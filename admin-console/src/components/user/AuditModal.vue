<template>
  <el-dialog
    v-model="visible"
    :title="dialogTitle"
    width="900px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="handleClose"
  >
    <div v-if="auditUser" class="audit-modal">
      <!-- 头部信息 -->
      <div class="audit-header">
        <div class="user-basic">
          <el-avatar
            :size="60"
            :src="auditUser.avatar"
            @error="() => true"
          >
            <el-icon><User /></el-icon>
          </el-avatar>
          <div class="user-info">
            <h3>{{ auditUser.realName || auditUser.username }}</h3>
            <p>{{ hidePhone(auditUser.phone) }}</p>
            <el-tag :type="getStatusTagType(auditUser.status)">
              {{ formatUserStatus(auditUser.status) }}
            </el-tag>
          </div>
        </div>
        <div class="audit-actions">
          <el-button
            type="success"
            size="large"
            :icon="Check"
            @click="approveUser"
            :loading="approving"
          >
            通过审核
          </el-button>
          <el-button
            type="danger"
            size="large"
            :icon="Close"
            @click="rejectUser"
            :loading="rejecting"
          >
            拒绝审核
          </el-button>
        </div>
      </div>

      <!-- 审核内容 -->
      <div class="audit-content">
        <el-tabs v-model="activeTab" class="audit-tabs">
          <!-- 基本信息 -->
          <el-tab-pane label="基本信息" name="basic">
            <div class="basic-info">
              <el-descriptions :column="2" border>
                <el-descriptions-item label="用户ID">
                  {{ auditUser.id }}
                </el-descriptions-item>
                <el-descriptions-item label="用户名">
                  {{ auditUser.username }}
                </el-descriptions-item>
                <el-descriptions-item label="真实姓名">
                  {{ auditUser.realName }}
                </el-descriptions-item>
                <el-descriptions-item label="手机号">
                  {{ hidePhone(auditUser.phone) }}
                </el-descriptions-item>
                <el-descriptions-item label="邮箱">
                  {{ auditUser.email || '-' }}
                </el-descriptions-item>
                <el-descriptions-item label="性别">
                  {{ formatGender(auditUser.gender) }}
                </el-descriptions-item>
                <el-descriptions-item label="身份证号">
                  {{ formatIdCard(auditUser.idCard) }}
                </el-descriptions-item>
                <el-descriptions-item label="出生日期">
                  {{ auditUser.birthDate || '-' }}
                </el-descriptions-item>
                <el-descriptions-item label="注册时间" :span="2">
                  {{ formatDate(auditUser.createdAt, 'YYYY-MM-DD HH:mm:ss') }}
                </el-descriptions-item>
              </el-descriptions>

              <!-- 地址信息 -->
              <div v-if="auditUser.address" class="address-info">
                <h4>居住地址</h4>
                <p>{{ auditUser.address }}</p>
              </div>
            </div>
          </el-tab-pane>

          <!-- 身份验证 -->
          <el-tab-pane label="身份验证" name="identity">
            <div class="identity-verification">
              <h4>身份证件</h4>
              <div class="id-card-images">
                <div class="image-item">
                  <div class="image-label">身份证正面</div>
                  <div class="image-preview" @click="previewImage(auditUser.idCardFront)">
                    <el-image
                      v-if="auditUser.idCardFront"
                      :src="auditUser.idCardFront"
                      :preview-src-list="[auditUser.idCardFront]"
                      fit="cover"
                      style="width: 100%; height: 100%;"
                    />
                    <div v-else class="no-image">
                      <el-icon><Picture /></el-icon>
                      <span>暂无图片</span>
                    </div>
                  </div>
                </div>
                <div class="image-item">
                  <div class="image-label">身份证背面</div>
                  <div class="image-preview" @click="previewImage(auditUser.idCardBack)">
                    <el-image
                      v-if="auditUser.idCardBack"
                      :src="auditUser.idCardBack"
                      :preview-src-list="[auditUser.idCardBack]"
                      fit="cover"
                      style="width: 100%; height: 100%;"
                    />
                    <div v-else class="no-image">
                      <el-icon><Picture /></el-icon>
                      <span>暂无图片</span>
                    </div>
                  </div>
                </div>
                <div class="image-item">
                  <div class="image-label">手持身份证</div>
                  <div class="image-preview" @click="previewImage(auditUser.idCardSelf)">
                    <el-image
                      v-if="auditUser.idCardSelf"
                      :src="auditUser.idCardSelf"
                      :preview-src-list="[auditUser.idCardSelf]"
                      fit="cover"
                      style="width: 100%; height: 100%;"
                    />
                    <div v-else class="no-image">
                      <el-icon><Picture /></el-icon>
                      <span>暂无图片</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 验证结果 -->
              <div class="verification-result">
                <h4>验证结果</h4>
                <el-row :gutter="16">
                  <el-col :span="8">
                    <el-card class="result-card">
                      <div class="result-item">
                        <div class="result-label">姓名验证</div>
                        <div class="result-value">
                          <el-icon class="success-icon"><CircleCheck /></el-icon>
                          <span>通过</span>
                        </div>
                      </div>
                    </el-card>
                  </el-col>
                  <el-col :span="8">
                    <el-card class="result-card">
                      <div class="result-item">
                        <div class="result-label">身份证验证</div>
                        <div class="result-value">
                          <el-icon class="success-icon"><CircleCheck /></el-icon>
                          <span>通过</span>
                        </div>
                      </div>
                    </el-card>
                  </el-col>
                  <el-col :span="8">
                    <el-card class="result-card">
                      <div class="result-item">
                        <div class="result-label">人脸识别</div>
                        <div class="result-value">
                          <el-icon :class="auditUser.faceVerified ? 'success-icon' : 'warning-icon'">
                            {{ auditUser.faceVerified ? 'CircleCheck' : 'Warning' }}
                          </el-icon>
                          <span>{{ auditUser.faceVerified ? '通过' : '未验证' }}</span>
                        </div>
                      </div>
                    </el-card>
                  </el-col>
                </el-row>
              </div>
            </div>
          </el-tab-pane>

          <!-- 其他资料 -->
          <el-tab-pane label="其他资料" name="documents">
            <div class="other-documents">
              <h4>其他证明材料</h4>
              <div class="documents-grid">
                <div
                  v-for="doc in auditUser.documents"
                  :key="doc.id"
                  class="document-item"
                >
                  <div class="document-name">{{ doc.name }}</div>
                  <div class="document-type">{{ getDocumentTypeText(doc.type) }}</div>
                  <div class="document-preview" @click="previewDocument(doc)">
                    <el-image
                      v-if="doc.type === 'image'"
                      :src="doc.url"
                      :preview-src-list="[doc.url]"
                      fit="cover"
                      style="width: 100%; height: 100%;"
                    />
                    <div v-else class="document-file">
                      <el-icon><Document /></el-icon>
                      <span>{{ doc.name }}</span>
                    </div>
                  </div>
                  <div class="document-time">
                    {{ formatDate(doc.createdAt, 'MM-DD HH:mm') }}
                  </div>
                </div>
                <div v-if="!auditUser.documents?.length" class="no-documents">
                  <el-icon><Document /></el-icon>
                  <span>暂无其他资料</span>
                </div>
              </div>
            </div>
          </el-tab-pane>

          <!-- 审核历史 -->
          <el-tab-pane label="审核历史" name="history">
            <AuditHistory :user-id="auditUser.id" />
          </el-tab-pane>
        </el-tabs>
      </div>

      <!-- 审核意见 -->
      <div class="audit-comment">
        <h4>审核意见</h4>
        <el-input
          v-model="auditComment"
          type="textarea"
          :rows="3"
          placeholder="请输入审核意见（通过审核时为可选项，拒绝审核时为必填项）"
          maxlength="500"
          show-word-limit
        />
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button
          type="success"
          :icon="Check"
          @click="approveUser"
          :loading="approving"
        >
          通过
        </el-button>
        <el-button
          type="danger"
          :icon="Close"
          @click="rejectUser"
          :loading="rejecting"
        >
          拒绝
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  User,
  Check,
  Close,
  Picture,
  Document,
  CircleCheck,
  Warning
} from '@element-plus/icons-vue'
import type { User as UserType, AuditModalProps, AuditModalEvents } from '@/types/user'
import { UserApiService } from '@/api/user'
import {
  formatDate,
  hidePhone,
  hideEmail,
  formatIdCard,
  formatGender,
  formatUserStatus
} from '@/utils/formatters'
import AuditHistory from './AuditHistory.vue'

