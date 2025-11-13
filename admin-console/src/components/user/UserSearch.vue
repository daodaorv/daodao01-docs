<template>
  <div class="user-search">
    <el-form
      ref="formRef"
      :model="searchForm"
      :inline="true"
      class="search-form"
      @submit.prevent="handleSearch"
    >
      <!-- 基础搜索 -->
      <el-form-item label="关键词">
        <el-input
          v-model="searchForm.keyword"
          placeholder="请输入用户名、手机号或邮箱"
          clearable
          @clear="handleClear"
          @keyup.enter="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
      </el-form-item>

      <!-- 状态筛选 -->
      <el-form-item label="用户状态">
        <el-select
          v-model="searchForm.status"
          placeholder="请选择用户状态"
          clearable
          @change="handleStatusChange"
        >
          <el-option label="全部" value="" />
          <el-option label="正常" value="active" />
          <el-option label="禁用" value="inactive" />
          <el-option label="待审核" value="pending" />
          <el-option label="已禁用" value="banned" />
          <el-option label="审核不通过" value="audit_rejected" />
        </el-select>
      </el-form-item>

      <!-- 信用等级筛选 -->
      <el-form-item label="信用等级">
        <el-select
          v-model="searchForm.creditLevel"
          placeholder="请选择信用等级"
          clearable
          @change="handleCreditLevelChange"
        >
          <el-option label="全部" value="" />
          <el-option label="AAA" value="AAA" />
          <el-option label="AA" value="AA" />
          <el-option label="A" value="A" />
          <el-option label="B" value="B" />
          <el-option label="C" value="C" />
          <el-option label="D" value="D" />
        </el-select>
      </el-form-item>

      <!-- 风险等级筛选 -->
      <el-form-item label="风险等级">
        <el-select
          v-model="searchForm.riskLevel"
          placeholder="请选择风险等级"
          clearable
          @change="handleRiskLevelChange"
        >
          <el-option label="全部" value="" />
          <el-option label="低风险" value="low" />
          <el-option label="中风险" value="medium" />
          <el-option label="高风险" value="high" />
          <el-option label="严重风险" value="critical" />
        </el-select>
      </el-form-item>

      <!-- 注册时间范围 -->
      <el-form-item label="注册时间">
        <el-date-picker
          v-model="searchForm.registerDateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          clearable
          @change="handleRegisterDateChange"
        />
      </el-form-item>

      <!-- 最后登录时间范围 -->
      <el-form-item label="最后登录">
        <el-date-picker
          v-model="searchForm.loginDateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          clearable
          @change="handleLoginDateChange"
        />
      </el-form-item>

      <!-- 操作按钮 -->
      <el-form-item>
        <el-button
          type="primary"
          :icon="Search"
          @click="handleSearch"
        >
          搜索
        </el-button>
        <el-button
          :icon="Refresh"
          @click="handleReset"
        >
          重置
        </el-button>
        <el-button
          v-if="showAdvanced"
          type="info"
          :icon="MoreFilled"
          @click="toggleAdvanced"
        >
          {{ showAdvanced ? '收起' : '高级搜索' }}
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 高级搜索区域 -->
    <el-collapse-transition>
      <div v-show="showAdvanced" class="advanced-search">
        <el-divider>
          <span class="advanced-title">高级筛选</span>
        </el-divider>

        <el-form
          :model="advancedForm"
          :inline="true"
          class="advanced-form"
        >
          <!-- 用户标签筛选 -->
          <el-form-item label="用户标签">
            <el-select
              v-model="advancedForm.tagIds"
              placeholder="请选择用户标签"
              multiple
              clearable
              filterable
              @change="handleTagsChange"
            >
              <el-option
                v-for="tag in availableTags"
                :key="tag.id"
                :label="tag.name"
                :value="tag.id"
              >
                <el-tag
                  :color="tag.color"
                  size="small"
                  style="margin-right: 8px"
                >
                  {{ tag.name }}
                </el-tag>
              </el-option>
            </el-select>
          </el-form-item>

          <!-- 角色筛选 -->
          <el-form-item label="用户角色">
            <el-select
              v-model="advancedForm.roleCode"
              placeholder="请选择用户角色"
              clearable
              @change="handleRoleChange"
            >
              <el-option label="全部" value="" />
              <el-option label="平台管理员" value="platform_admin" />
              <el-option label="区域经理" value="region_manager" />
              <el-option label="门店经理" value="store_manager" />
              <el-option label="门店员工" value="store_employee" />
            </el-select>
          </el-form-item>

          <!-- 门店筛选 -->
          <el-form-item label="所属门店">
            <el-select
              v-model="advancedForm.storeId"
              placeholder="请选择门店"
              clearable
              filterable
              @change="handleStoreChange"
            >
              <el-option
                v-for="store in availableStores"
                :key="store.id"
                :label="store.name"
                :value="store.id"
              />
            </el-select>
          </el-form-item>

          <!-- 年龄范围 -->
          <el-form-item label="年龄范围">
            <el-input-number
              v-model="advancedForm.minAge"
              placeholder="最小年龄"
              :min="18"
              :max="100"
              style="width: 100px"
            />
            <span style="margin: 0 8px;">-</span>
            <el-input-number
              v-model="advancedForm.maxAge"
              placeholder="最大年龄"
              :min="18"
              :max="100"
              style="width: 100px"
            />
          </el-form-item>

          <!-- 年收入范围 -->
          <el-form-item label="年收入范围">
            <el-input-number
              v-model="advancedForm.minIncome"
              placeholder="最小收入"
              :min="0"
              :step="10000"
              style="width: 120px"
            />
            <span style="margin: 0 8px;">-</span>
            <el-input-number
              v-model="advancedForm.maxIncome"
              placeholder="最大收入"
              :min="0"
              :step="10000"
              style="width: 120px"
            />
          </el-form-item>

          <!-- 教育程度 -->
          <el-form-item label="教育程度">
            <el-select
              v-model="advancedForm.education"
              placeholder="请选择教育程度"
              clearable
              @change="handleEducationChange"
            >
              <el-option label="不限" value="" />
              <el-option label="小学" value="primary" />
              <el-option label="初中" value="middle" />
              <el-option label="高中" value="high" />
              <el-option label="大专" value="college" />
              <el-option label="本科" value="bachelor" />
              <el-option label="硕士" value="master" />
              <el-option label="博士" value="doctor" />
            </el-select>
          </el-form-item>

          <!-- 婚姻状况 -->
          <el-form-item label="婚姻状况">
            <el-select
              v-model="advancedForm.maritalStatus"
              placeholder="请选择婚姻状况"
              clearable
              @change="handleMaritalStatusChange"
            >
              <el-option label="不限" value="" />
              <el-option label="未婚" value="single" />
              <el-option label="已婚" value="married" />
              <el-option label="离异" value="divorced" />
              <el-option label="丧偶" value="widowed" />
            </el-select>
          </el-form-item>

          <!-- 是否有紧急联系人 -->
          <el-form-item label="紧急联系人">
            <el-select
              v-model="advancedForm.hasEmergencyContact"
              placeholder="请选择"
              clearable
              @change="handleEmergencyContactChange"
            >
              <el-option label="不限" value="" />
              <el-option label="有" value="true" />
              <el-option label="没有" value="false" />
            </el-select>
          </el-form-item>

          <!-- 高级搜索操作按钮 -->
          <el-form-item>
            <el-button
              type="primary"
              :icon="Search"
              @click="handleAdvancedSearch"
            >
              高级搜索
            </el-button>
            <el-button
              :icon="Refresh"
              @click="handleAdvancedReset"
            >
              重置高级搜索
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-collapse-transition>

    <!-- 搜索历史 -->
    <div v-if="showSearchHistory && searchHistory.length > 0" class="search-history">
      <el-divider>
        <span class="history-title">搜索历史</span>
        <el-button
          type="text"
          size="small"
          :icon="Delete"
          @click="clearSearchHistory"
        >
          清空历史
        </el-button>
      </el-divider>

      <div class="history-list">
        <el-tag
          v-for="(item, index) in searchHistory"
          :key="index"
          closable
          @close="removeSearchHistory(index)"
          @click="applySearchHistory(item)"
          class="history-tag"
        >
          {{ item.keyword }}
        </el-tag>
      </div>
    </div>

    <!-- 快速筛选 -->
    <div v-if="showQuickFilters" class="quick-filters">
      <el-divider>
        <span class="filter-title">快速筛选</span>
      </el-divider>

      <div class="filter-chips">
        <el-chip
          v-for="filter in quickFilters"
          :key="filter.key"
          :label="filter.label"
          :value="filter.key"
          :color="filter.active ? 'primary' : 'default'"
          @click="toggleQuickFilter(filter)"
          size="small"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { Search, Refresh, MoreFilled, Delete } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { UserSearchProps, UserSearchEvents, UserFilters, UserTag } from '@/types/user'
