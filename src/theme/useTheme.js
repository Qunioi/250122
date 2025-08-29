// src/theme/useTheme.js
import themeData from '@/assets/data/theme.json'
import { colorDatabase } from './colorDatabase'

const hasWindow = () => typeof window !== 'undefined'
const lsGet = (k, fallback = null) => (hasWindow() ? localStorage.getItem(k) : null) ?? fallback
const lsSet = (k, v) => { if (hasWindow()) localStorage.setItem(k, v) }

export function useTheme(options = {}) {
  const namespace = options.namespace || 'app'
  const keyColor = `${namespace}:themeColor`
  const keyMode  = `${namespace}:themeMode`

  const getTheme = (themeName) =>
    themeData.colorThemes?.find(t => t.themeName === themeName)

  const getDefaultModeOf = (themeName) => getTheme(themeName)?.themeMode || 'dark'

  /**
   * 實際套用主題（唯一會動 DOM 的地方）
   * @param {string} themeName
   * @param {string} [mode] - 若不傳，採用該主題預設 mode
   * @param {boolean} [persist=true] - 是否寫入 localStorage
   */
  const applyTheme = (themeName, mode, persist = true) => {
    const theme = getTheme(themeName)
    if (!theme || typeof document === 'undefined') return
    const finalMode = mode || getDefaultModeOf(themeName)
    document.documentElement.setAttribute('data-theme', `${finalMode} ${themeName}`)
    if (persist) {
      lsSet(keyColor, themeName)
      lsSet(keyMode, finalMode)
    }
  }

  /** 從 storage 讀取並套用（頁面初始化時用） */
  const initTheme = (fallbackThemeName, fallbackMode) => {
    const themeName = lsGet(keyColor, fallbackThemeName)
    const mode = lsGet(keyMode, fallbackMode || getDefaultModeOf(themeName))
    applyTheme(themeName, mode, false) // 初始化可不重寫 storage
    return { themeName, mode }
  }

  // ===== 純資料工具（不動 DOM） =====
  const getColorVars = (themeName) =>
    getTheme(themeName)?.colorVariables || themeData.colorVariables || []

  const getSelectedColors = (themeName) => {
    const vars = getColorVars(themeName)
    return colorDatabase.filter(item => vars.includes(item.id))
  }

  const storageKey = (themeName) => `${namespace}:customThemeColors:${themeName}`
  const persistCustom = {
    get(themeName) {
      if (!hasWindow()) return null
      return JSON.parse(localStorage.getItem(storageKey(themeName)) || 'null')
    },
    set(themeName, colors) {
      if (!hasWindow()) return
      localStorage.setItem(storageKey(themeName), JSON.stringify(colors))
    },
    clear(themeName) {
      if (!hasWindow()) return
      localStorage.removeItem(storageKey(themeName))
    }
  }

  return {
    // 唯一動 DOM 的方法
    applyTheme,
    initTheme,

    // 工具
    getTheme,
    getDefaultModeOf,
    getColorVars,
    getSelectedColors,
    storageKey,
    persistCustom,
    themes: themeData.colorThemes || []
  }
}
