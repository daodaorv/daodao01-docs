<template>
  <template v-if="menu.children && menu.children.length > 0">
    <!-- 有子菜单的情况 -->
    <el-sub-menu :index="menu.id">
      <template #title>
        <el-icon v-if="menu.icon">
          <component :is="menu.icon" />
        </el-icon>
        <span>{{ menu.title }}</span>
      </template>

      <sidebar-menu-item
        v-for="child in menu.children"
        :key="child.id"
        :menu="child"
        :base-path="resolvePath(child.path)"
      />
    </el-sub-menu>
  </template>

  <template v-else>
    <!-- 没有子菜单的情况 -->
    <el-menu-item :index="menu.path" @click="handleMenuClick(menu)">
      <el-icon v-if="menu.icon">
        <component :is="menu.icon" />
      </el-icon>
      <template #title>
        <span>{{ menu.title }}</span>
      </template>
    </el-menu-item>
  </template>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { MenuItem } from '@/types/menu'

interface Props {
  menu: MenuItem
  basePath?: string
}

const props = withDefaults(defineProps<Props>(), {
  basePath: ''
})

const route = useRoute()
const router = useRouter()

// 解析路径
const resolvePath = (path?: string) => {
  if (!path) return ''

  if (path.startsWith('/')) {
    return path
  }

  return `${props.basePath}/${path}`.replace(/\/+/g, '/')
}

// 处理菜单点击
const handleMenuClick = (menu: MenuItem) => {
  if (menu.path) {
    router.push(menu.path)
  }
}
</script>

<style scoped lang="scss">
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