<template>
  <div class="page-wrap">
    <ThemeManager />
    <Header />
    <div class="page-container">
      <router-view />
    </div>
    <Footer />
    <!-- 只在開發環境顯示 -->
    <!-- <DevTools /> -->
  </div>
</template>

<script setup>
import ThemeManager from '@/theme/components/ThemeManager.vue'
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
import DevTools from './components/DevTools.vue';
import { useDataStore } from '@/stores/dataStore.js';
import { useConfigStore } from '@/stores/configStore.js';
import { onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';

const dataStore = useDataStore();
const configStore = useConfigStore();
const route = useRoute();

const isStatic = true; // 可根據你的邏輯動態判斷
const staticClass = isStatic ? 'is-static' : '';

function getPageClass() {
  const item = dataStore.headerNav.find(i => i.link === route.path);
  return item?.pageClass || '';
}

function setBodyClass() {
  const pageClass = getPageClass();
  document.body.className = [staticClass, pageClass, configStore.lang].filter(Boolean).join(' ');
}

onMounted(() => {
  configStore.updateHtmlDataTheme();
  setBodyClass();
});

watch(() => route.path, setBodyClass);
watch(() => configStore.lang, setBodyClass);
</script>