import { UserApiService } from '@/api/user'

// Props定义
const props = withDefaults(defineProps<UserSearchProps>(), {
  showAdvanced: false,
  showReset: true,
  showSearchHistory: true,
  showQuickFilters: true,
  placeholder: '请输入搜索关键词'
})

// Emits定义
const emit = defineEmits<UserSearchEvents>()

// Refs
const formRef = ref()

// 响应式数据
const searchForm = reactive<Partial<UserFilters>>({
  keyword: '',
  status: '',
  creditLevel: '',
  riskLevel: '',
  registerDateRange: [],
  loginDateRange: []
})

const advancedForm = reactive({
  tagIds: [],
  roleCode: '',
  storeId: '',
  minAge: undefined,
  maxAge: undefined,
  minIncome: undefined,
  maxIncome: undefined,
  education: '',
  maritalStatus: '',
  hasEmergencyContact: ''
})

const showAdvanced = ref(props.showAdvanced)
const searchHistory = ref<Array<{ keyword: string; filters: Partial<UserFilters> }>>([])
const quickFilters = ref([
  { key: 'active', label: '正常用户', active: false },
  { key: 'pending', label: '待审核用户', active: false },
  { key: 'high_risk', label: '高风险用户', active: false },
  { key: 'low_credit', label: '低信用用户', active: false }
])

