<template>
  <div class="login-container">
    <div class="login-form">
      <div class="login-header">
        <h1>叨叨管理后台</h1>
        <p>请登录您的账户</p>
      </div>

      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        label-width="0"
        size="large"
        @submit.prevent="handleLogin"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="用户名"
            clearable
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="密码"
            show-password
            @keyup.enter="handleLogin"
          />
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            size="large"
            style="width: 100%"
            :loading="loading"
            @click="handleLogin"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>

      <div class="demo-accounts">
        <h4>演示账号</h4>
        <div class="account-list">
          <div class="account-item" @click="quickLogin('admin', '平台管理员')">
            <strong>admin / 123456</strong>
            <span>平台管理员</span>
          </div>
          <div class="account-item" @click="quickLogin('manager', '区域经理')">
            <strong>manager / 123456</strong>
            <span>区域经理</span>
          </div>
          <div class="account-item" @click="quickLogin('store', '门店经理')">
            <strong>store / 123456</strong>
            <span>门店经理</span>
          </div>
          <div class="account-item" @click="quickLogin('employee', '门店员工')">
            <strong>employee / 123456</strong>
            <span>门店员工</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'

interface LoginForm {
  username: string
  password: string
}

const router = useRouter()
const loginFormRef = ref<FormInstance>()
const loading = ref(false)

// 表单数据
const loginForm = reactive<LoginForm>({
  username: '',
  password: ''
})

// 表单验证规则
const loginRules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '用户名长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ]
}

// 模拟用户数据
const mockUsers = {
  admin: {
    username: 'admin',
    name: '系统管理员',
    role: 'platform_admin',
    roleName: '平台管理员',
    permissions: ['*']
  },
  manager: {
    username: 'manager',
    name: '区域经理',
    role: 'region_manager',
    roleName: '区域经理',
    permissions: ['user:*', 'vehicle:*', 'store:*', 'order:*']
  },
  store: {
    username: 'store',
    name: '门店经理',
    role: 'store_manager',
    roleName: '门店经理',
    permissions: ['user:list', 'vehicle:*', 'store:*', 'order:*']
  },
  employee: {
    username: 'employee',
    name: '门店员工',
    role: 'store_employee',
    roleName: '门店员工',
    permissions: ['user:list', 'vehicle:list', 'order:list']
  }
}

// 登录处理
const handleLogin = async () => {
  if (!loginFormRef.value) return

  try {
    const valid = await loginFormRef.value.validate()
    if (!valid) return

    loading.value = true

    // 模拟登录请求
    await new Promise(resolve => setTimeout(resolve, 1000))

    const user = mockUsers[loginForm.username as keyof typeof mockUsers]
    if (!user || loginForm.password !== '123456') {
      ElMessage.error('用户名或密码错误')
      return
    }

    // 保存登录信息
    const token = `mock_token_${Date.now()}`
    localStorage.setItem('token', token)
    localStorage.setItem('userInfo', JSON.stringify(user))

    ElMessage.success(`登录成功，欢迎 ${user.name}`)

    // 跳转到首页
    router.push('/dashboard/overview')
  } catch (error) {
    console.error('登录失败:', error)
    ElMessage.error('登录失败，请重试')
  } finally {
    loading.value = false
  }
}

// 快速登录
const quickLogin = (username: string, roleName: string) => {
  loginForm.username = username
  loginForm.password = '123456'
  ElMessage.info(`已填充 ${roleName} 账号信息`)
}

// 自动填充上次登录的用户名
const initLastUser = () => {
  const userInfo = localStorage.getItem('userInfo')
  if (userInfo) {
    try {
      const user = JSON.parse(userInfo)
      loginForm.username = user.username || ''
    } catch (error) {
      // 忽略解析错误
    }
  }
}

// 初始化
initLastUser()
</script>

<style scoped lang="scss">
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-form {
  width: 100%;
  max-width: 400px;
  background: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.login-header {
  text-align: center;
  margin-bottom: 32px;

  h1 {
    font-size: 28px;
    color: #303133;
    margin-bottom: 8px;
  }

  p {
    color: #606266;
    font-size: 14px;
  }
}

.demo-accounts {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #e4e7ed;

  h4 {
    margin-bottom: 16px;
    color: #606266;
    font-size: 14px;
    text-align: center;
  }

  .account-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .account-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background: #f5f7fa;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s;
    font-size: 13px;

    &:hover {
      background: #e6f7ff;
      border-color: #91d5ff;
    }

    strong {
      color: #303133;
    }

    span {
      color: #409EFF;
      font-weight: 500;
    }
  }
}

// 响应式设计
@media (max-width: 480px) {
  .login-form {
    padding: 24px;
  }

  .login-header h1 {
    font-size: 24px;
  }

  .account-item {
    font-size: 12px;
  }
}
</style>