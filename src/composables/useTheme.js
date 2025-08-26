import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import themeData from '@/assets/data/theme.json'
import { useConfigStore } from '@/stores/configStore.js'

// 使用配置 store 而不是直接讀取環境變數
let observer = null

// 初始化主題監聽器（只初始化一次）
const initThemeObserver = () => {
  if (observer) return // 如果已經初始化過就不重複初始化

  observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
        // 主題變更時的額外邏輯可以放在這裡
      }
    })
  })

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
  })
}

// 清理監聽器
const cleanupThemeObserver = () => {
  if (observer) {
    observer.disconnect()
    observer = null
  }
}

// 主要 composable 函數
export const useTheme = () => {
  const configStore = useConfigStore()

  // 切換主題，根據 theme.json
  const setTheme = (themeName) => {
    const theme = themeData.colorThemes.find(t => t.themeName === themeName)
    if (theme) {
      document.documentElement.setAttribute('data-theme', `${theme.themeMode} ${theme.themeName}`)
      Object.entries(theme.themeColor).forEach(([key, value]) => {
        document.documentElement.style.setProperty(`--${key}`, value)
      })
    }
  }

  onMounted(() => {
    initThemeObserver()
  })

  return {
    setTheme,
    themes: themeData.colorThemes,
    themeColor: computed(() => configStore.themeColor),
    themeMode: computed(() => configStore.themeMode),
    themeNav: computed(() => configStore.themeNavType),
    imgQrcode: computed(() => configStore.themeImgQrcode),
    lang: computed(() => configStore.lang)
  }
}

// 手動初始化（在 main.js 中調用）
export const initGlobalThemeObserver = () => {
  initThemeObserver()
}

// 手動清理（在應用關閉時調用）
export const cleanupGlobalThemeObserver = () => {
  cleanupThemeObserver()
}
