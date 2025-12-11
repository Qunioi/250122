import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import './assets/styles/app.scss';
import { initGlobalThemeObserver } from '@/composables/useTheme.js';
import themeConfig from '@/assets/data/theme.json';

import headerFixed from './directives/headerFixed.js';

// 從 theme.json 中取得 themeSort === 1 的主題作為預設值
const defaultTheme = themeConfig.colorThemes.find(t => t.themeSort === 1) || themeConfig.colorThemes[0];
const themeMode = defaultTheme?.themeMode || 'dark';
const themeColor = defaultTheme?.themeName || '';
document.documentElement.setAttribute('data-theme', `${themeMode} ${themeColor}`);

const app = createApp(App);

app.directive('header-fixed', headerFixed);
app.use(createPinia());
app.use(router);
app.mount('#page-layout');

// 初始化全域主題監聽器
initGlobalThemeObserver();