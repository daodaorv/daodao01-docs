/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// Element Plus 图标类型声明
declare module '@element-plus/icons-vue' {
  const icons: any
  export default icons
}

// 权限指令类型声明
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $permission: any
  }
}

export {}