<template>
  <div class="page-wrap">
    <Header />
    <main>
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
import { useDataStore } from '@/stores/dataStore.js';
import { onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';

const dataStore = useDataStore();
const route = useRoute();
const lang = import.meta.env.VITE_LANG || 'zh-cn';
const isStatic = true; // 可根據你的邏輯動態判斷
const staticClass = isStatic ? 'is-static' : 'is-dynamic';

function getPageClass() {
  const item = dataStore.headerNav.find(i => i.link === route.path);
  return item?.pageClass || '';
}

function setBodyClass() {
  const pageClass = getPageClass();
  document.body.className = [staticClass, pageClass, lang].filter(Boolean).join(' ');
}

onMounted(setBodyClass);
watch(() => route.path, setBodyClass);
</script>