<template>
  <div class="changeColor-manager">
    <h3>主題切換</h3>

    <div class="changeColor-theme-wrap">
      <button
        v-for="theme in themes"
        :key="theme.themeID ?? theme.themeName"
        :class="['changeColor-theme-btn', { active: selectedThemeName === theme.themeName }]"
        type="button"
        @click="selectTheme(theme.themeName)"
      >
        <div
          class="changeColor-theme-color"
          :style="{
            background: `linear-gradient(90deg, ${theme.themeColor.primary} 0, ${theme.themeColor.primary} 50%, ${theme.themeColor.secondary} 50%, ${theme.themeColor.secondary} 100%)`
          }"
        />
        <span class="changeColor-theme-name">
          {{ theme.themeName }} ({{ theme.themeMode }})
        </span>
      </button>

      <button
        class="changeColor-theme-reset"
        type="button"
        :disabled="!hasModified"
        :title="hasModified ? '重置當前主題所有自訂顏色' : '尚未調整，無需重置'"
        @click="resetTheme"
      >
        重置主題
      </button>

      <span class="changeColor-theme-modified">已調整：{{ hasModified ? 'true' : 'false' }}</span>
    </div>

    <h4>主題顏色自訂</h4>
    <div v-if="selectedColors.length">
      <ColorPicker
        v-for="color in selectedColors"
        :key="color.id"
        :item="color"
        :modified="modifiedMap[color.id]"
        @update="updateColor"
        @remove="removeColor"
      />
    </div>
    <div v-else>
      <p>此主題尚未設定 colorVariables。</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { colorDatabase } from '../colorDatabase'
import { useTheme } from '../useTheme'
import themeData from '@/assets/data/theme.json'
import ColorPicker from './ColorPicker.vue'

/** ---- 工具：色彩轉換 ---- */
const normalizeHex = (hex) => (hex || '').toLowerCase()

function hexToRgbSpace(hex) {
  const v = normalizeHex(hex).replace('#', '')
  const full = v.length === 3 ? v.split('').map(x => x + x).join('') : v
  const num = parseInt(full, 16)
  const r = (num >> 16) & 255
  const g = (num >> 8) & 255
  const b = num & 255
  return `${r} ${g} ${b}`
}

function toHex(val) {
  if (!val) return '#000000'
  const v = String(val).toLowerCase()
  if (v.startsWith('#')) {
    if (v.length === 4) return '#' + v.slice(1).split('').map(ch => ch + ch).join('')
    return v
  }
  if (v.startsWith('rgb')) {
    const result = v.match(/\d+/g)
    if (result?.length === 3) {
      return '#' + result.map(x => {
        const hex = (parseInt(x, 10) || 0).toString(16)
        return hex.length === 1 ? '0' + hex : hex
      }).join('')
    }
  }
  if (/^\d+\s+\d+\s+\d+$/.test(v)) {
    const arr = v.split(' ')
    return '#' + arr.map(x => {
      const hex = (parseInt(x, 10) || 0).toString(16)
      return hex.length === 1 ? '0' + hex : hex
    }).join('')
  }
  return v
}

/** ---- 主題資料與狀態 ---- */
const { setTheme, getColorVars, themes } = useTheme({ namespace: 'app' })

const selectedThemeName = ref(themes[0]?.themeName || '')
const currentTheme = computed(() => themes.find(t => t.themeName === selectedThemeName.value))
const colorVars = computed(() => getColorVars(selectedThemeName.value))

// 畫面上的色票（reactive）
const selectedColors = ref([]) // [{ id, name, varName, value: '#rrggbb' }]

// baseline：當前主題原生值（無 inline 覆寫時量取）
const baselineMap = ref({}) // { [id]: '#rrggbb' }

// 當前主題的持久化快取（mirror localStorage；reactive）
const savedColors = ref({}) // { [id]: '#rrggbb' }

/** ---- DOM & Storage ---- */
function getThemeColorValue(varName) {
  if (typeof window === 'undefined') return '#000000'
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim() || '#000000'
}

function clearThemeInlineColors() {
  const el = document.documentElement
  colorDatabase
    .filter(item => colorVars.value.includes(item.id))
    .forEach(item => el.style.removeProperty(item.varName))
}

