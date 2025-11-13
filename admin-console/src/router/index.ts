import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// 基础路由（不需要权限验证的页面）
const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: {
      title: '登录',
      hideInMenu: true,
    },
  },
  {
    path: '/404',
    name: 'NotFound',
    component: () => import('@/views/404.vue'),
    meta: {
      title: '页面不存在',
      hideInMenu: true,
    },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
  },
]

// 默认重定向
const defaultRoute: RouteRecordRaw = {
  path: '/',
  redirect: '/dashboard/overview',
}

// 临时简化路由配置 - 暂时只保留基础页面
const tempRoutes: RouteRecordRaw[] = [
  {
    path: '/dashboard/overview',
    name: 'DashboardOverview',
    component: () => import('@/views/dashboard/SimpleOverview.vue'),
    meta: {
      title: '数据概览',
      requiresAuth: true,
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes: [
    defaultRoute,
    ...constantRoutes,
    ...tempRoutes
  ],
  scrollBehavior: () => ({ left: 0, top: 0 })
})

// 路由守卫
router.beforeEach(async (to, from, next) => {
  // 设置页面标题
  document.title = `${to.meta?.title || '页面'} - 叨叨管理后台`

  // 检查是否为登录页面或404页面
  if (to.path === '/login' || to.path === '/404') {
    next()
    return
  }

  // 获取token
  const token = localStorage.getItem('token')
  if (!token) {
    next('/login')
    return
  }

  // 检查用户信息
  const userInfo = localStorage.getItem('userInfo')
  if (!userInfo) {
    next('/login')
    return
  }

  try {
    const user = JSON.parse(userInfo)
    // 暂时跳过复杂的权限检查
    next()
  } catch (error) {
    console.error('用户信息解析失败:', error)
    next('/login')
  }
})

export default router