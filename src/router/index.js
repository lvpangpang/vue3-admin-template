import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/home/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/login/index.vue'),
    },
    {
      path: '/test1',
      name: 'test1',
      component: () => import('../views/test1/index.vue'),
    },
    {
      path: '/test2',
      name: 'test2',
      component: () => import('../views/test2/index.vue'),
    }
  ],
})

export default router
