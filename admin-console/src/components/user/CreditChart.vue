<template>
  <div class="credit-chart">
    <!-- 信用概览卡片 -->
    <div class="credit-overview">
      <el-row :gutter="16">
        <el-col :span="6">
          <el-card class="overview-card score-card">
            <div class="score-display">
              <div class="score-circle">
                <div class="score-value">{{ userCredit.currentScore }}</div>
                <div class="score-label">信用分</div>
              </div>
              <div class="score-level">
                <el-tag :type="getCreditTagType(userCredit.level)" size="large">
                  {{ userCredit.level || '暂无等级' }}
                </el-tag>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="overview-card trend-card">
            <div class="trend-display">
              <div class="trend-title">月度趋势</div>
              <div class="trend-value" :class="{ positive: userCredit.monthlyTrend > 0, negative: userCredit.monthlyTrend < 0 }">
                <el-icon><TrendCharts /></el-icon>
                <span>{{ userCredit.monthlyTrend > 0 ? '+' : '' }}{{ userCredit.monthlyTrend || 0 }}</span>
              </div>
              <div class="trend-desc">{{ getTrendDesc(userCredit.monthlyTrend) }}</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="overview-card rank-card">
            <div class="rank-display">
              <div class="rank-title">用户排名</div>
              <div class="rank-value">#{{ userCredit.rank || '-' }}</div>
              <div class="rank-desc">{{ getRankDesc(userCredit.rank) }}</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="overview-card evaluation-card">
            <div class="evaluation-display">
              <div class="evaluation-title">评估次数</div>
              <div class="evaluation-value">{{ userCredit.evaluationCount || 0 }}</div>
              <div class="evaluation-desc">次历史评估</div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 操作按钮 -->
    <div class="chart-actions">
      <el-button
        type="primary"
        :icon="Edit"
        @click="showManualDialog = true"
      >
        手动调整
      </el-button>
      <el-button
        :icon="Refresh"
        @click="refreshData"
      >
        刷新数据
      </el-button>
      <el-button
        :icon="Download"
        @click="exportReport"
      >
        导出报告
      </el-button>
      <el-button
        :icon="Setting"
        @click="showFactorDialog = true"
      >
        因子配置
      </el-button>
    </div>

    <!-- 图表区域 -->
    <div class="charts-container">
      <el-row :gutter="16">
        <!-- 信用趋势图 -->
        <el-col :span="12">
          <el-card class="chart-card" title="信用分趋势">
            <template #header>
              <div class="card-header">
                <span>信用分趋势</span>
                <el-select
                  v-model="trendPeriod"
                  size="small"
                  @change="updateTrendChart"
                >
                  <el-option label="最近7天" value="7d" />
                  <el-option label="最近30天" value="30d" />
                  <el-option label="最近3个月" value="3m" />
                  <el-option label="最近6个月" value="6m" />
                  <el-option label="最近1年" value="1y" />
                </el-select>
              </div>
            </template>
            <div ref="trendChartRef" class="chart-content"></div>
          </el-card>
        </el-col>

        <!-- 影响因素图 -->
        <el-col :span="12">
          <el-card class="chart-card" title="影响因素分析">
            <template #header>
              <div class="card-header">
                <span>影响因素分析</span>
                <el-button
                  type="text"
                  size="small"
                  @click="showFactorDialog = true"
                >
                  配置
                </el-button>
              </div>
            </template>
            <div ref="factorChartRef" class="chart-content"></div>
          </el-card>
        </el-col>
      </el-row>

      <el-row :gutter="16" style="margin-top: 16px;">
        <!-- 信用等级分布 -->
        <el-col :span="12">
          <el-card class="chart-card" title="信用等级分布">
            <div ref="distributionChartRef" class="chart-content"></div>
          </el-card>
        </el-col>

        <!-- 同比分析 -->
        <el-col :span="12">
          <el-card class="chart-card" title="同比分析">
            <template #header>
              <div class="card-header">
                <span>同比分析</span>
                <el-select
                  v-model="comparisonType"
                  size="small"
                  @change="updateComparisonChart"
                >
                  <el-option label="环比" value="mom" />
                  <el-option label="同比" value="yoy" />
                </el-select>
              </div>
            </template>
            <div ref="comparisonChartRef" class="chart-content"></div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 手动调整对话框 -->
    <el-dialog
      v-model="showManualDialog"
      title="手动调整信用分"
      width="600px"
    >
      <el-form
        ref="manualFormRef"
        :model="manualForm"
        :rules="manualFormRules"
        label-width="100px"
      >
        <el-form-item label="调整类型" prop="type">
          <el-select v-model="manualForm.type" placeholder="请选择调整类型">
            <el-option label="手动评分" value="manual" />
            <el-option label="行为奖励" value="behavior_reward" />
            <el-option label="行为惩罚" value="behavior_punishment" />
            <el-option label="信用修复" value="credit_repair" />
            <el-option label="特殊调整" value="special" />
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

        <el-form-item label="调整原因" prop="reason">
          <el-input
            v-model="manualForm.reason"
            type="textarea"
            :rows="3"
            placeholder="请输入调整原因"
          />
        </el-form-item>

        <el-form-item label="调整说明" prop="comment">
          <el-input
            v-model="manualForm.comment"
            type="textarea"
            :rows="2"
            placeholder="请输入调整说明（可选）"
          />
        </el-form-item>

        <el-form-item label="生效时间">
          <el-radio-group v-model="manualForm.effectiveTime">
            <el-radio label="immediate">立即生效</el-radio>
            <el-radio label="next_cycle">下个周期</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="showManualDialog = false">取消</el-button>
        <el-button
          type="primary"
          :loading="manualSubmitting"
          @click="submitManualAdjustment"
        >
          确认调整
        </el-button>
      </template>
    </el-dialog>

    <!-- 因子配置对话框 -->
    <el-dialog
      v-model="showFactorDialog"
      title="信用因子配置"
      width="800px"
    >
      <CreditFactors :user-id="userId" @factor-updated="updateFactorChart" />
    </el-dialog>

    <!-- 导出报告对话框 -->
    <el-dialog
      v-model="showExportDialog"
      title="导出信用报告"
      width="500px"
    >
      <el-form :model="exportForm" label-width="100px">
        <el-form-item label="报告类型">
          <el-checkbox-group v-model="exportForm.types">
            <el-checkbox label="summary">概要报告</el-checkbox>
            <el-checkbox label="detail">详细报告</el-checkbox>
            <el-checkbox label="chart">图表报告</el-checkbox>
            <el-checkbox label="history">历史报告</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="时间范围">
          <el-select v-model="exportForm.period">
            <el-option label="最近1个月" value="1m" />
            <el-option label="最近3个月" value="3m" />
            <el-option label="最近6个月" value="6m" />
            <el-option label="最近1年" value="1y" />
            <el-option label="全部时间" value="all" />
          </el-select>
        </el-form-item>

        <el-form-item label="导出格式">
          <el-radio-group v-model="exportForm.format">
            <el-radio label="pdf">PDF格式</el-radio>
            <el-radio label="excel">Excel格式</el-radio>
            <el-radio label="word">Word格式</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="showExportDialog = false">取消</el-button>
        <el-button
          type="primary"
          :loading="exportLoading"
          @click="doExport"
        >
          确认导出
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, nextTick, defineProps } from 'vue'
import { ElMessage, ElForm } from 'element-plus'
import {
  Edit,
  Refresh,
  Download,
  Setting,
  TrendCharts
} from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import type { UserProps } from '@/types/user'
import { UserApiService } from '@/api/user'
import CreditFactors from './CreditFactors.vue'

