<template>
  <div class="tag-users">
    <!-- 搜索和筛选 -->
    <div class="users-header">
      <div class="search-section">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索用户名、手机号"
          :prefix-icon="Search"
          clearable
          @input="handleSearch"
        />
      </div>
      <div class="filter-section">
        <el-select
          v-model="statusFilter"
          placeholder="用户状态"
          clearable
          @change="loadUsers"
        >
          <el-option label="全部" value="" />
          <el-option label="正常" value="active" />
          <el-option label="禁用" value="inactive" />
          <el-option label="待审核" value="pending" />
          <el-option label="已禁用" value="banned" />
        </el-select>
      </div>
    </div>

    <!-- 用户列表 -->
    <el-table
      :data="filteredUsers"
      v-loading="loading"
      row-key="id"
    >
      <el-table-column label="用户信息" width="200">
        <template #default="{ row }">
          <div class="user-info">
            <el-avatar
              :size="40"
              :src="row.avatar"
              @error="() => true"
            >
              <el-icon><User /></el-icon>
            </el-avatar>
            <div class="user-details">
              <div class="user-name">{{ row.realName || row.username }}</div>
              <div class="user-phone">{{ hidePhone(row.phone) }}</div>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="信用等级" width="120">
        <template #default="{ row }">
          <el-tag :type="getCreditTagType(row.creditLevel)">
            {{ row.creditLevel || '暂无' }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="风险等级" width="120">
        <template #default="{ row }">
          <el-tag :type="getRiskTagType(row.riskLevel)">
            {{ formatRiskLevel(row.riskLevel) }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="注册时间" width="160">
        <template #default="{ row }">
          {{ formatDate(row.createdAt, 'YYYY-MM-DD HH:mm') }}
        </template>
      </el-table-column>

      <el-table-column label="最后使用" width="160">
        <template #default="{ row }">
          {{ formatDate(row.lastUsedAt, 'YYYY-MM-DD HH:mm') }}
        </template>
      </el-table-column>

      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="getStatusTagType(row.status)">
            {{ formatUserStatus(row.status) }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="150" fixed="right">
        <template #default="{ row }">
          <el-button
            type="text"
            size="small"
            @click="viewUser(row)"
          >
            查看
          </el-button>
          <el-button
            type="text"
            size="small"
            @click="removeTagFromUser(row)"
            style="color: #f56c6c"
          >
            移除标签
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 批量操作 -->
    <div v-if="selectedUsers.length > 0" class="batch-actions">
      <div class="batch-info">
        已选择 {{ selectedUsers.length }} 个用户
      </div>
      <div class="batch-buttons">
        <el-button
          size="small"
          @click="batchRemoveTag"
          type="danger"
        >
          批量移除标签
        </el-button>
        <el-button
          size="small"
          @click="exportUsers"
        >
          导出用户
        </el-button>
      </div>
    </div>

    <!-- 分页 -->
    <div class="pagination-wrapper">
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.size"
        :total="pagination.total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, defineProps } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, User } from '@element-plus/icons-vue'
import type { UserTag, User as UserType } from '@/types/user'
import { UserApiService } from '@/api/user'
import {
  formatDate,
  hidePhone,
  formatUserStatus,
  formatRiskLevel
} from '@/utils/formatters'

// Props
interface Props {
  tag: UserTag | null
}

const props = defineProps<Props>()

// 响应式数据
const loading = ref(false)
const users = ref<UserType[]>([])
const selectedUsers = ref<UserType[]>([])
const searchKeyword = ref('')
const statusFilter = ref('')

const pagination = reactive({
  page: 1,
  size: 20,
  total: 0
})

// Computed
const filteredUsers = computed(() => {
  let result = users.value

  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(user =>
      (user.username && user.username.toLowerCase().includes(keyword)) ||
      (user.realName && user.realName.toLowerCase().includes(keyword)) ||
      (user.phone && user.phone.includes(keyword))
    )
  }

  return result
})

// Methods
const loadUsers = async () => {
  if (!props.tag) return

  loading.value = true
  try {
    // 这里需要实现获取使用指定标签的用户列表的API
    // const response = await UserApiService.getUsersByTag(props.tag.id, {
    //   page: pagination.page,
    //   size: pagination.size,
    //   status: statusFilter.value
    // })
    // users.value = response.data
    // pagination.total = response.total

    // Mock数据
    users.value = [
      {
        id: 'user1',
        username: 'zhangsan',
        realName: '张三',
        phone: '13800138001',
        avatar: '',
        creditLevel: 'A',
        riskLevel: 'low',
        status: 'active',
        createdAt: '2025-11-01T10:00:00Z',
        lastUsedAt: '2025-11-12T09:30:00Z'
      },
      {
        id: 'user2',
        username: 'lisi',
        realName: '李四',
        phone: '13800138002',
        avatar: '',
        creditLevel: 'AA',
        riskLevel: 'low',
        status: 'active',
        createdAt: '2025-11-02T14:20:00Z',
        lastUsedAt: '2025-11-11T16:45:00Z'
      },
      {
        id: 'user3',
        username: 'wangwu',
        realName: '王五',
        phone: '13800138003',
        avatar: '',
        creditLevel: 'B',
        riskLevel: 'medium',
        status: 'pending',
        createdAt: '2025-11-03T08:15:00Z',
        lastUsedAt: '2025-11-10T11:20:00Z'
      }
    ]

    pagination.total = users.value.length
  } catch (error) {
    console.error('Failed to load users:', error)
    ElMessage.error('加载用户列表失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  // 搜索逻辑已在computed中处理
}

const handleSizeChange = (size: number) => {
  pagination.size = size
  loadUsers()
}

const handleCurrentChange = (page: number) => {
  pagination.page = page
  loadUsers()
}

const viewUser = (user: UserType) => {
  // 打开用户详情页面或对话框
  ElMessage.info(`查看用户：${user.realName || user.username}`)
}

const removeTagFromUser = async (user: UserType) => {
  if (!props.tag) return

  try {
    await ElMessageBox.confirm(
      `确定要移除用户 "${user.realName || user.username}" 的标签 "${props.tag.name}" 吗？`,
      '确认移除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    // await UserApiService.removeTagFromUser(user.id, props.tag.id)
    ElMessage.success('标签移除成功')
    loadUsers()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('移除标签失败')
    }
  }
}

const batchRemoveTag = async () => {
  if (!props.tag || selectedUsers.value.length === 0) return

  try {
    await ElMessageBox.confirm(
      `确定要移除选中的 ${selectedUsers.value.length} 个用户的标签 "${props.tag.name}" 吗？`,
      '确认批量移除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    const userIds = selectedUsers.value.map(user => user.id)
    // await UserApiService.batchRemoveTagFromUsers(userIds, props.tag.id)
    ElMessage.success('批量移除标签成功')
    loadUsers()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('批量移除标签失败')
    }
  }
}

const exportUsers = () => {
  if (!props.tag) return

  try {
    // 导出用户列表逻辑
    const csvContent = generateCSV()
    downloadCSV(csvContent, `tag_users_${props.tag.name}.csv`)
    ElMessage.success('用户列表导出成功')
  } catch (error) {
    ElMessage.error('导出失败')
  }
}

const generateCSV = () => {
  if (!props.tag) return ''

  const headers = ['用户名', '真实姓名', '手机号', '信用等级', '风险等级', '状态', '注册时间']
  const rows = filteredUsers.value.map(user => [
    user.username || '',
    user.realName || '',
    hidePhone(user.phone),
    user.creditLevel || '',
    formatRiskLevel(user.riskLevel),
    formatUserStatus(user.status),
    formatDate(user.createdAt, 'YYYY-MM-DD HH:mm:ss')
  ])

  return [headers, ...rows].map(row => row.join(',')).join('\n')
}

const downloadCSV = (content: string, filename: string) => {
  const blob = new Blob(['\ufeff' + content], { type: 'text/csv;charset=utf-8' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
  URL.revokeObjectURL(link.href)
}

const getCreditTagType = (level: string) => {
  const typeMap: Record<string, string> = {
    AAA: 'success',
    AA: 'success',
    A: 'success',
    B: 'warning',
    C: 'danger',
    D: 'danger'
  }
  return typeMap[level] || 'info'
}

const getRiskTagType = (level: string) => {
  const typeMap: Record<string, string> = {
    low: 'success',
    medium: 'warning',
    high: 'danger',
    critical: 'danger'
  }
  return typeMap[level] || 'info'
}

const getStatusTagType = (status: string) => {
  const typeMap: Record<string, string> = {
    active: 'success',
    inactive: 'danger',
    pending: 'warning',
    banned: 'danger',
    audit_rejected: 'danger'
  }
  return typeMap[status] || 'info'
}

// 监听tag变化
watch(() => props.tag, (newTag) => {
  if (newTag) {
    loadUsers()
  }
}, { immediate: true })
</script>

<style scoped lang="scss">
.tag-users {
  .users-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    gap: 16px;

    .search-section {
      flex: 1;
      max-width: 300px;
    }

    .filter-section {
      min-width: 120px;
    }
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 12px;

    .user-details {
      .user-name {
        font-weight: 500;
        color: #303133;
        margin-bottom: 4px;
      }

      .user-phone {
        font-size: 12px;
        color: #909399;
      }
    }
  }

  .batch-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 16px 0;
    padding: 12px 16px;
    background-color: #fef0f0;
    border: 1px solid #fbc4c4;
    border-radius: 6px;

    .batch-info {
      color: #f56c6c;
      font-weight: 500;
    }

    .batch-buttons {
      display: flex;
      gap: 8px;
    }
  }

  .pagination-wrapper {
    display: flex;
    justify-content: center;
    margin-top: 16px;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .tag-users {
    .users-header {
      flex-direction: column;
      align-items: stretch;

      .search-section {
        max-width: 100%;
      }

      .filter-section {
        min-width: 100%;
      }
    }

    .batch-actions {
      flex-direction: column;
      gap: 8px;
      text-align: center;
    }
  }
}
</style>