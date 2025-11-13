<template>
  <div class="user-table">
    <el-table
      ref="tableRef"
      v-loading="loading"
      :data="users"
      :height="height"
      :stripe="stripe"
      :border="border"
      :row-key="rowKey"
      :default-sort="defaultSort"
      :show-header="showHeader"
      :highlight-current-row="highlightCurrentRow"
      :empty-text="emptyText"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      @row-click="handleRowClick"
      @sort-change="handleSortChange"
    >
      <!-- 选择列 -->
      <el-table-column
        v-if="showSelection"
        type="selection"
        width="55"
        :selectable="selectable"
        :reserve-selection="true"
      />

      <!-- 用户头像列 -->
      <el-table-column
        label="头像"
        width="80"
        align="center"
        fixed="left"
      >
        <template #default="{ row }">
          <el-avatar
            :size="40"
            :src="row.avatar"
            @error="handleAvatarError"
          >
            {{ row.realName?.charAt(0) || row.username?.charAt(0) }}
          </el-avatar>
        </template>
      </el-table-column>

      <!-- 用户基本信息列 -->
      <el-table-column
        label="用户信息"
        min-width="200"
        fixed="left"
      >
        <template #default="{ row }">
          <div class="user-info">
            <div class="user-name">{{ row.realName || row.username }}</div>
            <div class="user-phone">{{ row.phone }}</div>
            <div class="user-email" v-if="row.email">{{ row.email }}</div>
          </div>
        </template>
      </el-table-column>

      <!-- 状态列 -->
      <el-table-column
        label="状态"
        width="100"
        align="center"
        prop="status"
        sortable="custom"
      >
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)" size="small">
            {{ getStatusText(row.status) }}
          </el-tag>
        </template>
      </el-table-column>

      <!-- 信用等级列 -->
      <el-table-column
        label="信用等级"
        width="120"
        align="center"
        prop="creditLevel"
        sortable="custom"
      >
        <template #default="{ row }">
          <div class="credit-info">
            <el-tag :type="getCreditLevelType(row.creditLevel)" size="small">
              {{ row.creditLevel }}
            </el-tag>
            <div class="credit-score">{{ row.creditScore }}分</div>
          </div>
        </template>
      </el-table-column>

      <!-- 风险等级列 -->
      <el-table-column
        label="风险等级"
        width="100"
        align="center"
        prop="riskLevel"
        sortable="custom"
      >
        <template #default="{ row }">
          <el-tag :type="getRiskLevelType(row.riskLevel)" size="small">
            {{ getRiskLevelText(row.riskLevel) }}
          </el-tag>
        </template>
      </el-table-column>

      <!-- 注册时间列 -->
      <el-table-column
        label="注册时间"
        width="180"
        prop="registerTime"
        sortable="custom"
      >
        <template #default="{ row }">
          {{ formatDateTime(row.registerTime) }}
        </template>
      </el-table-column>

      <!-- 最后登录时间列 -->
      <el-table-column
        label="最后登录"
        width="180"
        prop="lastLoginTime"
        sortable="custom"
      >
        <template #default="{ row }">
          {{ formatDateTime(row.lastLoginTime) }}
        </template>
      </el-table-column>

      <!-- 用户标签列 -->
      <el-table-column
        label="标签"
        width="200"
      >
        <template #default="{ row }">
          <div class="user-tags">
            <el-tag
              v-for="tag in row.tags.slice(0, 3)"
              :key="tag.id"
              :color="tag.color"
              size="small"
              class="tag-item"
            >
              {{ tag.name }}
            </el-tag>
            <el-tag
              v-if="row.tags.length > 3"
              type="info"
              size="small"
            >
              +{{ row.tags.length - 3 }}
            </el-tag>
          </div>
        </template>
      </el-table-column>

      <!-- 操作列 -->
      <el-table-column
        v-if="showActions"
        label="操作"
        width="200"
        align="center"
        fixed="right"
      >
        <template #default="{ row }">
          <div class="action-buttons">
            <el-button
              type="primary"
              size="small"
              link
              @click="handleViewDetail(row)"
            >
              详情
            </el-button>
            <el-button
              type="success"
              size="small"
              link
              @click="handleEdit(row)"
            >
              编辑
            </el-button>
            <el-dropdown
              trigger="click"
              @command="handleCommand"
            >
              <el-button
                type="info"
                size="small"
                link
              >
                更多
                <el-icon class="el-icon--right">
                  <arrow-down />
                </el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    :command="{ action: 'audit', user: row }"
                    v-if="row.status === 'pending'"
                  >
                    审核用户
                  </el-dropdown-item>
                  <el-dropdown-item
                    :command="{ action: 'credit', user: row }"
                  >
                    信用评估
                  </el-dropdown-item>
                  <el-dropdown-item
                    :command="{ action: 'risk', user: row }"
                  >
                    风控管理
                  </el-dropdown-item>
                  <el-dropdown-item
                    :command="{ action: 'blacklist', user: row }"
                    v-if="row.status !== 'banned'"
                  >
                    加入黑名单
                  </el-dropdown-item>
                  <el-dropdown-item
                    :command="{ action: 'delete', user: row }"
                    divided
                  >
                    删除用户
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <div v-if="showPagination" class="pagination-wrapper">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="pageSizes"
        :total="total"
        :layout="paginationLayout"
        :background="background"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowDown } from '@element-plus/icons-vue'
import type { User, UserTableProps, UserTableEvents } from '@/types/user'
import { formatDate } from '@/utils/formatters'

