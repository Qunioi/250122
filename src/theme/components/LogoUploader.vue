<template>
  <div class="themeManager-imgSize-wrap">
    <div
      class="themeManager-imgSize-section"
      @mouseenter="handleMouseEnter('logo')"
      @mouseleave="handleMouseLeave">
      <div class="themeManager-imgSize-title logo">
        <label>Logo</label>
        <span class="themeManager-imgSize-size">{{ logoSize }}</span>
        <svg data-v-4b021c78="" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" fill="currentColor"><path data-v-4b021c78="" d="M21 15V18H24V20H21V23H19V20H16V18H19V15H21ZM21.0082 3C21.556 3 22 3.44495 22 3.9934V13H20V5H4V18.999L14 9L17 12V14.829L14 11.8284L6.827 19H14V21H2.9918C2.44405 21 2 20.5551 2 20.0066V3.9934C2 3.44476 2.45531 3 2.9918 3H21.0082ZM8 7C9.10457 7 10 7.89543 10 9C10 10.1046 9.10457 11 8 11C6.89543 11 6 10.1046 6 9C6 7.89543 6.89543 7 8 7Z"></path></svg>
      </div>
      <div class="themeManager-imgSize-upload">
        <input
          type="file"
          accept=".jpg,.jpeg,.png,.gif"
          class="themeManager-imgSize-upload-input"
          @change="onLogoFileChange"
          id="themeManager-imgSize-input"
        />
        <label for="themeManager-imgSize-input" class="themeManager-btn themeManager-imgSize-upload-btn">上传Logo示意图</label>
        <button
          type="button"
          class="themeManager-btn themeManager-imgSize-reset-btn"
          @click="resetLogo"
          :disabled="!assets.logoDataUrl"
        >
          还原预设Logo
        </button>
      </div>
      <div class="themeManager-imgSize-tips">
        <span>仅接受<b>JPG/PNG/GIF</b>，大小≤<b>600KB</b></span>
      </div>
    </div>
    <div
      class="themeManager-imgSize-section"
      @mouseenter="handleMouseEnter('slider')"
      @mouseleave="handleMouseLeave">
      <div class="themeManager-imgSize-title">
        <label>轮播图</label>
        <span class="themeManager-imgSize-size">{{ sliderSize }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useBrandAssetsStore } from '@/stores/brandAssetsStore'

const MAX_SIZE = 600 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif']
const ALLOWED_EXTS  = ['jpg','jpeg','png','gif']

const assets = useBrandAssetsStore()
const logoSize = ref('偵測中')
const sliderSize = ref('偵測中')

let logoObserver = null
let sliderObserver = null
let domObserver = null  // 用來等元素進 DOM

const showHighlightByDefault = false
let currentHighlight = null

// 處理滑鼠進入事件
const handleMouseEnter = (type) => {
  if (!showHighlightByDefault) {
    removeHighlight()
    if (type === 'logo') {
      addLogoHighlight()
    } else if (type === 'slider') {
      addSliderHighlight()
    }
  }
}
// 處理滑鼠離開事件
const handleMouseLeave = () => {
  if (!showHighlightByDefault) {
    removeHighlight()
  }
}

// 添加 Logo 高亮
const addLogoHighlight = () => {
  const logoEl = document.querySelector('.ele-logo-wrap')
  if (logoEl) {
    // 創建高亮 div
    const highlightDiv = document.createElement('div')
    highlightDiv.className = 'ele-highlight'
    highlightDiv.textContent = logoSize.value

    // 添加到 logo 元素內部
    logoEl.appendChild(highlightDiv)
    currentHighlight = highlightDiv
  }
}

// 添加輪播高亮
const addSliderHighlight = () => {
  const sliderWrap = document.querySelector('.ele-slider-wrap')
  if (sliderWrap) {
    // 創建高亮 div
    const highlightDiv = document.createElement('div')
    highlightDiv.className = 'ele-highlight'
    highlightDiv.textContent = sliderSize.value

    sliderWrap.appendChild(highlightDiv)
    currentHighlight = highlightDiv
  }
}

