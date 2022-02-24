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
    path: '/Tools',
    name: 'Tools',
    meta: {
      title: "工具集合"
    },
    component: () => import('../views/Tools.vue')
  },
  {
    path: '/Setting',
    name: 'setting',
    meta: {
      title: "工具设置"
    },
    component: () => import('../views/Setting.vue')
  },
  {
    path: '/Bht',
    name: 'BehaviorTree',
    meta: {
      title: "行为树配置"
    },
    component: () => import('../views/BehaviorTree.vue')
  },
  {
    path: '/BhtEdit/:file',
    name: 'BehaviorTreeEdit',
    meta: {
      title: "行为树编辑"
    },
    component: () => import('../views/BehaviorTreeEdit.vue')
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach(async (to, from) => {
  function canAccess(to: RouteLocationNormalized): boolean {
    return to.path === '/Setting' || !StringUtil.isEmpty(window.tool_api.setting().cfgPathSelect.current)
  }

  if (!canAccess(to)) {
    ElMessage.success("请先进行工具的基本设置!")
    return '/Setting'
  }
})

export default router;
