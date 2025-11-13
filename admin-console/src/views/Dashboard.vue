<template>
  <div class="dashboard-container">
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px" class="sidebar">
        <div class="logo">
          <h2>叨叨管理</h2>
        </div>
        <el-menu
          :default-active="$route.path"
          class="sidebar-menu"
          router
        >
          <el-menu-item index="/dashboard">
            <el-icon><DataBoard /></el-icon>
            <span>仪表盘</span>
          </el-menu-item>

          <el-sub-menu index="content">
            <template #title>
              <el-icon><Document /></el-icon>
              <span>内容管理</span>
            </template>
            <el-menu-item index="/content/articles">文章管理</el-menu-item>
            <el-menu-item index="/content/categories">分类管理</el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="user">
            <template #title>
              <el-icon><User /></el-icon>
              <span>用户管理</span>
            </template>
            <el-menu-item index="/user/list">用户列表</el-menu-item>
            <el-menu-item index="/user/admin">管理员</el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-aside>

      <!-- 主内容区 -->
      <el-container>
        <!-- 头部 -->
        <el-header class="header">
          <div class="header-left">
            <el-button text @click="toggleSidebar">
              <el-icon><Menu /></el-icon>
            </el-button>
            <el-breadcrumb separator="/">
              <el-breadcrumb-item>首页</el-breadcrumb-item>
              <el-breadcrumb-item>仪表盘</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <div class="header-right">
            <el-dropdown>
              <span class="user-info">
                <el-avatar :size="32" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
                <span class="username">管理员</span>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>个人中心</el-dropdown-item>
                  <el-dropdown-item divided>退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-header>

        <!-- 主要内容 -->
        <el-main class="main-content">
          <div class="welcome-section">
            <el-card class="welcome-card">
              <template #header>
                <div class="card-header">
                  <span>欢迎使用叨叨管理后台</span>
                  <el-button type="primary">开始使用</el-button>
                </div>
              </template>

              <div class="stats-grid">
                <div class="stat-item">
                  <div class="stat-number">1,234</div>
                  <div class="stat-label">总用户数</div>
                </div>
                <div class="stat-item">
                  <div class="stat-number">567</div>
                  <div class="stat-label">文章总数</div>
                </div>
                <div class="stat-item">
                  <div class="stat-number">890</div>
                  <div class="stat-label">评论总数</div>
                </div>
                <div class="stat-item">
                  <div class="stat-number">12</div>
                  <div class="stat-label">管理员数</div>
                </div>
              </div>
            </el-card>

            <el-row :gutter="20" class="info-cards">
              <el-col :span="12">
                <el-card>
                  <template #header>
                    <span>快速操作</span>
                  </template>
                  <div class="quick-actions">
                    <el-button type="primary" :icon="Plus">新建文章</el-button>
                    <el-button type="success" :icon="User">用户管理</el-button>
                    <el-button type="warning" :icon="Setting">系统设置</el-button>
                  </div>
                </el-card>
              </el-col>
              <el-col :span="12">
                <el-card>
                  <template #header>
                    <span>系统信息</span>
                  </template>
                  <div class="system-info">
                    <p><strong>版本:</strong> v1.0.0</p>
                    <p><strong>运行时间:</strong> 2天3小时</p>
                    <p><strong>服务器:</strong> 正常运行</p>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  DataBoard,
  Document,
  User,
  Menu,
  Plus,
  Setting
} from '@element-plus/icons-vue'

const collapsed = ref(false)

const toggleSidebar = () => {
  collapsed.value = !collapsed.value
}
</script>

<style scoped>
.dashboard-container {
  height: 100vh;
}

.sidebar {
  background-color: #001529;
  color: white;
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #1f2937;
}

.logo h2 {
  color: white;
  font-size: 18px;
  margin: 0;
}

.sidebar-menu {
  border: none;
  background-color: #001529;
}

.header {
  background-color: #fff;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.username {
  color: #606266;
}

.main-content {
  background-color: #f5f5f5;
  padding: 20px;
}

.welcome-section {
  max-width: 1200px;
  margin: 0 auto;
}

.welcome-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.stat-item {
  text-align: center;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 8px;
}

.stat-number {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  opacity: 0.9;
}

.info-cards {
  margin-top: 20px;
}

.quick-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.system-info p {
  margin: 8px 0;
  color: #606266;
}
</style>