import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  // 登入狀態
  const isLoggedIn = ref(false)
  const user = ref(null)

  // 登入函數
  const login = (credentials) => {
    if (credentials.username && credentials.password) {
      // 簡單登入：只要有帳號密碼就成功
      isLoggedIn.value = true
      user.value = {
        username: credentials.username,
        fullUsername: `${credentials.username}@bin` // 顯示完整用戶名
      }

      // 儲存到 localStorage
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('user', JSON.stringify(user.value))

      return true
    }
    return false
  }

  // 登出函數
  const logout = () => {
    isLoggedIn.value = false
    user.value = null

    // 清除 localStorage
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('user')
  }

  // 初始化檢查登入狀態
  const initAuth = () => {
    const savedLoginState = localStorage.getItem('isLoggedIn')
    const savedUser = localStorage.getItem('user')

    if (savedLoginState === 'true' && savedUser) {
      try {
        isLoggedIn.value = true
        user.value = JSON.parse(savedUser)
      } catch (error) {
        console.error('Failed to parse saved user data:', error)
        logout() // 如果解析失敗，清除狀態
      }
    }
  }

  // 在 store 創建時初始化
  initAuth()

  return {
    isLoggedIn,
    user,
    login,
    logout,
    initAuth
  }
})
