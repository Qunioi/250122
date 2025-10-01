<template>
  <a href="#" class="ele-logo-wrap">
    <!-- 若有自訂 logo，顯示圖片；否則顯示預設 SVG -->
    <img
      v-if="assets.logoDataUrl"
      class="ele-logo-img"
      :src="assets.logoDataUrl"
      alt="Logo"
      decoding="async"
      loading="lazy"
      referrerpolicy="no-referrer"
    />
    <svg v-else class="ele-logo-img" width="180" height="116" viewBox="0 0 180 116" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M139.2 39.65C144.7 39.65 149.88 41.8 153.77 45.69L153.76 45.66C157.65 49.55 159.8 54.72 159.8 60.23V80.93C153.31 80.93 152.43 74.83 152.34 72.4V60.23C152.34 56.72 150.97 53.42 148.49 50.94C146.01 48.46 142.7 47.09 139.19 47.09C135.68 47.09 132.37 48.45 129.89 50.94L129.78 51.05L126.04 54.48V71.42C126.04 71.42 126.68 80.94 118.58 80.94V61.34L103.85 74.87C99.83 78.85 94.58 80.84 89.33 80.84C84.05 80.84 78.78 78.83 74.76 74.81L62.83 62.88L50.89 50.95C45.85 45.91 37.69 45.83 32.55 50.71L32.16 51.09C29.7 53.62 28.46 56.91 28.46 60.2V60.24C28.46 63.61 29.73 66.98 32.3 69.54C37.42 74.65 45.29 74.85 50.89 69.54C56.5 64.23 63.52 67.46 63.52 67.46L56.18 74.8C48.12 82.84 35.05 82.83 27.02 74.8C23 70.78 21 65.5 21 60.22V28C29.1 28 28.46 37.52 28.46 37.52V44.37C32.25 41.22 36.92 39.63 41.59 39.63C46.88 39.63 52.15 41.64 56.17 45.66L68.1 57.59L80.04 69.53C80.34 69.83 80.65 70.11 80.97 70.37C80.6668 70.1236 80.3725 69.8682 80.0872 69.5869C85.221 74.66 93.5257 74.6443 98.64 69.54L98.75 69.43L98.78 69.4C103.77 64.27 103.72 56.03 98.64 50.95C93.52 45.84 85.65 45.64 80.05 50.95C74.44 56.26 67.42 53.02 67.42 53.02V28.03C75.52 28.03 74.88 37.55 74.88 37.55V45.58C82.94 37.66 95.92 37.7 103.91 45.69C107.66 49.45 109.64 54.3 109.89 59.22L118.59 51.23V41.4C122.16 41.4 124.03 43.25 125.01 45.32C128.86 41.66 133.7 39.65 139.2 39.65ZM122.22 38.31L119.21 35.3V35.31C117.55 33.64 117.55 30.95 119.21 29.29C120.87 27.63 123.57 27.63 125.23 29.29C126.89 30.95 126.89 33.64 125.23 35.3L122.22 38.31Z" fill="currentColor"/>
      <path style="mix-blend-mode:multiply" d="M74.88 45.59V37.56C74.88 37.56 75.52 28.04 67.42 28.04V53.03H67.58L74.75 45.7C74.75 45.7 74.84 45.63 74.87 45.59H74.88Z" fill="url(#paint0_linear)"/>
      <path style="mix-blend-mode:multiply" d="M118.58 61.36V80.96C126.68 80.96 126.04 71.44 126.04 71.44V54.5L124.83 55.61L118.58 61.36Z" fill="url(#paint1_linear)"/>
      <path style="mix-blend-mode:multiply" d="M27.19 45.53C27.6 45.13 28.02 44.77 28.46 44.41V37.55C28.46 37.55 29.1 28.03 21 28.03V60.25H21.02C21.02 55.09 22.93 49.94 26.77 45.96L27.2 45.52L27.19 45.53Z" fill="url(#paint2_linear)"/>
      <path style="mix-blend-mode:multiply" d="M103.91 45.69C95.92 37.7 82.9399 37.66 74.8799 45.58C74.8399 45.62 74.7999 45.65 74.7599 45.69L67.59 52.86L67.4299 53.03C67.4299 53.03 74.4499 56.26 80.0599 50.95C85.6599 45.64 93.53 45.84 98.65 50.95C103.73 56.03 103.78 64.27 98.79 69.4L109.91 59.2C109.66 54.28 107.68 49.43 103.93 45.67L103.91 45.69Z" fill="url(#paint3_linear)"/>
      <path style="mix-blend-mode:multiply" d="M125 45.32C124.02 43.25 122.15 41.4 118.58 41.4V51.23C118.58 51.23 124.89 45.43 125 45.32Z" fill="url(#paint4_linear)"/>
      <defs>
      <linearGradient id="paint0_linear" x1="71.15" y1="37.8" x2="71.15" y2="51.91" gradientUnits="userSpaceOnUse">
      <stop stop-color="#000" stop-opacity="0"/>
      <stop offset="1" stop-color="#000" stop-opacity="0.35"/>
      </linearGradient>
      <linearGradient id="paint1_linear" x1="123.09" y1="45.07" x2="122.45" y2="63.2" gradientUnits="userSpaceOnUse">
      <stop stop-color="#000" stop-opacity="0"/>
      <stop offset="0.42" stop-color="#000" stop-opacity="0.25"/>
      <stop offset="1" stop-color="#000" stop-opacity="0"/>
      </linearGradient>
      <linearGradient id="paint2_linear" x1="24.49" y1="38.88" x2="23.36" y2="51.79" gradientUnits="userSpaceOnUse">
      <stop stop-color="#000" stop-opacity="0"/>
      <stop offset="1" stop-color="#000" stop-opacity="0.35"/>
      </linearGradient>
      <linearGradient id="paint3_linear" x1="88.34" y1="53.91" x2="93.92" y2="69.18" gradientUnits="userSpaceOnUse">
      <stop stop-color="#000" stop-opacity="0"/>
      <stop offset="1" stop-color="#000" stop-opacity="0.35"/>
      </linearGradient>
      <linearGradient id="paint4_linear" x1="121.77" y1="47.17" x2="121.93" y2="54.96" gradientUnits="userSpaceOnUse">
      <stop stop-color="#000" stop-opacity="0"/>
      <stop offset="0.42" stop-color="#000" stop-opacity="0.25"/>
      <stop offset="1" stop-color="#000" stop-opacity="0"/>
      </linearGradient>
      </defs>
    </svg>
  </a>
</template>


<script setup>
import { useBrandAssetsStore } from '@/stores/brandAssetsStore'

const assets = useBrandAssetsStore()
onMounted(() => assets.load())
</script>