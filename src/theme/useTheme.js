import themeData from '@/assets/data/theme.json'
import { colorDatabase } from './colorDatabase'

export function useTheme() {
  // 將 rgb(x,x,x) 轉成 'x x x' 格式
  function formatRgbValue(value) {
    if (typeof value === 'string' && value.startsWith('rgb')) {
      const result = value.match(/\d+/g);
      return result ? result.join(' ') : value;
    }
    return value;
  }

  const setTheme = (themeName) => {
    const theme = themeData.colorThemes.find(t => t.themeName === themeName)
    if (theme) {
      document.documentElement.setAttribute('data-theme', `${theme.themeMode} ${theme.themeName}`)
    }
  }
  const getSelectedColors = (themeName) => {
    const theme = themeData.colorThemes.find(t => t.themeName === themeName)
    if (!theme || !theme.colorVariables) return []
    return colorDatabase.filter(item => theme.colorVariables.includes(item.id))
  }
  return { setTheme, getSelectedColors, themes: themeData.colorThemes }
}
