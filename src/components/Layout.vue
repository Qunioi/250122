<template>
  <div class="page-wrap">
    <FloatImg v-if="enableThemeManager" />
    <Loading :show="showMask" />
    <Header />
    <div class="page-container">
      <router-view />
    </div>
    <Footer />
  </div>
</template>

<script setup>
import FloatImg from '@/components/common/FloatImg.vue';
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import Loading from '@/components/common/Loading.vue';
import { setMaskRef } from '@/router';
import { useDataStore } from '@/stores/dataStore.js';
import { useConfigStore } from '@/stores/configStore.js';
import { useRoute } from 'vue-router';

const dataStore = useDataStore();
const configStore = useConfigStore();
const enableThemeManager = inject('enableThemeManager', ref(true))
const route = useRoute();

const showMask = ref(false);
onMounted(async () => {
  setMaskRef(showMask);
  await nextTick();
  setBodyClass();
});

const isStatic = true;
const staticClass = isStatic ? 'is-static' : '';

// 記錄上一次設定的 class,用於清除
let lastPageClass = '';
let lastLang = '';

function getPageClass() {
  return route.meta?.pageClass || '';
}

function setBodyClass() {
  const pageClass = getPageClass();
  const currentLang = configStore.lang;
  
  // 移除上一次的 pageClass 和 lang
  if (lastPageClass) {
    lastPageClass.split(' ').forEach(cls => {
      if (cls) document.body.classList.remove(cls);
    });
  }
  if (lastLang) {
    document.body.classList.remove(lastLang);
  }
  
  // 添加 staticClass (只在第一次)
  if (staticClass && !document.body.classList.contains(staticClass)) {
    document.body.classList.add(staticClass);
  }
  
  // 添加新的 pageClass
  if (pageClass) {
    pageClass.split(' ').forEach(cls => {
      if (cls) document.body.classList.add(cls);
    });
  }
  
  // 添加新的 lang
  if (currentLang) {
    document.body.classList.add(currentLang);
  }
  
  // 記錄當前設定
  lastPageClass = pageClass;
  lastLang = currentLang;
}

watch(route, setBodyClass, { deep: true });
watch(() => configStore.lang, setBodyClass);
</script>
