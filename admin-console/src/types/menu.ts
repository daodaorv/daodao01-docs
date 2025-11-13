/**
 * 菜单相关类型定义
 */

// 菜单类型枚举
export enum MenuType {
  MENU = 'menu',       // 菜单
  PAGE = 'page',       // 页面
  BUTTON = 'button',   // 按钮
  DIRECTORY = 'dir'    // 目录
}

// 菜单项接口
export interface MenuItem {
  id: string
  parentId?: string
  name: string
  title: string
  path?: string
  component?: string
  icon?: string
  type: MenuType
  sort: number
  hidden?: boolean
  cache?: boolean
  permission?: string[]
  children?: MenuItem[]
  meta?: {
    title: string
    icon?: string
    hideInMenu?: boolean
    noCache?: boolean
    affix?: boolean
    activeMenu?: string
    breadcrumb?: boolean
  }
}

// 角色菜单权限接口
export interface RoleMenuPermission {
  roleId: string
  menuId: string
  permissions: string[]
}

// 用户菜单树接口
export interface UserMenuTree {
  menus: MenuItem[]
  permissions: string[]
  roleCodes: string[]
}

// 菜单配置选项
export interface MenuOptions {
  expandAll?: boolean
  autoSelect?: boolean
  collapse?: boolean
  uniqueOpened?: boolean
}

// 四层角色权限枚举
export enum RoleCode {
  PLATFORM_ADMIN = 'platform_admin',      // 平台管理员
  REGION_MANAGER = 'region_manager',      // 区域经理
  STORE_MANAGER = 'store_manager',        // 门店经理
  STORE_EMPLOYEE = 'store_employee',      // 门店员工
}

// 数据权限范围
export enum DataScope {
  ALL = 'all',              // 全部数据
  REGION = 'region',        // 区域数据
  STORE = 'store',          // 门店数据
  SELF = 'self',            // 个人数据
}