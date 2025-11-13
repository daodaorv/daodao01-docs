<template>
  <div class="simple-dashboard">
    <div class="dashboard-header">
      <h1>叨叨房车管理后台</h1>
      <p>菜单架构演示页面</p>
    </div>

    <div class="user-info-card">
      <el-card title="当前用户信息">
        <div v-if="currentUser">
          <p><strong>用户名:</strong> {{ currentUser.username }}</p>
          <p><strong>姓名:</strong> {{ currentUser.name }}</p>
          <p><strong>角色:</strong> {{ getRoleDisplayName(currentUser.role) }}</p>
          <p><strong>权限数量:</strong> {{ currentUser.permissions?.length || 0 }}</p>
        </div>
        <div v-else>
          <p>未登录</p>
          <el-button type="primary" @click="goToLogin">前往登录</el-button>
        </div>
      </el-card>
    </div>

    <div class="menu-demo-card">
      <el-card title="菜单架构演示">
        <div class="menu-structure">
          <h3>四大功能模块</h3>
          <el-row :gutter="20">
            <el-col :span="6" v-for="module in menuModules" :key="module.id">
              <div class="module-card">
                <div class="module-icon">
                  <span class="icon-placeholder">{{ module.icon }}</span>
                </div>
                <h4>{{ module.title }}</h4>
                <p>{{ module.description }}</p>
                <div class="module-stats">
                  <el-tag size="small">{{ module.childCount }} 个子模块</el-tag>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>

        <div class="role-demo">
          <h3>角色权限体系</h3>
          <el-table :data="roleData" style="width: 100%">
            <el-table-column prop="role" label="角色" width="120" />
            <el-table-column prop="dataScope" label="数据权限" width="120" />
            <el-table-column prop="description" label="职责描述" />
            <el-table-column label="状态">
              <template #default="scope">
                <el-tag :type="scope.row.current ? 'success' : 'info'">
                  {{ scope.row.current ? '当前角色' : '其他角色' }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div class="menu-tree-demo">
          <h3>菜单结构预览</h3>
          <el-collapse v-model="activeCollapse">
            <el-collapse-item title="核心业务管理" name="core">
              <div class="menu-list">
                <div class="menu-item">👥 用户管理 (用户列表、注册审核、标签管理、信用评估、风控管理、黑名单)</div>
                <div class="menu-item">🚗 车辆管理 (车型库管理、车辆列表、车辆状态、维保管理、保险管理、违章管理)</div>
                <div class="menu-item">🏪 门店管理 (门店列表、门店设置、服务配置、城市管理、区域管理)</div>
                <div class="menu-item">📋 订单管理 (订单列表、订单详情、异常处理、退款管理、评价管理)</div>
                <div class="menu-item">💰 众筹管理 (众筹项目、车辆关联、份额管理、份额交易)</div>
                <div class="menu-item">🤝 合作管理 (合作商管理、合作车辆、供应商管理、结算管理)</div>
                <div class="menu-item">⛺ 营地管理 (营地列表、营地设置、预订管理、咨询配置)</div>
              </div>
            </el-collapse-item>
            <el-collapse-item title="营销运营管理" name="marketing">
              <div class="menu-list">
                <div class="menu-item">🎯 营销管理 (价格策略、优惠券管理、营销活动、特惠套餐、定制旅游、增值费用管理)</div>
                <div class="menu-item">🌐 社区管理 (内容审核、社区配置、举报处理、内容管理)</div>
                <div class="menu-item">📞 客服管理 (客服配置、工单管理、质量监控、知识库)</div>
                <div class="menu-item">💸 分润管理 (众筹分润、差价分润、员工激励、推广分润、分润配置、结算管理、提现审核)</div>
              </div>
            </el-collapse-item>
            <el-collapse-item title="系统管理" name="system">
              <div class="menu-list">
                <div class="menu-item">👤 员工管理 (员工列表、角色分配、门店员工、客服人员、绩效管理)</div>
                <div class="menu-item">🔐 权限管理 (角色管理、权限配置、菜单权限、数据权限、操作日志)</div>
                <div class="menu-item">⚙️ 系统管理 (系统配置、参数设置、智能预警、系统监控、审计日志、数据备份)</div>
              </div>
            </el-collapse-item>
            <el-collapse-item title="数据分析" name="data">
              <div class="menu-list">
                <div class="menu-item">🏠 工作台 (数据概览、今日待办、快捷操作)</div>
                <div class="menu-item">💰 财务管理 (收入统计、支出管理、对账结算、财务报表、发票管理)</div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>

        <div class="action-buttons">
          <el-button type="primary" @click="simulateLogin">模拟登录</el-button>
          <el-button @click="clearUserInfo">清除用户信息</el-button>
          <el-button type="warning" @click="goToLogin">前往登录页</el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

interface UserInfo {
  username: string
  name: string
  role: string
  roleName: string
  permissions: string[]
}

const router = useRouter()
const currentUser = ref<UserInfo | null>(null)
const activeCollapse = ref(['core'])

// 菜单模块数据
const menuModules = ref([
  {
    id: 'core-business',
    title: '核心业务管理',
    icon: '🏪',
    description: '用户、车辆、门店、订单等核心业务',
    childCount: 7
  },
  {
    id: 'marketing',
    title: '营销运营管理',
    icon: '🎯',
    description: '营销活动、社区管理、客服、分润',
    childCount: 4
  },
  {
    id: 'system',
    title: '系统管理',
    icon: '⚙️',
    description: '员工、权限、系统配置管理',
    childCount: 3
  },
  {
    id: 'data-analysis',
    title: '数据分析',
    icon: '📊',
    description: '工作台、财务管理',
    childCount: 2
  }
])

// 角色权限数据
const roleData = ref([
  {
    role: '平台管理员',
    dataScope: '全部数据',
    description: '系统配置、全局管理权限',
    current: false
  },
  {
    role: '区域经理',
    dataScope: '区域数据',
    description: '区域运营、跨门店协调权限',
    current: false
  },
  {
    role: '门店经理',
    dataScope: '门店数据',
    description: '门店运营、员工管理权限',
    current: false
  },
  {
    role: '门店员工',
    dataScope: '个人数据',
    description: '基础操作、任务处理权限',
    current: false
  }
])

// 方法
const initUserInfo = () => {
  const userInfo = localStorage.getItem('userInfo')
  if (userInfo) {
    try {
      currentUser.value = JSON.parse(userInfo)
      // 更新角色数据中的当前状态
      roleData.value.forEach(role => {
        role.current = role.role === currentUser.value?.roleName
      })
    } catch (error) {
      console.error('用户信息解析失败:', error)
    }
  }
}

const getRoleDisplayName = (role: string) => {
  const roleMap: Record<string, string> = {
    'platform_admin': '平台管理员',
    'region_manager': '区域经理',
    'store_manager': '门店经理',
    'store_employee': '门店员工'
  }
  return roleMap[role] || role
}

const goToLogin = () => {
  router.push('/login')
}

const simulateLogin = () => {
  // 模拟不同角色的登录
  const roles = ['平台管理员', '区域经理', '门店经理', '门店员工']
  const randomRole = roles[Math.floor(Math.random() * roles.length)]

  const mockUser: UserInfo = {
    username: 'demo_user',
    name: '演示用户',
    role: 'platform_admin',
    roleName: randomRole,
    permissions: ['*']
  }

  localStorage.setItem('token', 'mock_token_' + Date.now())
  localStorage.setItem('userInfo', JSON.stringify(mockUser))

  currentUser.value = mockUser
  roleData.value.forEach(role => {
    role.current = role.role === mockUser.roleName
  })

  ElMessage.success(`模拟登录成功 - 角色：${randomRole}`)
}

const clearUserInfo = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('userInfo')
  currentUser.value = null
  roleData.value.forEach(role => {
    role.current = false
  })
  ElMessage.success('用户信息已清除')
}

