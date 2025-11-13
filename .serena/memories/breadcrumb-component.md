<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="item.path">
        <span
          v-if="index === breadcrumbs.length - 1"
          class="no-redirect"
        >
          {{ item.title }}
        </span>
        <a
          v-else
          class="redirect"
          @click.prevent="handleLink(item)"
        >
          {{ item.title }}
        </a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

interface BreadcrumbItem {
  title: string
  path: string
  redirect?: string
}

const route = useRoute()
const router = useRouter()
const breadcrumbs = ref<BreadcrumbItem[]>([])

// 菜单映射关系
const menuMap: Record<string, string> = {
  'dashboard': '数据分析',
  'overview': '数据概览',
  'core-business': '核心业务管理',
  'user-manage': '用户管理',
  'vehicle-manage': '车辆管理',
  'order-manage': '订单管理',
  'marketing': '营销运营管理'
}

// 获取面包屑数据
const getBreadcrumb = () => {
  const pathArray = route.path.split('/').filter(item => item)
  const breadcrumbArray: BreadcrumbItem[] = []

  breadcrumbArray.push({
    title: '首页',
    path: '/dashboard/overview'
  })

  pathArray.forEach((item, index) => {
    const title = menuMap[item] || item
    const path = '/' + pathArray.slice(0, index + 1).join('/')

    breadcrumbArray.push({
      title,
      path,
      redirect: path
    })
  })

  breadcrumbs.value = breadcrumbArray
}

// 处理链接点击
const handleLink = (item: BreadcrumbItem) => {
  router.push(item.redirect || item.path)
}

watch(() => route.path, getBreadcrumb, { immediate: true })
</script>

<style scoped lang="scss">
.app-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 60px;
  margin-left: 8px;
}

.no-redirect {
  color: #97a8be;
  cursor: text;
}

.redirect {
  color: #666;
  cursor: pointer;
  &:hover {
    color: #409EFF;
  }
}
</style>