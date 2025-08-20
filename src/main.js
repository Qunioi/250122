import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import './assets/styles/app.scss';

const themeMode = import.meta.env.VITE_THEME_MODE || 'light';
const themeColor = import.meta.env.VITE_THEME_COLOR || '';
document.documentElement.setAttribute('data-theme', `${themeMode} ${themeColor}`);

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.mount('#page-layout');