<template>
  <el-container class="layout-container">
    <!-- 侧边栏 -->
    <el-aside :width="isCollapse ? '64px' : '240px'" class="sidebar">
      <div class="logo-container">
        <img v-if="!isCollapse" src="/logo.png" alt="Logo" class="logo" />
        <img v-else src="/logo-mini.png" alt="Logo" class="logo-mini" />
        <span v-if="!isCollapse" class="title">叨叨管理</span>
      </div>

      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :unique-opened="uniqueOpened"
        :router="true"
        class="sidebar-menu"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
      >
        <sidebar-menu-item
          v-for="menu in menuList"
          :key="menu.id"
          :menu="menu"
          :base-path="menu.path"
        />
      </el-menu>
    </el-aside>

    <!-- 主内容区 -->
    <el-container>
      <!-- 顶部导航栏 -->
      <el-header class="navbar">
        <div class="navbar-left">
          <el-icon class="collapse-btn" @click="toggleSidebar">
            <Expand v-if="isCollapse" />
            <Fold v-else />
          </el-icon>
          <breadcrumb />
        </div>

        <div class="navbar-right">
          <!-- 通知 -->
          <el-dropdown trigger="click" class="notification-dropdown">
            <el-badge :value="notificationCount" :hidden="notificationCount === 0" class="notification">
              <el-icon :size="20"><Bell /></el-icon>
            </el-badge>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item v-for="item in notifications" :key="item.id">
                  <div class="notification-item">
                    <div class="notification-title">{{ item.title }}</div>
                    <div class="notification-time">{{ formatTime(item.time) }}</div>
                  </div>
                </el-dropdown-item>
                <el-dropdown-item divided @click="viewAllNotifications">
                  查看全部通知
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>

          <!-- 用户菜单 -->
          <el-dropdown trigger="click" class="user-dropdown">
            <div class="user-info">
              <el-avatar :size="32" :src="userInfo.avatar">
                <el-icon><User /></el-icon>
              </el-avatar>
              <span class="username">{{ userInfo.name }}</span>
              <el-icon class="user-arrow"><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="viewProfile">
                  <el-icon><User /></el-icon>
                  个人信息
                </el-dropdown-item>
                <el-dropdown-item @click="changePassword">
                  <el-icon><Lock /></el-icon>
                  修改密码
                </el-dropdown-item>
                <el-dropdown-item divided @click="logout">
                  <el-icon><SwitchButton /></el-icon>
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <!-- 主内容 -->
      <el-main class="main-content">
        <router-view v-slot="{ Component, route }">
          <transition name="fade-transform" mode="out-in">
            <keep-alive :include="cachedViews">
              <component :is="Component" :key="route.path" />
            </keep-alive>
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Expand,
  Fold,
  Bell,
  User,
  ArrowDown,
  Lock,
  SwitchButton
} from '@element-plus/icons-vue'
import type { MenuItem } from '@/types/menu'
import { PermissionChecker } from '@/utils/route'
import { RoleCode } from '@/types/menu'
import SidebarMenuItem from './components/SidebarMenuItem.vue'
import Breadcrumb from './components/Breadcrumb.vue'

// 响应式数据
const route = useRoute()
const router = useRouter()
const isCollapse = ref(false)
const uniqueOpened = ref(true)
const cachedViews = ref<string[]>([])

// 用户信息
const userInfo = ref({
  id: '',
  name: '',
  avatar: '',
  role: RoleCode.STORE_EMPLOYEE,
  permissions: [] as string[]
})

// 菜单相关
const menuList = ref<MenuItem[]>([])

// 通知相关
const notificationCount = ref(0)
const notifications = ref([
  {
    id: 1,
    title: '有新的订单待处理',
    time: new Date(Date.now() - 5 * 60 * 1000)
  },
  {
    id: 2,
    title: '车辆保养提醒',
    time: new Date(Date.now() - 30 * 60 * 1000)
  }
])