// Props
interface Props {
  userId: string
}

const props = defineProps<Props>()

// Refs
const trendChartRef = ref<HTMLElement>()
const factorChartRef = ref<HTMLElement>()
const distributionChartRef = ref<HTMLElement>()
const comparisonChartRef = ref<HTMLElement>()
const manualFormRef = ref<InstanceType<typeof ElForm>>()

// 响应式数据
const loading = ref(false)
const manualSubmitting = ref(false)
const exportLoading = ref(false)
const showManualDialog = ref(false)
const showFactorDialog = ref(false)
const showExportDialog = ref(false)
const trendPeriod = ref('30d')
const comparisonType = ref('mom')

const userCredit = reactive({
  currentScore: 750,
  level: 'A',
  monthlyTrend: 15,
  rank: 1250,
  evaluationCount: 8
})

const manualForm = reactive({
  type: '',
  scoreChange: 0,
  reason: '',
  comment: '',
  effectiveTime: 'immediate'
})

const exportForm = reactive({
  types: ['summary', 'detail'],
  period: '3m',
  format: 'pdf'
})

const manualFormRules = {
  type: [
    { required: true, message: '请选择调整类型', trigger: 'change' }
  ],
  scoreChange: [
    { required: true, message: '请输入调整分数', trigger: 'blur' }
  ],
  reason: [
    { required: true, message: '请输入调整原因', trigger: 'blur' }
  ]
}

