import type { RouteRecordRaw } from 'vue-router'
import type { MenuItem, UserMenuTree } from '@/types/menu'
import { allMenus } from '@/config/menu'
import { RoleCode } from '@/types/menu'

/**
 * 路由生成工具类
 */
export class RouteGenerator {
  /**
   * 将菜单配置转换为路由配置
   */
  static generateRoutes(menus: MenuItem[]): RouteRecordRaw[] {
    const routes: RouteRecordRaw[] = []

    this.processMenuItems(menus, routes)
    return routes
  }

  /**
   * 递归处理菜单项生成路由
   */
  private static processMenuItems(menus: MenuItem[], routes: RouteRecordRaw[], parentPath = ''): void {
    menus.forEach(menu => {
      if (menu.type === 'page' && menu.path && menu.component) {
        const route: RouteRecordRaw = {
          path: menu.path,
          name: menu.name,
          component: this.getComponent(menu.component),
          meta: {
            title: menu.title,
            icon: menu.icon,
            requiresAuth: true,
            permissions: menu.permission || []
          },
          children: []
        }

        // 如果有子页面，递归处理
        if (menu.children && menu.children.length > 0) {
          this.processMenuItems(menu.children, route.children!, menu.path)
        }

        routes.push(route)
      } else if (menu.type === 'menu' && menu.children) {
        // 处理菜单类型的目录项
        this.processMenuItems(menu.children, routes, parentPath)
      }
    })
  }

  /**
   * 动态导入组件
   */
  private static getComponent(componentPath: string) {
    // 移除 @/ 前缀并转换为相对路径
    const cleanPath = componentPath.replace('@/', '')

    // 动态导入组件
    return () => import(`@/${cleanPath}`)
  }

  /**
   * 根据用户角色过滤路由
   */
  static filterRoutesByRole(routes: RouteRecordRaw[], userRole: string): RouteRecordRaw[] {
    if (userRole === RoleCode.PLATFORM_ADMIN) {
      return routes // 平台管理员拥有所有权限
    }

    return routes.filter(route => {
      const meta = route.meta as any
      if (!meta.permissions) return true

      // 根据角色权限检查
      return this.hasPermission(meta.permissions, userRole)
    })
  }

  /**
   * 检查用户是否有指定权限
   */
  static hasPermission(permissions: string[], userRole: string): boolean {
    // 简化版权限检查，实际应用中需要更复杂的权限系统
    const rolePermissions = this.getRolePermissions(userRole)
    return permissions.some(permission => rolePermissions.includes(permission))
  }

  /**
   * 获取角色权限列表
   */
  private static getRolePermissions(role: string): string[] {
    const permissionMap: Record<string, string[]> = {
      [RoleCode.PLATFORM_ADMIN]: ['*'], // 所有权限
      [RoleCode.REGION_MANAGER]: [
        'user:list', 'user:audit', 'user:tags', 'user:credit',
        'vehicle:*', 'store:*', 'order:*',
        'marketing:*', 'dashboard:*', 'finance:*'
      ],
      [RoleCode.STORE_MANAGER]: [
        'user:list', 'user:credit',
        'vehicle:list', 'vehicle:status',
        'store:*', 'order:*',
        'marketing:price', 'marketing:coupon',
        'dashboard:*'
      ],
      [RoleCode.STORE_EMPLOYEE]: [
        'user:list',
        'vehicle:list', 'vehicle:status',
        'order:list', 'order:detail',
        'dashboard:overview', 'dashboard:todo'
      ]
    }

    return permissionMap[role] || []
  }

  /**
   * 生成面包屑导航
   */
  static generateBreadcrumb(route: RouteRecordRaw, allRoutes: RouteRecordRaw[]): Array<{title: string, path?: string}> {
    const breadcrumb: Array<{title: string, path?: string}> = []
    const meta = route.meta as any

    if (meta.title) {
      breadcrumb.push({ title: meta.title, path: route.path })
    }

    // 可以进一步优化为查找父级路由
    return breadcrumb
  }
}

/**
 * 权限检查工具
 */
export class PermissionChecker {
  /**
   * 检查用户是否有权限访问菜单
   */
  static checkMenuPermission(menu: MenuItem, userPermissions: string[]): boolean {
    if (!menu.permission || menu.permission.length === 0) {
      return true // 没有权限要求的菜单默认可访问
    }

    return menu.permission.some(permission =>
      userPermissions.includes(permission) || userPermissions.includes('*')
    )
  }

  /**
   * 过滤用户可访问的菜单
   */
  static filterMenusByPermission(menus: MenuItem[], userPermissions: string[]): MenuItem[] {
    return menus
      .filter(menu => this.checkMenuPermission(menu, userPermissions))
      .map(menu => {
        if (menu.children && menu.children.length > 0) {
          const filteredChildren = this.filterMenusByPermission(menu.children, userPermissions)
          return { ...menu, children: filteredChildren }
        }
        return menu
      })
      .filter(menu => !menu.children || menu.children.length > 0)
  }

  /**
   * 获取用户菜单树
   */
  static getUserMenuTree(userRole: string, userPermissions: string[]): UserMenuTree {
    const roleMenus = this.getRoleBasedMenus(userRole)
    const filteredMenus = this.filterMenusByPermission(roleMenus, userPermissions)

    return {
      menus: filteredMenus,
      permissions: userPermissions,
      roleCodes: [userRole]
    }
  }

  /**
   * 根据角色获取基础菜单
   */
  private static getRoleBasedMenus(role: string): MenuItem[] {
    switch (role) {
      case RoleCode.PLATFORM_ADMIN:
        return allMenus
      case RoleCode.REGION_MANAGER:
        return allMenus.filter(m => m.id !== 'employee-manage')
      case RoleCode.STORE_MANAGER:
        return allMenus.filter(m =>
          ['user-manage', 'vehicle-manage', 'store-manage', 'order-manage', 'marketing-manage'].includes(m.id)
        )
      case RoleCode.STORE_EMPLOYEE:
        return allMenus.filter(m =>
          ['user-manage', 'vehicle-manage', 'order-manage', 'dashboard'].includes(m.id)
        )
      default:
        return []
    }
  }
}