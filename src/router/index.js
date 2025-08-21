import { createRouter, createWebHistory } from 'vue-router';
import Index from '../views/Index.vue';
import TypePage from '../views/[type].vue';

const routes = [
  { path: '/', component: Index },
  {
    path: '/:type(card|casino|live|sport|lottery|promotion|about)',
    component: TypePage
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
