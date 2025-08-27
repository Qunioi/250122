import themeData from '@/assets/data/theme.json'
import { colorDatabase } from './colorDatabase'

/**
 * 共用主題工具
 * @param {object} options
 * @param {string} options.namespace - localStorage 命名空間（可選）
 */
export function useTheme(options = {}) {
  const namespace = options.namespace || 'app'

  const getTheme = (themeName) =>
    themeData.colorThemes?.find(t => t.themeName === themeName)

  const setTheme = (themeName) => {
    const theme = getTheme(themeName)
    if (!theme) return
    const el = document.documentElement
    // 舊有：合併字串（若你的 CSS 用 [data-theme~="dark"] 這類 token selector，仍可用）
    el.setAttribute('data-theme', `${theme.themeMode} ${theme.themeName}`)
    // 建議：分開屬性，選擇器更直覺
    el.setAttribute('data-theme-mode', theme.themeMode)
    el.setAttribute('data-theme-name', theme.themeName)
  }

  const getColorVars = (themeName) =>
    getTheme(themeName)?.colorVariables || themeData.colorVariables || []

  const getSelectedColors = (themeName) => {
    const vars = getColorVars(themeName)
    return colorDatabase.filter(item => vars.includes(item.id))
  }

  const storageKey = (themeName) => `${namespace}:customThemeColors:${themeName}`

  return {
    setTheme,
    getColorVars,
    getSelectedColors,
    storageKey,
    themes: themeData.colorThemes || []
  }
}