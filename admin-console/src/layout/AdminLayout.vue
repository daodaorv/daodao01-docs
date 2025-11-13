<template>
  <el-container class="admin-layout">
    <!-- 侧边栏 -->
    <el-aside :width="isCollapse ? '64px' : '240px'" class="sidebar">
      <div class="logo-container">
        <div v-if="!isCollapse" class="logo-text">叨叨房车</div>
        <div v-else class="logo-mini">叨叨</div>
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
        <!-- 数据分析 -->
        <el-sub-menu index="dashboard">
          <template #title>
            <el-icon><DataBoard /></el-icon>
            <span>数据分析</span>
          </template>
          <el-menu-item index="/dashboard/overview">
            <el-icon><DataLine /></el-icon>
            <template #title>数据概览</template>
          </el-menu-item>
          <el-menu-item index="/dashboard/todo">
            <el-icon><List /></el-icon>
            <template #title>今日待办</template>
          </el-menu-item>
          <el-menu-item index="/dashboard/quick">
            <el-icon><Operation /></el-icon>
            <template #title>快捷操作</template>
          </el-menu-item>
        </el-sub-menu>

        <!-- 核心业务管理 -->
        <el-sub-menu index="core-business">
          <template #title>
            <el-icon><Shop /></el-icon>
            <span>核心业务管理</span>
          </template>

          <!-- 用户管理 -->
          <el-sub-menu index="user-manage">
            <template #title>
              <el-icon><User /></el-icon>
              <span>用户管理</span>
            </template>
            <el-menu-item index="/core-business/user/list">用户列表</el-menu-item>
            <el-menu-item index="/core-business/user/audit">注册审核</el-menu-item>
            <el-menu-item index="/core-business/user/tags">标签管理</el-menu-item>
            <el-menu-item index="/core-business/user/credit">信用评估</el-menu-item>
            <el-menu-item index="/core-business/user/risk">风控管理</el-menu-item>
            <el-menu-item index="/core-business/user/blacklist">黑名单</el-menu-item>
          </el-sub-menu>

          <!-- 车辆管理 -->
          <el-sub-menu index="vehicle-manage">
            <template #title>
              <el-icon><Van /></el-icon>
              <span>车辆管理</span>
            </template>
            <el-menu-item index="/core-business/vehicle/models">车型库管理</el-menu-item>
            <el-menu-item index="/core-business/vehicle/list">车辆列表</el-menu-item>
            <el-menu-item index="/core-business/vehicle/status">车辆状态</el-menu-item>
            <el-menu-item index="/core-business/vehicle/maintenance">维保管理</el-menu-item>
            <el-menu-item index="/core-business/vehicle/insurance">保险管理</el-menu-item>
            <el-menu-item index="/core-business/vehicle/violations">违章管理</el-menu-item>
          </el-sub-menu>

          <!-- 门店管理 -->
          <el-sub-menu index="store-manage">
            <template #title>
              <el-icon><House /></el-icon>
              <span>门店管理</span>
            </template>
            <el-menu-item index="/core-business/store/list">门店列表</el-menu-item>
            <el-menu-item index="/core-business/store/settings">门店设置</el-menu-item>
            <el-menu-item index="/core-business/store/service">服务配置</el-menu-item>
            <el-menu-item index="/core-business/store/city">城市管理</el-menu-item>
            <el-menu-item index="/core-business/store/area">区域管理</el-menu-item>
          </el-sub-menu>

          <!-- 订单管理 -->
          <el-sub-menu index="order-manage">
            <template #title>
              <el-icon><Document /></el-icon>
              <span>订单管理</span>
            </template>
            <el-menu-item index="/core-business/order/list">订单列表</el-menu-item>
            <el-menu-item index="/core-business/order/detail">订单详情</el-menu-item>
            <el-menu-item index="/core-business/order/exception">异常处理</el-menu-item>
            <el-menu-item index="/core-business/order/refund">退款管理</el-menu-item>
            <el-menu-item index="/core-business/order/evaluation">评价管理</el-menu-item>
          </el-sub-menu>

          <!-- 众筹管理 -->
          <el-sub-menu index="crowdfunding-manage">
            <template #title>
              <el-icon><Money /></el-icon>
              <span>众筹管理</span>
            </template>
            <el-menu-item index="/core-business/crowdfunding/projects">众筹项目</el-menu-item>
            <el-menu-item index="/core-business/crowdfunding/vehicle">车辆关联</el-menu-item>
            <el-menu-item index="/core-business/crowdfunding/share">份额管理</el-menu-item>
            <el-menu-item index="/core-business/crowdfunding/trade">份额交易</el-menu-item>
          </el-sub-menu>

          <!-- 合作管理 -->
          <el-sub-menu index="cooperation-manage">
            <template #title>
              <el-icon><Connection /></el-icon>
              <span>合作管理</span>
            </template>
            <el-menu-item index="/core-business/cooperation/partner">合作商管理</el-menu-item>
            <el-menu-item index="/core-business/cooperation/vehicle">合作车辆</el-menu-item>
            <el-menu-item index="/core-business/cooperation/supplier">供应商管理</el-menu-item>
            <el-menu-item index="/core-business/cooperation/settlement">结算管理</el-menu-item>
          </el-sub-menu>

          <!-- 营地管理 -->
          <el-sub-menu index="campsite-manage">
            <template #title>
              <el-icon><HomeFilled /></el-icon>
              <span>营地管理</span>
            </template>
            <el-menu-item index="/core-business/campsite/list">营地列表</el-menu-item>
            <el-menu-item index="/core-business/campsite/settings">营地设置</el-menu-item>
            <el-menu-item index="/core-business/campsite/booking">预订管理</el-menu-item>
            <el-menu-item index="/core-business/campsite/consult">咨询配置</el-menu-item>
          </el-sub-menu>
        </el-sub-menu>

        <!-- 营销运营管理 -->
        <el-sub-menu index="marketing">
          <template #title>
            <el-icon><Promotion /></el-icon>
            <span>营销运营管理</span>
          </template>

          <!-- 营销管理 -->
          <el-sub-menu index="marketing-manage">
            <template #title>
              <el-icon><TrendCharts /></el-icon>
              <span>营销管理</span>
            </template>
            <el-menu-item index="/marketing/price/strategy">价格策略</el-menu-item>
            <el-menu-item index="/marketing/coupon/list">优惠券管理</el-menu-item>
            <el-menu-item index="/marketing/promotion/activity">营销活动</el-menu-item>
            <el-menu-item index="/marketing/package/special">特惠套餐</el-menu-item>
            <el-menu-item index="/marketing/tour/custom">定制旅游</el-menu-item>
            <el-menu-item index="/marketing/fee/extra">增值费用管理</el-menu-item>
          </el-sub-menu>

          <!-- 社区管理 -->
          <el-sub-menu index="community-manage">
            <template #title>
              <el-icon><ChatDotRound /></el-icon>
              <span>社区管理</span>
            </template>
            <el-menu-item index="/marketing/community/audit">内容审核</el-menu-item>
            <el-menu-item index="/marketing/community/config">社区配置</el-menu-item>
            <el-menu-item index="/marketing/community/report">举报处理</el-menu-item>
            <el-menu-item index="/marketing/community/content">内容管理</el-menu-item>
          </el-sub-menu>

          <!-- 客服管理 -->
          <el-sub-menu index="service-manage">
            <template #title>
              <el-icon><Service /></el-icon>
              <span>客服管理</span>
            </template>
            <el-menu-item index="/marketing/service/config">客服配置</el-menu-item>
            <el-menu-item index="/marketing/service/ticket">工单管理</el-menu-item>
            <el-menu-item index="/marketing/service/quality">质量监控</el-menu-item>
            <el-menu-item index="/marketing/service/knowledge">知识库</el-menu-item>
          </el-sub-menu>

          <!-- 分润管理 -->
          <el-sub-menu index="profit-sharing">
            <template #title>
              <el-icon><Share /></el-icon>
              <span>分润管理</span>
            </template>
            <el-menu-item index="/marketing/profit/crowdfunding">众筹分润</el-menu-item>
            <el-menu-item index="/marketing/profit/cooperation">差价分润（合作商）</el-menu-item>
            <el-menu-item index="/marketing/profit/employee">员工激励</el-menu-item>
            <el-menu-item index="/marketing/profit/promotion">推广分润</el-menu-item>
            <el-menu-item index="/marketing/profit/config">分润配置</el-menu-item>
            <el-menu-item index="/marketing/profit/settlement">结算管理</el-menu-item>
            <el-menu-item index="/marketing/profit/withdraw">提现审核</el-menu-item>
          </el-sub-menu>
        </el-sub-menu>

        <!-- 财务管理 -->
        <el-menu-item index="/finance">
          <el-icon><Coin /></el-icon>
          <template #title>财务管理</template>
        </el-menu-item>

        <!-- 系统管理 -->
        <el-sub-menu index="system">
          <template #title>
            <el-icon><Setting /></el-icon>
            <span>系统管理</span>
          </template>

          <!-- 员工管理 -->
          <el-sub-menu index="employee-manage">
            <template #title>
              <el-icon><Avatar /></el-icon>
              <span>员工管理</span>
            </template>
            <el-menu-item index="/system/employee/list">员工列表</el-menu-item>
            <el-menu-item index="/system/employee/role">角色分配</el-menu-item>
            <el-menu-item index="/system/employee/store">门店员工</el-menu-item>
            <el-menu-item index="/system/employee/service">客服人员</el-menu-item>
            <el-menu-item index="/system/employee/performance">绩效管理</el-menu-item>
          </el-sub-menu>

          <!-- 权限管理 -->
          <el-sub-menu index="permission-manage">
            <template #title>
              <el-icon><Lock /></el-icon>
              <span>权限管理</span>
            </template>
            <el-menu-item index="/system/permission/role">角色管理</el-menu-item>
            <el-menu-item index="/system/permission/config">权限配置</el-menu-item>
            <el-menu-item index="/system/permission/menu">菜单权限</el-menu-item>
            <el-menu-item index="/system/permission/data">数据权限</el-menu-item>
            <el-menu-item index="/system/permission/log">操作日志</el-menu-item>
          </el-sub-menu>

          <!-- 系统管理 -->
          <el-sub-menu index="system-manage">
            <template #title>
              <el-icon><Tools /></el-icon>
              <span>系统管理</span>
            </template>
            <el-menu-item index="/system/system/config">系统配置</el-menu-item>
            <el-menu-item index="/system/system/parameter">参数设置</el-menu-item>
            <el-menu-item index="/system/system/warning">智能预警</el-menu-item>
            <el-menu-item index="/system/system/monitor">系统监控</el-menu-item>
            <el-menu-item index="/system/system/audit">审计日志</el-menu-item>
            <el-menu-item index="/system/system/backup">数据备份</el-menu-item>
          </el-sub-menu>
        </el-sub-menu>
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
          <el-badge :value="3" class="notification">
            <el-icon :size="20"><Bell /></el-icon>
          </el-badge>

          <!-- 用户菜单 -->
          <el-dropdown trigger="click" class="user-dropdown">
            <div class="user-info">
              <el-avatar :size="32">
                <el-icon><User /></el-icon>
              </el-avatar>
              <span class="username">{{ userInfo.name || '用户' }}</span>
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
            <keep-alive>
              <component :is="Component" :key="route.path" />
            </keep-alive>
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Expand,
  Fold,
  Bell,
  User,
  ArrowDown,
  Lock,
  SwitchButton,
  DataBoard,
  DataLine,
  List,
  Operation,
  Shop,
  Van,
  House,
  Document,
  Money,
  Connection,
  HomeFilled,
  Promotion,
  TrendCharts,
  ChatDotRound,
  Service,
  Share,
  Coin,
  Setting,
  Avatar,
  Tools
} from '@element-plus/icons-vue'