// 移除高亮
const removeHighlight = () => {
  if (currentHighlight) {
    currentHighlight.remove()
    currentHighlight = null
  }
}

onMounted(async () => {
  assets.load()
  await nextTick()

  const logoEl = await waitForEl('.ele-logo-img', 8000)
  if (logoEl) {
    // 先做一次初始化量測（避免一開始 0x0）
    updateBoxSize(logoEl, logoSize)

    // 若是 <img>，等它 load 後再量一次
    if (logoEl.tagName === 'IMG' && !isImgComplete(logoEl)) {
      logoEl.addEventListener('load', () => updateBoxSize(logoEl, logoSize), { once: true })
      logoEl.addEventListener('error', () => updateBoxSize(logoEl, logoSize), { once: true })
    }

    // 監聽尺寸變化
    logoObserver = new ResizeObserver(() => updateBoxSize(logoEl, logoSize))
    logoObserver.observe(logoEl)
  }

  // 先嘗試找 .ele-slider-img，找不到就找其他可能的容器
  let sliderEl = await waitForEl('.ele-slider-img', 3000);

  if (!sliderEl) {
    // 找不到 .ele-slider-img，嘗試找其他可能的輪播容器
    sliderEl = await waitForEl('.ele-slider-wrap', 3000) ||
              await waitForEl('.slider-wrap', 3000);
  }
  if (sliderEl) {
    // 初始量測
    updateSliderSize(sliderEl, sliderSize);
    
    // 如果是圖片元素，監聽載入事件
    if (sliderEl.tagName === 'IMG') {
      if (!isImgComplete(sliderEl)) {
        sliderEl.addEventListener('load', () => updateSliderSize(sliderEl, sliderSize), { once: true });
        sliderEl.addEventListener('error', () => { sliderSize.value = '載入失敗' }, { once: true });
      }
      
      // 監聽 src 變化（輪播切換）
      sliderObserver = new MutationObserver(() => {
        updateSliderSize(sliderEl, sliderSize);
      });
      sliderObserver.observe(sliderEl, {
        attributes: true,
        attributeFilter: ['src']
      });
    } else {
      // 監聽容器內部變化（包括子元素的圖片載入）
      sliderObserver = new MutationObserver(() => {
        updateSliderSize(sliderEl, sliderSize);
      });
      sliderObserver.observe(sliderEl, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['src', 'style'] // 也監聽 style 變化
      });
      
      // 同時監聽容器尺寸變化
      const resizeObserver = new ResizeObserver(() => {
        updateSliderSize(sliderEl, sliderSize);
      });
      resizeObserver.observe(sliderEl);
    }
  } else {
    // 完全找不到輪播元素
    sliderSize.value = '找不到輪播元素';
  }
  if (showHighlightByDefault) {
    await nextTick()
    addLogoHighlight()
    addSliderHighlight()
  }
})

onUnmounted(() => {
  if (logoObserver) logoObserver.disconnect()
  if (sliderObserver) sliderObserver.disconnect()
  if (domObserver) domObserver.disconnect()
  removeHighlight() // 清理高亮元素
})

// 等待元素進 DOM（處理 v-if / 延遲載入）
function waitForEl(selector, timeout = 5000) {
  return new Promise((resolve) => {
    const found = document.querySelector(selector)
    if (found) return resolve(found)

    const timer = setTimeout(() => {
      if (domObserver) domObserver.disconnect()
      resolve(null)
    }, timeout)

    domObserver = new MutationObserver(() => {
      const el = document.querySelector(selector)
      if (el) {
        clearTimeout(timer)
        domObserver.disconnect()
        resolve(el)
      }
    })
    domObserver.observe(document.documentElement, { childList: true, subtree: true })
  })
}

// 圖片是否已完整可量測
function isImgComplete(img) {
  return img.complete && img.naturalWidth > 0 && img.naturalHeight > 0
}