// Props定义
const props = withDefaults(defineProps<UserTableProps>(), {
  loading: false,
  selection: () => [],
  selectable: () => true,
  showActions: true,
  height: 500,
  showSelection: true,
  stripe: true,
  border: true,
  showHeader: true,
  highlightCurrentRow: true,
  emptyText: '暂无数据'
})

// Emits定义
const emit = defineEmits<UserTableEvents>()

// Refs
const tableRef = ref()
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// Computed
const defaultSort = computed(() => ({
  prop: 'registerTime',
  order: 'descending'
}))

const rowKey = computed(() => 'id')

const pageSizes = computed(() => [10, 20, 50, 100])
const paginationLayout = computed(() => 'total, sizes, prev, pager, next, jumper')
const background = computed(() => true)

// Watch props变化
watch(() => props.selection, (newVal) => {
  // 这里可以添加选择同步逻辑
}, { deep: true })

// 状态类型映射
const getStatusType = (status: string) => {
  const typeMap: Record<string, string> = {
    active: 'success',
    inactive: 'warning',
    pending: 'info',
    banned: 'danger',
    audit_rejected: 'danger'
  }
  return typeMap[status] || 'info'
}

const getStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    active: '正常',
    inactive: '禁用',
    pending: '待审核',
    banned: '已禁用',
    audit_rejected: '审核不通过'
  }
  return textMap[status] || status
}

// 信用等级类型映射
const getCreditLevelType = (level: string) => {
  const typeMap: Record<string, string> = {
    AAA: 'success',
    AA: 'success',
    A: 'primary',
    B: 'warning',
    C: 'warning',
    D: 'danger'
  }
  return typeMap[level] || 'info'
}

// 风险等级类型映射
const getRiskLevelType = (level: string) => {
  const typeMap: Record<string, string> = {
    low: 'success',
    medium: 'warning',
    high: 'danger',
    critical: 'danger'
  }
  return typeMap[level] || 'info'
}

const getRiskLevelText = (level: string) => {
  const textMap: Record<string, string> = {
    low: '低风险',
    medium: '中风险',
    high: '高风险',
    critical: '严重风险'
  }
  return textMap[level] || level
}

// 格式化日期时间
const formatDateTime = (date: string | Date) => {
  return formatDate(date, 'YYYY-MM-DD HH:mm:ss')
}

// 处理头像加载错误
const handleAvatarError = (e: Event) => {
  const target = e.target as HTMLImageElement
  target.src = '' // 清空src，显示默认头像
}

// 事件处理
const handleSelectionChange = (selection: User[]) => {
  emit('selection-change', selection)
}

const handleRowClick = (row: User) => {
  emit('row-click', row)
}

const handleSortChange = (sort: { prop: string; order: string }) => {
  emit('sort-change', sort)
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  emit('pagination-change', { page: currentPage.value, pageSize: size })
}

const handleCurrentChange = (page: number) => {
  currentPage.value = page
  emit('pagination-change', { page, pageSize: pageSize.value })
}

// 操作按钮事件
const handleViewDetail = (user: User) => {
  emit('view-detail', user)
}

const handleEdit = (user: User) => {
  emit('edit-user', user)
}

const handleCommand = (command: { action: string; user: User }) => {
  const { action, user: userData } = command

  switch (action) {
    case 'audit':
      emit('audit-user', userData)
      break
    case 'credit':
      emit('credit-manage', userData)
      break
    case 'risk':
      emit('risk-manage', userData)
      break
    case 'blacklist':
      handleBlacklist(userData)
      break
    case 'delete':
      handleDelete(userData)
      break
    default:
      console.warn(`Unknown action: ${action}`)
  }
}

// 加入黑名单处理
const handleBlacklist = async (user: User) => {
  try {
    await ElMessageBox.confirm(
      `确定要将用户"${user.realName || user.username}"加入黑名单吗？`,
      '确认操作',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    emit('blacklist-user', user)
  } catch {
    // 用户取消
  }
}

// 删除用户处理
const handleDelete = async (user: User) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除用户"${user.realName || user.username}"吗？此操作不可恢复！`,
      '确认删除',
      {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    emit('delete-user', user)
  } catch {
    // 用户取消
  }
}

// 公开方法
const clearSelection = () => {
  tableRef.value?.clearSelection()
}

const toggleRowSelection = (row: User) => {
  tableRef.value?.toggleRowSelection(row)
}

const toggleAllSelection = () => {
  tableRef.value?.toggleAllSelection()
}

const setCurrentRow = (row: User) => {
  tableRef.value?.setCurrentRow(row)
}

const clearSort = () => {
  tableRef.value?.clearSort()
}

// 导出方法供父组件使用
defineExpose({
  clearSelection,
  toggleRowSelection,
  toggleAllSelection,
  setCurrentRow,
  clearSort,
  tableRef
})
</script>

<style scoped lang="scss">
.user-table {
  .user-info {
    .user-name {
      font-weight: 500;
      color: #303133;
      margin-bottom: 4px;
    }

    .user-phone {
      font-size: 12px;
      color: #606266;
      margin-bottom: 2px;
    }

    .user-email {
      font-size: 12px;
      color: #909399;
    }
  }

  .credit-info {
    .credit-score {
      font-size: 12px;
      color: #606266;
      margin-top: 2px;
    }
  }

  .user-tags {
    .tag-item {
      margin-right: 4px;
      margin-bottom: 4px;
    }
  }

  .action-buttons {
    display: flex;
    gap: 4px;
    justify-content: center;
  }

  .pagination-wrapper {
    display: flex;
    justify-content: center;
    margin-top: 20px;
    padding: 20px 0;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .user-table {
    :deep(.el-table__fixed-right) {
      right: 0 !important;
    }
  }
}
</style>