const availableTags = ref<UserTag[]>([])
const availableStores = ref<Array<{ id: string; name: string }>>([])

// Computed
const currentFilters = computed(() => ({
  ...searchForm,
  ...advancedForm
}))

// Methods
const toggleAdvanced = () => {
  showAdvanced.value = !showAdvanced.value
}

const handleSearch = () => {
  const filters = getFilters()
  addToSearchHistory(filters)
  emit('search', filters)
}

const handleAdvancedSearch = () => {
  const filters = getFilters()
  addToSearchHistory(filters)
  emit('search', filters)
}

const handleReset = () => {
  Object.assign(searchForm, {
    keyword: '',
    status: '',
    creditLevel: '',
    riskLevel: '',
    registerDateRange: [],
    loginDateRange: []
  })
  Object.assign(advancedForm, {
    tagIds: [],
    roleCode: '',
    storeId: '',
    minAge: undefined,
    maxAge: undefined,
    minIncome: undefined,
    maxIncome: undefined,
    education: '',
    maritalStatus: '',
    hasEmergencyContact: ''
  })

  // 清除快速筛选
  quickFilters.value.forEach(filter => {
    filter.active = false
  })

  emit('reset')
}

const handleAdvancedReset = () => {
  Object.assign(advancedForm, {
    tagIds: [],
    roleCode: '',
    storeId: '',
    minAge: undefined,
    maxAge: undefined,
    minIncome: undefined,
    maxIncome: undefined,
    education: '',
    maritalStatus: '',
    hasEmergencyContact: ''
  })
  emit('reset')
}

