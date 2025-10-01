<template>
  <div class="themeManager-imgSize-wrap">
    <div class="themeManager-imgSize-section">
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
        <label for="themeManager-imgSize-input" class="themeManager-btn themeManager-imgSize-upload-btn">上傳Logo示意圖</label>
        <button
          type="button"
          class="themeManager-btn themeManager-imgSize-reset-btn"
          @click="resetLogo"
          :disabled="!assets.logoDataUrl"
        >
          還原預設 Logo
        </button>
      </div>
      <div class="themeManager-imgSize-tips">
        <span>僅接受<b>JPG/PNG/GIF</b>，大小≤<b>600KB</b></span>
      </div>
    </div>
    <div class="themeManager-imgSize-section">
      <div class="themeManager-imgSize-title">
        <label>輪播圖</label>
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
const logoSize = ref('未偵測到')
const sliderSize = ref('未偵測到')

let logoObserver = null
let sliderObserver = null
let domObserver = null  // 用來等元素進 DOM

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

  const sliderEl = await waitForEl('.ele-slider-img', 8000)
  if (sliderEl) {
    updateBoxSize(sliderEl, sliderSize)
    if (sliderEl.tagName === 'IMG' && !isImgComplete(sliderEl)) {
      sliderEl.addEventListener('load', () => updateBoxSize(sliderEl, sliderSize), { once: true })
      sliderEl.addEventListener('error', () => updateBoxSize(sliderEl, sliderSize), { once: true })
    }
    sliderObserver = new ResizeObserver(() => updateBoxSize(sliderEl, sliderSize))
    sliderObserver.observe(sliderEl)
  }
})

onUnmounted(() => {
  if (logoObserver) logoObserver.disconnect()
  if (sliderObserver) sliderObserver.disconnect()
  if (domObserver) domObserver.disconnect()
})

/** 等待元素進 DOM（處理 v-if / 延遲載入） */
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

/** 圖片是否已完整可量測 */
function isImgComplete(img) {
  return img.complete && img.naturalWidth > 0 && img.naturalHeight > 0
}

/** 量測並寫入顯示字串（多來源 fallback） */
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

/** Logo 上傳檢查 */
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
.themeManager-imgSize-wrap {
  display: grid;
  gap: 4px;
}

/* 區塊卡片 */
.themeManager-imgSize-section {
  background: var(--cp-color-third);
  // border: 1px solid #e8e8ef;
  border-radius: 6px;
  padding: 10px;
  // box-shadow: 0 2px 10px rgba(0,0,0,.04);
}

/* 標題列 */
.themeManager-imgSize-title {
  display: flex;
  align-items: center;
  gap: 10px;
  &.logo {
    margin-bottom: 8px;
    svg {
      margin-left: auto;
    }
  }
  label {
    font-size: 14px;
    font-weight: 700;
    letter-spacing: .02em;
    color: #1e2233;
  }

  .themeManager-imgSize-size {
    font-size: 12px;
    color: #fff;
    background: var(--cp-bg-secondary);
    border: 1px solid #e8e8ef;
    color: #1e2233;
    background-color: #fff;
    border-radius: 20px;
    padding: 3px 8px 2px;
  }
}

/* 上傳區 */
.themeManager-imgSize-upload {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  /* 隱藏原生 input，改用 label 當按鈕 */
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
    color: #fff;
    background-color: var(--cp-color-primary);

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(28, 76, 231, .08);
    }

    &:disabled {
      opacity: .2;
      cursor: not-allowed;
      box-shadow: none;
    }
  }
}

/* 提示文字 */
.themeManager-imgSize-tips {
  font-size: 12px;
  color: var(--cp-text-secondary);
  padding-top: 8px;
  b {
    font-size: 11px;
  }
}
</style>