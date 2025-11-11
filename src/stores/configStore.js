import { defineStore } from 'pinia'
import { useTheme } from '@/theme/useTheme'
import themeConfig from '@/assets/data/theme.json'

// 與 useTheme 的命名空間一致
const NAMESPACE = 'app'

const hasWindow = () => typeof window !== 'undefined'
const lsGet = (k, fallback = null) => (hasWindow() ? localStorage.getItem(k) : null) ?? fallback
const lsSet = (k, v) => { if (hasWindow()) localStorage.setItem(k, v) }

export const useConfigStore = defineStore('config', () => {
  const theme = useTheme({ namespace: NAMESPACE })

  // 下拉清單
  const themeOptions = computed(() =>
    themeConfig.colorThemes.map(t => ({ value: t.themeName, label: `${t.themeName} (${t.themeMode})` }))
  )

  // 初值（若 storage 沒有，退回 .env 或預設）
  const fallbackColor = import.meta.env.VITE_THEME_COLOR || '2501231'
  const fallbackMode  = import.meta.env.VITE_THEME_MODE  || theme.getDefaultModeOf(fallbackColor) || 'dark'

  // 如果環境變量存在，就使用環境變量，否則才使用 localStorage
  const storedColor = lsGet(`${NAMESPACE}:themeColor`)
  const storedMode = lsGet(`${NAMESPACE}:themeMode`)

  // 優先順序：環境變量 > localStorage > 預設值
  const themeColor = ref(import.meta.env.VITE_THEME_COLOR || storedColor || fallbackColor)
  const themeMode  = ref(import.meta.env.VITE_THEME_MODE || storedMode || fallbackMode)
  const lang       = ref(lsGet('lang') || import.meta.env.VITE_LANG || 'zh-cn')

  // 在初始化時，如果使用了環境變量，就更新 localStorage
  if (import.meta.env.VITE_THEME_COLOR && import.meta.env.VITE_THEME_COLOR !== storedColor) {
    lsSet(`${NAMESPACE}:themeColor`, import.meta.env.VITE_THEME_COLOR)
  }
  if (import.meta.env.VITE_THEME_MODE && import.meta.env.VITE_THEME_MODE !== storedMode) {
    lsSet(`${NAMESPACE}:themeMode`, import.meta.env.VITE_THEME_MODE)
  }

  // 衍生配置
  const themeFooterLogo = computed(() => themeConfig.colorThemes.find(t => t.themeName === themeColor.value)?.footerLogo || { bb: 'white', ub: 'white' })
  const themeImgQrcode  = computed(() => themeConfig.colorThemes.find(t => t.themeName === themeColor.value)?.imgQrcode || 'qrcode_d')
  const themeNavType    = computed(() => themeConfig.colorThemes.find(t => t.themeName === themeColor.value)?.themeNav || 'type-1')

  // 行為：切換主題（預設會套用該主題的預設 mode，再寫回 state）
  const setThemeColor = (themeName, { keepMode = false } = {}) => {
    const nextMode = keepMode ? themeMode.value : theme.getDefaultModeOf(themeName)
    themeColor.value = themeName
    themeMode.value  = nextMode
    lsSet(`${NAMESPACE}:themeColor`, themeName)
    lsSet(`${NAMESPACE}:themeMode`, nextMode)
    // 交給 useTheme 套用（唯一動 DOM）
    theme.applyTheme(themeName, nextMode)
  }

  // 行為：切換模式（不動顏色）
  const setThemeMode = (mode) => {
    themeMode.value = mode
    lsSet(`${NAMESPACE}:themeMode`, mode)
    theme.applyTheme(themeColor.value, mode)
  }

  // 語言
  const setLang = (language) => {
    lang.value = language
    lsSet('lang', language)
  }

  // 初始化：從 storage/預設讀取並真正套用一次
  onMounted(() => {
    const { themeName, mode } = theme.initTheme(themeColor.value, themeMode.value)
    // 回寫到 store，以防 storage 與 state 不一致
    themeColor.value = themeName
    themeMode.value  = mode
  })

  return {
    // state / computed
    themeOptions,
    themeMode,
    themeColor,
    themeFooterLogo,
    themeImgQrcode,
    themeNavType,
    lang,
    // actions
    setThemeMode,
    setThemeColor,
    setLang,
  }
})
