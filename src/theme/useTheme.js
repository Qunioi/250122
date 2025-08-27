import themeData from '@/assets/data/theme.json'
import { colorDatabase } from './colorDatabase'

/**
 * 共用主題工具
 * @param {object} options
 * @param {string} [options.namespace='app'] - localStorage 命名空間
 * @param {string} [options.forceMode] - 強制設定主題模式（優先於 theme.json）
 */
export function useTheme(options = {}) {
  const namespace = options.namespace || 'app'
  const forceMode = options.forceMode

  const getTheme = (themeName) =>
    themeData.colorThemes?.find(t => t.themeName === themeName)

  const setTheme = (themeName) => {
    const theme = getTheme(themeName)
    if (!theme) return
    const el = document.documentElement
    el.setAttribute('data-theme', `${theme.themeMode} ${theme.themeName}`)
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