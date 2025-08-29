<template>
  <div class="mainnav-wrap">
    <nav class="ele-navbar">
      <ul>
          <li
          v-for="(item, index) in headerNav.filter(item => item.navClass !== 'morenav')"
          :key="index"
          :class="['ele-navbar-link-wrap', 'ele-navbar-link-' + item.navClass]"
          @mouseenter="hoverIndex = index"
          @mouseleave="hoverIndex = null"
        >
          <!-- 如果 link 為空，渲染靜態文本 -->
          <template v-if="!item.link">
            <span class="ele-navbar-link">
              <p class="ele-navbar-title">{{ item.title }}</p>
            </span>
          </template>
          <!-- 否则，渲染 router-link -->
          <template v-else>
            <router-link
              :to="item.link"
              class="ele-navbar-link"
              :class="{ active: isActive(item.link) }"
            >
              <p class="ele-navbar-title">{{ item.title }}</p>
            </router-link>
          </template>

          <transition name="fade" appear v-if="item.img && getSubNavItems(item.link)">
            <nav v-show="hoverIndex === index" :class="['ele-subnav', 'ele-subnav-' + themeNav]">
              <div class="ele-subnav-container">
                <img :src="getPath(`/image/not-use/subnav/${lang}/subnav_${item.img}_title.png`)" class="ele-subnav-title">
                <ul v-if="!isLoading">
                  <li v-for="(subItem, subIndex) in getSubNavItems(item.link)" :key="subIndex">
                    <a href="#" :title="subItem.pn_name" class="ele-navbar-sublink">
                      <span class="ele-subnav-icon" :style="{ backgroundImage: `url('https://web.bbinpartner.com/images/subnav/${getRouteKey(item.link)}/${subItem.pn_logo}')` }"></span>
                      <p class="ele-subnav-link-title">{{ subItem.pn_name }}</p>
                    </a>
                  </li>
                </ul>
                <div v-else class="loading">載入中...</div>
              </div>
            </nav>
          </transition>
        </li>
        <li
          v-for="(item, index) in headerNav.filter(item => item.navClass === 'morenav')"
          :key="'more-' + index"
          class="ele-morenav-link-wrap"
          @mouseenter="showMoreNav = true"
          @mouseleave="showMoreNav = false"
        >
          <a href="#" class="ele-morenav-sublink-title"></a>
          <transition name="fade">
            <ul v-show="showMoreNav" class="ele-morenav-container" @mouseenter="showMoreMenu" @mouseleave="hideMoreMenu">
              <li v-for="(subItem, subIndex) in item.subItems" :key="subIndex">
                <router-link :to="subItem.link" class="ele-morenav-sublink">{{ subItem.title }}</router-link>
              </li>
            </ul>
          </transition>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { useDataStore } from '@/stores/dataStore.js';
import { useTheme } from '@/composables/useTheme.js';
import { getPath } from '@/composables/usePath.js'
const { themeNav, lang } = useTheme(); // 使用動態主題和語言設定

const dataStore = useDataStore();
const headerNav = dataStore.headerNav;
const route = useRoute();

// 控制更多選單顯示
const showMoreNav = ref(false);
const hoverIndex = ref(null);

// API 資料
const headerNavSub = ref({});
const isLoading = ref(true);

// 判斷當前路由是否為 active
const isActive = (link) => {
  if (!link) return false;
  return route.path === link;
};

// 根據路由獲取對應的子選單資料
const getSubNavItems = (link) => {
  if (!link || isLoading.value) return null;

  if (link === '/casino') return headerNavSub.value.casino;
  if (link === '/live') return headerNavSub.value.live;
  if (link === '/card') return headerNavSub.value.card;
  if (link === '/sport') return headerNavSub.value.sport;
  if (link === '/lottery') return headerNavSub.value.lottery;

  return null;
};

// 獲取路由對應的圖片路徑鍵值
const getRouteKey = (link) => {
  if (link === '/casino') return 'game';
  if (link === '/live') return 'live';
  if (link === '/card') return 'card';
  if (link === '/sport') return 'ball';
  if (link === '/lottery') return 'lottery';

  return '';
};// 從 API 獲取導航子選單資料
const fetchNavData = async () => {
  try {
    isLoading.value = true;
    const response = await fetch('https://wms.bbinpartner.com/api/navs');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // 重新組織資料結構
    headerNavSub.value = {
      casino: data.games || [],    // 電子游藝
      live: data.lives || [],      // 視訊直播
      card: data.cards || [],      // 棋牌游戲
      sport: data.balls || [],     // 體育賽事
      lottery: data.lotterys || [] // 彩票游戲
    };

    // console.log('Fetched headerNavSub:', headerNavSub.value);
  } catch (error) {
    console.error('Error fetching nav data:', error);
    // 設置預設空值，避免錯誤
    headerNavSub.value = {
      casino: [],
      live: [],
      card: [],
      sport: [],
      lottery: []
    };
  } finally {
    isLoading.value = false;
  }
};

// 在組件掛載時獲取資料
onMounted(() => {
  fetchNavData();
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  pointer-events: none;
}
.fade-enter-to,
.fade-leave-from {
  pointer-events: auto;
}
</style>
