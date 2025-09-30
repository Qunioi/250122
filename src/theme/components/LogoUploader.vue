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
        <label for="themeManager-imgSize-input" class="themeManager-btn themeManager-imgSize-upload-btn">選擇圖片</label>
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
        <span>僅接受 <b>JPG/PNG/GIF</b>，大小 ≤ <b>600KB</b>，解析度需為 <b>{{ logoSize }}</b></span>
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
import { nextTick, computed, onMounted } from 'vue'
import { useBrandAssetsStore } from '@/stores/brandAssetsStore'

const MAX_SIZE = 600 * 1024 // 600 KB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif']
const ALLOWED_EXTS  = ['jpg','jpeg','png','gif']

const assets = useBrandAssetsStore()
onMounted(() => assets.load())

/** 共用：讀取 DOM 元素尺寸 */
function getBox(selector, fallbackW, fallbackH) {
  const el = document.querySelector(selector)
  if (!el) return { el: null, w: fallbackW, h: fallbackH }
  const r = el.getBoundingClientRect()
  const w = Math.round(r.width || Number(el.getAttribute('width')) || fallbackW)
  const h = Math.round(r.height || Number(el.getAttribute('height')) || fallbackH)
  return { el, w, h }
}

// logo 尺寸
const logoSize = computed(() => {
  const { w, h } = getBox('.ele-logo-img', 180, 116)
  return `${w}x${h}`
})

// slider 尺寸
const sliderSize = computed(() => {
  const { w, h } = getBox('.ele-slider-img', 375, 200) // 預設一個常見的輪播圖尺寸
  return `${w}x${h}`
})

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
  margin-top: 10px;
}

/* 區塊卡片 */
.themeManager-imgSize-section {
  background: var(--cp-color-third);
  border: 1px solid #e8e8ef;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 10px rgba(0,0,0,.04);
}

/* 標題列 */
.themeManager-imgSize-title {
  display: flex;
  gap: 10px;
  &.logo {
    margin-bottom: 8px;
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
    background-color: var(--cp-bg-secondary);

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(28, 76, 231, .08);
    }

    &:disabled {
      opacity: .55;
      cursor: not-allowed;
      box-shadow: none;
    }
  }
}

/* 提示文字 */
.themeManager-imgSize-tips {
  margin-top: 8px;
  font-size: 12px;
  color: #6f7791;
  line-height: 1.5;
  b { font-weight: 700; color: #384166; }
}

/* 小尺寸適配 */
@media (max-width: 480px) {
  .themeManager-imgSize-section { padding: 12px; }
  .themeManager-imgSize-title { flex-direction: column; gap: 6px; }
}
</style>