<template>
  <div class="placeholder-page">
    <el-card class="page-card">
      <template #header>
        <div class="page-header">
          <div class="header-left">
            <h2>{{ pageTitle }}</h2>
            <el-tag v-if="moduleType" :type="getModuleTypeColor(moduleType)">
              {{ moduleType }}
            </el-tag>
          </div>
          <div class="header-right">
            <el-button type="primary">
              <el-icon><Plus /></el-icon>
              新增
            </el-button>
            <el-button>
              <el-icon><Download /></el-icon>
              导出
            </el-button>
            <el-button>
              <el-icon><Refresh /></el-icon>
              刷新
            </el-button>
          </div>
        </div>
      </template>

      <!-- 搜索和筛选区域 -->
      <div class="search-section">
        <el-form :inline="true" :model="searchForm" class="search-form">
          <el-form-item label="关键词">
            <el-input
              v-model="searchForm.keyword"
              placeholder="请输入搜索关键词"
              clearable
            />
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
              <el-option label="全部" value="" />
              <el-option label="启用" value="active" />
              <el-option label="禁用" value="inactive" />
            </el-select>
          </el-form-item>
          <el-form-item label="时间范围">
            <el-date-picker
              v-model="searchForm.dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">
              <el-icon><Search /></el-icon>
              搜索
            </el-button>
            <el-button @click="handleReset">
              <el-icon><RefreshRight /></el-icon>
              重置
            </el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 数据表格区域 -->
      <div class="table-section">
        <el-table
          :data="tableData"
          border
          stripe
          style="width: 100%"
          v-loading="loading"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column type="index" label="序号" width="80" />

          <el-table-column
            v-for="column in tableColumns"
            :key="column.prop"
            :prop="column.prop"
            :label="column.label"
            :width="column.width"
            :min-width="column.minWidth"
          >
            <template #default="scope" v-if="column.slot">
              <slot :name="column.slot" :row="scope.row">
                {{ scope.row[column.prop] }}
              </slot>
            </template>
          </el-table-column>

          <el-table-column label="状态" width="100">
            <template #default="scope">
              <el-tag :type="scope.row.status === 'active' ? 'success' : 'info'">
                {{ scope.row.status === 'active' ? '启用' : '禁用' }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="200" fixed="right">
            <template #default="scope">
              <el-button type="primary" size="small" @click="handleEdit(scope.row)">
                编辑
              </el-button>
              <el-button type="danger" size="small" @click="handleDelete(scope.row)">
                删除
              </el-button>
              <el-dropdown @command="(command) => handleMoreAction(command, scope.row)">
                <el-button size="small">
                  更多<el-icon class="el-icon--right"><ArrowDown /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="view">查看详情</el-dropdown-item>
                    <el-dropdown-item command="copy">复制</el-dropdown-item>
                    <el-dropdown-item command="export">导出数据</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination-section">
          <el-pagination
            v-model:current-page="pagination.currentPage"
            v-model:page-size="pagination.pageSize"
            :page-sizes="[10, 20, 50, 100]"
            :total="pagination.total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </el-card>

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6" v-for="stat in statsData" :key="stat.title">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" :style="{ backgroundColor: stat.color }">
              <el-icon :size="24" color="#fff">
                <component :is="stat.icon" />
              </el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stat.value }}</div>
              <div class="stat-label">{{ stat.title }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Plus,
  Download,
  Refresh,
  Search,
  RefreshRight,
  ArrowDown,
  User,
  Van,
  Document,
  Money,
  House,
  Setting
} from '@element-plus/icons-vue'

// 定义属性
interface Props {
  pageTitle: string
  moduleType?: string
}

const props = withDefaults(defineProps<Props>(), {
  moduleType: ''
})

// 响应式数据
const loading = ref(false)
const searchForm = reactive({
  keyword: '',
  status: '',
  dateRange: []
})

const pagination = reactive({
  currentPage: 1,
  pageSize: 20,
  total: 0
})

// 表格配置
const tableColumns = ref([
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'name', label: '名称', minWidth: 120 },
  { prop: 'description', label: '描述', minWidth: 200 },
  { prop: 'createTime', label: '创建时间', width: 180 },
  { prop: 'updateTime', label: '更新时间', width: 180 }
])

// 表格数据
const tableData = ref([])

// 统计数据
const statsData = ref([
  {
    title: '总数',
    value: '1,234',
    icon: 'Document',
    color: '#409EFF'
  },
  {
    title: '今日新增',
    value: '56',
    icon: 'Plus',
    color: '#67C23A'
  },
  {
    title: '活跃数',
    value: '890',
    icon: 'User',
    color: '#E6A23C'
  },
  {
    title: '待处理',
    value: '12',
    icon: 'Warning',
    color: '#F56C6C'
  }
])

// 方法
const getModuleTypeColor = (type: string) => {
  const colorMap: Record<string, string> = {
    '数据分析': 'primary',
    '核心业务': 'success',
    '营销运营': 'warning',
    '系统管理': 'info'
  }
  return colorMap[type] || 'default'
}

const handleSearch = () => {
  loading.value = true
  // 模拟搜索
  setTimeout(() => {
    loading.value = false
    ElMessage.success('搜索完成')
  }, 1000)
}

const handleReset = () => {
  Object.assign(searchForm, {
    keyword: '',
    status: '',
    dateRange: []
  })
  ElMessage.info('重置成功')
}

const handleEdit = (row: any) => {
  ElMessage.info(`编辑：${row.name}`)
}

const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确定要删除 ${row.name} 吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    ElMessage.success('删除成功')
  })
}

const handleMoreAction = (command: string, row: any) => {
  ElMessage.info(`${command} - ${row.name}`)
}

const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  // 重新加载数据
}

const handleCurrentChange = (page: number) => {
  pagination.currentPage = page
  // 重新加载数据
}

// 生成模拟数据
const generateMockData = () => {
  const mockData = []
  for (let i = 1; i <= 20; i++) {
    mockData.push({
      id: i,
      name: `示例数据 ${i}`,
      description: `这是第${i}条示例数据的描述信息`,
      status: i % 2 === 0 ? 'active' : 'inactive',
      createTime: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleString(),
      updateTime: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleString()
    })
  }
  tableData.value = mockData
  pagination.total = 1234
}

onMounted(() => {
  generateMockData()
})
</script>

<style scoped lang="scss">
.placeholder-page {
  .page-card {
    margin-bottom: 20px;
  }

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .header-left {
      display: flex;
      align-items: center;
      gap: 12px;

      h2 {
        margin: 0;
        color: #303133;
      }
    }

    .header-right {
      display: flex;
      gap: 12px;
    }
  }

  .search-section {
    margin-bottom: 20px;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 4px;

    .search-form {
      margin: 0;
    }
  }

  .table-section {
    .pagination-section {
      margin-top: 20px;
      display: flex;
      justify-content: center;
    }
  }
}

.stats-row {
  .stat-card {
    .stat-content {
      display: flex;
      align-items: center;
      gap: 16px;

      .stat-icon {
        width: 60px;
        height: 60px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .stat-info {
        .stat-value {
          font-size: 24px;
          font-weight: bold;
          color: #303133;
          line-height: 1.2;
        }

        .stat-label {
          color: #606266;
          font-size: 14px;
        }
      }
    }
  }
}
</style>