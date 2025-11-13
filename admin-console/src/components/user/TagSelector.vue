<template>
  <div class="tag-selector">
    <!-- 选择器主体 -->
    <div class="selector-main">
      <el-select
        ref="selectRef"
        v-model="selectedTagIds"
        :multiple="multiple"
        :filterable="filterable"
        :clearable="clearable"
        :placeholder="placeholder"
        :disabled="disabled"
        :loading="loading"
        :remote="remoteSearch"
        :remote-method="handleRemoteSearch"
        :collapse-tags="collapseTags"
        :collapse-tags-tooltip="collapseTagsTooltip"
        :max-collapse-tags="maxCollapseTags"
        @change="handleChange"
        @clear="handleClear"
        @remove-tag="handleRemoveTag"
        @visible-change="handleVisibleChange"
        class="tag-select"
      >
        <template #default>
          <!-- 标签选项 -->
          <el-option-group
            v-for="group in tagGroups"
            :key="group.name"
            :label="group.label"
          >
            <el-option
              v-for="tag in group.tags"
              :key="tag.id"
              :label="tag.name"
              :value="tag.id"
              :disabled="tag.disabled"
            >
              <div class="tag-option">
                <el-tag
                  :color="tag.color"
                  size="small"
                  style="margin-right: 8px"
                >
                  {{ tag.name }}
                </el-tag>
                <span class="tag-desc">{{ tag.description }}</span>
                <span v-if="showUsageCount" class="tag-count">({{ tag.usageCount || 0 }})</span>
              </div>
            </el-option>
          </el-option-group>

          <!-- 无结果时的提示 -->
          <template v-if="!tagGroups.length && !loading">
            <div class="no-results">
              <el-icon><Search /></el-icon>
              <span v-if="searchKeyword">未找到匹配的标签</span>
              <span v-else>暂无可用标签</span>
            </div>
          </template>
        </template>

        <!-- 扩展操作 -->
        <template v-if="allowCreate && showCreateButton" #footer>
          <div class="create-section">
            <el-divider style="margin: 8px 0" />
            <div class="create-actions">
              <el-button
                type="text"
                :icon="Plus"
                @click="showCreateDialog = true"
                style="width: 100%"
              >
                创建新标签
              </el-button>
            </div>
          </div>
        </template>
      </el-select>
    </div>

    <!-- 已选标签展示 -->
    <div v-if="showSelectedTags && selectedTags.length" class="selected-tags">
      <div class="selected-label">已选标签：</div>
      <div class="selected-list">
        <el-tag
          v-for="tag in selectedTags"
          :key="tag.id"
          :color="tag.color"
          :closable="!disabled"
          @close="removeTag(tag.id)"
          class="selected-tag"
        >
          {{ tag.name }}
        </el-tag>
      </div>
    </div>

    <!-- 创建新标签对话框 -->
    <el-dialog
      v-model="showCreateDialog"
      title="创建新标签"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="createFormRef"
        :model="createForm"
        :rules="createFormRules"
        label-width="80px"
      >
        <el-form-item label="标签名称" prop="name">
          <el-input
            v-model="createForm.name"
            placeholder="请输入标签名称"
            maxlength="20"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="标签分组" prop="category">
          <el-select v-model="createForm.category" placeholder="请选择分组">
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
              :class="{ active: createForm.color === color }"
              :style="{ backgroundColor: color }"
              @click="createForm.color = color"
            />
            <el-color-picker
              v-model="createForm.color"
              show-alpha
              :predefine="predefinedColors"
              size="small"
            />
          </div>
        </el-form-item>

        <el-form-item label="标签描述" prop="description">
          <el-input
            v-model="createForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入标签描述（可选）"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="showCreateDialog = false">取消</el-button>
        <el-button
          type="primary"
          :loading="createLoading"
          @click="createTag"
        >
          创建
        </el-button>
      </template>
    </el-dialog>

    <!-- 标签管理对话框 -->
    <el-dialog
      v-model="showManageDialog"
      title="标签管理"
      width="800px"
    >
      <TagManager
        :user-id="userId"
        @tag-created="handleTagCreated"
        @tag-deleted="handleTagDeleted"
      />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted, nextTick } from 'vue'
import { ElMessage, ElForm } from 'element-plus'
import { Search, Plus } from '@element-plus/icons-vue'
import type { UserTag, TagSelectorProps, TagSelectorEvents } from '@/types/user'
import { UserApiService } from '@/api/user'
import TagManager from './TagManager.vue'

// Props定义
const props = withDefaults(defineProps<TagSelectorProps>(), {
  multiple: true,
  filterable: true,
  clearable: true,
  placeholder: '请选择标签',
  disabled: false,
  allowCreate: true,
  showUsageCount: true,
  showSelectedTags: true,
  showCreateButton: true,
  remoteSearch: false,
  collapseTags: true,
  collapseTagsTooltip: true,
  maxCollapseTags: 3
})

// Emits定义
const emit = defineEmits<TagSelectorEvents>()

// Refs
const selectRef = ref()
const createFormRef = ref<InstanceType<typeof ElForm>>()

// 响应式数据
const loading = ref(false)
const allTags = ref<UserTag[]>([])
const searchKeyword = ref('')
const showCreateDialog = ref(false)
const showManageDialog = ref(false)
const createLoading = ref(false)

const createForm = reactive({
  name: '',
  category: 'other',
  color: '#409EFF',
  description: ''
})

