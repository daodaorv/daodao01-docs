import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { RouteGenerator } from '@/utils/route'
import { allMenus } from '@/config/menu'
import { RoleCode } from '@/types/menu'

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

// 动态路由（需要权限验证的页面）
const asyncRoutes: RouteRecordRaw[] = RouteGenerator.generateRoutes(allMenus)

const router = createRouter({
  history: createWebHistory(),
  routes: [
    defaultRoute,
    ...constantRoutes,
    ...asyncRoutes
  ],
  scrollBehavior: () => ({ left: 0, top: 0 })
})

// 路由守卫
router.beforeEach(async (to, from, next) => {
  // 设置页面标题
  document.title = `${to.meta?.title || '页面'} - 叨叨管理后台`

  // 检查是否为登录页面
  if (to.path === '/login') {
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
    // 如果有token但没有用户信息��跳转到登录页
    next('/login')
    return
  }

  try {
    const user = JSON.parse(userInfo)
    const userRole = user.role || RoleCode.STORE_EMPLOYEE

    // 检查路由权限
    const meta = to.meta as any
    if (meta && meta.permissions) {
      const hasPermission = RouteGenerator.hasPermission(meta.permissions, userRole)
      if (!hasPermission) {
        console.warn(`用户 ${userRole} 没有权限访问: ${to.path}`)
        next('/404')
        return
      }
    }

    next()
  } catch (error) {
    console.error('用户信息解析失败:', error)
    next('/login')
  }
})

export default router

// 导出路由相关工具
export { RouteGenerator }