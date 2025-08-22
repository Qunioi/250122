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
  history: createWebHistory(),
  routes,
});

export default router;
