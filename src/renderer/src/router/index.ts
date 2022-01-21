import {createRouter, createWebHashHistory, RouteRecordRaw} from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/Home',
  },
  {
    path: '/Home',
    name: 'Home',
    meta: {
      title: "配置转换"
    },
    component: () => import('../views/Home.vue')
  },
  {
    path: '/Time',
    name: 'time',
    meta: {
      title: "时间工具"
    },
    component: () => import('../views/Time.vue')
  },
  {
    path: '/Json',
    name: 'json',
    meta: {
      title: "Json工具"
    },
    component: () => import('../views/Json.vue')
  },
  {
    path: '/Setting',
    name: 'setting',
    meta: {
      title: "工具设置"
    },
    component: () => import('../views/Setting.vue')
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})


export default router;
