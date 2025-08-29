import { defineStore } from 'pinia'

const LS_KEY = 'app:brand:logo'

export const useBrandAssetsStore = defineStore('brandAssets', () => {
  const logoDataUrl = ref(null)

  const load = () => {
    try { logoDataUrl.value = localStorage.getItem(LS_KEY) || null } catch {}
  }
  const setLogo = (dataUrl) => {
    logoDataUrl.value = dataUrl
    try { localStorage.setItem(LS_KEY, dataUrl || '') } catch {}
  }
  const clearLogo = () => {
    logoDataUrl.value = null
    try { localStorage.removeItem(LS_KEY) } catch {}
  }

  // 初始載入（如需）
  load()

  return { logoDataUrl, load, setLogo, clearLogo }
})