import { defineStore } from 'pinia'
import { computed } from 'vue'
import data from '../assets/data/data.json'

/**
 * 資料 Store - 使用 Composition API 風格
 * 統一與其他 Store 相同的語法風格
 */
export const useDataStore = defineStore('data', () => {
  // 使用 computed 取代 getters，保持響應性
  const headerNav = computed(() => data.headerNav)
  const footerLinks = computed(() => data.footerLinks)
  const customLinks = computed(() => data.customLinks)
  const meminfoLinks = computed(() => data.meminfoLinks)
  const flatImg = computed(() => data.flatImg)

  return {
    // 原始資料（如有需要直接存取）
    data,
    // computed getters
    headerNav,
    footerLinks,
    customLinks,
    meminfoLinks,
    flatImg,
  }
})