// 量測並寫入顯示字串（多來源 fallback）
function updateBoxSize(el, targetRef) {
  // 1) 先拿 layout 寬高
  const rect = el.getBoundingClientRect()
  let w = Math.round(rect.width)
  let h = Math.round(rect.height)

  // 2) 若為 0，且是 <img>，試 naturalWidth/Height
  if ((!w || !h) && el.tagName === 'IMG') {
    const iw = el.naturalWidth || 0
    const ih = el.naturalHeight || 0
    if (iw && ih) { w = iw; h = ih }
  }

  // 3) 仍為 0，再試 computed style（px 轉數字）
  if (!w || !h) {
    const cs = window.getComputedStyle(el)
    const sw = parseFloat(cs.width)
    const sh = parseFloat(cs.height)
    if (sw && sh) { w = Math.round(sw); h = Math.round(sh) }
  }

  targetRef.value = (w && h) ? `${w}x${h}` : '未偵測到'
}

// Slider 尺寸量測（優先使用圖片原始尺寸）
function updateSliderSize(el, targetRef) {
  // 1) 如果是 <img> 元素，優先使用原始尺寸
  if (el.tagName === 'IMG') {
    const naturalW = el.naturalWidth || 0;
    const naturalH = el.naturalHeight || 0;
    
    if (naturalW && naturalH) {
      targetRef.value = `${naturalW}x${naturalH}`;
      return;
    }
    
    // 如果圖片還沒載入完成，顯示載入狀態
    if (!isImgComplete(el)) {
      targetRef.value = '載入中...';
      return;
    }
    
    // 如果是圖片但沒有原始尺寸，可能是載入失敗
    targetRef.value = '載入失敗';
    return;
  }

  // 2) 如果不是 <img> 元素，嘗試找到內部的 img
  const imgElement = el.querySelector('img');
  if (imgElement) {
    const naturalW = imgElement.naturalWidth || 0;
    const naturalH = imgElement.naturalHeight || 0;
    
    if (naturalW && naturalH) {
      targetRef.value = `${naturalW}x${naturalH}`;
      return;
    }
    
    if (!isImgComplete(imgElement)) {
      targetRef.value = '載入中...';
      return;
    }
    
    targetRef.value = '載入失敗';
    return;
  }

  // 3) 找不到圖片元素，直接量測容器尺寸
  const rect = el.getBoundingClientRect();
  let w = Math.round(rect.width);
  let h = Math.round(rect.height);

  // 如果容器尺寸為 0，嘗試 computed style
  if (!w || !h) {
    const cs = window.getComputedStyle(el);
    const sw = parseFloat(cs.width);
    const sh = parseFloat(cs.height);
    if (sw && sh) { 
      w = Math.round(sw); 
      h = Math.round(sh); 
    }
  }

  targetRef.value = (w && h) ? `${w}x${h} (容器)` : '未偵測到';
}

function getBox(selector, fallbackW = 0, fallbackH = 0) {
  const el = document.querySelector(selector)
  if (!el) return { el: null, w: fallbackW, h: fallbackH }

  const rect = el.getBoundingClientRect()
  const w = Math.round(rect.width) || fallbackW
  const h = Math.round(rect.height) || fallbackH

  return { el, w, h }
}

