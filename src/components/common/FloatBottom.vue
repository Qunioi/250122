<template>
  <div class="ele-float-bottom" :style="containerStyle">
    <div class="ele-float-bottom-container">
      <div class="ele-float-top-btn">
        <div class="ele-float-bottom-link" @click="scrollToTop">
          <img
            :src="floatGotopImage"
            alt="Go to top"
            class="float-gotop-img"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getPath } from '@/composables/usePath.js'
import { useConfigStore } from '@/stores/configStore'
import themeData from '@/assets/data/theme.json'

const config = useConfigStore()
const themeName = computed(() => config.themeColor)

// 滾動位置管理
const containerStyle = ref({ transform: 'translateY(0px)' })

// 根據主題配置獲取 floatGotop 圖片
const floatGotopImage = computed(() => {
  const currentTheme = getCurrentTheme()
  const floatGotop = currentTheme?.floatGotop || 'black'

  const filename = floatGotop === 'white'
    ? 'float_top_gotop_w.png'
    : 'float_top_gotop_b.png'

  return getPath(`/image/not-use/${filename}`)
})

// 獲取當前主題配置
const getCurrentTheme = () => {
  try {
    const currentThemeName = themeName.value
    
    // 先嘗試從直接引入的 theme.json 獲取
    if (themeData && themeData.colorThemes) {
      return themeData.colorThemes.find(theme => 
        theme.themeName === currentThemeName
      )
    }
    
    // 備用：從 store 獲取
    const storeThemeData = config.themeData
    if (storeThemeData && storeThemeData.colorThemes) {
      return storeThemeData.colorThemes.find(theme => 
        theme.themeName === currentThemeName
      )
    }
    
    return null
  } catch (e) {
    console.error('獲取主題配置失敗:', e)
    return null
  }
}

// 根據滾動更新容器位置
function updatePosition() {
  // 檢查編輯模式容器
  const siteWrap = document.querySelector('.themeManager-site-wrap')
  let scrollTop = window.scrollY || window.pageYOffset || 0
  
  if (siteWrap) {
    const style = window.getComputedStyle(siteWrap)
    if (style.overflowY === 'auto' || style.overflowY === 'scroll') {
      scrollTop = siteWrap.scrollTop
    }
  }
  
  // 計算視窗高度，減去底部距離
  const viewportHeight = window.innerHeight
  const bottomOffset = parseFloat(getComputedStyle(document.documentElement).fontSize) * 3.4375 // 3.4375rem to px
  
  containerStyle.value = {
    transform: `translateY(${scrollTop + viewportHeight - bottomOffset}px)`
  }
}

// 處理滾動事件
function onScroll() {
  requestAnimationFrame(updatePosition)
}

// 滾動到頂部
const scrollToTop = () => {
  const siteWrap = document.querySelector('.themeManager-site-wrap')

  if (siteWrap) {
    siteWrap.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  } else {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }
}

// 初始化
onMounted(() => {
  // 初始校正
  requestAnimationFrame(updatePosition)
  
  // 監聽 window 滾動
  window.addEventListener('scroll', onScroll, { passive: true })
  
  // 監聽 .themeManager-site-wrap 滾動（編輯模式）
  const siteWrap = document.querySelector('.themeManager-site-wrap')
  if (siteWrap) {
    siteWrap.addEventListener('scroll', onScroll, { passive: true })
  }
  
  // 額外監聽 DOM 變化以處理編輯模式切換
  const observer = new MutationObserver(() => {
    const newSiteWrap = document.querySelector('.themeManager-site-wrap')
    if (newSiteWrap) {
      newSiteWrap.removeEventListener('scroll', onScroll)
      newSiteWrap.addEventListener('scroll', onScroll, { passive: true })
    }
    requestAnimationFrame(updatePosition)
  })
  observer.observe(document.body, { childList: true, subtree: true })
})

// 清理監聽
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  const siteWrap = document.querySelector('.themeManager-site-wrap')
  if (siteWrap) {
    siteWrap.removeEventListener('scroll', onScroll)
  }
})
</script>