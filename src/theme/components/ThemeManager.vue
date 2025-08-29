<template>
  <teleport to="body">
    <div class="themeManager-toggle-btn" v-if="panelVisible === false">
      <button type="button" class="themeManager-btn" @click="panelVisible = true">顯示主題面板</button>
    </div>
    <div class="themeManager-wrap" v-show="panelVisible">
      <button type="button" class="themeManager-hide-btn" @click="panelVisible = false">隱藏面板</button>
      <div class="themeManager-content">
        <h3>Logo與輪播圖尺寸</h3>
        <LogoUploader />

        <h3>主題切換</h3>
        <div class="themeManager-theme-wrap">
          <button
            v-for="theme in themes"
            :key="theme.themeID ?? theme.themeName"
            :class="['themeManager-theme-btn', { active: selectedThemeName === theme.themeName }]"
            type="button"
            @click="selectTheme(theme.themeName)"
          >
            <div class="themeManager-theme-color" :style="{
                background: `linear-gradient(90deg, ${theme.themeColor.primary} 0, ${theme.themeColor.primary} 50%, ${theme.themeColor.secondary} 50%, ${theme.themeColor.secondary} 100%)`
              }"/>
            <span class="themeManager-theme-name">
              {{ theme.themeName }} ({{ theme.themeMode }})
            </span>
          </button>

          <button
            class="themeManager-theme-reset"
            type="button"
            :disabled="!hasModified"
            :title="hasModified ? '重置當前主題所有自訂顏色' : '尚未調整，無需重置'"
            @click="resetTheme"
          >
            重置主題
          </button>

          <span class="themeManager-theme-modified">已調整：{{ hasModified ? 'true' : 'false' }}</span>
        </div>

        <!-- 匯出 / 匯入 / 保存 -->
        <div class="themeManager-io-wrap">
          <button type="button"
            class="themeManager-btn themeManager-btn-export"
            @click="exportTheme"
            :title="hasModified ? '汇出目前自订配色' : '没有自订变更，汇出将与预设相同'">
            匯出配色
          </button>
          <button type="button" class="themeManager-btn themeManager-btn-import" @click="triggerImport">
            匯入配色
          </button>
          <button
            type="button"
            class="themeManager-btn themeManager-btn-save"
            :disabled="saving"
            :title="saving ? '汇出保存中…' : '下載壓縮檔（含 .css 與畫面示意圖）'"
            @click="saveTheme"
          >
            保存
          </button>
          <input
            ref="fileInputRef"
            type="file"
            accept=".css,.txt"
            class="themeManager-file-hidden"
            @change="onFileChange"
          />
        </div>

        <!-- 匯入結果訊息 -->
        <div v-if="importMessage" :class="['themeManager-import-msg', importSuccess ? 'ok' : 'err']">
          <pre class="themeManager-import-text">{{ importMessage }}</pre>
        </div>

        <h4>主題顏色自訂</h4>
        <div v-if="selectedColors.length">
          <ColorPicker
            v-for="color in selectedColors"
            :key="color.id"
            :item="color"
            :modified="modifiedMap[color.id]"
            @update="updateColor"
            @remove="removeColor"
          />
        </div>
        <div v-else>
          <p>此主題尚未設定 colorVariables。</p>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { nextTick } from 'vue'
import JSZip from 'jszip'
import { toPng } from 'html-to-image'
import { colorDatabase } from '../colorDatabase'
import { useTheme } from '../useTheme'
import { useConfigStore } from '@/stores/configStore'
import themeData from '@/assets/data/theme.json'
import ColorPicker from './ColorPicker.vue'
import LogoUploader from './LogoUploader.vue'

const panelVisible = ref(true) // 截圖隱藏 ThemeManager

/** ---- 從 .env 取得版型編號 ---- */
const ENV_VERSION = String(import.meta.env?.VITE_VERSION ?? '').trim()

/** ---- 工具：色彩轉換 ---- */
const normalizeHex = (hex) => (hex || '').toLowerCase()

function hexToRgbSpace(hex) {
  const v = normalizeHex(hex).replace('#', '')
  const full = v.length === 3 ? v.split('').map(x => x + x).join('') : v
  const num = parseInt(full, 16) || 0
  const r = (num >> 16) & 255
  const g = (num >> 8) & 255
  const b = num & 255
  return `${r} ${g} ${b}`
}

