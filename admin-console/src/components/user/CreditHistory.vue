<template>
  <div class="credit-history">
    <!-- 统计卡片 -->
    <div class="credit-stats">
      <el-row :gutter="16">
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-title">当前信用分</div>
              <div class="stat-value">{{ userCredit.currentScore || '-' }}</div>
              <div class="stat-trend" :class="{ positive: userCredit.trend > 0, negative: userCredit.trend < 0 }">
                <el-icon><TrendCharts /></el-icon>
                <span>{{ userCredit.trend > 0 ? '+' : '' }}{{ userCredit.trend || 0 }}</span>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-title">信用等级</div>
              <div class="stat-value">
                <el-tag :type="getCreditTagType(userCredit.level)">
                  {{ userCredit.level || '暂无' }}
                </el-tag>
              </div>
              <div class="stat-desc">{{ getCreditDesc(userCredit.level) }}</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-title">历史最高</div>
              <div class="stat-value">{{ userCredit.highestScore || '-' }}</div>
              <div class="stat-desc">{{ userCredit.highestDate || '-' }}</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-title">评估次数</div>
              <div class="stat-value">{{ userCredit.evaluationCount || 0 }}</div>
              <div class="stat-desc">次评估</div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 操作按钮 -->
    <div class="action-bar">
      <el-button
        type="primary"
        :icon="Plus"
        @click="handleManualEvaluation"
      >
        手动评估
      </el-button>
      <el-button
        :icon="Refresh"
        @click="loadCreditHistory"
      >
        刷新
      </el-button>
      <el-button
        :icon="TrendCharts"
        @click="showChart = !showChart"
      >
        {{ showChart ? '隐藏' : '显示' }}趋势图
      </el-button>
    </div>

    <!-- 信用趋势图 -->
    <el-card v-show="showChart" class="chart-card" title="信用趋势图">
      <div ref="chartRef" class="credit-chart"></div>
    </el-card>

    <!-- 信用历史表格 -->
    <el-table
      :data="creditHistory"
      v-loading="loading"
      row-key="id"
    >
      <el-table-column label="评估ID" prop="id" width="120" />

      <el-table-column label="评估类型" width="120">
        <template #default="{ row }">
          <el-tag :type="getTypeTagType(row.type)">
            {{ getTypeText(row.type) }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="评估前分数" prop="beforeScore" width="120" />

      <el-table-column label="评估后分数" prop="afterScore" width="120">
        <template #default="{ row }">
          <span :class="{ 'score-increase': row.afterScore > row.beforeScore, 'score-decrease': row.afterScore < row.beforeScore }">
            {{ row.afterScore }}
          </span>
        </template>
      </el-table-column>

      <el-table-column label="分数变化" width="100">
        <template #default="{ row }">
          <span
            :class="{
              'score-change-increase': row.afterScore > row.beforeScore,
              'score-change-decrease': row.afterScore < row.beforeScore
            }"
          >
            {{ row.afterScore > row.beforeScore ? '+' : '' }}{{ row.afterScore - row.beforeScore }}
          </span>
        </template>
      </el-table-column>

      <el-table-column label="评估原因" prop="reason" show-overflow-tooltip />

      <el-table-column label="评估人" prop="evaluatorName" width="120" />

      <el-table-column label="评估时间" width="180">
        <template #default="{ row }">
          {{ formatDate(row.createdAt, 'YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>

      <el-table-column label="操作" width="120" fixed="right">
        <template #default="{ row }">
          <el-button
            type="text"
            size="small"
            @click="handleViewDetail(row)"
          >
            详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>

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

    <!-- 评估详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="评估详情"
      width="700px"
    >
      <div v-if="selectedEvaluation" class="evaluation-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="评估ID">
            {{ selectedEvaluation.id }}
          </el-descriptions-item>
          <el-descriptions-item label="评估类型">
            <el-tag :type="getTypeTagType(selectedEvaluation.type)">
              {{ getTypeText(selectedEvaluation.type) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="评估前分数">
            {{ selectedEvaluation.beforeScore }}
          </el-descriptions-item>
          <el-descriptions-item label="评估后分数">
            <span :class="{ 'score-increase': selectedEvaluation.afterScore > selectedEvaluation.beforeScore }">
              {{ selectedEvaluation.afterScore }}
            </span>
          </el-descriptions-item>
          <el-descriptions-item label="评估人">
            {{ selectedEvaluation.evaluatorName }}
          </el-descriptions-item>
          <el-descriptions-item label="评估时间">
            {{ formatDate(selectedEvaluation.createdAt, 'YYYY-MM-DD HH:mm:ss') }}
          </el-descriptions-item>
        </el-descriptions>

        <div class="evaluation-reason">
          <h4>评估原因</h4>
          <p>{{ selectedEvaluation.reason }}</p>
        </div>

        <div v-if="selectedEvaluation.factors?.length" class="evaluation-factors">
          <h4>影响因素</h4>
          <div class="factors-list">
            <div
              v-for="factor in selectedEvaluation.factors"
              :key="factor.name"
              class="factor-item"
            >
              <div class="factor-name">{{ factor.name }}</div>
              <div class="factor-weight">权重: {{ factor.weight }}%</div>
              <div class="factor-score">得分: {{ factor.score }}</div>
              <div class="factor-impact" :class="{ positive: factor.impact > 0, negative: factor.impact < 0 }">
                {{ factor.impact > 0 ? '+' : '' }}{{ factor.impact }}
              </div>
            </div>
          </div>
        </div>

        <div v-if="selectedEvaluation.comment" class="evaluation-comment">
          <h4>评估说明</h4>
          <p>{{ selectedEvaluation.comment }}</p>
        </div>
      </div>

      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 手动评估对话框 -->
    <el-dialog
      v-model="manualDialogVisible"
      title="手动信用评估"
      width="600px"
    >
      <el-form
        ref="manualFormRef"
        :model="manualForm"
        :rules="manualFormRules"
        label-width="100px"
      >
        <el-form-item label="评估类型" prop="type">
          <el-select v-model="manualForm.type" placeholder="请选择评估类型">
            <el-option label="人工调整" value="manual" />
            <el-option label="行为评估" value="behavior" />
            <el-option label="投诉处理" value="complaint" />
            <el-option label="信用修复" value="repair" />
          </el-select>
        </el-form-item>

        <el-form-item label="调整分数" prop="scoreChange">
          <el-input-number
            v-model="manualForm.scoreChange"
            :min="-100"
            :max="100"
            placeholder="分数变化（正负数）"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="评估原因" prop="reason">
          <el-input
            v-model="manualForm.reason"
            type="textarea"
            :rows="3"
            placeholder="请输入评估原因"
          />
        </el-form-item>

        <el-form-item label="评估说明" prop="comment">
          <el-input
            v-model="manualForm.comment"
            type="textarea"
            :rows="2"
            placeholder="请输入评估说明（可选）"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="manualDialogVisible = false">取消</el-button>
        <el-button
          type="primary"
          :loading="manualSubmitting"
          @click="submitManualEvaluation"
        >
          确认评估
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick, defineProps } from 'vue'
import { ElMessage, ElForm } from 'element-plus'
import {
  Plus,
  Refresh,
  TrendCharts
} from '@element-plus/icons-vue'
import type { CreditEvaluation } from '@/types/user'
import { UserApiService } from '@/api/user'
import { formatDate } from '@/utils/formatters'
import * as echarts from 'echarts'

// Props
interface Props {
  userId: string
}

const props = defineProps<Props>()

// Refs
const chartRef = ref<HTMLElement>()
const manualFormRef = ref<InstanceType<typeof ElForm>>()

// 响应式数据
const loading = ref(false)
const creditHistory = ref<CreditEvaluation[]>([])
const selectedEvaluation = ref<CreditEvaluation | null>(null)
const detailDialogVisible = ref(false)
const manualDialogVisible = ref(false)
const manualSubmitting = ref(false)
const showChart = ref(false)

const userCredit = reactive({
  currentScore: 0,
  level: '',
  trend: 0,
  highestScore: 0,
  highestDate: '',
  evaluationCount: 0
})

const manualForm = reactive({
  type: '',
  scoreChange: 0,
  reason: '',
  comment: ''
})

const manualFormRules = {
  type: [
    { required: true, message: '请选择评估类型', trigger: 'change' }
  ],
  scoreChange: [
    { required: true, message: '请输入调整分数', trigger: 'blur' }
  ],
  reason: [
    { required: true, message: '请输入评估原因', trigger: 'blur' }
  ]
}

const pagination = reactive({
  page: 1,
  size: 20,
  total: 0
})

let chartInstance: echarts.ECharts | null = null

// Methods
const loadCreditHistory = async () => {
  loading.value = true
  try {
    const [historyResponse, creditResponse] = await Promise.all([
      UserApiService.getUserCreditHistory(props.userId, {
        page: pagination.page,
        size: pagination.size
      }),
      UserApiService.getUserCreditScore(props.userId)
    ])

    creditHistory.value = historyResponse.data
    pagination.total = historyResponse.total

    // 更新用户信用信息
    Object.assign(userCredit, creditResponse)

    // 更新图表
    if (showChart.value) {
      await nextTick()
      updateChart()
    }
  } catch (error) {
    console.error('Failed to load credit history:', error)
    ElMessage.error('加载信用历史失败')
  } finally {
    loading.value = false
  }
}

const handleManualEvaluation = () => {
  manualForm.type = ''
  manualForm.scoreChange = 0
  manualForm.reason = ''
  manualForm.comment = ''
  manualDialogVisible.value = true
}

const submitManualEvaluation = async () => {
  if (!manualFormRef.value) return

  try {
    await manualFormRef.value.validate()

    manualSubmitting.value = true

    await UserApiService.evaluateUserCredit(props.userId, {
      type: manualForm.type,
      scoreChange: manualForm.scoreChange,
      reason: manualForm.reason,
      comment: manualForm.comment
    })

    ElMessage.success('信用评估完成')
    manualDialogVisible.value = false
    loadCreditHistory()
  } catch (error: any) {
    if (error.message) {
      ElMessage.error(error.message)
    }
  } finally {
    manualSubmitting.value = false
  }
}

const handleViewDetail = (evaluation: CreditEvaluation) => {
  selectedEvaluation.value = evaluation
  detailDialogVisible.value = true
}

const handleSizeChange = (size: number) => {
  pagination.size = size
  loadCreditHistory()
}

const handleCurrentChange = (page: number) => {
  pagination.page = page
  loadCreditHistory()
}

const updateChart = () => {
  if (!chartRef.value || !creditHistory.value.length) return

  if (!chartInstance) {
    chartInstance = echarts.init(chartRef.value)
  }

  const dates = creditHistory.value
    .slice()
    .reverse()
    .map(item => formatDate(item.createdAt, 'MM-DD'))
  const scores = creditHistory.value
    .slice()
    .reverse()
    .map(item => item.afterScore)

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    xAxis: {
      type: 'category',
      data: dates,
      axisLabel: {
        rotate: 45
      }
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 1000
    },
    series: [
      {
        data: scores,
        type: 'line',
        smooth: true,
        areaStyle: {
          opacity: 0.3
        },
        lineStyle: {
          width: 2,
          color: '#409EFF'
        },
        areaStyle: {
          color: '#409EFF'
        }
      }
    ]
  }

  chartInstance.setOption(option)
}

// 工具方法
const getTypeText = (type: string) => {
  const typeMap: Record<string, string> = {
    initial: '初始评估',
    behavior: '行为评估',
    transaction: '交易评估',
    complaint: '投诉处理',
    manual: '人工调整',
    repair: '信用修复',
    system: '系统评估'
  }
  return typeMap[type] || type
}

const getTypeTagType = (type: string) => {
  const typeMap: Record<string, string> = {
    initial: 'info',
    behavior: 'primary',
    transaction: 'success',
    complaint: 'danger',
    manual: 'warning',
    repair: 'success',
    system: 'info'
  }
  return typeMap[type] || 'info'
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

const getCreditDesc = (level: string) => {
  const descMap: Record<string, string> = {
    AAA: '信用极好',
    AA: '信用优秀',
    A: '信用良好',
    B: '信用一般',
    C: '信用较差',
    D: '信用很差'
  }
  return descMap[level] || ''
}

// 生命周期
onMounted(() => {
  loadCreditHistory()
})
</script>

<style scoped lang="scss">
.credit-history {
  .credit-stats {
    margin-bottom: 24px;

    .stat-card {
      .stat-content {
        text-align: center;

        .stat-title {
          font-size: 14px;
          color: #909399;
          margin-bottom: 8px;
        }

        .stat-value {
          font-size: 24px;
          font-weight: bold;
          color: #303133;
          margin-bottom: 4px;
        }

        .stat-trend {
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;

          &.positive {
            color: #67c23a;
          }

          &.negative {
            color: #f56c6c;
          }
        }

        .stat-desc {
          font-size: 12px;
          color: #909399;
        }
      }
    }
  }

  .action-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .chart-card {
    margin-bottom: 16px;

    .credit-chart {
      height: 300px;
    }
  }

  .pagination-wrapper {
    display: flex;
    justify-content: center;
    margin-top: 16px;
  }

  .evaluation-detail {
    .evaluation-reason,
    .evaluation-factors,
    .evaluation-comment {
      margin-top: 16px;

      h4 {
        margin-bottom: 8px;
        color: #303133;
      }

      p {
        color: #606266;
        line-height: 1.5;
      }
    }

    .evaluation-factors {
      .factors-list {
        .factor-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 12px;
          background-color: #f8f9fa;
          border-radius: 4px;
          margin-bottom: 8px;

          .factor-name {
            font-weight: 500;
            color: #303133;
          }

          .factor-weight,
          .factor-score {
            color: #606266;
            font-size: 14px;
          }

          .factor-impact {
            font-weight: bold;
            font-size: 14px;

            &.positive {
              color: #67c23a;
            }

            &.negative {
              color: #f56c6c;
            }
          }
        }
      }
    }
  }

  .score-increase {
    color: #67c23a;
    font-weight: bold;
  }

  .score-decrease {
    color: #f56c6c;
    font-weight: bold;
  }

  .score-change-increase {
    color: #67c23a;
    font-weight: bold;
  }

  .score-change-decrease {
    color: #f56c6c;
    font-weight: bold;
  }
}
</style>