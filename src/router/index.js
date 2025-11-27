import { createRouter, createWebHistory } from 'vue-router';
import Index from '../views/Index.vue';
import TypePage from '../views/[type].vue';
import About from '../views/About.vue';
import Article from '../views/Article.vue';
import Join from '../views/Join.vue';

// 靜態頁面配置
const staticPages = [
  { path: '/', component: Index, pageClass: 'first' },
  { path: '/about', component: About, pageClass: 'advertise about' },
  { path: '/article', component: Article, pageClass: 'advertise article' },
  { path: '/join', component: Join, pageClass: 'advertise join' },
];

// 動態頁面類型配置
const typeClassMap = {
  'sport': 'game sport',
  'live': 'game live',
  'casino': 'game casino',
  'lottery': 'game lottery',
  'card': 'game card',
  'promotion': 'promotion'
};

// 生成靜態路由
const routes = staticPages.map(page => ({
  path: page.path,
  component: page.component,
  meta: { pageClass: page.pageClass }
}));

// 添加動態路由
routes.push({
  path: '/:type(card|casino|live|sport|lottery|promotion)',
  component: TypePage,
  beforeEnter: (to, from, next) => {
    to.meta.pageClass = typeClassMap[to.params.type] || 'game';
    next();
  }
});

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});


// 全域遮罩控制
let showMaskRef = null
export function setMaskRef(ref) {
  showMaskRef = ref
}

router.beforeEach((to, from, next) => {
  if (showMaskRef) showMaskRef.value = true
  setTimeout(() => {
    next()
  }, 300)
})

router.afterEach(() => {
  if (showMaskRef) showMaskRef.value = false
})

export default router;
