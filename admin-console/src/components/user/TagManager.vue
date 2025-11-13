<template>
  <div class="tag-manager">
    <!-- 搜索和操作栏 -->
    <div class="manager-header">
      <div class="search-section">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索标签名称"
          :prefix-icon="Search"
          clearable
          @input="handleSearch"
        />
      </div>
      <div class="action-section">
        <el-button
          type="primary"
          :icon="Plus"
          @click="showCreateDialog = true"
        >
          新建标签
        </el-button>
        <el-button
          :icon="Refresh"
          @click="loadTags"
        >
          刷新
        </el-button>
      </div>
    </div>

    <!-- 标签统计 -->
    <div class="tag-stats">
      <el-row :gutter="16">
        <el-col :span="6">
          <el-statistic title="总标签数" :value="stats.total" />
        </el-col>
        <el-col :span="6">
          <el-statistic title="活跃标签" :value="stats.active" />
        </el-col>
        <el-col :span="6">
          <el-statistic title="本月新增" :value="stats.thisMonth" />
        </el-col>
        <el-col :span="6">
          <el-statistic title="使用次数" :value="stats.usageCount" />
        </el-col>
      </el-row>
    </div>

    <!-- 标签列表 -->
    <el-table
      :data="filteredTags"
      v-loading="loading"
      row-key="id"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />

      <el-table-column label="标签" width="200">
        <template #default="{ row }">
          <div class="tag-cell">
            <el-tag
              :color="row.color"
              size="small"
              style="margin-right: 8px"
            >
              {{ row.name }}
            </el-tag>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="分组" width="120">
        <template #default="{ row }">
          <el-tag size="small" type="info">
            {{ getCategoryText(row.category) }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="描述" prop="description" show-overflow-tooltip />

      <el-table-column label="使用次数" width="100" align="center">
        <template #default="{ row }">
          <el-link
            v-if="row.usageCount > 0"
            type="primary"
            @click="showUsersDialog(row)"
          >
            {{ row.usageCount }}
          </el-link>
          <span v-else>0</span>
        </template>
      </el-table-column>

      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          <el-switch
            v-model="row.enabled"
            @change="toggleTag(row)"
            :loading="row.loading"
          />
        </template>
      </el-table-column>

      <el-table-column label="创建时间" width="160">
        <template #default="{ row }">
          {{ formatDate(row.createdAt, 'YYYY-MM-DD HH:mm') }}
        </template>
      </el-table-column>

      <el-table-column label="操作" width="180" fixed="right">
        <template #default="{ row }">
          <el-button
            type="text"
            size="small"
            @click="editTag(row)"
          >
            编辑
          </el-button>
          <el-button
            type="text"
            size="small"
            @click="duplicateTag(row)"
          >
            复制
          </el-button>
          <el-button
            type="text"
            size="small"
            style="color: #f56c6c"
            @click="deleteTag(row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 批量操作 -->
    <div v-if="selectedTags.length > 0" class="batch-actions">
      <div class="batch-info">
        已选择 {{ selectedTags.length }} 个标签
      </div>
      <div class="batch-buttons">
        <el-button
          size="small"
          @click="batchEnable"
        >
          批量启用
        </el-button>
        <el-button
          size="small"
          @click="batchDisable"
        >
          批量禁用
        </el-button>
        <el-button
          type="danger"
          size="small"
          @click="batchDelete"
        >
          批量删除
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

    <!-- 创建/编辑标签对话框 -->
    <el-dialog
      v-model="showCreateDialog"
      :title="editingTag.id ? '编辑标签' : '新建标签'"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="tagFormRef"
        :model="tagForm"
        :rules="tagFormRules"
        label-width="80px"
      >
        <el-form-item label="标签名称" prop="name">
          <el-input
            v-model="tagForm.name"
            placeholder="请输入标签名称"
            maxlength="20"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="标签分组" prop="category">
          <el-select v-model="tagForm.category" placeholder="请选择分组">
            <el-option label="用户类型" value="user_type" />
            <el-option label="行为特征" value="behavior" />
            <el-option label="风险等级" value="risk" />
            <el-option label="信用等级" value="credit" />
            <el-option label="会员等级" value="membership" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>

        <el-form-item label="标签颜色" prop="color">
          <div class="color-picker">
            <div
              v-for="color in predefinedColors"
              :key="color"
              class="color-option"
              :class="{ active: tagForm.color === color }"
              :style="{ backgroundColor: color }"
              @click="tagForm.color = color"
            />
            <el-color-picker
              v-model="tagForm.color"
              show-alpha
              :predefine="predefinedColors"
              size="small"
            />
          </div>
        </el-form-item>

        <el-form-item label="标签描述" prop="description">
          <el-input
            v-model="tagForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入标签描述（可选）"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="排序权重">
          <el-input-number
            v-model="tagForm.sortOrder"
            :min="0"
            :max="9999"
            placeholder="权重，数字越大越靠前"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="showCreateDialog = false">取消</el-button>
        <el-button
          type="primary"
          :loading="submitLoading"
          @click="submitTag"
        >
          {{ editingTag.id ? '更新' : '创建' }}
        </el-button>
      </template>
    </el-dialog>

    <!-- 用户列表对话框 -->
    <el-dialog
      v-model="showUsersDialog"
      title="标签用户列表"
      width="800px"
    >
      <TagUsers :tag="selectedTagForUsers" />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, defineProps, defineEmits } from 'vue'
