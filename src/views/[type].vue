<template>
  <div class="page-body">
    <div class="banner-wrap" :style="bannerStyle"></div>
  </div>
</template>

<script setup>
import { useTheme } from '@/composables/useTheme.js'
import { useRoute } from 'vue-router'

const route = useRoute()
const { themeColor, lang } = useTheme() // 取得主題色與語言
const navClass = computed(() => route.params.type) // 取得 navClass

const bannerStyle = computed(() => ({
  backgroundImage: `url(/image/${themeColor.value}/lang/${lang.value}/title_${navClass.value}.png)`
}))
</script>