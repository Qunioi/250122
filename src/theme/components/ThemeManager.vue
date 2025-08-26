<template>
  <div class="theme-manager">
    <h3>主題切換</h3>
    <div class="changeColor-theme-wrap">
      <button
        v-for="theme in themes"
        :key="theme.themeID"
        :class="['changeColor-theme-btn', { active: selectedThemeName === theme.themeName }]"
        @click="selectTheme(theme.themeName)"
      >
        <div
          class="changeColor-theme-color"
          :style="{
            background: `linear-gradient(90deg, ${theme.themeColor.primary} 0, ${theme.themeColor.primary} 50%, ${theme.themeColor.secondary} 50%, ${theme.themeColor.secondary} 100%)`
          }"
        ></div>
        <span class="changeColor-theme-name">{{ theme.themeName }} ({{ theme.themeMode }})</span>
      </button>
      <!-- <button class="changeColor-theme-reset" @click="resetTheme">重置主題</button> -->
    </div>

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
// 按鈕切換主題
function selectTheme(themeName) {
  selectedThemeName.value = themeName
  onThemeChange()
}

// 將 hex 轉成 'r g b' 空白間隔格式
function hexToRgbSpace(hex) {
  hex = hex.replace('#', '')
  if (hex.length === 3) hex = hex.split('').map(x => x + x).join('')
  const num = parseInt(hex, 16)
  const r = (num >> 16) & 255
  const g = (num >> 8) & 255
  const b = num & 255
  return `${r} ${g} ${b}`
}
// 將 hex 轉成 rgb(x,x,x)
function hexToRgb(hex) {
  hex = hex.replace('#', '')
  if (hex.length === 3) hex = hex.split('').map(x => x + x).join('')
  const num = parseInt(hex, 16)
  const r = (num >> 16) & 255
  const g = (num >> 8) & 255
  const b = num & 255
  return `rgb(${r},${g},${b})`
}
// 將 rgb(x,x,x) 或 'x x x' 轉成 hex
function toHex(val) {
  if (typeof val === 'string' && val.startsWith('rgb')) {
    const result = val.match(/\d+/g)
    if (result && result.length === 3) {
      return (
        '#' +
        result
          .map(x => {
            const hex = parseInt(x).toString(16)
            return hex.length === 1 ? '0' + hex : hex
          })
          .join('')
      )
    }
  } else if (typeof val === 'string' && /^\d+ \d+ \d+$/.test(val)) {
    const arr = val.split(' ')
    return (
      '#' +
      arr
        .map(x => {
          const hex = parseInt(x).toString(16)
          return hex.length === 1 ? '0' + hex : hex
        })
        .join('')
    )
  }
  return val
}
import { colorDatabase } from '../colorDatabase'
import { useTheme } from '../useTheme'
import themeData from '@/assets/data/theme.json'
import ColorPicker from './ColorPicker.vue'

const themes = themeData.colorThemes
const { setTheme } = useTheme()
const selectedThemeName = ref(themes[0]?.themeName || '')
const colorVars = themeData.colorVariables || []
const selectedColors = ref([])

// 依主題儲存 customThemeColors
function getCustomThemeColors(themeName) {
  return JSON.parse(localStorage.getItem(`customThemeColors_${themeName}`) || 'null')
}
function saveCustomThemeColors(themeName, colors) {
  localStorage.setItem(`customThemeColors_${themeName}` , JSON.stringify(colors))
}

function clearThemeColors() {
  // 清除所有 colorVars 相關的 style 顏色
  colorDatabase.filter(item => colorVars.includes(item.id)).forEach(item => {
    document.documentElement.style.removeProperty(item.varName)
  })
}

function onThemeChange() {
  setTheme(selectedThemeName.value)
  clearThemeColors()
  // 先嘗試讀取 localStorage
  const saved = getCustomThemeColors(selectedThemeName.value)
  if (saved) {
    selectedColors.value = colorDatabase.filter(item => colorVars.includes(item.id)).map(item => ({
      ...item,
      value: saved[item.id] || toHex(getThemeColorValue(item.varName))
    }))
    // 套用已存顏色
    selectedColors.value.forEach(item => {
      document.documentElement.style.setProperty(item.varName, hexToRgbSpace(item.value))
    })
  } else {
    selectedColors.value = colorDatabase.filter(item => colorVars.includes(item.id)).map(item => ({
      ...item,
      value: toHex(getThemeColorValue(item.varName))
    }))
  }
}

function getThemeColorValue(varName) {
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim() || '#000000'
}
function updateColor(item, newValue) {
  // 保證 newValue 為 hex
  item.value = newValue
  document.documentElement.style.setProperty(item.varName, hexToRgbSpace(newValue))
  // 儲存到 localStorage
  const themeName = selectedThemeName.value
  const colors = getCustomThemeColors(themeName) || {}
  colors[item.id] = newValue
  saveCustomThemeColors(themeName, colors)
}

// 初始化
onThemeChange()
</script>

<style lang="scss">
:root {
  --cp-bg-primary: #FFF;
  --cp-bg-secondary: #889EBC;
  --cp-color-bg: #F1F4F8;
  --cp-color-primary: #417FF7;
  --cp-color-third: #F5F7FA;
  --cp-text-primary: #3D4154;
  --cp-text-secondary: #97A2AF;
}
.theme-manager {
  padding: 24px;
  color: #000;
  background: #f9f9f9;
  border-radius: 8px;
  max-width: 400px;
  margin: 32px auto;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  h3 {
    margin-top: 0;
  }
}

// 主題切換
.changeColor-theme-wrap {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  .changeColor-theme-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 26px;
    height: 26px;
    border-radius: 4px;
    border: 1px solid transparent;
  }
  .changeColor-theme-btn.active {
    border-color: var(--cp-color-primary);
  }
  .changeColor-theme-color {
    width: 20px;
    height: 20px;
    border-radius: 2px;
  }
  .changeColor-theme-name {
    display: none;
  }
}
</style>