// Logo 上傳檢查
async function onLogoFileChange(e) {
  const file = e?.target?.files?.[0]
  if (!file) return

  const ext = (file.name.split('.').pop() || '').toLowerCase()
  if (!ALLOWED_TYPES.includes(file.type) || !ALLOWED_EXTS.includes(ext)) {
    alert('僅接受 JPG、PNG 或 GIF 檔案')
    resetInput(e)
    return
  }

  if (file.size > MAX_SIZE) {
    alert('檔案過大，請壓縮至 600KB 以下')
    resetInput(e)
    return
  }

  const dataUrl = await readFileAsDataURL(file)
  await nextTick()

  const { w: targetW, h: targetH } = getBox('.ele-logo-img', 180, 116)
  try {
    const { width: imgW, height: imgH } = await loadImageSize(dataUrl)
    if (imgW !== targetW || imgH !== targetH) {
      alert(`尺寸不符合，需为 ${targetW}x${targetH} 像素（目前为 ${imgW}x${imgH}）`)
      resetInput(e)
      return
    }
  } catch {
    alert('图片读取失败，请重新选择')
    resetInput(e)
    return
  }

  assets.setLogo(dataUrl)
  resetInput(e)
  alert('Logo 已更新完成')
}

function resetLogo() {
  assets.clearLogo()
  alert('已还原预设 Logo')
}

// helpers
function resetInput(e) {
  if (e?.target) e.target.value = ''
}
function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader()
    fr.onload = () => resolve(fr.result)
    fr.onerror = reject
    fr.readAsDataURL(file)
  })
}
function loadImageSize(dataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight })
    img.onerror = () => reject(new Error('load error'))
    img.src = dataUrl
  })
}
</script>

<style scoped lang="scss">
:global(.ele-logo-wrap),
:global(.ele-slider-wrap) {
  position: relative;
}
:global(.ele-highlight) {
  align-items: center;
  background-color: rgb(85 217 127 / 60%);
  color: rgb(255 255 255);
  display: flex;
  font-size: 5rem;
  font-weight: 700;
  height: 100%;
  justify-content: center;
  left: 0;
  pointer-events: none;
  position: absolute;
  text-shadow: 0 0 10px rgb(0 0 0 / 70%);
  top: 0;
  width: 100%;
  z-index: 99;
  transition: all .3s ease;
}
:global(.ele-logo-wrap .ele-highlight) {
  font-size: 2.6rem;
}

.themeManager-imgSize-wrap {
  display: grid;
  gap: 4px;
}

// 區塊卡片
.themeManager-imgSize-section {
  background: var(--cp-color-third);
  border-radius: 6px;
  padding: 10px;
  &:hover {
    .themeManager-imgSize-size {
      color: rgb(255 255 255);
      background-color: var(--cp-color-secondary);
    }
  }
}

// 標題列
.themeManager-imgSize-title {
  display: flex;
  align-items: center;
  gap: 4px;
  &.logo {
    margin-bottom: 8px;
    svg {
      margin-left: auto;
    }
  }
  label {
    font-size: 14px;
    letter-spacing: .02em;
    color: var(--cp-text-primary);
  }

  .themeManager-imgSize-size {
    font-size: 12px;
    color: rgb(30 34 51);
    background-color: rgb(255 255 255);
    border: 1px solid rgb(232 232 239);
    border-radius: 20px;
    padding: 3px 8px 2px;
    transition: background-color .3s, color .3s;
  }
}

// 上傳區
.themeManager-imgSize-upload {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  // 隱藏原生 input，改用 label 當按鈕
  .themeManager-imgSize-upload-input {
    position: absolute;
    width: 1px; height: 1px;
    padding: 0; margin: -1px;
    overflow: hidden; clip: rect(0 0 0 0);
    border: 0;
  }

  .themeManager-imgSize-upload-btn,
  .themeManager-imgSize-reset-btn {
    align-items: center;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    flex: 1;
    font-size: 12px;
    height: 26px;
    justify-content: center;
    line-height: 1;
    position: relative;
    transition: background-color .3s;
    appearance: none;
    color: rgb(255 255 255);
    background-color: var(--cp-color-primary);

    &:hover {
      background-color: var(--cp-color-secondary);
    }

    &:disabled {
      opacity: .2;
      cursor: not-allowed;
      box-shadow: none;
    }
  }
}

// 提示文字
.themeManager-imgSize-tips {
  font-size: 12px;
  color: var(--cp-text-third);
  padding-top: 8px;
  b {
    font-size: 11px;
  }
}
</style>