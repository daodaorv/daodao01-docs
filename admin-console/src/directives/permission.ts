import type { App, Directive, DirectiveBinding } from 'vue'
import { useAuth } from '@/composables/useAuth'

// 权限指令配置
export interface PermissionDirectiveBinding {
  value: string | string[] | {
    permission?: string | string[]
    role?: string | string[]
    mode?: 'any' | 'all' // 权限检查模式：any-任意一个，all-全部
  }
}

/**
 * 权限指令 v-permission
 * 用法：
 * v-permission="'user:create'"     // 检查单个权限
 * v-permission="['user:create', 'user:edit']"  // 检查多个权限（默认any模式）
 * v-permission="{ permission: 'user:create', mode: 'all' }"  // all模式
 * v-permission="{ role: 'admin' }"  // 检查角色
 */
export const permissionDirective: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding<PermissionDirectiveBinding>) {
    checkPermission(el, binding)
  },
  updated(el: HTMLElement, binding: DirectiveBinding<PermissionDirectiveBinding>) {
    checkPermission(el, binding)
  }
}

/**
 * 角色指令 v-role
 * 用法：
 * v-role="'admin'"                    // 检查单个角色
 * v-role="['admin', 'manager']"       // 检查多个角色
 */
export const roleDirective: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding<string | string[]>) {
    checkRole(el, binding)
  },
  updated(el: HTMLElement, binding: DirectiveBinding<string | string[]>) {
    checkRole(el, binding)
  }
}

/**
 * 数据权限指令 v-data-scope
 * 用法：
 * v-data-scope="'all'"     // 全部数据权限
 * v-data-scope="'store'"   // 门店数据权限
 */
export const dataScopeDirective: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding<string>) {
    checkDataScope(el, binding)
  },
  updated(el: HTMLElement, binding: DirectiveBinding<string>) {
    checkDataScope(el, binding)
  }
}

// 检查权限
function checkPermission(el: HTMLElement, binding: DirectiveBinding<PermissionDirectiveBinding>) {
  const { hasPermission, hasRole } = useAuth()
  const { value } = binding

  if (!value) {
    console.warn('权限指令需要提供值')
    return
  }

  let hasAuth = false

  if (typeof value === 'string') {
    // 简单字符串权限
    hasAuth = hasPermission(value)
  } else if (Array.isArray(value)) {
    // 权限数组
    hasAuth = value.some(permission => hasPermission(permission))
  } else if (typeof value === 'object') {
    if (value.permission) {
      // 权限检查
      if (Array.isArray(value.permission)) {
        hasAuth = value.mode === 'all'
          ? value.permission.every(permission => hasPermission(permission))
          : value.permission.some(permission => hasPermission(permission))
      } else {
        hasAuth = hasPermission(value.permission)
      }
    } else if (value.role) {
      // 角色检查
      if (Array.isArray(value.role)) {
        hasAuth = value.role.some(role => hasRole(role as any))
      } else {
        hasAuth = hasRole(value.role as any)
      }
    }
  }

  // 如果没有权限，隐藏或禁用元素
  if (!hasAuth) {
    // 优先使用样式隐藏，而不是移除元素，保持响应式更新
    el.style.display = 'none'
    // 或者可以添加_disabled类来禁用交互
    el.classList.add('permission-disabled')
    el.setAttribute('aria-disabled', 'true')
  } else {
    el.style.display = ''
    el.classList.remove('permission-disabled')
    el.removeAttribute('aria-disabled')
  }
}

// 检查角色
function checkRole(el: HTMLElement, binding: DirectiveBinding<string | string[]>) {
  const { hasRole } = useAuth()
  const { value } = binding

  if (!value) {
    console.warn('角色指令需要提供值')
    return
  }

  let hasAuth = false

  if (typeof value === 'string') {
    hasAuth = hasRole(value as any)
  } else if (Array.isArray(value)) {
    hasAuth = value.some(role => hasRole(role as any))
  }

  if (!hasAuth) {
    el.style.display = 'none'
    el.classList.add('permission-disabled')
    el.setAttribute('aria-disabled', 'true')
  } else {
    el.style.display = ''
    el.classList.remove('permission-disabled')
    el.removeAttribute('aria-disabled')
  }
}

// 检查数据权限
function checkDataScope(el: HTMLElement, binding: DirectiveBinding<string>) {
  const { hasDataScope } = useAuth()
  const { value } = binding

  if (!value) {
    console.warn('数据权限指令需要提供值')
    return
  }

  const hasAuth = hasDataScope(value)

  if (!hasAuth) {
    el.style.display = 'none'
    el.classList.add('permission-disabled')
    el.setAttribute('aria-disabled', 'true')
  } else {
    el.style.display = ''
    el.classList.remove('permission-disabled')
    el.removeAttribute('aria-disabled')
  }
}

/**
 * 注册权限指令
 */
export function setupPermissionDirective(app: App) {
  app.directive('permission', permissionDirective)
  app.directive('role', roleDirective)
  app.directive('data-scope', dataScopeDirective)
}

/**
 * 权限检查工具函数
 */
export class PermissionUtils {
  /**
   * 检查是否有权限
   */
  static hasPermission(permission: string | string[]): boolean {
    const { hasPermission } = useAuth()
    return hasPermission(permission)
  }

  /**
   * 检查是否有角色
   */
  static hasRole(role: string | string[]): boolean {
    const { hasRole } = useAuth()
    return hasRole(role as any)
  }

  /**
   * 检查数据权限
   */
  static hasDataScope(dataScope: string): boolean {
    const { hasDataScope } = useAuth()
    return hasDataScope(dataScope)
  }

  /**
   * 权限过滤器 - 用于数组过滤
   */
  static filterByPermission<T extends { permission?: string[] }>(
    items: T[],
    requiredPermissions: string | string[]
  ): T[] {
    const permissions = Array.isArray(requiredPermissions)
      ? requiredPermissions
      : [requiredPermissions]

    return items.filter(item => {
      if (!item.permission) return true
      return permissions.some(p => item.permission!.includes(p))
    })
  }

  /**
   * 角色过滤器 - 用于数组过滤
   */
  static filterByRole<T extends { roles?: string[] }>(
    items: T[],
    requiredRoles: string | string[]
  ): T[] {
    const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles]
    return items.filter(item => {
      if (!item.roles) return true
      return roles.some(r => item.roles!.includes(r))
    })
  }
}