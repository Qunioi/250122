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
onMounted(() => {
  setMaskRef(showMask);
});

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