let trendChart: echarts.ECharts | null = null
let factorChart: echarts.ECharts | null = null
let distributionChart: echarts.ECharts | null = null
let comparisonChart: echarts.ECharts | null = null

// Methods
const initCharts = async () => {
  await nextTick()

  // 初始化趋势图
  if (trendChartRef.value) {
    trendChart = echarts.init(trendChartRef.value)
    updateTrendChart()
  }

  // 初始化因素图
  if (factorChartRef.value) {
    factorChart = echarts.init(factorChartRef.value)
    updateFactorChart()
  }

  // 初始化分布图
  if (distributionChartRef.value) {
    distributionChart = echarts.init(distributionChartRef.value)
    updateDistributionChart()
  }

  // 初始化对比图
  if (comparisonChartRef.value) {
    comparisonChart = echarts.init(comparisonChartRef.value)
    updateComparisonChart()
  }
}

const updateTrendChart = () => {
  if (!trendChart) return

  // 生成模拟数据
  const dates = []
  const scores = []
  const now = new Date()

  for (let i = 29; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
    dates.push(date.toLocaleDateString())
    scores.push(Math.floor(650 + Math.random() * 150))
  }

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
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
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(64, 158, 255, 0.3)' },
              { offset: 1, color: 'rgba(64, 158, 255, 0.1)' }
            ]
          }
        }
      }
    ]
  }

  trendChart.setOption(option)
}

const updateFactorChart = () => {
  if (!factorChart) return

  const data = [
    { name: '历史信用', value: 25 },
    { name: '行为数据', value: 20 },
    { name: '交易记录', value: 18 },
    { name: '身份信息', value: 15 },
    { name: '社交关系', value: 12 },
    { name: '资产状况', value: 10 }
  ]

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c}% ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: '影响因素',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '16',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: data
      }
    ]
  }

  factorChart.setOption(option)
}

const updateDistributionChart = () => {
  if (!distributionChart) return

  const data = [
    { name: 'AAA', value: 5 },
    { name: 'AA', value: 15 },
    { name: 'A', value: 35 },
    { name: 'B', value: 25 },
    { name: 'C', value: 15 },
    { name: 'D', value: 5 }
  ]

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    xAxis: {
      type: 'category',
      data: data.map(item => item.name)
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: data.map(item => item.value),
        type: 'bar',
        showBackground: true,
        backgroundStyle: {
          color: 'rgba(180, 180, 180, 0.2)'
        },
        itemStyle: {
          color: function(params) {
            const colors = ['#67C23A', '#67C23A', '#67C23A', '#E6A23C', '#F56C6C', '#F56C6C']
            return colors[params.dataIndex]
          }
        }
      }
    ]
  }

  distributionChart.setOption(option)
}