onMounted(() => {
  initUserInfo()
})
</script>

<style scoped lang="scss">
.simple-dashboard {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.dashboard-header {
  text-align: center;
  margin-bottom: 32px;

  h1 {
    font-size: 32px;
    color: #303133;
    margin-bottom: 8px;
  }

  p {
    color: #606266;
    font-size: 16px;
  }
}

.user-info-card,
.menu-demo-card {
  margin-bottom: 24px;
}

.menu-structure {
  margin-bottom: 32px;

  h3 {
    margin-bottom: 16px;
    color: #303133;
  }

  .module-card {
    padding: 20px;
    border: 1px solid #e4e7ed;
    border-radius: 8px;
    text-align: center;
    transition: all 0.3s;

    &:hover {
      border-color: #409EFF;
      box-shadow: 0 2px 12px rgba(64, 158, 255, 0.1);
    }

    .module-icon {
      margin-bottom: 12px;
      font-size: 32px;
    }

    h4 {
      margin: 8px 0;
      color: #303133;
    }

    p {
      color: #606266;
      font-size: 14px;
      margin-bottom: 12px;
    }

    .module-stats {
      .el-tag {
        background-color: #ecf5ff;
        border-color: #b3d8ff;
        color: #409EFF;
      }
    }
  }
}

.role-demo,
.menu-tree-demo {
  margin-bottom: 24px;

  h3 {
    margin-bottom: 16px;
    color: #303133;
  }
}

.menu-list {
  .menu-item {
    padding: 8px 12px;
    margin-bottom: 4px;
    background-color: #f5f7fa;
    border-radius: 4px;
    font-size: 14px;
    color: #606266;
    border-left: 3px solid #409EFF;
  }
}

.action-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 24px;
}

@media (max-width: 768px) {
  .simple-dashboard {
    padding: 16px;
  }

  .dashboard-header h1 {
    font-size: 24px;
  }

  .module-card {
    margin-bottom: 16px;
  }

  .action-buttons {
    flex-direction: column;
  }
}
</style>