import { ElMessage, ElMessageBox, ElForm } from 'element-plus'
import { Search, Plus, Refresh } from '@element-plus/icons-vue'
import type { UserTag } from '@/types/user'
import { UserApiService } from '@/api/user'
import { formatDate } from '@/utils/formatters'
import TagUsers from './TagUsers.vue'

// Props
interface Props {
  userId?: string
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  'tag-created': [tag: UserTag]
  'tag-deleted': [tagId: string]
  'tag-updated': [tag: UserTag]
}>()

// Refs
const tagFormRef = ref<InstanceType<typeof ElForm>>()

// 响应式数据
const loading = ref(false)
const submitLoading = ref(false)
const tags = ref<UserTag[]>([])
const selectedTags = ref<UserTag[]>([])
const searchKeyword = ref('')
const showCreateDialog = ref(false)
const showUsersDialog = ref(false)
const selectedTagForUsers = ref<UserTag | null>(null)

const stats = reactive({
  total: 0,
  active: 0,
  thisMonth: 0,
  usageCount: 0
})

const editingTag = reactive<Partial<UserTag>>({
  id: '',
  name: '',
  category: 'other',
  color: '#409EFF',
  description: '',
  sortOrder: 0
})

const tagForm = reactive({
  name: '',
  category: 'other',
  color: '#409EFF',
  description: '',
  sortOrder: 0
})

const tagFormRules = {
  name: [
    { required: true, message: '请输入标签名称', trigger: 'blur' },
    { min: 1, max: 20, message: '标签名称长度应在1-20个字符之间', trigger: 'blur' }
  ],
  category: [
    { required: true, message: '请选择标签分组', trigger: 'change' }
  ],
  color: [
    { required: true, message: '请选择标签颜色', trigger: 'change' }
  ]
}

const pagination = reactive({
  page: 1,
  size: 20,
  total: 0
})

// 预定义颜色
const predefinedColors = [
  '#409EFF', '#67C23A', '#E6A23C', '#F56C6C', '#909399',
  '#FF7700', '#FFAA00', '#55A532', '#1890FF', '#722ED1',
  '#EB2F96', '#F5222D', '#FA8C16', '#A0D911', '#13C2C2'
]

// Computed
const filteredTags = computed(() => {
  if (!searchKeyword.value) {
    return tags.value
  }

  const keyword = searchKeyword.value.toLowerCase()
  return tags.value.filter(tag =>
    tag.name.toLowerCase().includes(keyword) ||
    tag.description?.toLowerCase().includes(keyword) ||
    getCategoryText(tag.category).includes(keyword)
  )
})

// Methods
const loadTags = async () => {
  loading.value = true
  try {
    // 这里需要实现获取标签列表的API
    // const response = await UserApiService.getTagsList({
    //   page: pagination.page,
    //   size: pagination.size
    // })
    // tags.value = response.data
    // pagination.total = response.total

    // Mock数据
    tags.value = [
      {
        id: '1',
        name: 'VIP用户',
        category: 'membership',
        color: '#FFD700',
        description: '会员等级最高的用户',
        usageCount: 156,
        enabled: true,
        sortOrder: 100,
        createdAt: '2025-11-01T10:00:00Z'
      },
      {
        id: '2',
        name: '高风险',
        category: 'risk',
        color: '#FF4D4F',
        description: '具有高风险行为的用户',
        usageCount: 23,
        enabled: true,
        sortOrder: 90,
        createdAt: '2025-11-02T15:30:00Z'
      },
      {
        id: '3',
        name: '信用优秀',
        category: 'credit',
        color: '#52C41A',
        description: '信用评分优秀的用户',
        usageCount: 89,
        enabled: true,
        sortOrder: 80,
        createdAt: '2025-11-03T09:15:00Z'
      }
    ]

    pagination.total = tags.value.length

    // 更新统计数据
    updateStats()
  } catch (error) {
    console.error('Failed to load tags:', error)
    ElMessage.error('加载标签列表失败')
  } finally {
    loading.value = false
  }
}

const updateStats = () => {
  stats.total = tags.value.length
  stats.active = tags.value.filter(tag => tag.enabled).length
  stats.usageCount = tags.value.reduce((sum, tag) => sum + (tag.usageCount || 0), 0)

  // 计算本月新增（模拟）
  const currentMonth = new Date().getMonth()
  stats.thisMonth = tags.value.filter(tag => {
    const tagMonth = new Date(tag.createdAt).getMonth()
    return tagMonth === currentMonth
  }).length
}

const handleSearch = () => {
  // 搜索逻辑已在computed中处理
}