const handleClear = () => {
  searchForm.keyword = ''
  emit('filter-change', getFilters())
}

const getFilters = (): UserFilters => {
  return {
    keyword: searchForm.keyword?.trim() || '',
    status: searchForm.status || '',
    creditLevel: searchForm.creditLevel || '',
    riskLevel: searchForm.riskLevel || '',
    registerDateRange: searchForm.registerDateRange || [],
    loginDateRange: searchForm.loginDateRange || [],
    tagIds: advancedForm.tagIds,
    roleCode: advancedForm.roleCode || '',
    storeId: advancedForm.storeId || '',
    minAge: advancedForm.minAge,
    maxAge: advancedForm.maxAge,
    minIncome: advancedForm.minIncome,
    maxIncome: advancedForm.maxIncome,
    education: advancedForm.education || '',
    maritalStatus: advancedForm.maritalStatus || '',
    hasEmergencyContact: advancedForm.hasEmergencyContact
  }
}

// 事件处理
const handleStatusChange = () => {
  emit('filter-change', getFilters())
}

const handleCreditLevelChange = () => {
  emit('filter-change', getFilters())
}

const handleRiskLevelChange = () => {
  emit('filter-change', getFilters())
}

const handleRegisterDateChange = () => {
  emit('filter-change', getFilters())
}

const handleLoginDateChange = () => {
  emit('filter-change', getFilters())
}

const handleTagsChange = () => {
  emit('filter-change', getFilters())
}

const handleRoleChange = () => {
  emit('filter-change', getFilters())
}

const handleStoreChange = () => {
  emit('filter-change', getFilters())
}

const handleEducationChange = () => {
  emit('filter-change', getFilters())
}

const handleMaritalStatusChange = () => {
  emit('filter-change', getFilters())
}

const handleEmergencyContactChange = () => {
  emit('filter-change', getFilters())
}

// 搜索历史管理
const addToSearchHistory = (filters: UserFilters) => {
  if (!filters.keyword) return

  const historyItem = {
    keyword: filters.keyword,
    filters: { ...filters }
  }

  // 避免重复
  const existingIndex = searchHistory.value.findIndex(item => item.keyword === filters.keyword)
  if (existingIndex > -1) {
    searchHistory.value.splice(existingIndex, 1)
  }

  searchHistory.value.unshift(historyItem)

  // 限制历史记录数量
  if (searchHistory.value.length > 10) {
    searchHistory.value = searchHistory.value.slice(0, 10)
  }

  // 保存到本地存储
  localStorage.setItem('user-search-history', JSON.stringify(searchHistory.value))
}

const removeSearchHistory = (index: number) => {
  searchHistory.value.splice(index, 1)
  localStorage.setItem('user-search-history', JSON.stringify(searchHistory.value))
}

const applySearchHistory = (item: { keyword: string; filters: Partial<UserFilters> }) => {
  searchForm.keyword = item.keyword

  // 应用筛选条件
  if (item.filters.status) searchForm.status = item.filters.status
  if (item.filters.creditLevel) searchForm.creditLevel = item.filters.creditLevel
  if (item.filters.riskLevel) searchForm.riskLevel = item.filters.riskLevel
  if (item.filters.registerDateRange) searchForm.registerDateRange = item.filters.registerDateRange
  if (item.filters.loginDateRange) searchForm.loginDateRange = item.filters.loginDateRange

  emit('search', getFilters())
}

const clearSearchHistory = () => {
  searchHistory.value = []
  localStorage.removeItem('user-search-history')
  ElMessage.success('搜索历史已清空')
}

