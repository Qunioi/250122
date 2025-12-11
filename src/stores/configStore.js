import { defineStore } from 'pinia'
import { ref, computed, onMounted } from 'vue'
import { useTheme } from '@/theme/useTheme'
import themeConfig from '@/assets/data/theme.json'

// ============================================================
// CONFIG 設定區塊
// ============================================================
const NAMESPACE = 'app'

// ============================================================
// 工具函式
// ============================================================
const hasWindow = () => typeof window !== 'undefined'
const lsGet = (k, fallback = null) => (hasWindow() ? localStorage.getItem(k) : null) ?? fallback
const lsSet = (k, v) => { if (hasWindow()) localStorage.setItem(k, v) }

/**
 * 取得預設主題（themeSort === 1 或第一個）
 */
const getDefaultTheme = () => {
  return themeConfig.colorThemes.find(t => t.themeSort === 1) || themeConfig.colorThemes[0]
}

/**
 * 根據主題名稱取得主題配置
 */
const getThemeByName = (themeName) => {
  return themeConfig.colorThemes.find(t => t.themeName === themeName)
}

// ============================================================
// Store 定義
// ============================================================
export const useConfigStore = defineStore('config', () => {
  const theme = useTheme({ namespace: NAMESPACE })
  const defaultTheme = getDefaultTheme()

  // 預設值
  const fallbackColor = defaultTheme?.themeName || ''
  const fallbackMode = defaultTheme?.themeMode || 'dark'

  // --------------------------------------------------------
  // State（統一從 localStorage 或預設值初始化）
  // --------------------------------------------------------
  const themeColor = ref(lsGet(`${NAMESPACE}:themeColor`) || fallbackColor)
  const themeMode = ref(lsGet(`${NAMESPACE}:themeMode`) || fallbackMode)
  const lang = ref(lsGet('lang') || 'zh-cn')

  // --------------------------------------------------------
  // Computed / Getters
  // --------------------------------------------------------
  
  // 下拉清單選項
  const themeOptions = computed(() =>
    themeConfig.colorThemes.map(t => ({
      value: t.themeName,
      label: `${t.themeName} (${t.themeMode})`
    }))
  )

  // 當前主題配置（快取查找結果）
  const currentThemeConfig = computed(() => getThemeByName(themeColor.value))

  // 衍生配置（使用 currentThemeConfig 避免重複查找）
  const themeFooterLogo = computed(() => 
    currentThemeConfig.value?.footerLogo || { bb: 'white', ub: 'white' }
  )
  const themeImgQrcode = computed(() => 
    currentThemeConfig.value?.imgQrcode || 'qrcode_d'
  )
  const themeNavType = computed(() => 
    currentThemeConfig.value?.themeNav || 'type-1'
  )

  // --------------------------------------------------------
  // Actions
  // --------------------------------------------------------

  /**
   * 切換主題顏色
   * @param {string} themeName - 主題名稱
   * @param {Object} options - 選項
   * @param {boolean} options.keepMode - 是否保持當前模式
   */
  const setThemeColor = (themeName, { keepMode = false } = {}) => {
    const nextMode = keepMode ? themeMode.value : theme.getDefaultModeOf(themeName)
    
    themeColor.value = themeName
    themeMode.value = nextMode
    
    lsSet(`${NAMESPACE}:themeColor`, themeName)
    lsSet(`${NAMESPACE}:themeMode`, nextMode)
    
    // 交給 useTheme 套用 DOM
    theme.applyTheme(themeName, nextMode)
  }

  /**
   * 切換主題模式（不改變顏色）
   * @param {string} mode - 模式 (dark/light)
   */
  const setThemeMode = (mode) => {
    themeMode.value = mode
    lsSet(`${NAMESPACE}:themeMode`, mode)
    theme.applyTheme(themeColor.value, mode)
  }

  /**
   * 切換語言
   * @param {string} language - 語言代碼
   */
  const setLang = (language) => {
    lang.value = language
    lsSet('lang', language)
    document.documentElement.setAttribute('lang', language)
  }

  /**
   * 初始化主題（統一入口）
   * 在 onMounted 時呼叫，確保 DOM 已準備好
   */
  const initTheme = () => {
    // 套用主題到 DOM
    theme.applyTheme(themeColor.value, themeMode.value, true)
    // 設定語言屬性
    document.documentElement.setAttribute('lang', lang.value)
  }

  // --------------------------------------------------------
  // 生命週期
  // --------------------------------------------------------
  onMounted(() => {
    initTheme()
  })

  // --------------------------------------------------------
  // 匯出
  // --------------------------------------------------------
  return {
    // State
    themeColor,
    themeMode,
    lang,
    // Computed
    themeOptions,
    themeFooterLogo,
    themeImgQrcode,
    themeNavType,
    currentThemeConfig,
    // Actions
    setThemeColor,
    setThemeMode,
    setLang,
    initTheme,
  }
})
