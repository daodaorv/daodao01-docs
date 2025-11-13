import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { UserMenuTree } from '@/types/menu'
import { PermissionChecker } from '@/utils/route'
import { RoleCode } from '@/types/menu'

// 用户信息接口
export interface UserInfo {
  id: string
  username: string
  name: string
  email?: string
  phone?: string
  avatar?: string
  role: RoleCode
  roleName: string
  permissions: string[]
  storeId?: string
  regionId?: string
}

// 认证响应接口
export interface LoginResponse {
  token: string
  user: UserInfo
  expiresIn: number
}

/**
 * 认证和权限管理Composable
 */
export function useAuth() {
  const router = useRouter()

  // 响应式状态
  const token = ref<string>('')
  const user = ref<UserInfo | null>(null)
  const isLoggedIn = computed(() => !!token.value && !!user.value)

  // 初始化认证状态
  const initAuth = () => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('userInfo')

    if (storedToken) {
      token.value = storedToken
    }

    if (storedUser) {
      try {
        user.value = JSON.parse(storedUser)
      } catch (error) {
        console.error('用户信息解析失败:', error)
        clearAuth()
      }
    }
  }

  // 登录
  const login = async (credentials: {
    username: string
    password: string
    captcha?: string
  }): Promise<boolean> => {
    try {
      // 模拟登录API调用
      // 实际项目中需要调用真实API
      const response = await mockLoginApi(credentials)

      if (response.token) {
        token.value = response.token
        user.value = response.user

        // 存储到localStorage
        localStorage.setItem('token', response.token)
        localStorage.setItem('userInfo', JSON.stringify(response.user))

        ElMessage.success('登录成功')
        return true
      } else {
        ElMessage.error('登录失败，请检查用户名和密码')
        return false
      }
    } catch (error) {
      console.error('登录错误:', error)
      ElMessage.error('登录失败，请稍后重试')
      return false
    }
  }

  // 退出登录
  const logout = () => {
    token.value = ''
    user.value = null
    clearAuth()
    router.push('/login')
    ElMessage.success('退出登录成功')
  }

  // 清除认证信息
  const clearAuth = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
  }

  // 检查用户权限
  const hasPermission = (permission: string | string[]): boolean => {
    if (!user.value) return false

    const userPermissions = user.value.permissions
    const permissions = Array.isArray(permission) ? permission : [permission]

    // 管理员拥有所有权限
    if (userPermissions.includes('*')) return true

    return permissions.some(p => userPermissions.includes(p))
  }

  // 检查用户角色
  const hasRole = (role: RoleCode | RoleCode[]): boolean => {
    if (!user.value) return false

    const userRole = user.value.role
    const roles = Array.isArray(role) ? role : [role]

    return roles.includes(userRole)
  }

  // 检查数据权限
  const hasDataScope = (dataScope: string): boolean => {
    if (!user.value) return false

    const roleDataScopeMap: Record<RoleCode, string[]> = {
      [RoleCode.PLATFORM_ADMIN]: ['all', 'region', 'store', 'self'],
      [RoleCode.REGION_MANAGER]: ['region', 'store', 'self'],
      [RoleCode.STORE_MANAGER]: ['store', 'self'],
      [RoleCode.STORE_EMPLOYEE]: ['self']
    }

    const allowedScopes = roleDataScopeMap[user.value.role] || []
    return allowedScopes.includes(dataScope)
  }

  // 获取用户菜单树
  const getUserMenus = (): UserMenuTree => {
    if (!user.value) {
      return {
        menus: [],
        permissions: [],
        roleCodes: []
      }
    }

    return PermissionChecker.getUserMenuTree(
      user.value.role,
      user.value.permissions
    )
  }

  // 刷新用户信息
  const refreshUserInfo = async (): Promise<boolean> => {
    try {
      // 模拟API调用
      const userInfo = await mockGetUserInfoApi()
      if (userInfo) {
        user.value = userInfo
        localStorage.setItem('userInfo', JSON.stringify(userInfo))
        return true
      }
      return false
    } catch (error) {
      console.error('刷新用户信息失败:', error)
      return false
    }
  }

  // 更新用户权限
  const updatePermissions = (permissions: string[]) => {
    if (user.value) {
      user.value.permissions = permissions
      localStorage.setItem('userInfo', JSON.stringify(user.value))
    }
  }

  return {
    // 状态
    token: computed(() => token.value),
    user: computed(() => user.value),
    isLoggedIn,

    // 方法
    initAuth,
    login,
    logout,
    hasPermission,
    hasRole,
    hasDataScope,
    getUserMenus,
    refreshUserInfo,
    updatePermissions
  }
}

