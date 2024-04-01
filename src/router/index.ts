import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/Home',
    component: () => import('@/views/Home.vue'),
    meta: { title: '自述文件' },
    children: [
      {
        path: '/Info',
        component: () => import('@/views/InfoPage.vue'),
        meta: { title: 'Info' }
      },
      {
        path: '/parkingspot',
        component: () => import('@/views/Parkingspot.vue'),
        meta: { title: 'parkingspot' }
      },
      {
        path: '/ust/:pnum?',
        component: () => import('@/views/RentPage.vue'),
        meta: { title: 'ust' }
      },
      {
        path: '/car',
        component: () => import('@/views/CarPage.vue'),
        meta: { title: 'car' }
      },
      {
        path: '/breaking',
        component: () => import('@/views/BreakingManage.vue'),
        meta: { title: 'breaking' }
      },
      {
        path: '/rank',
        component: () => import('@/views/Rank.vue'),
        meta: { title: 'rank' }
      },
      {
        path: '/Personal',
        component: () => import('@/views/Personal.vue'),
        meta: { title: 'Personal' }
      }
    ]
  },
  {
    path: '/',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/regist',
    component: () => import('@/views/Regist.vue'),
    meta: { title: 'regist' }
  },
  {
    path: '/forpwd',
    component: () => import('@/views/Forpwd.vue'),
    meta: { title: 'forpwd' }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
