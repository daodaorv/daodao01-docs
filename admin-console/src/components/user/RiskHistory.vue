<template>
  <div class="risk-history">
    <!-- 风险概览卡片 -->
    <div class="risk-overview">
      <el-row :gutter="16">
        <el-col :span="6">
          <el-card class="overview-card">
            <div class="overview-content">
              <div class="overview-title">当前风险等级</div>
              <div class="overview-value">
                <el-tag :type="getRiskTagType(userRisk.currentLevel)">
                  {{ formatRiskLevel(userRisk.currentLevel) }}
                </el-tag>
              </div>
              <div class="overview-trend" :class="{ positive: userRisk.trend < 0, negative: userRisk.trend > 0 }">
                <el-icon><TrendCharts /></el-icon>
                <span>{{ userRisk.trend > 0 ? '上升' : userRisk.trend < 0 ? '下降' : '稳定' }}</span>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="overview-card">
            <div class="overview-content">
              <div class="overview-title">风险评分</div>
              <div class="overview-value">{{ userRisk.currentScore || '-' }}</div>
              <div class="overview-desc">满分100分</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="overview-card">
            <div class="overview-content">
              <div class="overview-title">本月事件</div>
              <div class="overview-value">{{ userRisk.monthlyEvents || 0 }}</div>
              <div class="overview-desc">{{ userRisk.monthlyEvents > 0 ? '需要关注' : '状态正常' }}</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="overview-card">
            <div class="overview-content">
              <div class="overview-title">累计事件</div>
              <div class="overview-value">{{ userRisk.totalEvents || 0 }}</div>
              <div class="overview-desc">历史总计</div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 操作按钮 -->
    <div class="action-bar">
      <el-button
        type="danger"
        :icon="Warning"
        @click="handleAddRiskEvent"
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
        :icon="Refresh"
        @click="loadRiskHistory"
      >
        刷新
      </el-button>
    </div>

    <!-- 风险事件表格 -->
    <el-table
      :data="riskEvents"
      v-loading="loading"
      row-key="id"
    >
      <el-table-column label="事件ID" prop="id" width="120" />

      <el-table-column label="事件类型" width="120">
        <template #default="{ row }">
          <el-tag :type="getTypeTagType(row.type)">
            {{ getTypeText(row.type) }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="风险等级" width="100">
        <template #default="{ row }">
          <el-tag :type="getRiskTagType(row.level)">
            {{ getRiskLevelText(row.level) }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="风险评分" width="100">
        <template #default="{ row }">
          <span :class="getRiskScoreClass(row.score)">{{ row.score }}</span>
        </template>
      </el-table-column>

      <el-table-column label="事件描述" prop="description" show-overflow-tooltip />

      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="getStatusTagType(row.status)">
            {{ getStatusText(row.status) }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="创建时间" width="180">
        <template #default="{ row }">
          {{ formatDate(row.createdAt, 'YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>

      <el-table-column label="处理时间" width="180">
        <template #default="{ row }">
          {{ row.handledAt ? formatDate(row.handledAt, 'YYYY-MM-DD HH:mm:ss') : '-' }}
        </template>
      </el-table-column>

      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button
            v-if="row.status === 'pending'"
            type="text"
            size="small"
            @click="handleProcessEvent(row)"
          >
            处理
          </el-button>
          <el-button
            type="text"
            size="small"
            @click="handleViewDetail(row)"
          >
            详情
          </el-button>
          <el-button
            type="text"
            size="small"
            @click="handleAddRule(row)"
          >
            添加规则
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

    <!-- 事件详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="风险事件详情"
      width="800px"
    >
      <div v-if="selectedEvent" class="event-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="事件ID">
            {{ selectedEvent.id }}
          </el-descriptions-item>
          <el-descriptions-item label="事件类型">
            <el-tag :type="getTypeTagType(selectedEvent.type)">
              {{ getTypeText(selectedEvent.type) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="风险等级">
            <el-tag :type="getRiskTagType(selectedEvent.level)">
              {{ getRiskLevelText(selectedEvent.level) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="风险评分">
            <span :class="getRiskScoreClass(selectedEvent.score)">{{ selectedEvent.score }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="事件状态">
            <el-tag :type="getStatusTagType(selectedEvent.status)">
              {{ getStatusText(selectedEvent.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="处理人">
            {{ selectedEvent.handlerName || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">
            {{ formatDate(selectedEvent.createdAt, 'YYYY-MM-DD HH:mm:ss') }}
          </el-descriptions-item>
          <el-descriptions-item label="处理时间">
            {{ selectedEvent.handledAt ? formatDate(selectedEvent.handledAt, 'YYYY-MM-DD HH:mm:ss') : '-' }}
          </el-descriptions-item>
        </el-descriptions>

        <div class="event-description">
          <h4>事件描述</h4>
          <p>{{ selectedEvent.description }}</p>
        </div>

        <div v-if="selectedEvent.evidence?.length" class="event-evidence">
          <h4>相关证据</h4>
          <div class="evidence-list">
            <div
              v-for="evidence in selectedEvent.evidence"
              :key="evidence.id"
              class="evidence-item"
            >
              <el-image
                v-if="evidence.type === 'image'"
                :src="evidence.url"
                :preview-src-list="[evidence.url]"
                style="width: 100px; height: 100px;"
                fit="cover"
              />
              <div v-else class="document-evidence">
                <el-icon><Document /></el-icon>
                <span>{{ evidence.name }}</span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="selectedEvent.handleComment" class="handle-comment">
          <h4>处理说明</h4>
          <p>{{ selectedEvent.handleComment }}</p>
        </div>
      </div>

      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 事件处理对话框 -->
    <el-dialog
      v-model="processDialogVisible"
      title="处理风险事件"
      width="600px"
    >
      <el-form
        ref="processFormRef"
        :model="processForm"
        :rules="processFormRules"
        label-width="100px"
      >
        <el-form-item label="处理方式" prop="action">
          <el-select v-model="processForm.action" placeholder="请选择处理方式">
            <el-option label="忽略" value="ignore" />
            <el-option label="警告" value="warn" />
            <el-option label="限制" value="restrict" />
            <el-option label="冻结" value="freeze" />
            <el-option label="加入黑名单" value="blacklist" />
          </el-select>
        </el-form-item>

        <el-form-item label="处理说明" prop="comment">
          <el-input
            v-model="processForm.comment"
            type="textarea"
            :rows="4"
            placeholder="请输入处理说明"
          />
        </el-form-item>

        <el-form-item label="后续措施" prop="followUp">
          <el-checkbox-group v-model="processForm.followUp">
            <el-checkbox label="monitor">持续监控</el-checkbox>
            <el-checkbox label="review">定期复查</el-checkbox>
            <el-checkbox label="report">上报主管</el-checkbox>
            <el-checkbox label="notify">通知用户</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="processDialogVisible = false">取消</el-button>
        <el-button
          type="danger"
          :loading="processSubmitting"
          @click="submitProcessEvent"
        >
          确认处理
        </el-button>
      </template>
    </el-dialog>

    <!-- 风控规则对话框 -->
    <el-dialog
      v-model="rulesDialogVisible"
      title="风控规则配置"
      width="900px"
    >
      <RiskRules :user-id="userId" />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, defineProps } from 'vue'
import { ElMessage, ElForm } from 'element-plus'
import {
  Warning,
  Setting,
  Refresh,
  TrendCharts,
  Document
} from '@element-plus/icons-vue'
import type { RiskEvent } from '@/types/user'
import { UserApiService } from '@/api/user'
import { formatDate, formatRiskLevel } from '@/utils/formatters'
import RiskRules from './RiskRules.vue'

// Props
interface Props {
  userId: string
}

const props = defineProps<Props>()

// Refs
const processFormRef = ref<InstanceType<typeof ElForm>>()

// 响应式数据
const loading = ref(false)
const riskEvents = ref<RiskEvent[]>([])
const selectedEvent = ref<RiskEvent | null>(null)
const detailDialogVisible = ref(false)
const processDialogVisible = ref(false)
const rulesDialogVisible = ref(false)
const processSubmitting = ref(false)

const userRisk = reactive({
  currentLevel: '',
  currentScore: 0,
  trend: 0,
  monthlyEvents: 0,
  totalEvents: 0
})

const processForm = reactive({
  action: '',
  comment: '',
  followUp: []
})

const processFormRules = {
  action: [
    { required: true, message: '请选择处理方式', trigger: 'change' }
  ],
  comment: [
    { required: true, message: '请输入处理说明', trigger: 'blur' }
  ]
}

const pagination = reactive({
  page: 1,
  size: 20,
  total: 0
})

// Methods
const loadRiskHistory = async () => {
  loading.value = true
  try {
    const [eventsResponse, riskResponse] = await Promise.all([
      UserApiService.getUserRiskEvents(props.userId, {
        page: pagination.page,
        size: pagination.size
      }),
      UserApiService.getUserRiskLevel(props.userId)
    ])

    riskEvents.value = eventsResponse.data
    pagination.total = eventsResponse.total

    // 更新用户风险信息
    Object.assign(userRisk, riskResponse)
  } catch (error) {
    console.error('Failed to load risk history:', error)
    ElMessage.error('加载风险历史失败')
  } finally {
    loading.value = false
  }
}

const handleAddRiskEvent = () => {
  ElMessage.info('添加风险事件功能开发中...')
}

const handleProcessEvent = (event: RiskEvent) => {
  selectedEvent.value = event
  processForm.action = ''
  processForm.comment = ''
  processForm.followUp = []
  processDialogVisible.value = true
}

const submitProcessEvent = async () => {
  if (!processFormRef.value || !selectedEvent.value) return

  try {
    await processFormRef.value.validate()

    processSubmitting.value = true

    await UserApiService.handleRiskEvent(selectedEvent.value.id, {
      action: processForm.action,
      comment: processForm.comment,
      followUp: processForm.followUp
    })

    ElMessage.success('风险事件处理成功')
    processDialogVisible.value = false
    loadRiskHistory()
  } catch (error: any) {
    if (error.message) {
      ElMessage.error(error.message)
    }
  } finally {
    processSubmitting.value = false
  }
}

const handleViewDetail = (event: RiskEvent) => {
  selectedEvent.value = event
  detailDialogVisible.value = true
}

const handleAddRule = (event: RiskEvent) => {
  ElMessage.info('基于事件添加规则功能开发中...')
}

const handleSizeChange = (size: number) => {
  pagination.size = size
  loadRiskHistory()
}

const handleCurrentChange = (page: number) => {
  pagination.page = page
  loadRiskHistory()
}

// 工具方法
const getTypeText = (type: string) => {
  const typeMap: Record<string, string> = {
    login_abnormal: '登录异常',
    behavior_anomaly: '行为异常',
    transaction_risk: '交易风险',
    complaint_risk: '投诉风险',
    credit_risk: '信用风险',
    system_alert: '系统预警',
    manual_report: '人工举报'
  }
  return typeMap[type] || type
}

const getTypeTagType = (type: string) => {
  const typeMap: Record<string, string> = {
    login_abnormal: 'warning',
    behavior_anomaly: 'danger',
    transaction_risk: 'danger',
    complaint_risk: 'warning',
    credit_risk: 'danger',
    system_alert: 'info',
    manual_report: 'warning'
  }
  return typeMap[type] || 'info'
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

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    pending: '待处理',
    processing: '处理中',
    resolved: '已解决',
    ignored: '已忽略'
  }
  return statusMap[status] || status
}

const getStatusTagType = (status: string) => {
  const statusMap: Record<string, string> = {
    pending: 'warning',
    processing: 'primary',
    resolved: 'success',
    ignored: 'info'
  }
  return statusMap[status] || 'info'
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

const getRiskScoreClass = (score: number) => {
  if (score >= 80) return 'risk-high'
  if (score >= 60) return 'risk-medium'
  return 'risk-low'
}

// 生命周期
onMounted(() => {
  loadRiskHistory()
})
</script>

<style scoped lang="scss">
.risk-history {
  .risk-overview {
    margin-bottom: 24px;

    .overview-card {
      .overview-content {
        text-align: center;

        .overview-title {
          font-size: 14px;
          color: #909399;
          margin-bottom: 8px;
        }

        .overview-value {
          font-size: 24px;
          font-weight: bold;
          color: #303133;
          margin-bottom: 4px;
        }

        .overview-trend {
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

        .overview-desc {
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

  .pagination-wrapper {
    display: flex;
    justify-content: center;
    margin-top: 16px;
  }

  .event-detail {
    .event-description,
    .event-evidence,
    .handle-comment {
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

    .event-evidence {
      .evidence-list {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;

        .evidence-item {
          .document-evidence {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 100px;
            height: 100px;
            border: 1px dashed #dcdfe6;
            border-radius: 4px;
            color: #909399;
            background-color: #fafafa;

            .el-icon {
              font-size: 24px;
              margin-bottom: 8px;
            }

            span {
              font-size: 12px;
              text-align: center;
              word-break: break-all;
              padding: 0 4px;
            }
          }
        }
      }
    }
  }

  .risk-high {
    color: #f56c6c;
    font-weight: bold;
  }

  .risk-medium {
    color: #e6a23c;
    font-weight: bold;
  }

  .risk-low {
    color: #67c23a;
    font-weight: bold;
  }
}
</style>