function toHex(val) {
  if (!val) return '#000000'
  const v = String(val).toLowerCase()
  if (v.startsWith('#')) {
    if (v.length === 4) return '#' + v.slice(1).split('').map(ch => ch + ch).join('')
    return v
  }
  if (v.startsWith('rgb')) {
    const result = v.match(/\d+/g)
    if (result?.length === 3) {
      return '#' + result.map(x => {
        const hex = (parseInt(x, 10) || 0).toString(16)
        return hex.length === 1 ? '0' + hex : hex
      }).join('')
    }
  }
  if (/^\d+\s+\d+\s+\d+$/.test(v)) {
    const arr = v.split(' ')
    return '#' + arr.map(x => {
      const hex = (parseInt(x, 10) || 0).toString(16)
      return hex.length === 1 ? '0' + hex : hex
    }).join('')
  }
  return v
}

/** ---- 主題資料與狀態 ---- */
const { setTheme, getColorVars, themes, storageKey, persist } = useTheme({ namespace: 'app' })
const config = useConfigStore()
const getCustomThemeColors = persist.get
const saveCustomThemeColors = persist.set
const clearCustomThemeColors = persist.clear

const selectedThemeName = ref(config.themeColor || themes[0]?.themeName || '')
const currentTheme = computed(() => themes.find(t => t.themeName === selectedThemeName.value))
const colorVars = computed(() => getColorVars(selectedThemeName.value))

// 版型編號優先使用 .env 的 VITE_VERSION，缺省時退回主題名稱
const currentTemplateNumber = computed(() =>
  ENV_VERSION || currentTheme.value?.themeName || selectedThemeName.value
)

// 畫面上的色票（reactive）
const selectedColors = ref([]) // [{ id, name, varName, value: '#rrggbb' }]

// baseline：當前主題原生值（無 inline 覆寫時量取）
const baselineMap = ref({}) // { [id]: '#rrggbb' }

// 當前主題的持久化快取（mirror localStorage；reactive）
const savedColors = ref({}) // { [id]: '#rrggbb' }

/** ---- DOM & Storage ---- */
function getThemeColorValue(varName) {
  if (typeof window === 'undefined') return '#000000'
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim() || '#000000'
}

function clearThemeInlineColors() {
  const el = document.documentElement
  colorDatabase
    .filter(item => colorVars.value.includes(item.id))
    .forEach(item => el.style.removeProperty(item.varName))
}


/** ---- 初始化 / 切主題 ---- */
function onThemeChange() {
  config.setThemeColor(selectedThemeName.value)
  clearThemeInlineColors()

  const items = colorDatabase.filter(item => colorVars.value.includes(item.id))

  // 量 baseline（無 inline 覆寫）
  const base = {}
  for (const item of items) {
    base[item.id] = normalizeHex(toHex(getThemeColorValue(item.varName)))
  }
  baselineMap.value = base

  // 載入 localStorage -> reactive
  savedColors.value = getCustomThemeColors(selectedThemeName.value) || {}

  // 組畫面色票（若有存檔，覆蓋 baseline）
  selectedColors.value = items.map(item => {
    const cur = normalizeHex(savedColors.value[item.id] || base[item.id])
    return { ...item, value: cur }
  })

  // 對已存的項目套 inline 覆寫
  for (const item of items) {
    const hex = savedColors.value[item.id]
    if (hex) {
      document.documentElement.style.setProperty(item.varName, hexToRgbSpace(hex))
    }
  }
}

watch(selectedThemeName, onThemeChange, { immediate: true })

/** ---- 修改狀態（即時） ---- */
const modifiedMap = computed(() => {
  const map = {}
  for (const item of selectedColors.value) {
    const base = normalizeHex(baselineMap.value[item.id])
    const cur  = normalizeHex(item.value)
    map[item.id] = !!(base && cur && base !== cur)
  }
  return map
})
const hasModified = computed(() => Object.values(modifiedMap.value).some(Boolean))

/** ---- 事件：更新 / 重置單一色 ---- */
function updateColor(item, newHex) {
  const themeName = selectedThemeName.value
  const next = normalizeHex(newHex)
  const base = normalizeHex(baselineMap.value[item.id])

  // 先更新 UI（讓 computed 立即反應）
  item.value = next

  // 選回 baseline => 視為移除自訂
  if (next === base) {
    const colors = getCustomThemeColors(themeName) || {}
    delete colors[item.id]
    saveCustomThemeColors(themeName, colors)
    const c = { ...savedColors.value }
    delete c[item.id]
    savedColors.value = c
    document.documentElement.style.removeProperty(item.varName)
    return
  }

  // 否則：存檔 + inline
  const colors = getCustomThemeColors(themeName) || {}
  colors[item.id] = next
  saveCustomThemeColors(themeName, colors)
  savedColors.value = { ...savedColors.value, [item.id]: next }
  document.documentElement.style.setProperty(item.varName, hexToRgbSpace(next))
}

