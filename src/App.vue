<template>
  <component :is="enableThemeManager ? ThemeManager : 'div'">
    <div class="page-wrap">
      <Loading :show="showMask" />
      <Header />
      <div class="page-container">
        <router-view />
      </div>
      <Footer />
    </div>
  </component>
</template>

<script setup>
import ThemeManager from '@/theme/components/ThemeManager.vue'
import Loading from '@/components/common/Loading.vue'
import { setMaskRef } from '@/router'

// 控制 ThemeManager 開關
const enableThemeManager = true

const showMask = ref(false)
onMounted(() => {
  setMaskRef(showMask)
})

import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
import { useDataStore } from '@/stores/dataStore.js';
import { useConfigStore } from '@/stores/configStore.js';
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
  setBodyClass();
});

watch(() => route.path, setBodyClass);
watch(() => configStore.lang, setBodyClass);
</script>