/**
 * 菜单权限管理Composable
 */
export function useMenuPermission() {
  const { user, hasPermission } = useAuth()

  // 检查菜单权限
  const checkMenuPermission = (menuId: string): boolean => {
    // 基于菜单ID的权限映射
    const menuPermissionMap: Record<string, string> = {
      'user-manage': 'user:manage',
      'vehicle-manage': 'vehicle:manage',
      'store-manage': 'store:manage',
      'order-manage': 'order:manage',
      'crowdfunding-manage': 'crowdfunding:manage',
      'cooperation-manage': 'cooperation:manage',
      'campsite-manage': 'campsite:manage',
      'marketing-manage': 'marketing:manage',
      'community-manage': 'community:manage',
      'service-manage': 'service:manage',
      'profit-sharing': 'profit:manage',
      'employee-manage': 'employee:manage',
      'permission-manage': 'permission:manage',
      'system-manage': 'system:manage',
      'dashboard': 'dashboard:view',
      'finance-manage': 'finance:manage'
    }

    const requiredPermission = menuPermissionMap[menuId]
    if (!requiredPermission) return true

    return hasPermission(requiredPermission)
  }

  // 过滤菜单权限
  const filterMenusByPermission = (menus: any[]) => {
    return menus.filter(menu => {
      // 检查当前菜单权限
      if (!checkMenuPermission(menu.id)) {
        return false
      }

      // 如果有子菜单，递归过滤
      if (menu.children && menu.children.length > 0) {
        const filteredChildren = filterMenusByPermission(menu.children)
        if (filteredChildren.length === 0) {
          return false
        }
        menu.children = filteredChildren
      }

      return true
    })
  }

  return {
    checkMenuPermission,
    filterMenusByPermission
  }
}

// 模拟API函数（实际项目中需要替换为真实API）
async function mockLoginApi(credentials: {
  username: string
  password: string
  captcha?: string
}): Promise<LoginResponse> {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 1000))

  // 模拟用户数据
  const mockUsers: Record<string, UserInfo> = {
    admin: {
      id: '1',
      username: 'admin',
      name: '系统管理员',
      email: 'admin@daodao.com',
      role: RoleCode.PLATFORM_ADMIN,
      roleName: '平台管理员',
      permissions: ['*'],
      avatar: '/avatars/admin.png'
    },
    manager: {
      id: '2',
      username: 'manager',
      name: '区域经理',
      email: 'manager@daodao.com',
      role: RoleCode.REGION_MANAGER,
      roleName: '区域经理',
      permissions: [
        'user:*', 'vehicle:*', 'store:*', 'order:*',
        'marketing:*', 'dashboard:*', 'finance:*'
      ],
      regionId: 'region001',
      avatar: '/avatars/manager.png'
    },
    store: {
      id: '3',
      username: 'store',
      name: '门店经理',
      email: 'store@daodao.com',
      role: RoleCode.STORE_MANAGER,
      roleName: '门店经理',
      permissions: [
        'user:list', 'user:credit',
        'vehicle:*', 'store:*', 'order:*',
        'marketing:price', 'dashboard:*'
      ],
      storeId: 'store001',
      regionId: 'region001',
      avatar: '/avatars/store.png'
    },
    employee: {
      id: '4',
      username: 'employee',
      name: '门店员工',
      email: 'employee@daodao.com',
      role: RoleCode.STORE_EMPLOYEE,
      roleName: '门店员工',
      permissions: [
        'user:list',
        'vehicle:list', 'vehicle:status',
        'order:list', 'order:detail',
        'dashboard:overview', 'dashboard:todo'
      ],
      storeId: 'store001',
      avatar: '/avatars/employee.png'
    }
  }

  const user = mockUsers[credentials.username]
  if (!user || credentials.password !== '123456') {
    throw new Error('用户名或密码错误')
  }

  return {
    token: `mock_token_${Date.now()}`,
    user,
    expiresIn: 24 * 60 * 60 * 1000 // 24小时
  }
}

async function mockGetUserInfoApi(): Promise<UserInfo | null> {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 500))

  const storedUser = localStorage.getItem('userInfo')
  if (storedUser) {
    try {
      return JSON.parse(storedUser)
    } catch (error) {
      return null
    }
  }

  return null
}