function removeColor(item) {
  const themeName = selectedThemeName.value

  const colors = getCustomThemeColors(themeName) || {}
  delete colors[item.id]
  saveCustomThemeColors(themeName, colors)

  const c = { ...savedColors.value }
  delete c[item.id]
  savedColors.value = c

  const base = normalizeHex(baselineMap.value[item.id] || toHex(getThemeColorValue(item.varName)))
  item.value = base
  document.documentElement.style.removeProperty(item.varName)
}

/** ---- 全部重置（當前主題） ---- */
function resetTheme() {
  clearThemeInlineColors()
  clearCustomThemeColors(selectedThemeName.value)
  savedColors.value = {}

  // 直接把畫面值還原 baseline（即時）
  selectedColors.value = selectedColors.value.map(item => ({
    ...item,
    value: normalizeHex(baselineMap.value[item.id])
  }))
}

/** ---- 匯出 / 匯入 ---- */
const fileInputRef = ref(null)
const importMessage = ref('')
const importSuccess = ref(false)

function triggerImport() {
  importMessage.value = ''
  importSuccess.value = false
  if (fileInputRef.value && fileInputRef.value.click) fileInputRef.value.click()
}

function onFileChange(e) {
  const file = e?.target?.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    const text = String(reader.result || '')
    importFromCssText(text)
    // 允許同檔連續上傳
    if (e?.target) e.target.value = ''
  }
  reader.readAsText(file, 'utf-8')
}