// 计算属性
const activeMenu = computed(() => {
  const { meta, path } = route
  if (meta?.activeMenu) {
    return meta.activeMenu as string
  }
  return path
})

// 初始化用户信息
const initUserInfo = () => {
  const storedUserInfo = localStorage.getItem('userInfo')
  if (storedUserInfo) {
    try {
      userInfo.value = JSON.parse(storedUserInfo)
      loadUserMenus()
    } catch (error) {
      console.error('用户信息解析失败:', error)
      logout()
    }
  } else {
    logout()
  }
}

// 加载用户菜单
const loadUserMenus = () => {
  const menuTree = PermissionChecker.getUserMenuTree(
    userInfo.value.role,
    userInfo.value.permissions
  )
  menuList.value = menuTree.menus
}

// 切换侧边栏
const toggleSidebar = () => {
  isCollapse.value = !isCollapse.value
}

// 格式化时间
const formatTime = (time: Date) => {
  const now = new Date()
  const diff = now.getTime() - time.getTime()
  const minutes = Math.floor(diff / (1000 * 60))

  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}小时前`

  return time.toLocaleDateString()
}

// 查看所有通知
const viewAllNotifications = () => {
  router.push('/notifications')
}

// 查看个人信息
const viewProfile = () => {
  router.push('/profile')
}

// 修改密码
const changePassword = () => {
  router.push('/change-password')
}

// 退出登录
const logout = () => {
  ElMessageBox.confirm(
    '确定要退出登录吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
    router.push('/login')
    ElMessage.success('退出登录成功')
  }).catch(() => {
    // 用户取消
  })
}

// 监听路由变化
watch(route, () => {
  // 可以在这里处理路由变化的逻辑
}, { immediate: true })

onMounted(() => {
  initUserInfo()
})
</script>

<style scoped lang="scss">
.layout-container {
  height: 100vh;
  overflow: hidden;
}

.sidebar {
  background-color: #304156;
  box-shadow: 2px 0 6px rgba(0, 21, 41, 0.08);
  transition: width 0.28s;
  overflow: hidden;

  .logo-container {
    height: 60px;
    display: flex;
    align-items: center;
    padding: 0 16px;
    background-color: #2b2f3a;
    overflow: hidden;

    .logo, .logo-mini {
      width: 32px;
      height: 32px;
    }

    .title {
      margin-left: 12px;
      color: #fff;
      font-size: 18px;
      font-weight: 600;
      white-space: nowrap;
    }
  }

  .sidebar-menu {
    border-right: none;
    height: calc(100vh - 60px);
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #304156;
      border-radius: 3px;
    }
  }
}

.navbar {
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  height: 60px;

  .navbar-left {
    display: flex;
    align-items: center;

    .collapse-btn {
      font-size: 20px;
      cursor: pointer;
      margin-right: 20px;
      color: #606266;
      transition: color 0.28s;

      &:hover {
        color: #409EFF;
      }
    }
  }

  .navbar-right {
    display: flex;
    align-items: center;
    gap: 20px;

    .notification-dropdown {
      cursor: pointer;

      .notification {
        cursor: pointer;
        color: #606266;
        transition: color 0.28s;

        &:hover {
          color: #409EFF;
        }
      }

      .notification-item {
        .notification-title {
          font-size: 14px;
          color: #303133;
          margin-bottom: 4px;
        }

        .notification-time {
          font-size: 12px;
          color: #909399;
        }
      }
    }

    .user-dropdown {
      cursor: pointer;

      .user-info {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        border-radius: 4px;
        transition: background-color 0.28s;

        &:hover {
          background-color: #f5f7fa;
        }

        .username {
          font-size: 14px;
          color: #303133;
        }

        .user-arrow {
          font-size: 12px;
          color: #909399;
        }
      }
    }
  }
}

.main-content {
  background-color: #f0f2f5;
  padding: 20px;
  overflow-y: auto;
}

// 路由切换动画
.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all 0.3s;
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>