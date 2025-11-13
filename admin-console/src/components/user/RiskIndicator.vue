<template>
  <div class="risk-indicator">
    <!-- 风险概览仪表盘 -->
    <div class="risk-dashboard">
      <el-row :gutter="16">
        <!-- 当前风险等级 -->
        <el-col :span="6">
          <el-card class="dashboard-card risk-level-card">
            <div class="risk-gauge">
              <div class="gauge-container">
                <div class="gauge-circle">
                  <div class="gauge-value">{{ userRisk.currentScore }}</div>
                  <div class="gauge-label">风险评分</div>
                </div>
                <div class="risk-level-display">
                  <el-tag :type="getRiskTagType(userRisk.currentLevel)" size="large">
                    {{ getRiskLevelText(userRisk.currentLevel) }}
                  </el-tag>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>

        <!-- 风险趋势 -->
        <el-col :span="6">
          <el-card class="dashboard-card trend-card">
            <div class="trend-display">
              <div class="trend-header">
                <span class="trend-title">风险趋势</span>
                <el-icon class="trend-icon" :class="getTrendClass(userRisk.trend)">
                  <TrendCharts />
                </el-icon>
              </div>
              <div class="trend-value" :class="getTrendClass(userRisk.trend)">
                {{ userRisk.trend > 0 ? '+' : '' }}{{ userRisk.trend || 0 }}%
              </div>
              <div class="trend-desc">{{ getTrendDesc(userRisk.trend) }}</div>
            </div>
          </el-card>
        </el-col>

        <!-- 近期事件 -->
        <el-col :span="6">
          <el-card class="dashboard-card events-card">
            <div class="events-display">
              <div class="events-header">
                <span class="events-title">近期事件</span>
                <el-badge :value="userRisk.recentEvents" class="events-badge" />
              </div>
              <div class="events-value">{{ userRisk.recentEvents || 0 }}</div>
              <div class="events-desc">7天内风险事件</div>
            </div>
          </el-card>
        </el-col>

        <!-- 风险评分变化 -->
        <el-col :span="6">
          <el-card class="dashboard-card score-change-card">
            <div class="score-change-display">
              <div class="change-header">
                <span class="change-title">评分变化</span>
              </div>
              <div class="change-value" :class="{ positive: userRisk.scoreChange > 0, negative: userRisk.scoreChange < 0 }">
                {{ userRisk.scoreChange > 0 ? '+' : '' }}{{ userRisk.scoreChange || 0 }}
              </div>
              <div class="change-desc">较上月变化</div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 操作按钮 -->
    <div class="indicator-actions">
      <el-button
        type="danger"
        :icon="Warning"
        @click="showAddEventDialog = true"
      >
        添加风险事件
      </el-button>
      <el-button
        type="primary"
        :icon="Setting"
        @click="showRulesDialog = true"
      >
        风控规则
      </el-button>
      <el-button
        :icon="Document"
        @click="generateReport"
      >
        生成报告
      </el-button>
      <el-button
        :icon="Refresh"
        @click="refreshRiskData"
      >
        刷新数据
      </el-button>
    </div>

    <!-- 实时监控图表 -->
    <div class="monitoring-charts">
      <el-row :gutter="16">
        <!-- 风险评分趋势 -->
        <el-col :span="12">
          <el-card class="chart-card" title="风险评分趋势">
            <template #header>
              <div class="card-header">
                <span>风险评分趋势</span>
                <el-select
                  v-model="trendPeriod"
                  size="small"
                  @change="updateRiskTrendChart"
                >
                  <el-option label="最近24小时" value="24h" />
                  <el-option label="最近7天" value="7d" />
                  <el-option label="最近30天" value="30d" />
                </el-select>
              </div>
            </template>
            <div ref="riskTrendChartRef" class="chart-content"></div>
          </el-card>
        </el-col>

        <!-- 风险类型分布 -->
        <el-col :span="12">
          <el-card class="chart-card" title="风险类型分布">
            <div ref="riskDistributionChartRef" class="chart-content"></div>
          </el-card>
        </el-col>
      </el-row>

      <el-row :gutter="16" style="margin-top: 16px;">
        <!-- 风险热力图 -->
        <el-col :span="12">
          <el-card class="chart-card" title="风险时间分布">
            <div ref="riskHeatmapChartRef" class="chart-content"></div>
          </el-card>
        </el-col>

        <!-- 实时预警 -->
        <el-col :span="12">
          <el-card class="chart-card" title="实时预警">
            <div class="real-time-alerts">
              <div
                v-for="alert in realTimeAlerts"
                :key="alert.id"
                class="alert-item"
                :class="alert.level"
              >
                <div class="alert-icon">
                  <el-icon><Warning /></el-icon>
                </div>
                <div class="alert-content">
                  <div class="alert-title">{{ alert.title }}</div>
                  <div class="alert-desc">{{ alert.description }}</div>
                  <div class="alert-time">{{ formatDate(alert.createdAt, 'MM-DD HH:mm') }}</div>
                </div>
                <div class="alert-actions">
                  <el-button
                    type="text"
                    size="small"
                    @click="handleAlert(alert)"
                  >
                    处理
                  </el-button>
                </div>
              </div>
              <div v-if="!realTimeAlerts.length" class="no-alerts">
                <el-icon><SuccessFilled /></el-icon>
                <span>暂无实时预警</span>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 添加风险事件对话框 -->
    <el-dialog
      v-model="showAddEventDialog"
      title="添加风险事件"
      width="600px"
    >
      <el-form
        ref="eventFormRef"
        :model="eventForm"
        :rules="eventFormRules"
        label-width="100px"
      >
        <el-form-item label="事件类型" prop="type">
          <el-select v-model="eventForm.type" placeholder="请选择事件类型">
            <el-option label="登录异常" value="login_abnormal" />
            <el-option label="行为异常" value="behavior_anomaly" />
            <el-option label="交易风险" value="transaction_risk" />
            <el-option label="投诉风险" value="complaint_risk" />
            <el-option label="信用风险" value="credit_risk" />
            <el-option label="系统预警" value="system_alert" />
            <el-option label="人工举报" value="manual_report" />
          </el-select>
        </el-form-item>

        <el-form-item label="风险等级" prop="level">
          <el-select v-model="eventForm.level" placeholder="请选择风险等级">
            <el-option label="低风险" value="low" />
            <el-option label="中风险" value="medium" />
            <el-option label="高风险" value="high" />
            <el-option label="严重风险" value="critical" />
          </el-select>
        </el-form-item>

        <el-form-item label="风险评分" prop="score">
          <el-input-number
            v-model="eventForm.score"
            :min="0"
            :max="100"
            placeholder="风险评分（0-100）"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="事件描述" prop="description">
          <el-input
            v-model="eventForm.description"
            type="textarea"
            :rows="3"
            placeholder="请详细描述风险事件"
          />
        </el-form-item>

        <el-form-item label="处理建议" prop="suggestion">
          <el-input
            v-model="eventForm.suggestion"
            type="textarea"
            :rows="2"
            placeholder="请输入处理建议（可选）"
          />
        </el-form-item>

        <el-form-item label="相关证据">
          <el-upload
            v-model:file-list="eventForm.evidence"
            :auto-upload="false"
            multiple
            :limit="5"
          >
            <el-button type="primary">上传证据</el-button>
          </el-upload>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="showAddEventDialog = false">取消</el-button>
        <el-button
          type="danger"
          :loading="eventSubmitting"
          @click="submitRiskEvent"
        >
          确认添加
        </el-button>
      </template>
    </el-dialog>

    <!-- 风控规则对话框 -->
    <el-dialog
      v-model="showRulesDialog"
      title="风控规则管理"
      width="900px"
    >
      <RiskRules :user-id="userId" />
    </el-dialog>

    <!-- 风险报告对话框 -->
    <el-dialog
      v-model="showReportDialog"
      title="风险报告"
      width="800px"
    >
      <div v-if="riskReport" class="risk-report">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="报告生成时间">
            {{ formatDate(riskReport.generatedAt, 'YYYY-MM-DD HH:mm:ss') }}
          </el-descriptions-item>
          <el-descriptions-item label="评估周期">
            {{ riskReport.period }}
          </el-descriptions-item>
          <el-descriptions-item label="当前风险等级">
            <el-tag :type="getRiskTagType(riskReport.currentLevel)">
              {{ getRiskLevelText(riskReport.currentLevel) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="风险评分">
            {{ riskReport.currentScore }}
          </el-descriptions-item>
        </el-descriptions>

        <div class="report-summary">
          <h4>风险评估摘要</h4>
          <div v-html="riskReport.summary"></div>
        </div>

        <div class="report-recommendations">
          <h4>风控建议</h4>
          <ul>
            <li v-for="recommendation in riskReport.recommendations" :key="recommendation">
              {{ recommendation }}
            </li>
          </ul>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, nextTick, defineProps } from 'vue'
import { ElMessage, ElForm } from 'element-plus'
import {
  Warning,
  Setting,
  Document,
  Refresh,
  TrendCharts,
  SuccessFilled
} from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import { formatDate, formatRiskLevel } from '@/utils/formatters'
import RiskRules from './RiskRules.vue'

// Props
interface Props {
  userId: string
}

const props = defineProps<Props>()

// Refs
const riskTrendChartRef = ref<HTMLElement>()
const riskDistributionChartRef = ref<HTMLElement>()
const riskHeatmapChartRef = ref<HTMLElement>()
const eventFormRef = ref<InstanceType<typeof ElForm>>()

// 响应式数据
const loading = ref(false)
const eventSubmitting = ref(false)
const showAddEventDialog = ref(false)
const showRulesDialog = ref(false)
const showReportDialog = ref(false)
const trendPeriod = ref('7d')

const userRisk = reactive({
  currentScore: 65,
  currentLevel: 'medium',
  trend: -5,
  recentEvents: 2,
  scoreChange: -3
})

const realTimeAlerts = ref([
  {
    id: '1',
    title: '异常登录检测',
    description: '用户在异地登录，存在账号被盗风险',
    level: 'high',
    createdAt: '2025-11-12T10:30:00Z'
  },
  {
    id: '2',
    title: '交易频率异常',
    description: '用户交易频率明显高于平时',
    level: 'medium',
    createdAt: '2025-11-12T09:15:00Z'
  }
])

const eventForm = reactive({
  type: '',
  level: '',
  score: 0,
  description: '',
  suggestion: '',
  evidence: []
})

const eventFormRules = {
  type: [
    { required: true, message: '请选择事件类型', trigger: 'change' }
  ],
  level: [
    { required: true, message: '请选择风险等级', trigger: 'change' }
  ],
  score: [
    { required: true, message: '请输入风险评分', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入事件描述', trigger: 'blur' }
  ]
}

const riskReport = ref<any>(null)

let riskTrendChart: echarts.ECharts | null = null
let riskDistributionChart: echarts.ECharts | null = null
let riskHeatmapChart: echarts.ECharts | null = null

// Methods
const initCharts = async () => {
  await nextTick()

  if (riskTrendChartRef.value) {
    riskTrendChart = echarts.init(riskTrendChartRef.value)
    updateRiskTrendChart()
  }

  if (riskDistributionChartRef.value) {
    riskDistributionChart = echarts.init(riskDistributionChartRef.value)
    updateRiskDistributionChart()
  }

  if (riskHeatmapChartRef.value) {
    riskHeatmapChart = echarts.init(riskHeatmapChartRef.value)
    updateRiskHeatmapChart()
  }
}

const updateRiskTrendChart = () => {
  if (!riskTrendChart) return

  const hours = []
  const scores = []
  const now = new Date()

  for (let i = 23; i >= 0; i--) {
    const hour = new Date(now.getTime() - i * 60 * 60 * 1000)
    hours.push(hour.getHours() + ':00')
    scores.push(Math.floor(50 + Math.random() * 40))
  }

  const option = {
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: hours,
      axisLabel: {
        rotate: 45
      }
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100
    },
    series: [
      {
        data: scores,
        type: 'line',
        smooth: true,
        lineStyle: {
          width: 2,
          color: '#F56C6C'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(245, 108, 108, 0.3)' },
              { offset: 1, color: 'rgba(245, 108, 108, 0.1)' }
            ]
          }
        }
      }
    ]
  }

  riskTrendChart.setOption(option)
}