/** 由 CSS 文字匯入 */
function importFromCssText(text) {
  // 1) 擷取 Template number（例如：/* Template number: test_250123 */）
  const tplMatch = text.match(/\/\*\s*Template\s+number\s*:\s*([^\*]+?)\s*\*\//i)
  const importedTpl = tplMatch ? tplMatch[1].trim() : ''
  const currentTpl = String(currentTemplateNumber.value || '').trim()

  if (!importedTpl) {
    importSuccess.value = false
    importMessage.value = `未找到 Template number 註解！\n當前版型: ${currentTpl}`
    return
  }

  // 2) 嚴格比對版型
  if (importedTpl !== currentTpl) {
    importSuccess.value = false
    importMessage.value = `當前版型: ${currentTpl}\n匯入版型: ${importedTpl}`
    return
  }

  // 3) 解析 CSS 變數：--var: #HEX;
  const varPairs = [...text.matchAll(/--([a-z0-9\-]+)\s*:\s*(#[0-9a-fA-F]{3,6})\s*;/g)]
    .map(m => [`--${m[1]}`, normalizeHex(m[2])])

  if (!varPairs.length) {
    importSuccess.value = false
    importMessage.value = `未讀取到任何配色變數！\n版型编号 ${importedTpl} 匯入取消。`
    return
  }

  // 4) 將配色套用到目前主題（僅處理 colorDatabase 有列出的變數）
  const themeName = selectedThemeName.value
  const colors = getCustomThemeColors(themeName) || {}
  const varNameToId = Object.fromEntries(colorDatabase.map(i => [i.varName, i.id]))

  for (const [varName, hex] of varPairs) {
    const id = varNameToId[varName]
    if (!id) continue

    // 更新 UI 列表
    const uiItem = selectedColors.value.find(i => i.id === id)
    if (uiItem) uiItem.value = hex

    // 覆寫 inline
    document.documentElement.style.setProperty(varName, hexToRgbSpace(hex))

    // 與 baseline 比較：相同就不存，否則存
    const base = normalizeHex(baselineMap.value[id])
    if (hex === base) {
      delete colors[id]
    } else {
      colors[id] = hex
    }
  }

  // 寫回 localStorage 與 reactive
  saveCustomThemeColors(themeName, colors)
  savedColors.value = { ...colors }

  importSuccess.value = true
  importMessage.value = `版型编号 ${importedTpl} 配色已成功汇入！`
}

/** 匯出當前配色為「版型編號.css」 */
async function exportTheme() {
  // 若沒有任何自訂變更，先提醒
  if (!hasModified.value) {
    const ok = confirm('目前没有任何自订变更，汇出将与主题预设值相同。\n仍要汇出吗？')
    if (!ok) return
  }

  const tpl = String(currentTemplateNumber.value || '').trim() || 'theme'
  const content = buildCssContent()
  const cssBlob = new Blob([content], { type: 'text/css;charset=utf-8' })

  // 下載：優先使用 File System Access API（可確定寫入完成），否則退回 <a download>
  if ('showSaveFilePicker' in window) {
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: `${tpl}.css`,
        types: [{ description: 'CSS 檔案', accept: { 'text/css': ['.css'] } }]
      })
      const writable = await handle.createWritable()
      await writable.write(cssBlob)
      await writable.close()
      alert('檔案已成功保存！')
    } catch (e) {
      // 使用者按「取消」會丟 AbortError，不要跳成功
      if (e?.name === 'AbortError') return
      console.error(e)
      alert(`保存失敗：${e.message || e}`)
    }
  } else {
    // Fallback：無法得知是否完成，只能啟動下載
    const a = document.createElement('a')
    const url = URL.createObjectURL(cssBlob)
    a.href = url
    a.download = `${tpl}.css`
    document.body.appendChild(a)
    a.click()
    URL.revokeObjectURL(url)
    a.remove()
    // 建議改為「下載已開始」，避免誤導為已完成
    alert('下載已開始（無法偵測是否完成）。')
  }
}

/** 產生匯出 CSS 文字（供 export 與 save 共用） */
function buildCssContent() {
  const tpl = String(currentTemplateNumber.value || '').trim() || 'theme'
  // 直接用 themeData.colorVariables 產生 exportVars
  const colorVariables = themeData.colorVariables
  const exportVars = colorVariables.map(id => {
    const item = colorDatabase.find(c => c.id === id)
    return item ? [`/* ${item.name} */`, item.varName] : null
  }).filter(Boolean)

  const lines = []
  lines.push('/* ※注意 - Template number 汇入配色时会判断是否同一个版型，请勿删除 */')
  lines.push(`/* Template number: ${tpl} */`)
  lines.push('')
  for (const [label, varName] of exportVars) {
    const hex = toHex(getThemeColorValue(varName)).toUpperCase()
    lines.push(label)
    lines.push(`${varName}: ${hex};`)
    lines.push('')
  }
  return lines.join('\n')
}

/** 保存：下載 <版型編號>.zip（含 .css 與不含工具的畫面示意圖） */
const saving = ref(false)
async function saveTheme() {
  if (saving.value) return;
  saving.value = true;

  // 若沒有任何自訂變更，先提醒
  if (!hasModified.value) {
    const ok = confirm('目前没有任何自订变更，汇出将与主题预设值相同。\n仍要汇出吗？')
    if (!ok) return
  }

  let captureEl = null;
  let originalStyle = '';
  let objectUrl = null;

  try {
    const tpl = String(currentTemplateNumber.value || '').trim() || 'theme';
    const cssContent = buildCssContent();

    // 目標容器：優先 #capture-root，其次 .page-wrap（都不含 ThemeManager）
    captureEl =
      document.getElementById('capture-root') ||
      document.querySelector('.page-wrap') ||
      document.body;

    if (!captureEl) throw new Error('找不到可截圖的容器');

    // 暫存原始 inline style，並把寬度設為 1920px（更貼近 1920 排版）
    originalStyle = captureEl.style.cssText || '';
    captureEl.style.cssText = `${originalStyle}; width: 1920px;`;

    // 處理圖片：失敗就隱藏，並等待載入完成
    const imgs = captureEl.querySelectorAll('img');
    imgs.forEach((img) => {
      img.onerror = () => {
        console.warn('圖片載入失敗，已隱藏：', img.src);
        img.style.display = 'none';
      };
    });

    await waitForImages(captureEl);
    await nextTick();

    // 產生 PNG（保持當前縮放；用 filter 排除不需截圖元素）
    const dataUrl = await toPng(captureEl, {
      cacheBust: true,
      pixelRatio: 1,           // 輸出剛好 1920 寬（由上方 width:1920px 決定）
      skipAutoScale: true,     // 非標準參數，無害；有些版本會忽略
      style: { transform: 'scale(1)' },
      filter: (node) => {
        // 你可以在不想截圖的元素上加 .ignore-screenshot
        if (node.classList?.contains?.('ignore-screenshot')) return false;
        // 防守：若有其他 Theme 面板被寫在 page-wrap 內，也排除
        if (node.classList?.contains?.('themeManager-wrap')) return false;
        // 排除失敗後被隱藏的圖片（display:none）
        if (node.tagName === 'IMG' && (node.style?.display === 'none')) return false;
        return true;
      },
      backgroundColor: getComputedStyle(document.body).backgroundColor || '#ffffff'
    });

    // 轉 Blob，順便限制大小（例如 10MB）
    const imageBlob = await fetch(dataUrl).then((r) => r.blob());
    if (imageBlob.size > 10 * 1024 * 1024) {
      throw new Error('截圖檔案過大，請調整畫面大小或內容');
    }

    // 打包 ZIP
    const zip = new JSZip();
    zip.file(`${tpl}.css`, cssContent);
    zip.file(`${tpl}.png`, imageBlob, { compression: 'STORE' });

    const zipBlob = await zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 },
      streamFiles: true,
      comment: `Generated at ${new Date().toISOString()}`
    });

    // 下載
    const a = document.createElement('a');
    objectUrl = URL.createObjectURL(zipBlob);
    a.href = objectUrl;
    a.download = `${tpl}.zip`;

    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('下載超時')), 30000);
      const onClick = () => {
        clearTimeout(timeout);
        setTimeout(() => {
          if (objectUrl) {
            URL.revokeObjectURL(objectUrl);
            objectUrl = null;
          }
          a.removeEventListener('click', onClick);
          resolve();
        }, 1000);
      };
      a.addEventListener('click', onClick);
      a.click();
    });

    alert('檔案已成功保存，請查看下載列表。');
  } catch (err) {
    console.error('保存過程發生錯誤：', err);
    alert(`保存失敗：${err.message || err.toString()}`);
  } finally {
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    if (captureEl) captureEl.style.cssText = originalStyle; // 復原寬度
    saving.value = false;
    // 可選：若你的環境注入了 window.gc() 作手動 GC
    if (window.gc) try { window.gc(); } catch {}
  }
}