const createFormRules = {
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

// 预定义颜色
const predefinedColors = [
  '#409EFF', '#67C23A', '#E6A23C', '#F56C6C', '#909399',
  '#FF7700', '#FFAA00', '#55A532', '#1890FF', '#722ED1',
  '#EB2F96', '#F5222D', '#FA8C16', '#A0D911', '#13C2C2'
]

// Computed
const selectedTagIds = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const selectedTags = computed(() => {
  return allTags.value.filter(tag => selectedTagIds.value.includes(tag.id))
})

const tagGroups = computed(() => {
  const groups: Array<{ name: string; label: string; tags: UserTag[] }> = []
  const categoryMap: Record<string, UserTag[]> = {}

  // 按分组分类标签
  allTags.value.forEach(tag => {
    const category = tag.category || 'other'
    if (!categoryMap[category]) {
      categoryMap[category] = []
    }
    categoryMap[category].push(tag)
  })

  // 转换为组件所需的格式
  const categoryLabels: Record<string, string> = {
    user_type: '用户类型',
    behavior: '行为特征',
    risk: '风险等级',
    credit: '信用等级',
    membership: '会员等级',
    other: '其他'
  }

  Object.entries(categoryMap).forEach(([category, tags]) => {
    groups.push({
      name: category,
      label: categoryLabels[category] || category,
      tags: tags
    })
  })

  return groups
})

// Methods
const loadTags = async () => {
  loading.value = true
  try {
    const tags = await UserApiService.getAllTags()
    allTags.value = tags
  } catch (error) {
    console.error('Failed to load tags:', error)
    ElMessage.error('加载标签失败')
  } finally {
    loading.value = false
  }
}

const handleRemoteSearch = async (query: string) => {
  searchKeyword.value = query

  if (remoteSearch.value && query) {
    loading.value = true
    try {
      // 这里可以实现远程搜索
      // const tags = await UserApiService.searchTags(query)
      // allTags.value = tags
    } catch (error) {
      console.error('Failed to search tags:', error)
    } finally {
      loading.value = false
    }
  }
}

const handleChange = (value: string[]) => {
  emit('change', value, selectedTags.value)
}

const handleClear = () => {
  emit('clear')
}

const handleRemoveTag = (tag: string) => {
  emit('remove-tag', tag)
}

const handleVisibleChange = (visible: boolean) => {
  if (visible && allTags.value.length === 0) {
    loadTags()
  }
  emit('visible-change', visible)
}

const removeTag = (tagId: string) => {
  const newValue = selectedTagIds.value.filter(id => id !== tagId)
  emit('update:modelValue', newValue)
  emit('remove-tag', tagId)
}

const createTag = async () => {
  if (!createFormRef.value) return

  try {
    await createFormRef.value.validate()

    createLoading.value = true

    const newTag = await UserApiService.createTag({
      name: createForm.name,
      category: createForm.category,
      color: createForm.color,
      description: createForm.description
    })

    ElMessage.success('标签创建成功')

    // 添加到已选标签（如果是单选模式或用户需要）
    if (!props.multiple) {
      emit('update:modelValue', newTag.id)
    }

    // 刷新标签列表
    await loadTags()

    // 关闭对话框
    showCreateDialog.value = false

    // 重置表单
    Object.assign(createForm, {
      name: '',
      category: 'other',
      color: '#409EFF',
      description: ''
    })

    emit('tag-created', newTag)
  } catch (error: any) {
    if (error.message) {
      ElMessage.error(error.message)
    }
  } finally {
    createLoading.value = false
  }
}

const handleTagCreated = (tag: UserTag) => {
  loadTags()
  emit('tag-created', tag)
}

const handleTagDeleted = (tagId: string) => {
  loadTags()

  // 如果删除的标签在已选列表中，移除它
  if (selectedTagIds.value.includes(tagId)) {
    const newValue = selectedTagIds.value.filter(id => id !== tagId)
    emit('update:modelValue', newValue)
  }

  emit('tag-deleted', tagId)
}

const focus = () => {
  selectRef.value?.focus()
}

const blur = () => {
  selectRef.value?.blur()
}

// 监听userId变化
watch(() => props.userId, (newUserId) => {
  if (newUserId) {
    loadTags()
  }
})

// 生命周期
onMounted(() => {
  if (allTags.value.length === 0) {
    loadTags()
  }
})

// 导出方法
defineExpose({
  focus,
  blur,
  loadTags
})
</script>

<style scoped lang="scss">
.tag-selector {
  .selector-main {
    .tag-select {
      width: 100%;
    }

    :deep(.el-select-dropdown__item) {
      height: auto;
      padding: 8px 20px;
    }

    .tag-option {
      display: flex;
      align-items: center;
      width: 100%;

      .tag-desc {
        flex: 1;
        margin-left: 8px;
        color: #606266;
        font-size: 12px;
      }

      .tag-count {
        color: #909399;
        font-size: 12px;
      }
    }

    .no-results {
      text-align: center;
      padding: 20px;
      color: #c0c4cc;

      .el-icon {
        font-size: 24px;
        margin-bottom: 8px;
      }

      span {
        display: block;
        font-size: 14px;
      }
    }
  }

  .selected-tags {
    margin-top: 12px;
    display: flex;
    align-items: flex-start;
    gap: 8px;

    .selected-label {
      color: #606266;
      font-size: 14px;
      line-height: 22px;
      white-space: nowrap;
    }

    .selected-list {
      flex: 1;

      .selected-tag {
        margin: 2px 4px 2px 0;
      }
    }
  }

  .create-section {
    .create-actions {
      padding: 0 12px 8px;
    }
  }

  .color-picker {
    display: flex;
    align-items: center;
    gap: 8px;

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
  .tag-selector {
    .selected-tags {
      flex-direction: column;
      align-items: flex-start;
      gap: 4px;

      .selected-label {
        margin-bottom: 4px;
      }
    }
  }
}
</style>