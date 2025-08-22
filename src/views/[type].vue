<template>
  <div class="page-body">
    <img :src="hallImage" class="imgHall">
  </div>
</template>

<script setup>
import { useTheme } from '@/composables/useTheme.js'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const { themeMode } = useTheme()
const navClass = computed(() => route.params.type)

const hallImage = computed(() => {
  const map = {
    card: '/image/not-use/hall/card_1200.png',
    casino: '/image/not-use/hall/casino_960.png',
    live: '/image/not-use/hall/live_960.png',
    lottery: '/image/not-use/hall/lottery_1200.jpg',
    sport: '/image/not-use/hall/sport_1200.png'
  }
  // 活動頁面需根據主題模式切換
  if (navClass.value === 'promotion') {
    return `/image/not-use/hall/promotions_${themeMode.value}.png`
  }
  return map[navClass.value] || ''
})
</script>