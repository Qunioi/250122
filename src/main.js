import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import './assets/styles/app.scss';
import { initGlobalThemeObserver } from '@/composables/useTheme.js';

import headerFixed from './directives/headerFixed.js';

const themeMode = import.meta.env.VITE_THEME_MODE || 'light';
const themeColor = import.meta.env.VITE_THEME_COLOR || '';
document.documentElement.setAttribute('data-theme', `${themeMode} ${themeColor}`);

const app = createApp(App);

app.directive('header-fixed', headerFixed);
app.use(createPinia());
app.use(router);
app.mount('#page-layout');

// 初始化全域主題監聽器
initGlobalThemeObserver();