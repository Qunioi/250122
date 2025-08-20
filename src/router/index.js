import { createRouter, createWebHistory } from 'vue-router';
import Index from '../views/Index.vue';
import Casino from '../views/Casino.vue';
import Live from '../views/Live.vue';
import Card from '../views/Card.vue';
import Sport from '../views/Sport.vue';
import Lottery from '../views/Lottery.vue';
import Promotion from '../views/Promotion.vue';
import About from '../views/About.vue';

const routes = [
  { path: '/', component: Index },
  { path: '/casino', component: Casino },
  { path: '/live', component: Live },
  { path: '/card', component: Card },
  { path: '/sport', component: Sport },
  { path: '/lottery', component: Lottery },
  { path: '/promotion', component: Promotion },
  { path: '/about', component: About },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