/** ---- UI 事件：切主題 ---- */
function selectTheme(themeName) {
  selectedThemeName.value = themeName
}


// 等待容器內所有 <img> 載入完成或失敗（失敗就隱藏）
function waitForImages(root, timeoutMs = 15000) {
  const imgs = Array.from(root.querySelectorAll('img'));
  if (imgs.length === 0) return Promise.resolve();

  return new Promise((resolve) => {
    let pending = imgs.length;
    const done = () => (--pending <= 0) && resolve();

    imgs.forEach((img) => {
      // 載入失敗就隱藏，避免黑塊
      img.onerror = () => {
        img.style.display = 'none';
        done();
      };
      if (img.complete && img.naturalWidth > 0) {
        done();
      } else if (img.complete && img.naturalWidth === 0) {
        // 已經失敗
        img.style.display = 'none';
        done();
      } else {
        const onEnd = () => {
          img.removeEventListener('load', onEnd);
          img.removeEventListener('error', onEnd);
          if (img.naturalWidth === 0) img.style.display = 'none';
          done();
        };
        img.addEventListener('load', onEnd);
        img.addEventListener('error', onEnd);
      }
    });

    // 安全超時（避免卡住）
    setTimeout(resolve, timeoutMs);
  });
}

/** ---- Logo與輪播圖尺寸 與 Logo上傳示意 ---- */
import { useBrandAssetsStore } from '@/stores/brandAssetsStore'
const assets = useBrandAssetsStore()
onMounted(() => assets.load())

// 取得當前頁面 Logo 容器尺寸：.ele-logo-img
function getLogoBox() {
  const el = document.querySelector('.ele-logo-img')
  if (!el) return { el: null, w: 180, h: 116 } // fallback
  const r = el.getBoundingClientRect()
  // 若寬高為 0（尚未渲染），退回 SVG 的 width/height 或預設
  const w = Math.round(r.width || Number(el.getAttribute('width')) || 180)
  const h = Math.round(r.height || Number(el.getAttribute('height')) || 116)
  return { el, w, h }
}

const logoBoxText = computed(() => {
  const { w, h } = getLogoBox()
  return `${w}x${h}`
})

async function onLogoFileChange(e) {
  const file = e?.target?.files?.[0]
  if (!file) return
  if (!/^image\//.test(file.type)) {
    alert('請選擇圖片檔案')
    return
  }
  // 讀檔
  const dataUrl = await readFileAsDataURL(file)
  // 確保 DOM 已渲染，避免量到 0x0
  await nextTick()

  // 取得容器實際尺寸
  const { w: boxW, h: boxH } = getLogoBox()
  // 產生縮放後的 DataURL（等比 contain，透明背景）
  const scaled = await resizeImageContain(dataUrl, boxW, boxH)

  assets.setLogo(scaled)
  // 允許同檔連續上傳
  if (e?.target) e.target.value = ''
  alert('Logo 已更新')
}

