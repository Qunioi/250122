<template>
  <ThemeManager v-if="enableThemeManager">
    <Layout />
  </ThemeManager>
  <Layout v-else />
</template>

<script setup>
import ThemeManager from '@/theme/components/ThemeManager.vue'
import Layout from '@/components/Layout.vue'

// 控制 ThemeManager 開關, true: 開啟, false: 關閉
const enableThemeManager = ref(true)
provide('enableThemeManager', enableThemeManager)
</script>