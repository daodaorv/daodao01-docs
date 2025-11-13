<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <el-breadcrumb-item :to="{ path: '/dashboard/overview' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>{{ currentPageTitle }}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const currentPageTitle = computed(() => {
  const pathMap: Record<string, string> = {
    '/dashboard/overview': '数据概览',
    '/dashboard/todo': '今日待办',
    '/dashboard/quick': '快捷操作'
  }
  return pathMap[route.path] || '页面'
})
</script>

<style scoped>
.app-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 60px;
  margin-left: 8px;
}
</style>