import themeData from '@/assets/data/theme.json'
import { colorDatabase } from './colorDatabase'

export function useTheme() {
  const setTheme = (themeName) => {
    const theme = themeData.colorThemes.find(t => t.themeName === themeName)
    if (theme) {
      document.documentElement.setAttribute('data-theme', `${theme.themeMode} ${theme.themeName}`)
      Object.entries(theme.themeColor).forEach(([key, value]) => {
        document.documentElement.style.setProperty(`--${key}`, value)
      })
    }
  }
  const getSelectedColors = (themeName) => {
    const theme = themeData.colorThemes.find(t => t.themeName === themeName)
    if (!theme || !theme.colorVariables) return []
    return colorDatabase.filter(item => theme.colorVariables.includes(item.id))
  }
  return { setTheme, getSelectedColors, themes: themeData.colorThemes }
}
