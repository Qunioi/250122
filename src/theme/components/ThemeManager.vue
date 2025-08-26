<template>
  <div class="theme-manager">
    <h3>主題切換</h3>
    <select v-model="selectedThemeName" @change="onThemeChange">
      <option v-for="theme in themes" :key="theme.themeID" :value="theme.themeName">
        {{ theme.themeName }} ({{ theme.themeMode }})
      </option>
    </select>

    <h4>主題顏色自訂</h4>
    <div v-if="selectedColors.length">
      <ColorPicker
        v-for="color in selectedColors"
        :key="color.id"
        :item="color"
        @update="updateColor"
      />
    </div>
    <div v-else>
      <p>此主題尚未設定 colorVariables。</p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

import themeData from '@/assets/data/theme.json'
import { colorDatabase } from '../colorDatabase'
import ColorPicker from './ColorPicker.vue'
import { useTheme } from '../useTheme'

const themes = themeData.colorThemes
const { setTheme } = useTheme()
const selectedThemeName = ref(themes[0]?.themeName || '')
const colorVars = themeData.colorVariables || []
const selectedColors = ref([])

function onThemeChange() {
  setTheme(selectedThemeName.value)
  selectedColors.value = colorDatabase.filter(item => colorVars.includes(item.id)).map(item => ({
    ...item,
    value: getThemeColorValue(item.varName)
  }))
}

function getThemeColorValue(varName) {
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim() || '#000000'
}

function hexToRgb(hex) {
  hex = hex.replace('#', '')
  if (hex.length === 3) hex = hex.split('').map(x => x + x).join('')
  const num = parseInt(hex, 16)
  const r = (num >> 16) & 255
  const g = (num >> 8) & 255
  const b = num & 255
  return `rgb(${r},${g},${b})`
}

function updateColor(item, newValue) {
  const rgbValue = hexToRgb(newValue)
  item.value = rgbValue
  document.documentElement.style.setProperty(item.varName, rgbValue)
}

// 初始化
onThemeChange()
</script>

<style scoped>
.theme-manager {
  padding: 24px;
  color: #000;
  background: #f9f9f9;
  border-radius: 8px;
  max-width: 400px;
  margin: 32px auto;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}
h3 {
  margin-top: 0;
}
select {
  margin-bottom: 16px;
  padding: 6px 12px;
  border-radius: 4px;
  border: 1px solid #ccc;
}
</style>
