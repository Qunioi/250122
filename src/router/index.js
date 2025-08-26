import { createRouter, createWebHistory } from 'vue-router';
import Index from '../views/Index.vue';
import TypePage from '../views/[type].vue';
import About from '../views/About.vue';
import Article from '../views/Article.vue';
import Join from '../views/Join.vue';

const routes = [
  { path: '/', component: Index },
  { path: '/about', component: About },
  { path: '/article', component: Article },
  { path: '/join', component: Join },
  {
    path: '/:type(card|casino|live|sport|lottery|promotion)',
    component: TypePage
  },
];

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
