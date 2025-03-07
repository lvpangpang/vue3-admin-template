import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/layout/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/index.vue'),
    },
    {
      path: '/',
      name: 'home',
      component: Layout,
      children: [
        {
          name: 'HomeIndex',
          path: '',
          component: () => import('@/views/home/index')
        },
      ],
    },
    {
      path: '/device',
      component: Layout,
      redirect: '/device/hydropower',
      meta: {
        title: '设备管理',
        icon: 'parkExamine',
      },
      children: [
        {
          name: 'HydropowerIndex',
          path: 'hydropower',
          component: () => import('@/views/device/hydropower/index.vue'),
          meta: {
            title: '水/电设备',
          },
          children: [
            {
              name: 'HydropowerEdit',
              path: 'edit',
              component: () => import('@/views/device/hydropower/edit/index.vue'),
              meta: {
                title: '编辑',
                hidden: 1,
                activeMenu: '/device/hydropower',
              },
              children: [],
            },
          ],
        },
        {
          name: 'GatewayIndex',
          path: 'gateway',
          component: () => import('@/views/device/gateway/index.vue'),
          meta: {
            title: '网关设备',
          },
          children: [
            {
              name: 'GatewayEdit',
              path: 'edit',
              component: () => import('@/views/device/hydropower/edit/index.vue'),
              meta: {
                title: '编辑',
                hidden: 1,
                activeMenu: '/device/gateway',
              },
              children: [],
            },
          ],
        },
      ],
    },
    {
      path: '/energy',
      component: Layout,
      redirect: '/energy',
      meta: {
        title: '能耗管理',
      },
      children: [
        {
          name: 'WeenergyIndex',
          path: '',
          component: () => import('@/views/energy/weenergy/index'),
          meta: {
            title: '水电能耗',
            icon: 'parkExamine',
          },
          children: [],
        },
      ],
    },
    {
      path: '/energy-overview',
      component: Layout,
      redirect: '/energy-overview',
      meta: {
        title: '能耗总览',
      },
      children: [
        {
          name: 'EnergyOverviewIndex',
          path: '',
          component: () => import('@/views/energy-overview/index'),
          meta: {
            title: '',
            icon: '',
          },
          children: [],
        },
      ],
    },
  ],
})

export default router
