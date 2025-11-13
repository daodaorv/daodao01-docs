import type { App } from 'vue'
import { ElMessage } from 'element-plus'
import type { MenuItem } from '@/types/menu'
import { PermissionChecker } from '@/utils/route'
import { RoleCode } from '@/types/menu'

/**
 * 权限工具类
 * 提供全局权限检查和菜单过滤功能
 */
export class PermissionUtils {
  /**
   * 检查用户是否有指定权限
   */
  static checkPermission(permission: string | string[], userPermissions: string[]): boolean {
    if (!userPermissions || userPermissions.length === 0) return false

    // 管理员拥有所有权限
    if (userPermissions.includes('*')) return true

    const permissions = Array.isArray(permission) ? permission : [permission]
    return permissions.some(p => userPermissions.includes(p))
  }

  /**
   * 检查用户是否有指定角色
   */
  static checkRole(role: RoleCode | RoleCode[], userRole: RoleCode): boolean {
    const roles = Array.isArray(role) ? role : [role]
    return roles.includes(userRole)
  }

  /**
   * 根据角色获取数据权限范围
   */
  static getDataScopeByRole(role: RoleCode): string[] {
    const dataScopeMap: Record<RoleCode, string[]> = {
      [RoleCode.PLATFORM_ADMIN]: ['all', 'region', 'store', 'self'],
      [RoleCode.REGION_MANAGER]: ['region', 'store', 'self'],
      [RoleCode.STORE_MANAGER]: ['store', 'self'],
      [RoleCode.STORE_EMPLOYEE]: ['self']
    }
    return dataScopeMap[role] || ['self']
  }

  /**
   * 过滤菜单权限
   */
  static filterMenusByRole(menus: MenuItem[], userRole: RoleCode, userPermissions: string[]): MenuItem[] {
    return menus
      .filter(menu => this.checkMenuPermission(menu, userRole, userPermissions))
      .map(menu => {
        if (menu.children && menu.children.length > 0) {
          const filteredChildren = this.filterMenusByRole(menu.children, userRole, userPermissions)
          return { ...menu, children: filteredChildren }
        }
        return menu
      })
      .filter(menu => !menu.children || menu.children.length > 0)
  }

  /**
   * 检查单个菜单权限
   */
  private static checkMenuPermission(menu: MenuItem, userRole: RoleCode, userPermissions: string[]): boolean {
    // 检查菜单权限配置
    if (menu.permission && menu.permission.length > 0) {
      if (!this.checkPermission(menu.permission, userPermissions)) {
        return false
      }
    }

    // 检查角色级别的菜单权限
    const roleMenuRestrictions: Record<RoleCode, string[]> = {
      [RoleCode.PLATFORM_ADMIN]: [], // 无限制
      [RoleCode.REGION_MANAGER]: ['employee-manage'], // 区域经理不能访问员工管理
      [RoleCode.STORE_MANAGER]: [
        'employee-manage',
        'permission-manage',
        'system-manage',
        'crowdfunding-manage',
        'cooperation-manage',
        'community-manage',
        'service-manage',
        'profit-sharing'
      ], // 门店经理限制
      [RoleCode.STORE_EMPLOYEE]: [
        'store-manage',
        'marketing-manage',
        'employee-manage',
        'permission-manage',
        'system-manage',
        'crowdfunding-manage',
        'cooperation-manage',
        'campsite-manage',
        'community-manage',
        'service-manage',
        'profit-sharing',
        'finance-manage'
      ] // 员工限制
    }

    const restrictedMenus = roleMenuRestrictions[userRole] || []
    return !restrictedMenus.includes(menu.id)
  }

  /**
   * 获取操作权限列表
   */
  static getActionPermissions(userRole: RoleCode): string[] {
    const permissionMap: Record<RoleCode, string[]> = {
      [RoleCode.PLATFORM_ADMIN]: ['*'],
      [RoleCode.REGION_MANAGER]: [
        'user:create', 'user:edit', 'user:delete', 'user:audit',
        'vehicle:create', 'vehicle:edit', 'vehicle:delete',
        'store:create', 'store:edit', 'store:approve',
        'order:create', 'order:edit', 'order:cancel', 'order:refund',
        'marketing:create', 'marketing:edit', 'marketing:delete',
        'dashboard:view', 'finance:view'
      ],
      [RoleCode.STORE_MANAGER]: [
        'user:view', 'user:credit',
        'vehicle:view', 'vehicle:edit', 'vehicle:status',
        'store:view', 'store:edit',
        'order:view', 'order:edit', 'order:process',
        'marketing:view', 'marketing:edit:price',
        'dashboard:view'
      ],
      [RoleCode.STORE_EMPLOYEE]: [
        'user:view',
        'vehicle:view', 'vehicle:status',
        'order:view', 'order:process',
        'dashboard:view:overview', 'dashboard:view:todo'
      ]
    }

    return permissionMap[userRole] || []
  }

