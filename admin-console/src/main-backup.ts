import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import App from './App.vue'
import router from './router'

// 创建应用实例
const app = createApp(App)

// 注册Element Plus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 使用插件
app.use(createPinia())
app.use(router)
app.use(ElementPlus)

// 权限相关导入和配置
try {
  // 动态导入权限模块
  import('./directives/permission').then(({ setupPermissionDirective }) => {
    setupPermissionDirective(app)
  }).catch(err => {
    console.warn('权限指令加载失败:', err)
  })

  import('./utils/permission').then(({ PermissionPlugin }) => {
    app.use(PermissionPlugin)
  }).catch(err => {
    console.warn('权限插件加载失败:', err)
  })

  import('./composables/useAuth').then(({ useAuth }) => {
    const { initAuth } = useAuth()
    initAuth()
  }).catch(err => {
    console.warn('认证模块加载失败:', err)
  })
} catch (error) {
  console.error('权限系统初始化失败:', error)
  // 继续启动应用，但禁用权限功能
}

// 挂载应用
app.mount('#app')