const updateComparisonChart = () => {
  if (!comparisonChart) return

  const categories = ['本月', '上月', '去年同期']
  const currentData = [750, 735, 680]
  const averageData = [720, 710, 690]

  const option = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['当前用户', '平均水平']
    },
    xAxis: {
      type: 'category',
      data: categories
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '当前用户',
        type: 'bar',
        data: currentData,
        itemStyle: {
          color: '#409EFF'
        }
      },
      {
        name: '平均水平',
        type: 'bar',
        data: averageData,
        itemStyle: {
          color: '#E6A23C'
        }
      }
    ]
  }

  comparisonChart.setOption(option)
}

const refreshData = async () => {
  loading.value = true
  try {
    // 重新加载用户信用数据
    // const creditData = await UserApiService.getUserCreditScore(props.userId)
    // Object.assign(userCredit, creditData)

    // 更新所有图表
    updateTrendChart()
    updateFactorChart()
    updateDistributionChart()
    updateComparisonChart()

    ElMessage.success('数据刷新成功')
  } catch (error) {
    console.error('Failed to refresh data:', error)
    ElMessage.error('数据刷新失败')
  } finally {
    loading.value = false
  }
}

const submitManualAdjustment = async () => {
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

    ElMessage.success('信用分调整成功')
    showManualDialog.value = false
    refreshData()
  } catch (error: any) {
    if (error.message) {
      ElMessage.error(error.message)
    }
  } finally {
    manualSubmitting.value = false
  }
}

const exportReport = () => {
  showExportDialog.value = true
}

const doExport = async () => {
  exportLoading.value = true
  try {
    // 实现导出逻辑
    ElMessage.success('报告导出成功')
    showExportDialog.value = false
  } catch (error) {
    ElMessage.error('导出失败')
  } finally {
    exportLoading.value = false
  }
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

const getTrendDesc = (trend: number) => {
  if (trend > 20) return '大幅上升'
  if (trend > 5) return '小幅上升'
  if (trend > -5) return '保持稳定'
  if (trend > -20) return '小幅下降'
  return '大幅下降'
}

const getRankDesc = (rank: number) => {
  if (rank < 100) return '顶尖水平'
  if (rank < 500) return '优秀水平'
  if (rank < 1000) return '良好水平'
  if (rank < 5000) return '一般水平'
  return '有待提升'
}

const handleResize = () => {
  trendChart?.resize()
  factorChart?.resize()
  distributionChart?.resize()
  comparisonChart?.resize()
}

// 生命周期
onMounted(async () => {
  await initCharts()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  trendChart?.dispose()
  factorChart?.dispose()
  distributionChart?.dispose()
  comparisonChart?.dispose()
})
</script>

<style scoped lang="scss">
.credit-chart {
  .credit-overview {
    margin-bottom: 24px;

    .overview-card {
      height: 140px;

      .score-display {
        text-align: center;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 20px 0;

        .score-circle {
          .score-value {
            font-size: 36px;
            font-weight: bold;
            color: #409EFF;
            margin-bottom: 4px;
          }

          .score-label {
            font-size: 14px;
            color: #909399;
          }
        }

        .score-level {
          margin-top: 8px;
        }
      }

      .trend-display,
      .rank-display,
      .evaluation-display {
        text-align: center;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 0 16px;

        .trend-title,
        .rank-title,
        .evaluation-title {
          font-size: 14px;
          color: #909399;
          margin-bottom: 8px;
        }

        .trend-value,
        .rank-value,
        .evaluation-value {
          font-size: 24px;
          font-weight: bold;
          color: #303133;
          margin-bottom: 4px;
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

        .trend-desc,
        .rank-desc,
        .evaluation-desc {
          font-size: 12px;
          color: #c0c4cc;
        }
      }
    }
  }

  .chart-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .charts-container {
    .chart-card {
      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        span {
          font-weight: 500;
          color: #303133;
        }
      }

      .chart-content {
        height: 300px;
      }
    }
  }
}

// 响应式设计
@media (max-width: 1200px) {
  .credit-chart {
    .charts-container {
      .el-col {
        margin-bottom: 16px;
      }
    }
  }
}
</style>