<template>
  <div class="audit-history">
    <!-- 操作按钮 -->
    <div class="table-header">
      <el-button
        type="primary"
        :icon="Plus"
        @click="handleAddAudit"
      >
        添加审核记录
      </el-button>
      <el-button
        :icon="Refresh"
        @click="loadAuditHistory"
      >
        刷新
      </el-button>
    </div>

    <!-- 审核历史表格 -->
    <el-table
      :data="auditHistory"
      v-loading="loading"
      row-key="id"
    >
      <el-table-column label="审核ID" prop="id" width="120" />

      <el-table-column label="审核类型" width="120">
        <template #default="{ row }">
          <el-tag :type="getAuditTypeTagType(row.type)">
            {{ getAuditTypeText(row.type) }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="审核状态" width="120">
        <template #default="{ row }">
          <el-tag :type="getStatusTagType(row.status)">
            {{ getStatusText(row.status) }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="审核结果" width="100">
        <template #default="{ row }">
          <el-tag
            :type="row.result === 'approved' ? 'success' : row.result === 'rejected' ? 'danger' : 'warning'"
            size="small"
          >
            {{ getResultText(row.result) }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="审核人" prop="auditorName" width="120" />

      <el-table-column label="审核时间" width="180">
        <template #default="{ row }">
          {{ formatDate(row.createdAt, 'YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>

      <el-table-column label="审核意见" prop="comment" show-overflow-tooltip />

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

    <!-- 审核详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="审核详情"
      width="800px"
    >
      <div v-if="selectedAudit" class="audit-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="审核ID">
            {{ selectedAudit.id }}
          </el-descriptions-item>
          <el-descriptions-item label="审核类型">
            <el-tag :type="getAuditTypeTagType(selectedAudit.type)">
              {{ getAuditTypeText(selectedAudit.type) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="审核状态">
            <el-tag :type="getStatusTagType(selectedAudit.status)">
              {{ getStatusText(selectedAudit.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="审核结果">
            <el-tag
              :type="selectedAudit.result === 'approved' ? 'success' : selectedAudit.result === 'rejected' ? 'danger' : 'warning'"
            >
              {{ getResultText(selectedAudit.result) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="审核人">
            {{ selectedAudit.auditorName }}
          </el-descriptions-item>
          <el-descriptions-item label="审核时间">
            {{ formatDate(selectedAudit.createdAt, 'YYYY-MM-DD HH:mm:ss') }}
          </el-descriptions-item>
        </el-descriptions>

        <div class="audit-comment" v-if="selectedAudit.comment">
          <h4>审核意见</h4>
          <p>{{ selectedAudit.comment }}</p>
        </div>

        <div class="audit-evidence" v-if="selectedAudit.evidence?.length">
          <h4>审核证据</h4>
          <div class="evidence-list">
            <div
              v-for="evidence in selectedAudit.evidence"
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
              <div v-else-if="evidence.type === 'document'" class="document-evidence">
                <el-icon><Document /></el-icon>
                <span>{{ evidence.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, defineProps } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, Refresh, Document } from '@element-plus/icons-vue'
import type { AuditRecord } from '@/types/user'
import { UserApiService } from '@/api/user'
import { formatDate } from '@/utils/formatters'

// Props
interface Props {
  userId: string
}

const props = defineProps<Props>()

// 响应式数据
const loading = ref(false)
const auditHistory = ref<AuditRecord[]>([])
const selectedAudit = ref<AuditRecord | null>(null)
const detailDialogVisible = ref(false)

const pagination = reactive({
  page: 1,
  size: 20,
  total: 0
})

// Methods
const loadAuditHistory = async () => {
  loading.value = true
  try {
    const response = await UserApiService.getUserAuditHistory(props.userId, {
      page: pagination.page,
      size: pagination.size
    })

    auditHistory.value = response.data
    pagination.total = response.total
  } catch (error) {
    console.error('Failed to load audit history:', error)
    ElMessage.error('加载审核历史失败')
  } finally {
    loading.value = false
  }
}

const handleAddAudit = () => {
  ElMessage.info('添加审核记录功能开发中...')
}

const handleViewDetail = (audit: AuditRecord) => {
  selectedAudit.value = audit
  detailDialogVisible.value = true
}

const handleSizeChange = (size: number) => {
  pagination.size = size
  loadAuditHistory()
}

const handleCurrentChange = (page: number) => {
  pagination.page = page
  loadAuditHistory()
}

// 工具方法
const getAuditTypeText = (type: string) => {
  const typeMap: Record<string, string> = {
    registration: '注册审核',
    identity: '身份审核',
    qualification: '资质审核',
    behavior: '行为审核',
    complaint: '投诉审核'
  }
  return typeMap[type] || type
}

const getAuditTypeTagType = (type: string) => {
  const typeMap: Record<string, string> = {
    registration: 'primary',
    identity: 'success',
    qualification: 'warning',
    behavior: 'info',
    complaint: 'danger'
  }
  return typeMap[type] || 'info'
}

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    pending: '待审核',
    reviewing: '审核中',
    approved: '已通过',
    rejected: '已拒绝',
    cancelled: '已取消'
  }
  return statusMap[status] || status
}

const getStatusTagType = (status: string) => {
  const statusMap: Record<string, string> = {
    pending: 'warning',
    reviewing: 'primary',
    approved: 'success',
    rejected: 'danger',
    cancelled: 'info'
  }
  return statusMap[status] || 'info'
}

const getResultText = (result: string) => {
  const resultMap: Record<string, string> = {
    approved: '通过',
    rejected: '拒绝',
    pending: '待定'
  }
  return resultMap[result] || result
}

// 生命周期
onMounted(() => {
  loadAuditHistory()
})
</script>

<style scoped lang="scss">
.audit-history {
  .table-header {
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

  .audit-detail {
    .audit-comment {
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

    .audit-evidence {
      margin-top: 16px;

      h4 {
        margin-bottom: 12px;
        color: #303133;
      }

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
}
</style>