<template>
  <div class="page-body">
    <img :src="hallImage" class="imgHall">
  </div>
</template>

<script setup>
import { useTheme } from '@/composables/useTheme.js'
import { getPath } from '@/composables/usePath.js'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const { themeMode } = useTheme()
const navClass = computed(() => route.params.type)

const hallImage = computed(() => {
  const map = {
    card: getPath('image/not-use/hall/card_1200.png'),
    casino: getPath('image/not-use/hall/casino_960.png'),
    live: getPath('image/not-use/hall/live_960.png'),
    lottery: getPath('image/not-use/hall/lottery_1200.jpg'),
    sport: getPath('image/not-use/hall/sport_1200.png')
  }
  // 活動頁面需根據主題模式切換
  if (navClass.value === 'promotion') {
    return getPath(`image/not-use/hall/promotions_${themeMode.value}.png`)
  }
  return map[navClass.value] || ''
})
</script>