// Props定义
const props = defineProps<AuditModalProps>()

// Emits定义
const emit = defineEmits<AuditModalEvents>()

// 响应式数据
const visible = ref(props.visible)
const activeTab = ref('basic')
const auditUser = ref<UserType | null>(null)
const auditComment = ref('')
const approving = ref(false)
const rejecting = ref(false)

// Computed
const dialogTitle = computed(() => {
  return auditUser.value ? `审核用户 - ${auditUser.value.realName || auditUser.value.username}` : '用户审核'
})

// Methods
const handleClose = () => {
  visible.value = false
  auditComment.value = ''
  emit('update:visible', false)
  emit('closed')
}

const approveUser = async () => {
  if (!auditUser.value) return

  try {
    approving.value = true

    await UserApiService.auditUser(auditUser.value.id, {
      action: 'approve',
      comment: auditComment.value
    })

    ElMessage.success('用户审核通过')
    emit('audit-success', auditUser.value)
    handleClose()
  } catch (error) {
    console.error('Failed to approve user:', error)
    ElMessage.error('审核通过失败')
  } finally {
    approving.value = false
  }
}

const rejectUser = async () => {
  if (!auditUser.value) return

  if (!auditComment.value.trim()) {
    ElMessage.warning('请输入拒绝原因')
    return
  }

  try {
    await ElMessageBox.confirm(
      '确定要拒绝该用户的注册申请吗？',
      '确认拒绝',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    rejecting.value = true

    await UserApiService.auditUser(auditUser.value.id, {
      action: 'reject',
      comment: auditComment.value
    })

    ElMessage.success('用户审核已拒绝')
    emit('audit-reject', auditUser.value)
    handleClose()
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('Failed to reject user:', error)
      ElMessage.error('审核拒绝失败')
    }
  } finally {
    rejecting.value = false
  }
}