  /**
   * 显示权限不足提示
   */
  static showNoPermissionTip(action?: string) {
    const message = action ? `您没有权限执行"${action}"操作` : '您没有权限执行此操作'
    ElMessage.warning(message)
  }

  /**
   * 检查操作权限并提示
   */
  static checkAndShowPermission(permission: string | string[], userPermissions: string[], action?: string): boolean {
    const hasPermission = this.checkPermission(permission, userPermissions)
    if (!hasPermission) {
      this.showNoPermissionTip(action)
    }
    return hasPermission
  }

  /**
   * 生成权限字符串
   */
  static generatePermission(resource: string, action: string): string {
    return `${resource}:${action}`
  }

  /**
   * 解析权限字符串
   */
  static parsePermission(permission: string): { resource: string; action: string } {
    const [resource, action] = permission.split(':')
    return { resource, action: action || '*' }
  }

  /**
   * 批量检查权限
   */
  static checkMultiplePermissions(
    permissions: Array<{ permission: string; required: boolean }>,
    userPermissions: string[]
  ): { allPassed: boolean; results: boolean[] } {
    const results = permissions.map(item =>
      item.required ? this.checkPermission(item.permission, userPermissions) : true
    )
    const allPassed = results.every(result => result)
    return { allPassed, results }
  }

  /**
   * 获取角色显示名称
   */
  static getRoleDisplayName(role: RoleCode): string {
    const roleNames: Record<RoleCode, string> = {
      [RoleCode.PLATFORM_ADMIN]: '平台管理员',
      [RoleCode.REGION_MANAGER]: '区域经理',
      [RoleCode.STORE_MANAGER]: '门店经理',
      [RoleCode.STORE_EMPLOYEE]: '门店员工'
    }
    return roleNames[role] || '未知角色'
  }

  /**
   * 获取数据权限显示名称
   */
  static getDataScopeDisplayName(dataScope: string): string {
    const scopeNames: Record<string, string> = {
      all: '全部数据',
      region: '区域数据',
      store: '门店数据',
      self: '个人数据'
    }
    return scopeNames[dataScope] || '未知权限'
  }
}

/**
 * 权限管理器
 * 提供统一的权限管理接口
 */
export class PermissionManager {
  private static instance: PermissionManager
  private userRole: RoleCode = RoleCode.STORE_EMPLOYEE
  private userPermissions: string[] = []

  static getInstance(): PermissionManager {
    if (!PermissionManager.instance) {
      PermissionManager.instance = new PermissionManager()
    }
    return PermissionManager.instance
  }

  /**
   * 初始化权限管理器
   */
  init(userRole: RoleCode, permissions: string[]) {
    this.userRole = userRole
    this.userPermissions = permissions
  }

  /**
   * 检查权限
   */
  hasPermission(permission: string | string[]): boolean {
    return PermissionUtils.checkPermission(permission, this.userPermissions)
  }

  /**
   * 检查角色
   */
  hasRole(role: RoleCode | RoleCode[]): boolean {
    return PermissionUtils.checkRole(role, this.userRole)
  }

  /**
   * 获取用户菜单
   */
  getUserMenus(allMenus: MenuItem[]): MenuItem[] {
    return PermissionUtils.filterMenusByRole(allMenus, this.userRole, this.userPermissions)
  }

  /**
   * 获取数据权限
   */
  getDataScope(): string[] {
    return PermissionUtils.getDataScopeByRole(this.userRole)
  }

  /**
   * 获取当前用户角色
   */
  getCurrentRole(): RoleCode {
    return this.userRole
  }

  /**
   * 获取当前用户权限
   */
  getCurrentPermissions(): string[] {
    return this.userPermissions
  }

  /**
   * 更新用户权限
   */
  updatePermissions(permissions: string[]) {
    this.userPermissions = permissions
  }

  /**
   * 更新用户角色
   */
  updateRole(role: RoleCode) {
    this.userRole = role
  }
}

/**
 * 权限插件 - 用于Vue应用安装
 */
export const PermissionPlugin = {
  install(app: App) {
    // 注册权限管理器实例
    app.config.globalProperties.$permission = PermissionManager.getInstance()

    // 提供全局权限工具
    app.provide('permissionUtils', PermissionUtils)
    app.provide('permissionManager', PermissionManager.getInstance())
  }
}

export default PermissionPlugin