// 响应式数据
const route = useRoute()
const router = useRouter()
const isCollapse = ref(false)
const uniqueOpened = ref(true)
const userInfo = ref({
  id: '',
  name: '',
  role: '',
  avatar: ''
})

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
    } catch (error) {
      console.error('用户信息解析失败:', error)
    }
  }
}

// 切换侧边栏
const toggleSidebar = () => {
  isCollapse.value = !isCollapse.value
}

// 查看个人信息
const viewProfile = () => {
  ElMessage.info('个人信息功能开发中...')
}

// 修改密码
const changePassword = () => {
  ElMessage.info('修改密码功能开发中...')
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

onMounted(() => {
  initUserInfo()
})
</script>

<style scoped lang="scss">
.admin-layout {
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

    .logo-text {
      font-size: 20px;
      font-weight: bold;
      color: #409EFF;
      white-space: nowrap;
    }

    .logo-mini {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #409EFF;
      color: white;
      border-radius: 4px;
      font-weight: bold;
      font-size: 12px;
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

    .notification {
      cursor: pointer;
      color: #606266;
      transition: color 0.28s;

      &:hover {
        color: #409EFF;
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

// 子菜单样式覆盖
:deep(.el-sub-menu__title) {
  &:hover {
    background-color: #263445 !important;
  }
}

:deep(.el-menu-item) {
  &:hover {
    background-color: #263445 !important;
  }

  &.is-active {
    background-color: #409EFF !important;
  }
}

// 子菜单项缩进
:deep(.el-sub-menu .el-menu-item) {
  background-color: #1f2d3d !important;

  &:hover {
    background-color: #001528 !important;
  }

  &.is-active {
    background-color: #409EFF !important;
  }
}

// 三级菜单缩进
:deep(.el-sub-menu .el-sub-menu .el-menu-item) {
  background-color: #0a1421 !important;

  &:hover {
    background-color: #000814 !important;
  }
}
</style>