const previewImage = (imageUrl: string) => {
  // Element Plus 的图片预览会自动处理
}

const previewDocument = (doc: any) => {
  if (doc.type === 'image') {
    // 图片预览已由 el-image 组件处理
  } else {
    // 处理文档预览或下载
    ElMessage.info('文档预览功能开发中...')
  }
}

const getDocumentTypeText = (type: string) => {
  const typeMap: Record<string, string> = {
    image: '图片',
    pdf: 'PDF文档',
    word: 'Word文档',
    excel: 'Excel表格',
    other: '其他文件'
  }
  return typeMap[type] || type
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

const loadUserDetail = async (userId: string) => {
  try {
    const user = await UserApiService.getUserById(userId)
    auditUser.value = user
  } catch (error) {
    console.error('Failed to load user detail:', error)
    ElMessage.error('加载用户详情失败')
  }
}

// 监听visible和userId变化
watch(() => props.visible, (newVisible) => {
  visible.value = newVisible
  if (newVisible && props.userId) {
    loadUserDetail(props.userId)
    activeTab.value = 'basic'
    auditComment.value = ''
  }
})

watch(() => props.userId, (newUserId) => {
  if (newUserId && visible.value) {
    loadUserDetail(newUserId)
  }
})

// 监听props变化
watch(() => props, (newProps) => {
  visible.value = newProps.visible
}, { immediate: true, deep: true })
</script>

<style scoped lang="scss">
.audit-modal {
  .audit-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 20px;
    background-color: #f8f9fa;
    border-radius: 8px;
    margin-bottom: 24px;

    .user-basic {
      display: flex;
      gap: 16px;

      .user-info {
        h3 {
          margin: 0 0 8px 0;
          font-size: 18px;
          color: #303133;
        }

        p {
          margin: 0 0 8px 0;
          color: #606266;
          font-size: 14px;
        }
      }
    }

    .audit-actions {
      display: flex;
      gap: 12px;
    }
  }

  .audit-content {
    .audit-tabs {
      margin-bottom: 24px;

      .basic-info {
        .address-info {
          margin-top: 16px;

          h4 {
            margin-bottom: 8px;
            color: #303133;
          }

          p {
            color: #606266;
            margin: 0;
          }
        }
      }

      .identity-verification {
        h4 {
          margin-bottom: 16px;
          color: #303133;
        }

        .id-card-images {
          display: flex;
          gap: 16px;
          margin-bottom: 24px;

          .image-item {
            .image-label {
              text-align: center;
              margin-bottom: 8px;
              color: #606266;
              font-size: 14px;
            }

            .image-preview {
              width: 200px;
              height: 120px;
              border: 1px solid #dcdfe6;
              border-radius: 4px;
              overflow: hidden;
              cursor: pointer;

              .no-image {
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                color: #c0c4cc;

                .el-icon {
                  font-size: 24px;
                  margin-bottom: 8px;
                }

                span {
                  font-size: 12px;
                }
              }
            }
          }
        }

        .verification-result {
          h4 {
            margin-bottom: 16px;
            color: #303133;
          }

          .result-card {
            .result-item {
              display: flex;
              justify-content: space-between;
              align-items: center;

              .result-label {
                color: #606266;
                font-size: 14px;
              }

              .result-value {
                display: flex;
                align-items: center;
                gap: 4px;
                color: #67c23a;
                font-weight: 500;

                .success-icon {
                  color: #67c23a;
                }

                .warning-icon {
                  color: #e6a23c;
                }
              }
            }
          }
        }
      }

      .other-documents {
        h4 {
          margin-bottom: 16px;
          color: #303133;
        }

        .documents-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 16px;

          .document-item {
            border: 1px solid #ebeef5;
            border-radius: 8px;
            padding: 12px;
            text-align: center;

            .document-name {
              font-weight: 500;
              color: #303133;
              margin-bottom: 4px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }

            .document-type {
              font-size: 12px;
              color: #909399;
              margin-bottom: 8px;
            }

            .document-preview {
              width: 100px;
              height: 80px;
              margin: 0 auto 8px;
              border: 1px dashed #dcdfe6;
              border-radius: 4px;
              overflow: hidden;
              cursor: pointer;

              .document-file {
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                color: #c0c4cc;

                .el-icon {
                  font-size: 20px;
                  margin-bottom: 4px;
                }

                span {
                  font-size: 10px;
                  text-align: center;
                  word-break: break-all;
                  padding: 0 4px;
                }
              }
            }

            .document-time {
              font-size: 12px;
              color: #c0c4cc;
            }
          }

          .no-documents {
            grid-column: 1 / -1;
            text-align: center;
            padding: 40px;
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
    }
  }

  .audit-comment {
    h4 {
      margin-bottom: 12px;
      color: #303133;
    }
  }

  .dialog-footer {
    text-align: right;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .audit-modal {
    .audit-header {
      flex-direction: column;
      gap: 16px;

      .audit-actions {
        width: 100%;
        justify-content: center;
      }
    }

    .identity-verification {
      .id-card-images {
        flex-direction: column;
        align-items: center;

        .image-item {
          width: 100%;
          max-width: 300px;

          .image-preview {
            width: 100%;
            height: 180px;
          }
        }
      }
    }
  }
}
</style>