// 快速筛选
const toggleQuickFilter = (filter: { key: string; label: string; active: boolean }) => {
  filter.active = !filter.active

  // 应用快速筛选
  if (filter.active) {
    switch (filter.key) {
      case 'active':
        searchForm.status = 'active'
        break
      case 'pending':
        searchForm.status = 'pending'
        break
      case 'high_risk':
        searchForm.riskLevel = 'high'
        break
      case 'low_credit':
        searchForm.creditLevel = 'D'
        break
    }
  } else {
    // 清除对应筛选
    switch (filter.key) {
      case 'active':
      case 'pending':
        searchForm.status = ''
        break
      case 'high_risk':
        searchForm.riskLevel = ''
        break
      case 'low_credit':
        searchForm.creditLevel = ''
        break
    }
  }

  emit('filter-change', getFilters())
}

// 加载外部数据
const loadTags = async () => {
  try {
    const tags = await UserApiService.getAllTags()
    availableTags.value = tags
  } catch (error) {
    console.error('Failed to load tags:', error)
  }
}

const loadStores = async () => {
  try {
    // 这里需要实现获取门店列表的API
    // const stores = await StoreApiService.getStoreList()
    // availableStores.value = stores
    availableStores.value = [
      { id: '1', name: '北京朝阳门店' },
      { id: '2', name: '上海浦东门店' },
      { id: '3', name: '广州天河门店' }
    ]
  } catch (error) {
    console.error('Failed to load stores:', error)
  }
}

// 初始化搜索历史
const initSearchHistory = () => {
  const saved = localStorage.getItem('user-search-history')
  if (saved) {
    try {
      searchHistory.value = JSON.parse(saved)
    } catch (error) {
      console.error('Failed to parse search history:', error)
    }
  }
}

// 监听父组件传入的筛选条件
watch(() => props.filters, (newFilters) => {
  if (newFilters) {
    Object.assign(searchForm, {
      keyword: newFilters.keyword || '',
      status: newFilters.status || '',
      creditLevel: newFilters.creditLevel || '',
      riskLevel: newFilters.riskLevel || '',
      registerDateRange: newFilters.registerDateRange || [],
      loginDateRange: newFilters.loginDateRange || []
    })
  }
}, { immediate: true, deep: true })

// 生命周期
onMounted(() => {
  loadTags()
  loadStores()
  initSearchHistory()
})

// 导出方法
defineExpose({
  reset: handleReset,
  search: handleSearch,
  advancedSearch: handleAdvancedSearch,
  clearHistory: clearSearchHistory,
  getFilters,
  toggleAdvanced,
  addFilter: (key: string, value: any) => {
    if (key in searchForm) {
      searchForm[key] = value
    } else if (key in advancedForm) {
      advancedForm[key] = value
    }
    emit('filter-change', getFilters())
  }
})
</script>

<style scoped lang="scss">
.user-search {
  .search-form {
    .el-form-item {
      margin-bottom: 0;
    }
  }

  .advanced-search {
    background-color: #f8f9fa;
    border-radius: 8px;
    padding: 16px;
    margin-top: 16px;
  }

  .advanced-title {
    font-weight: 500;
    color: #303133;
  }

  .advanced-form {
    .el-form-item {
      margin-bottom: 16px;
    }
  }
}

.search-history {
  margin-top: 16px;

  .history-title {
    font-weight: 500;
    color: #303133;
  }

  .history-list {
    .history-tag {
      margin: 4px;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
    }
  }
}

.quick-filters {
  margin-top: 16px;

  .filter-title {
    font-weight: 500;
    color: #303133;
  }

  .filter-chips {
    .el-chip {
      margin: 4px;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        transform: translateY(-1px);
      }
    }
  }
}

// 响应式设计
@media (max-width: 1200px) {
  .search-form {
    .el-form-item {
      margin-right: 0;
      margin-bottom: 16px;
    }
  }
}

@media (max-width: 768px) {
  .search-form {
    .el-form-item {
      width: 100%;
      margin-right: 0;
      margin-bottom: 16px;
    }
  }

  .advanced-form {
    .el-form-item {
      width: 100%;
      margin-bottom: 16px;
    }
  }
}
</style>