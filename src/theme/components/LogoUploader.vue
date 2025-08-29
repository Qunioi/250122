<template>
  <div class="themeManager-imgSize-wrap">
    <div class="themeManager-imgSize-section">
      <div class="themeManager-imgSize-title logo">
        <label>Logo</label>
        <span class="themeManager-imgSize-size">{{ logoSize }}</span>
      </div>
      <div class="themeManager-imgSize-preview">
        <img v-if="assets.logoDataUrl" :src="assets.logoDataUrl" alt="Logo 預覽" class="themeManager-imgSize-img" />
        <div v-else class="themeManager-imgSize-img themeManager-imgSize-img--empty">預設 Logo</div>
      </div>
      <div class="themeManager-imgSize-upload">
        <input
          type="file"
          accept=".jpg,.jpeg,.png,.gif"
          class="themeManager-imgSize-upload-input"
          @change="onLogoFileChange"
          id="themeManager-imgSize-input"
        />
        <label for="themeManager-imgSize-input" class="themeManager-imgSize-upload-btn">選擇圖片</label>
        <button
          type="button"
          class="themeManager-imgSize-reset-btn"
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
      alert(`解析度不符合，需為 ${targetW}x${targetH} 像素（目前為 ${imgW}x${imgH}）`)
      resetInput(e)
      return
    }
  } catch {
    alert('圖片讀取失敗，請重新選擇')
    resetInput(e)
    return
  }

  assets.setLogo(dataUrl)
  resetInput(e)
  alert('Logo 已更新')
}

function resetLogo() {
  assets.clearLogo()
  alert('已還原預設 Logo')
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
  background: #fff;
  border: 1px solid #e8e8ef;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 10px rgba(0,0,0,.04);

  /* 暗色主題優化 */
  :global(html[data-theme*="dark"]) & {
    background: #1e1f26;
    border-color: #2a2c36;
    box-shadow: 0 2px 10px rgba(0,0,0,.25);
  }
}

/* 標題列 */
.themeManager-imgSize-title {
  display: flex;
  align-items: baseline;
  gap: 10px;
  &.logo {
    margin-bottom: 8px;
  }
  label {
    font-size: 14px;
    font-weight: 700;
    letter-spacing: .02em;
    color: #1e2233;
    :global(html[data-theme*="dark"]) & { color: #e8ecff; }
  }

  .themeManager-imgSize-size {
    font-size: 12px;
    color: #7a8299;
    background: #f3f5fa;
    border: 1px solid #e7eaf4;
    border-radius: 6px;
    padding: 2px 8px;
    :global(html[data-theme*="dark"]) & {
      color: #b8c0d6;
      background: #242735;
      border-color: #2e3344;
    }
  }
}

/* 預覽框 */
.themeManager-imgSize-preview {
  border: 1px dashed #cfd6e6;
  border-radius: 10px;
  background: linear-gradient(180deg, #fafbff 0%, #f5f7fe 100%);
  min-height: 116px; /* 保持最小高度，避免空時塌陷 */
  display: grid;
  place-items: center;
  padding: 10px;
  margin-bottom: 12px;

  :global(html[data-theme*="dark"]) & {
    border-color: #384059;
    background: linear-gradient(180deg, #1b1d27 0%, #171923 100%);
  }

  .themeManager-imgSize-img {
    max-width: 100%;
    max-height: 180px; /* 防暴衝；可依需求調整 */
    object-fit: contain;
    display: block;

    &--empty {
      width: 100%;
      height: 100%;
      min-height: 80px;
      display: grid;
      place-items: center;
      color: #9aa3b8;
      font-size: 13px;
      letter-spacing: .02em;
      :global(html[data-theme*="dark"]) & { color: #8590a8; }
    }
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
    appearance: none;
    border: 1px solid #d7dceb;
    background: #fff;
    color: #1e2233;
    padding: 8px 12px;
    border-radius: 8px;
    font-size: 13px;
    line-height: 1;
    cursor: pointer;
    transition: transform .08s ease, box-shadow .2s ease, background .2s ease, border-color .2s ease, color .2s ease;

    :global(html[data-theme*="dark"]) & {
      background: #232736;
      border-color: #333a4f;
      color: #e8ecff;
    }

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(28, 76, 231, .08);
      border-color: #b8c4f2;
      :global(html[data-theme*="dark"]) & {
        box-shadow: 0 4px 12px rgba(0,0,0,.25);
        border-color: #485376;
      }
    }

    &:active {
      transform: translateY(0);
      box-shadow: 0 2px 6px rgba(28, 76, 231, .06);
    }

    &:disabled {
      opacity: .55;
      cursor: not-allowed;
      box-shadow: none;
    }
  }

  .themeManager-imgSize-upload-btn {
    border-color: #bfc9f2;
    background: #f5f7ff;
    :global(html[data-theme*="dark"]) & {
      background: #2a2f41;
      border-color: #49537a;
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

  :global(html[data-theme*="dark"]) & {
    color: #9aa3b8;
    b { color: #c7d0ef; }
  }
}

/* 小尺寸適配 */
@media (max-width: 480px) {
  .themeManager-imgSize-section { padding: 12px; }
  .themeManager-imgSize-title { flex-direction: column; gap: 6px; }
  .themeManager-imgSize-preview { min-height: 90px; }
}
</style>