const updateRiskDistributionChart = () => {
  if (!riskDistributionChart) return

  const data = [
    { name: '登录异常', value: 3 },
    { name: '行为异常', value: 2 },
    { name: '交易风险', value: 1 },
    { name: '投诉风险', value: 0 },
    { name: '信用风险', value: 1 },
    { name: '系统预警', value: 2 }
  ]

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: '风险类型',
        type: 'pie',
        radius: '50%',
        data: data,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }

  riskDistributionChart.setOption(option)
}

const updateRiskHeatmapChart = () => {
  if (!riskHeatmapChart) return

  // 生成24小时 x 7天的热力图数据
  const data = []
  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      data.push([hour, day, Math.floor(Math.random() * 10)])
    }
  }

  const option = {
    tooltip: {
      position: 'top'
    },
    grid: {
      height: '50%',
      top: '10%'
    },
    xAxis: {
      type: 'category',
      data: Array.from({ length: 24 }, (_, i) => i + ':00'),
      splitArea: {
        show: true
      }
    },
    yAxis: {
      type: 'category',
      data: ['周日', '周六', '周五', '周四', '周三', '周二', '周一'],
      splitArea: {
        show: true
      }
    },
    visualMap: {
      min: 0,
      max: 10,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: '15%'
    },
    series: [
      {
        name: '风险事件',
        type: 'heatmap',
        data: data,
        label: {
          show: true
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }

  riskHeatmapChart.setOption(option)
}

const refreshRiskData = async () => {
  loading.value = true
  try {
    // 重新加载用户风险数据
    // const riskData = await UserApiService.getUserRiskLevel(props.userId)
    // Object.assign(userRisk, riskData)

    // 更新图表
    updateRiskTrendChart()
    updateRiskDistributionChart()
    updateRiskHeatmapChart()

    ElMessage.success('数据刷新成功')
  } catch (error) {
    console.error('Failed to refresh risk data:', error)
    ElMessage.error('数据刷新失败')
  } finally {
    loading.value = false
  }
}

const submitRiskEvent = async () => {
  if (!eventFormRef.value) return

  try {
    await eventFormRef.value.validate()

    eventSubmitting.value = true

    // await UserApiService.createRiskEvent(props.userId, eventForm)
    ElMessage.success('风险事件添加成功')
    showAddEventDialog.value = false
    refreshRiskData()
  } catch (error: any) {
    if (error.message) {
      ElMessage.error(error.message)
    }
  } finally {
    eventSubmitting.value = false
  }
}

const handleAlert = (alert: any) => {
  ElMessage.info(`处理预警：${alert.title}`)
}

const generateReport = async () => {
  try {
    // 生成风险报告
    riskReport.value = {
      generatedAt: new Date().toISOString(),
      period: '最近30天',
      currentLevel: userRisk.currentLevel,
      currentScore: userRisk.currentScore,
      summary: '用户当前风险等级为中等，主要风险来源于登录异常和行为异常。建议加强身份验证，监控异常行为。',
      recommendations: [
        '启用双重身份验证',
        '加强异常登录监控',
        '定期风险评估',
        '完善用户行为分析'
      ]
    }

    showReportDialog.value = true
  } catch (error) {
    ElMessage.error('生成报告失败')
  }
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

const getRiskLevelText = (level: string) => {
  const levelMap: Record<string, string> = {
    low: '低风险',
    medium: '中风险',
    high: '高风险',
    critical: '严重风险'
  }
  return levelMap[level] || level
}

const getTrendClass = (trend: number) => {
  if (trend > 0) return 'negative'
  if (trend < 0) return 'positive'
  return 'neutral'
}

const getTrendDesc = (trend: number) => {
  if (trend > 10) return '风险大幅上升'
  if (trend > 0) return '风险小幅上升'
  if (trend < -10) return '风险大幅下降'
  if (trend < 0) return '风险小幅下降'
  return '风险保持稳定'
}

const handleResize = () => {
  riskTrendChart?.resize()
  riskDistributionChart?.resize()
  riskHeatmapChart?.resize()
}

// 生命周期
onMounted(async () => {
  await initCharts()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  riskTrendChart?.dispose()
  riskDistributionChart?.dispose()
  riskHeatmapChart?.dispose()
})
</script>

<style scoped lang="scss">
.risk-indicator {
  .risk-dashboard {
    margin-bottom: 24px;

    .dashboard-card {
      height: 140px;

      .risk-gauge {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .gauge-container {
          text-align: center;

          .gauge-circle {
            .gauge-value {
              font-size: 32px;
              font-weight: bold;
              color: #F56C6C;
              margin-bottom: 4px;
            }

            .gauge-label {
              font-size: 14px;
              color: #909399;
            }
          }

          .risk-level-display {
            margin-top: 12px;
          }
        }
      }

      .trend-display,
      .events-display,
      .score-change-display {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 0 16px;

        .trend-header,
        .events-header,
        .change-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;

          .trend-title,
          .events-title,
          .change-title {
            font-size: 14px;
            color: #909399;
          }

          .trend-icon {
            font-size: 16px;

            &.positive {
              color: #67c23a;
            }

            &.negative {
              color: #f56c6c;
            }

            &.neutral {
              color: #909399;
            }
          }

          .events-badge {
            margin-top: 2px;
          }
        }

        .trend-value,
        .events-value,
        .change-value {
          font-size: 24px;
          font-weight: bold;
          color: #303133;
          margin-bottom: 4px;

          &.positive {
            color: #67c23a;
          }

          &.negative {
            color: #f56c6c;
          }
        }

        .trend-desc,
        .events-desc,
        .change-desc {
          font-size: 12px;
          color: #c0c4cc;
        }
      }
    }
  }

  .indicator-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .monitoring-charts {
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

    .real-time-alerts {
      height: 300px;
      overflow-y: auto;

      .alert-item {
        display: flex;
        align-items: flex-start;
        padding: 12px;
        border-left: 4px solid #e6a23c;
        background-color: #fdf6ec;
        margin-bottom: 8px;
        border-radius: 4px;

        &.high {
          border-left-color: #f56c6c;
          background-color: #fef0f0;
        }

        &.low {
          border-left-color: #67c23a;
          background-color: #f0f9ff;
        }

        .alert-icon {
          margin-right: 8px;
          color: #e6a23c;
        }

        .alert-content {
          flex: 1;

          .alert-title {
            font-weight: 500;
            color: #303133;
            margin-bottom: 4px;
          }

          .alert-desc {
            font-size: 12px;
            color: #606266;
            margin-bottom: 4px;
          }

          .alert-time {
            font-size: 11px;
            color: #909399;
          }
        }

        .alert-actions {
          margin-left: 8px;
        }
      }

      .no-alerts {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        color: #c0c4cc;

        .el-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        span {
          font-size: 14px;
        }
      }
    }
  }

  .risk-report {
    .report-summary,
    .report-recommendations {
      margin-top: 16px;

      h4 {
        margin-bottom: 8px;
        color: #303133;
      }

      ul {
        padding-left: 20px;

        li {
          margin-bottom: 4px;
          color: #606266;
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 1200px) {
  .risk-indicator {
    .monitoring-charts {
      .el-col {
        margin-bottom: 16px;
      }
    }
  }
}
</style>