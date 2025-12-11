<template>
  <div class="themeManager-imgSize-wrap">
    <div
      class="themeManager-imgSize-section"
      :class="{ 'is-dragging': isDragging }"
      @mouseenter="handleMouseEnter('logo')"
      @mouseleave="handleMouseLeave"
      @dragover.prevent="onDragOver"
      @dragenter.prevent="onDragEnter"
      @dragleave.prevent="onDragLeave"
      @drop.prevent="onDrop">
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
        <span class="themeManager-imgSize-drag-hint">（支持拖曳上传）</span>
      </div>
      <!-- 拖放覆蓋層 -->
      <div v-if="isDragging" class="themeManager-imgSize-drop-overlay">
        <div class="themeManager-imgSize-drop-text">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" fill="currentColor"><path d="M12 12.5858L16.2426 16.8284L14.8284 18.2426L13 16.415V22H11V16.413L9.17157 18.2426L7.75736 16.8284L12 12.5858ZM12 2C15.5934 2 18.5544 4.70761 18.9541 8.19395C21.2858 8.83154 23 10.9656 23 13.5C23 16.3688 20.8036 18.7246 18.0006 18.9776L18 17C19.6569 17 21 15.6569 21 14C21 12.3431 19.6569 11 18 11H17V10C17 7.23858 14.7614 5 12 5C9.23858 5 7 7.23858 7 10V11H6C4.34315 11 3 12.3431 3 14C3 15.6569 4.34315 17 6 17L6.00039 18.9776C3.19696 18.7252 1 16.3692 1 13.5C1 10.9656 2.71424 8.83154 5.04648 8.19411C5.44561 4.70761 8.40661 2 12 2Z"></path></svg>
          <span>放开上传 Logo</span>
        </div>
      </div>
    </div>
    <div
      v-if="isFirst"
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
import { useRoute } from 'vue-router'

const MAX_SIZE = 600 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif']
const ALLOWED_EXTS  = ['jpg','jpeg','png','gif']

const assets = useBrandAssetsStore()
const route = useRoute()

// 判斷是否為首頁
const isFirst = computed(() => route.meta?.pageClass?.includes('first'))

const logoSize = ref('偵測中')
const sliderSize = ref('偵測中')

let logoObserver = null
let sliderObserver = null
let domObserver = null  // 用來等元素進 DOM

const showHighlightByDefault = false
let currentHighlight = null

// 拖放狀態
const isDragging = ref(false)
let dragCounter = 0  // 用於處理子元素的 dragenter/dragleave

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

// 輪播圖偵測邏輯
async function detectSlider() {
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

    // 如果需要高亮且在首頁
    if (showHighlightByDefault && isFirst.value) {
      addSliderHighlight()
    }
  } else {
    // 完全找不到輪播元素
    sliderSize.value = '找不到輪播元素';
  }
}

// 清除輪播圖偵測
function cleanupSlider() {
  if (sliderObserver) {
    sliderObserver.disconnect();
    sliderObserver = null;
  }
  // 移除高亮
  const sliderHighlight = document.querySelector('.ele-slider-wrap .ele-highlight');
  if (sliderHighlight) sliderHighlight.remove();
}