const handleSelectionChange = (selection: UserTag[]) => {
  selectedTags.value = selection
}

const handleSizeChange = (size: number) => {
  pagination.size = size
  loadTags()
}

const handleCurrentChange = (page: number) => {
  pagination.page = page
  loadTags()
}

const editTag = (tag: UserTag) => {
  Object.assign(editingTag, tag)
  Object.assign(tagForm, {
    name: tag.name,
    category: tag.category,
    color: tag.color,
    description: tag.description || '',
    sortOrder: tag.sortOrder || 0
  })
  showCreateDialog.value = true
}

const duplicateTag = (tag: UserTag) => {
  Object.assign(tagForm, {
    name: `${tag.name} - 副本`,
    category: tag.category,
    color: tag.color,
    description: tag.description,
    sortOrder: tag.sortOrder || 0
  })
  Object.assign(editingTag, {})
  showCreateDialog.value = true
}

const deleteTag = async (tag: UserTag) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除标签 "${tag.name}" 吗？删除后将无法恢复，且会影响所有使用此标签的用户。`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    // await UserApiService.deleteTag(tag.id)
    ElMessage.success('标签删除成功')
    emit('tag-deleted', tag.id)
    loadTags()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const submitTag = async () => {
  if (!tagFormRef.value) return

  try {
    await tagFormRef.value.validate()

    submitLoading.value = true

    if (editingTag.id) {
      // 更新标签
      // await UserApiService.updateTag(editingTag.id, tagForm)
      ElMessage.success('标签更新成功')
    } else {
      // 创建标签
      const newTag = await UserApiService.createTag(tagForm)
      ElMessage.success('标签创建成功')
      emit('tag-created', newTag)
    }

    showCreateDialog.value = false
    loadTags()
  } catch (error: any) {
    if (error.message) {
      ElMessage.error(error.message)
    }
  } finally {
    submitLoading.value = false
  }
}

const toggleTag = async (tag: UserTag) => {
  tag.loading = true
  try {
    // await UserApiService.updateTag(tag.id, { enabled: tag.enabled })
    ElMessage.success(`标签已${tag.enabled ? '启用' : '禁用'}`)
  } catch (error) {
    tag.enabled = !tag.enabled // 恢复原状态
    ElMessage.error('操作失败')
  } finally {
    tag.loading = false
  }
}

const batchEnable = async () => {
  try {
    const tagIds = selectedTags.value.map(tag => tag.id)
    // await UserApiService.batchUpdateTags(tagIds, { enabled: true })
    ElMessage.success('批量启用成功')
    loadTags()
  } catch (error) {
    ElMessage.error('批量启用失败')
  }
}

const batchDisable = async () => {
  try {
    const tagIds = selectedTags.value.map(tag => tag.id)
    // await UserApiService.batchUpdateTags(tagIds, { enabled: false })
    ElMessage.success('批量禁用成功')
    loadTags()
  } catch (error) {
    ElMessage.error('批量禁用失败')
  }
}

const batchDelete = async () => {
  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${selectedTags.value.length} 个标签吗？`,
      '确认批量删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    const tagIds = selectedTags.value.map(tag => tag.id)
    // await UserApiService.batchDeleteTags(tagIds)
    ElMessage.success('批量删除成功')
    tagIds.forEach(id => emit('tag-deleted', id))
    loadTags()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('批量删除失败')
    }
  }
}

const showUsersDialog = (tag: UserTag) => {
  selectedTagForUsers.value = tag
  showUsersDialog.value = true
}

const getCategoryText = (category: string) => {
  const categoryMap: Record<string, string> = {
    user_type: '用户类型',
    behavior: '行为特征',
    risk: '风险等级',
    credit: '信用等级',
    membership: '会员等级',
    other: '其他'
  }
  return categoryMap[category] || category
}

// 生命周期
onMounted(() => {
  loadTags()
})
</script>

<style scoped lang="scss">
.tag-manager {
  .manager-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    gap: 16px;

    .search-section {
      flex: 1;
      max-width: 300px;
    }

    .action-section {
      display: flex;
      gap: 8px;
    }
  }

  .tag-stats {
    margin-bottom: 16px;
    padding: 16px;
    background-color: #f8f9fa;
    border-radius: 8px;
  }

  .tag-cell {
    display: flex;
    align-items: center;
  }

  .batch-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 16px 0;
    padding: 12px 16px;
    background-color: #e6f7ff;
    border: 1px solid #91d5ff;
    border-radius: 6px;

    .batch-info {
      color: #1890ff;
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

  .color-picker {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;

    .color-option {
      width: 20px;
      height: 20px;
      border-radius: 4px;
      cursor: pointer;
      border: 2px solid transparent;

      &.active {
        border-color: #409EFF;
        box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
      }

      &:hover {
        transform: scale(1.1);
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .tag-manager {
    .manager-header {
      flex-direction: column;
      align-items: stretch;

      .search-section {
        max-width: 100%;
      }

      .action-section {
        justify-content: center;
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