function resetLogo() {
  assets.clearLogo()
  alert('已還原預設 Logo')
}

// helpers
function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader()
    fr.onload = () => resolve(fr.result)
    fr.onerror = reject
    fr.readAsDataURL(file)
  })
}

function resizeImageContain(srcDataUrl, targetW, targetH) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        canvas.width = targetW
        canvas.height = targetH
        const ctx = canvas.getContext('2d')
        // 透明背景
        ctx.clearRect(0, 0, targetW, targetH)
        // 等比縮放，置中
        const scale = Math.min(targetW / img.width, targetH / img.height)
        const drawW = Math.round(img.width * scale)
        const drawH = Math.round(img.height * scale)
        const dx = Math.round((targetW - drawW) / 2)
        const dy = Math.round((targetH - drawH) / 2)
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
        ctx.drawImage(img, dx, dy, drawW, drawH)
        resolve(canvas.toDataURL('image/png'))
      } catch (err) {
        reject(err)
      }
    }
    img.onerror = () => reject(new Error('圖片載入失敗'))
    img.src = srcDataUrl
  })
}
</script>

<style lang="scss">
:root {
  --cp-bg-primary: #FFF;
  --cp-bg-secondary: #889EBC;
  --cp-color-bg: #F1F4F8;
  --cp-color-primary: #417FF7;
  --cp-color-third: #F5F7FA;
  --cp-text-primary: #3D4154;
  --cp-text-secondary: #97A2AF;
}
.themeManager-wrap {
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 9999;
}

.themeManager-toggle-btn {
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 9999;
}
.themeManager-hide-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 4px 10px;
  border-radius: 6px;
  border: 1px solid #ddd;
  background: #fff;
  cursor: pointer;
  font-size: 13px;
  color: #888;
}

.themeManager-content {
  font-size: 13px;
  padding: 24px;
  color: #000;
  background: #f9f9f9;
  border-radius: 8px;
  max-width: 480px;
  margin: 32px auto;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  h3 { margin-top: 0; }
}

/* 主題切換 */
.themeManager-theme-wrap {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  align-items: center;
  flex-wrap: wrap;

  .themeManager-theme-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 26px;
    height: 26px;
    border-radius: 4px;
    border: 1px solid transparent;
    background: #fff;
    cursor: pointer;
  }
  .themeManager-theme-btn.active {
    border-color: var(--cp-color-primary);
  }
  .themeManager-theme-color {
    width: 20px;
    height: 20px;
    border-radius: 2px;
  }
  .themeManager-theme-name { display: none; }

  .themeManager-theme-reset {
    margin-left: auto;
    padding: 6px 10px;
    border-radius: 6px;
    border: 1px solid #ddd;
    background: #fff;
    cursor: pointer;
  }
  .themeManager-theme-reset:disabled {
    opacity: .5;
    cursor: not-allowed;
  }
}

/* 匯出 / 匯入 / 保存 */
.themeManager-io-wrap {
  display: flex;
  gap: 8px;
  margin: 12px 0 16px;
}
.themeManager-btn {
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #ddd;
  background: #fff;
  cursor: pointer;
}
.themeManager-btn-save:disabled {
  opacity: .5;
  cursor: not-allowed;
}
.themeManager-file-hidden { display: none; }

.themeManager-import-msg {
  padding: 8px 10px;
  border-radius: 8px;
  white-space: pre-wrap;
  margin-bottom: 12px;
}
.themeManager-import-msg.ok  { background: #e9f7ef; border: 1px solid #b8e0c8; color: #156a42; }
.themeManager-import-msg.err { background: #fff3f3; border: 1px solid #f1c0c0; color: #8b1f1f; }
.themeManager-import-text { margin: 0; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace; }


/* Logo&輪播圖尺寸 / Logo上傳 */
.changeColor-images-wrap {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 8px 12px;
  align-items: center;
  margin: 8px 0 16px;
}
.changeColor-upload {
  grid-column: 1 / -1;
  display: flex;
  gap: 8px;
  align-items: center;
  .changeColor-upload-tips {
    font-size: 12px;
    color: #666;
  }
  .changeColor-upload-input {
    cursor: pointer;
  }
}
</style>