// 監聽路由變化
watch(isFirst, async (val) => {
  if (val) {
    sliderSize.value = '偵測中...';
    await nextTick();
    detectSlider();
  } else {
    sliderSize.value = '非首頁';
    cleanupSlider();
  }
}, { immediate: true });

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

  // Logo 高亮
  if (showHighlightByDefault) {
    await nextTick()
    addLogoHighlight()
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
  // 1) 如果是 SVG 元素，直接讀取 width/height 屬性（不受 zoom 影響）
  if (el.tagName === 'svg') {
    const svgWidth = el.getAttribute('width')
    const svgHeight = el.getAttribute('height')
    
    if (svgWidth && svgHeight) {
      targetRef.value = `${svgWidth}x${svgHeight}`
      return
    }
  }

  // 2) 如果是 <img> 元素，優先使用原始尺寸（不受 zoom 影響）
  if (el.tagName === 'IMG') {
    const naturalW = el.naturalWidth || 0
    const naturalH = el.naturalHeight || 0

    if (naturalW && naturalH) {
      targetRef.value = `${naturalW}x${naturalH}`
      return
    }

    // 如果圖片還沒載入完成
    if (!isImgComplete(el)) {
      targetRef.value = '載入中...'
      return
    }
  }

  // 3) 如果不是 <img> 或 <svg>，嘗試找到內部的 img 或 svg
  const imgElement = el.querySelector('img')
  if (imgElement) {
    const naturalW = imgElement.naturalWidth || 0
    const naturalH = imgElement.naturalHeight || 0

    if (naturalW && naturalH) {
      targetRef.value = `${naturalW}x${naturalH}`
      return
    }
  }

  const svgElement = el.querySelector('svg')
  if (svgElement) {
    const svgWidth = svgElement.getAttribute('width')
    const svgHeight = svgElement.getAttribute('height')
    
    if (svgWidth && svgHeight) {
      targetRef.value = `${svgWidth}x${svgHeight}`
      return
    }
  }

  // 4) fallback: 使用 layout 寬高
  const rect = el.getBoundingClientRect()
  let w = Math.round(rect.width)
  let h = Math.round(rect.height)

  // 5) 仍為 0，再試 computed style（px 轉數字）
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

// ============================================================
// 拖放事件處理
// ============================================================
function onDragOver(e) {
  // 確保是檔案拖放
  if (e.dataTransfer?.types?.includes('Files')) {
    e.dataTransfer.dropEffect = 'copy'
  }
}

function onDragEnter(e) {
  dragCounter++
  if (e.dataTransfer?.types?.includes('Files')) {
    isDragging.value = true
  }
}

function onDragLeave(e) {
  dragCounter--
  if (dragCounter === 0) {
    isDragging.value = false
  }
}

async function onDrop(e) {
  dragCounter = 0
  isDragging.value = false

  const file = e.dataTransfer?.files?.[0]
  if (file) {
    await processLogoFile(file)
  }
}

// ============================================================
// 共用的檔案處理邏輯
// ============================================================
async function processLogoFile(file, inputEvent = null) {
  const ext = (file.name.split('.').pop() || '').toLowerCase()

  // 檢查檔案類型
  if (!ALLOWED_TYPES.includes(file.type) || !ALLOWED_EXTS.includes(ext)) {
    alert('僅接受 JPG、PNG 或 GIF 檔案')
    if (inputEvent) resetInput(inputEvent)
    return
  }

  // 讀取檔案為 DataURL（需要先讀取才能檢查尺寸）
  const dataUrl = await readFileAsDataURL(file)
  await nextTick()

  // 1. 先從頁面上的 Logo 元素讀取目標尺寸（動態適應不同版型）
  let targetW = 200
  let targetH = 62

  const logoEl = document.querySelector('.ele-logo-img')
  if (!logoEl) {
    alert('找不到 Logo 元素，無法確認尺寸要求')
    if (inputEvent) resetInput(inputEvent)
    return
  }

  if (logoEl.tagName === 'svg') {
    // SVG 元素：讀取 width 和 height 屬性
    const svgW = logoEl.getAttribute('width')
    const svgH = logoEl.getAttribute('height')
    if (svgW && svgH) {
      targetW = parseInt(svgW)
      targetH = parseInt(svgH)
    }
  } else if (logoEl.tagName === 'IMG') {
    // IMG 元素：讀取 naturalWidth 和 naturalHeight
    if (logoEl.naturalWidth && logoEl.naturalHeight) {
      targetW = logoEl.naturalWidth
      targetH = logoEl.naturalHeight
    }
  }

  if (!targetW || !targetH) {
    alert('無法讀取 Logo 尺寸要求，請稍後再試')
    if (inputEvent) resetInput(inputEvent)
    return
  }

  // 2. 檢查圖片尺寸
  try {
    const { width: imgW, height: imgH } = await loadImageSize(dataUrl)
    if (imgW !== targetW || imgH !== targetH) {
      alert(`尺寸不符合，需为 ${targetW}x${targetH} 像素（目前为 ${imgW}x${imgH}）`)
      if (inputEvent) resetInput(inputEvent)
      return
    }
  } catch {
    alert('图片读取失败，请重新选择')
    if (inputEvent) resetInput(inputEvent)
    return
  }

  // 2. 再檢查檔案大小
  if (file.size > MAX_SIZE) {
    alert('檔案過大，請壓縮至 600KB 以下')
    if (inputEvent) resetInput(inputEvent)
    return
  }

  // 儲存 Logo
  assets.setLogo(dataUrl)
  if (inputEvent) resetInput(inputEvent)
  alert('Logo 已更新完成')
}

// Logo 上傳（點擊選擇檔案）
async function onLogoFileChange(e) {
  const file = e?.target?.files?.[0]
  if (!file) return
  await processLogoFile(file, e)
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
  position: relative;
  transition: border-color 0.2s, background-color 0.2s;
  border: 2px dashed transparent;

  &:hover {
    .themeManager-imgSize-size {
      color: rgb(255 255 255);
      background-color: var(--cp-color-secondary);
    }
  }

  // 拖放進入狀態
  &.is-dragging {
    border-color: var(--cp-color-secondary);
    background-color: rgb(65 127 247 / 10%);
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
  .themeManager-imgSize-drag-hint {
    color: var(--cp-text-secondary);
    opacity: 0.7;
  }
}

// 拖放覆蓋層
.themeManager-imgSize-drop-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--cp-color-third);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  pointer-events: none;
  animation: dropOverlayFadeIn 0.2s ease;
}

.themeManager-imgSize-drop-text {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: var(--cp-text-third);
  font-size: 12px;

  svg {
    opacity: .5;
    animation: dropIconBounce 0.5s ease infinite alternate;
  }
}

@keyframes dropOverlayFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes dropIconBounce {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-4px);
  }
}
</style>