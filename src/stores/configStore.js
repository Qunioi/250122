import { defineStore } from 'pinia'
import themeConfig from '@/assets/data/theme.json'
import Footer from '../components/Footer.vue'

export const useConfigStore = defineStore('config', () => {
  // 從主題配置檔案獲取主題選項
  const themeOptions = computed(() => {
    return themeConfig.colorThemes.map(theme => ({
      value: theme.value,
      label: `${theme.themeName} (${theme.themeMode})`
    }))
  })

  // 開發工具顯示開關
  const showDevTools = ref(themeConfig.showDevTools)

  // 從 localStorage 或 .env 獲取初始值
  const themeColor = ref(localStorage.getItem('themeColor') || import.meta.env.VITE_THEME_COLOR || '2501221')
  const lang = ref(localStorage.getItem('lang') || import.meta.env.VITE_LANG || 'en')

  // 根據主題顏色自動設定對應的 mode
  const getThemeModeByColor = (color) => {
    const theme = themeConfig.colorThemes.find(theme => theme.value === color)
    return theme ? theme.themeMode : 'dark'
  }

  // 獲取當前主題的 footerLogo 配置
  const themeFooterLogo = computed(() => {
    const theme = themeConfig.colorThemes.find(theme => theme.value === themeColor.value)
    return theme ? theme.footerLogo : { bb: 'white', ub: 'white' }
  })

  // 獲取當前主題的 imgQrcode 配置
  const themeImgQrcode = computed(() => {
    const theme = themeConfig.colorThemes.find(theme => theme.value === themeColor.value)
    return theme ? theme.imgQrcode : 'qrcode_d'
  })

  // 獲取當前主題的 themeNav 配置
  const themeNavType = computed(() => {
    const theme = themeConfig.colorThemes.find(theme => theme.value === themeColor.value)
    return theme ? theme.themeNav : 'type-1'
  })

  const themeMode = ref(
    localStorage.getItem('themeMode') || 
    getThemeModeByColor(themeColor.value) || 
    import.meta.env.VITE_THEME_MODE || 
    'dark'
  )

  // 更新主題模式
  const setThemeMode = (mode) => {
    themeMode.value = mode
    localStorage.setItem('themeMode', mode)
    updateHtmlDataTheme()
  }

  // 更新主題顏色（同時自動更新對應的 mode）
  const setThemeColor = (color) => {
    themeColor.value = color
    localStorage.setItem('themeColor', color)

    // 根據主題顏色自動設定對應的 mode
    const selectedTheme = themeConfig.colorThemes.find(theme => theme.value === color)
    if (selectedTheme) {
      themeMode.value = selectedTheme.themeMode
      localStorage.setItem('themeMode', selectedTheme.themeMode)
    }

    updateHtmlDataTheme()
  }

  // 更新語言
  const setLang = (language) => {
    lang.value = language
    localStorage.setItem('lang', language)
  }

  // 更新 HTML data-theme 屬性
  const updateHtmlDataTheme = () => {
    document.documentElement.setAttribute('data-theme', `${themeMode.value} ${themeColor.value}`)
  }

  // 重置為 .env 默認值
  const resetToDefault = () => {
    localStorage.clear()
    themeMode.value = import.meta.env.VITE_THEME_MODE || 'dark'
    themeColor.value = import.meta.env.VITE_THEME_COLOR || '2501221'
    lang.value = import.meta.env.VITE_LANG || 'en'
    updateHtmlDataTheme()
  }

  return {
    themeOptions,
    showDevTools,
    themeMode,
    themeColor,
    themeFooterLogo,
    themeImgQrcode,
    themeNavType,
    lang,
    setThemeMode,
    setThemeColor,
    setLang,
    updateHtmlDataTheme,
    resetToDefault
  }
})