function storageKey(themeName) {
  // 若你在 useTheme 指定 namespace，可與此一致；此處簡單使用同樣格式
  return `app:customThemeColors:${themeName}`
}

function getCustomThemeColors(themeName) {
  return JSON.parse(localStorage.getItem(storageKey(themeName)) || 'null')
}
function saveCustomThemeColors(themeName, colors) {
  localStorage.setItem(storageKey(themeName), JSON.stringify(colors))
}
function clearCustomThemeColors(themeName) {
  localStorage.removeItem(storageKey(themeName))
}

/** ---- 初始化 / 切主題 ---- */
function onThemeChange() {
  setTheme(selectedThemeName.value)
  clearThemeInlineColors()

  const items = colorDatabase.filter(item => colorVars.value.includes(item.id))

  // 量 baseline（無 inline 覆寫）
  const base = {}
  for (const item of items) {
    base[item.id] = normalizeHex(toHex(getThemeColorValue(item.varName)))
  }
  baselineMap.value = base

  // 載入 localStorage -> reactive
  savedColors.value = getCustomThemeColors(selectedThemeName.value) || {}

  // 組畫面色票（若有存檔，覆蓋 baseline）
  selectedColors.value = items.map(item => {
    const cur = normalizeHex(savedColors.value[item.id] || base[item.id])
    return { ...item, value: cur }
  })

  // 對已存的項目套 inline 覆寫
  for (const item of items) {
    const hex = savedColors.value[item.id]
    if (hex) {
      document.documentElement.style.setProperty(item.varName, hexToRgbSpace(hex))
    }
  }
}

watch(selectedThemeName, onThemeChange, { immediate: true })

/** ---- 修改狀態（即時） ---- */
// 每個顏色是否與 baseline 不同
const modifiedMap = computed(() => {
  const map = {}
  for (const item of selectedColors.value) {
    const base = normalizeHex(baselineMap.value[item.id])
    const cur  = normalizeHex(item.value)
    map[item.id] = !!(base && cur && base !== cur)
  }
  return map
})

// 是否有任一顏色被修改
const hasModified = computed(() => Object.values(modifiedMap.value).some(Boolean))

/** ---- 事件：更新 / 重置單一色 ---- */
function updateColor(item, newHex) {
  const themeName = selectedThemeName.value
  const next = normalizeHex(newHex)
  const base = normalizeHex(baselineMap.value[item.id])

  // 先更新 UI（讓 computed 立即反應）
  item.value = next

  // 選回 baseline => 視為移除自訂
  if (next === base) {
    const colors = getCustomThemeColors(themeName) || {}
    delete colors[item.id]
    saveCustomThemeColors(themeName, colors)
    const c = { ...savedColors.value }
    delete c[item.id]
    savedColors.value = c
    document.documentElement.style.removeProperty(item.varName)
    return
  }

  // 否則：存檔 + inline
  const colors = getCustomThemeColors(themeName) || {}
  colors[item.id] = next
  saveCustomThemeColors(themeName, colors)
  savedColors.value = { ...savedColors.value, [item.id]: next }
  document.documentElement.style.setProperty(item.varName, hexToRgbSpace(next))
}

function removeColor(item) {
  const themeName = selectedThemeName.value

  const colors = getCustomThemeColors(themeName) || {}
  delete colors[item.id]
  saveCustomThemeColors(themeName, colors)

  const c = { ...savedColors.value }
  delete c[item.id]
  savedColors.value = c

  const base = normalizeHex(baselineMap.value[item.id] || toHex(getThemeColorValue(item.varName)))
  item.value = base
  document.documentElement.style.removeProperty(item.varName)
}

/** ---- 全部重置（當前主題） ---- */
function resetTheme() {
  clearThemeInlineColors()
  clearCustomThemeColors(selectedThemeName.value)
  savedColors.value = {}

  // 直接把畫面值還原 baseline（即時）
  selectedColors.value = selectedColors.value.map(item => ({
    ...item,
    value: normalizeHex(baselineMap.value[item.id])
  }))
}

/** ---- UI 事件：切主題 ---- */
function selectTheme(themeName) {
  selectedThemeName.value = themeName
}
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
.changeColor-manager {
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