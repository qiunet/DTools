import {createRouter, createWebHashHistory, RouteLocationNormalized, RouteRecordRaw} from 'vue-router';
import {StringUtil} from "../common/StringUtil";
import {ElMessage} from "element-plus";

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

router.beforeEach(async (to, from) => {
  function canAccess(to: RouteLocationNormalized): boolean {
    return to.path === '/Setting' || !StringUtil.isEmpty(window.tool_api.setting().currCfgPath)
  }

  if (!canAccess(to)) {
    ElMessage.success("请先进行工具的基本设置!")
    return '/Setting'
  }
})

export default router;
