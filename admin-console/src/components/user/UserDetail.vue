<template>
  <div class="user-detail">
    <!-- 头部操作栏 -->
    <div class="detail-header">
      <div class="header-left">
        <h3 class="detail-title">{{ isEditing ? '编辑用户信息' : '用户详情' }}</h3>
        <el-tag
          v-if="!isEditing"
          :type="getStatusTagType(user.status)"
          size="small"
        >
          {{ formatUserStatus(user.status) }}
        </el-tag>
      </div>
      <div class="header-right">
        <el-button
          v-if="!isEditing && canEdit"
          type="primary"
          :icon="Edit"
          @click="startEdit"
        >
          编辑
        </el-button>
        <el-button
          v-if="isEditing"
          type="success"
          :icon="Check"
          @click="saveEdit"
        >
          保存
        </el-button>
        <el-button
          v-if="isEditing"
          :icon="Close"
          @click="cancelEdit"
        >
          取消
        </el-button>
        <el-button
          v-if="!isEditing"
          type="danger"
          :icon="Lock"
          @click="handleDisableUser"
        >
          禁用
        </el-button>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="detail-content">
      <el-tabs v-model="activeTab" class="detail-tabs">
        <!-- 基本信息 -->
        <el-tab-pane label="基本信息" name="basic">
          <el-card class="tab-card">
            <div class="info-grid">
              <!-- 头像和基本信息 -->
              <div class="avatar-section">
                <el-avatar
                  :size="80"
                  :src="editForm.avatar || user.avatar"
                  @error="() => true"
                >
                  <el-icon><User /></el-icon>
                </el-avatar>
                <div v-if="isEditing" class="avatar-upload">
                  <el-button
                    size="small"
                    type="primary"
                    @click="handleAvatarUpload"
                  >
                    更换头像
                  </el-button>
                </div>
              </div>

              <!-- 基本信息 -->
              <div class="basic-info">
                <el-row :gutter="24">
                  <el-col :span="8">
                    <el-form-item label="用户ID">
                      <el-input
                        v-model="user.id"
                        disabled
                        placeholder="系统自动生成"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="用户名" required>
                      <el-input
                        v-if="isEditing"
                        v-model="editForm.username"
                        placeholder="请输入用户名"
                        clearable
                      />
                      <span v-else>{{ user.username || '-' }}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="真实姓名" required>
                      <el-input
                        v-if="isEditing"
                        v-model="editForm.realName"
                        placeholder="请输入真实姓名"
                        clearable
                      />
                      <span v-else>{{ user.realName || '-' }}</span>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row :gutter="24">
                  <el-col :span="8">
                    <el-form-item label="手机号" required>
                      <el-input
                        v-if="isEditing"
                        v-model="editForm.phone"
                        placeholder="请输入手机号"
                        clearable
                      />
                      <span v-else>{{ hidePhone(user.phone) || '-' }}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="邮箱">
                      <el-input
                        v-if="isEditing"
                        v-model="editForm.email"
                        placeholder="请输入邮箱"
                        clearable
                      />
                      <span v-else>{{ hideEmail(user.email) || '-' }}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="性别">
                      <el-select
                        v-if="isEditing"
                        v-model="editForm.gender"
                        placeholder="请选择性别"
                        clearable
                      >
                        <el-option label="男" value="male" />
                        <el-option label="女" value="female" />
                        <el-option label="未知" value="unknown" />
                      </el-select>
                      <span v-else>{{ formatGender(user.gender) || '-' }}</span>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row :gutter="24">
                  <el-col :span="8">
                    <el-form-item label="出生日期">
                      <el-date-picker
                        v-if="isEditing"
                        v-model="editForm.birthDate"
                        type="date"
                        placeholder="请选择出生日期"
                        format="YYYY-MM-DD"
                        value-format="YYYY-MM-DD"
                        style="width: 100%"
                      />
                      <span v-else>{{ user.birthDate || '-' }}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="年龄">
                      <el-input-number
                        v-if="isEditing"
                        v-model="editForm.age"
                        :min="18"
                        :max="100"
                        placeholder="年龄"
                        style="width: 100%"
                      />
                      <span v-else>{{ user.age || '-' }}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="身份证号">
                      <el-input
                        v-if="isEditing"
                        v-model="editForm.idCard"
                        placeholder="请输入身份证号"
                        clearable
                      />
                      <span v-else>{{ formatIdCard(user.idCard) || '-' }}</span>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </div>
          </el-card>
        </el-tab-pane>

        <!-- 详细资料 -->
        <el-tab-pane label="详细资料" name="profile">
          <el-card class="tab-card">
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="教育程度">
                  <el-select
                    v-if="isEditing"
                    v-model="editForm.education"
                    placeholder="请选择教育程度"
                    clearable
                  >
                    <el-option label="小学" value="primary" />
                    <el-option label="初中" value="middle" />
                    <el-option label="高中" value="high" />
                    <el-option label="大专" value="college" />
                    <el-option label="本科" value="bachelor" />
                    <el-option label="硕士" value="master" />
                    <el-option label="博士" value="doctor" />
                  </el-select>
                  <span v-else>{{ getEducationText(user.education) || '-' }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="职业">
                  <el-input
                    v-if="isEditing"
                    v-model="editForm.occupation"
                    placeholder="请输入职业"
                    clearable
                  />
                  <span v-else>{{ user.occupation || '-' }}</span>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="年收入">
                  <el-input-number
                    v-if="isEditing"
                    v-model="editForm.annualIncome"
                    :min="0"
                    :step="10000"
                    placeholder="年收入"
                    style="width: 100%"
                  />
                  <span v-else>{{ formatMoney(user.annualIncome) || '-' }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="婚姻状况">
                  <el-select
                    v-if="isEditing"
                    v-model="editForm.maritalStatus"
                    placeholder="请选择婚姻状况"
                    clearable
                  >
                    <el-option label="未婚" value="single" />
                    <el-option label="已婚" value="married" />
                    <el-option label="离异" value="divorced" />
                    <el-option label="丧偶" value="widowed" />
                  </el-select>
                  <span v-else>{{ getMaritalStatusText(user.maritalStatus) || '-' }}</span>
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item label="居住地址">
              <el-input
                v-if="isEditing"
                v-model="editForm.address"
                type="textarea"
                :rows="2"
                placeholder="请输入详细地址"
              />
              <span v-else>{{ user.address || '-' }}</span>
            </el-form-item>

            <el-form-item label="紧急联系人">
              <div v-if="isEditing" class="emergency-contact">
                <el-input
                  v-model="editForm.emergencyContact"
                  placeholder="紧急联系人姓名"
                  style="margin-bottom: 8px"
                />
                <el-input
                  v-model="editForm.emergencyPhone"
                  placeholder="紧急联系人电话"
                />
              </div>
              <div v-else>
                <span v-if="user.emergencyContact">
                  {{ user.emergencyContact }} ({{ hidePhone(user.emergencyPhone) }})
                </span>
                <span v-else>-</span>
              </div>
            </el-form-item>
          </el-card>
        </el-tab-pane>

        <!-- 用户标签 -->
        <el-tab-pane label="用户标签" name="tags">
          <el-card class="tab-card">
            <div v-if="isEditing" class="tag-edit">
              <el-form-item label="添加标签">
                <div class="tag-selector">
                  <el-select
                    v-model="selectedTagIds"
                    multiple
                    filterable
                    placeholder="请选择标签"
                    style="width: 300px"
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
                  <el-button
                    type="primary"
                    :icon="Plus"
                    @click="handleAddTag"
                    style="margin-left: 8px"
                  >
                    新建标签
                  </el-button>
                </div>
              </el-form-item>

              <el-form-item label="已选标签">
                <div class="selected-tags">
                  <el-tag
                    v-for="tag in selectedTags"
                    :key="tag.id"
                    :color="tag.color"
                    closable
                    @close="removeTag(tag.id)"
                    style="margin: 4px"
                  >
                    {{ tag.name }}
                  </el-tag>
                  <span v-if="selectedTags.length === 0" class="no-tags">暂无标签</span>
                </div>
              </el-form-item>
            </div>

            <div v-else class="tag-display">
              <div class="current-tags">
                <el-tag
                  v-for="tag in user.tags"
                  :key="tag.id"
                  :color="tag.color"
                  style="margin: 4px"
                >
                  {{ tag.name }}
                </el-tag>
                <span v-if="!user.tags || user.tags.length === 0" class="no-tags">暂无标签</span>
              </div>
            </div>
          </el-card>
        </el-tab-pane>

        <!-- 账户信息 -->
        <el-tab-pane label="账户信息" name="account">
          <el-card class="tab-card">
            <el-row :gutter="24">
              <el-col :span="8">
                <el-form-item label="注册时间">
                  <span>{{ formatDate(user.createdAt, 'YYYY-MM-DD HH:mm:ss') }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="注册来源">
                  <span>{{ getRegisterSourceText(user.registerSource) }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="最后登录">
                  <span>{{ formatDate(user.lastLoginAt, 'YYYY-MM-DD HH:mm:ss') }}</span>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="24">
              <el-col :span="8">
                <el-form-item label="信用等级">
                  <el-rate
                    v-if="isEditing"
                    v-model="editForm.creditLevel"
                    :texts="['D', 'C', 'B', 'A', 'AA', 'AAA']"
                    :colors="creditColors"
                    show-text
                  />
                  <span v-else>
                    <el-tag :type="getCreditTagType(user.creditLevel)">
                      {{ user.creditLevel || '暂无' }}
                    </el-tag>
                  </span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="信用分">
                  <span>{{ user.creditScore || '-' }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="风险等级">
                  <span>
                    <el-tag :type="getRiskTagType(user.riskLevel)">
                      {{ formatRiskLevel(user.riskLevel) }}
                    </el-tag>
                  </span>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="24">
              <el-col :span="8">
                <el-form-item label="所属门店">
                  <el-select
                    v-if="isEditing"
                    v-model="editForm.storeId"
                    placeholder="请选择门店"
                    clearable
                    filterable
                  >
                    <el-option
                      v-for="store in availableStores"
                      :key="store.id"
                      :label="store.name"
                      :value="store.id"
                    />
                  </el-select>
                  <span v-else>{{ user.storeName || '-' }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="用户角色">
                  <el-select
                    v-if="isEditing"
                    v-model="editForm.roleCode"
                    placeholder="请选择角色"
                    clearable
                  >
                    <el-option label="平台管理员" value="platform_admin" />
                    <el-option label="区域经理" value="region_manager" />
                    <el-option label="门店经理" value="store_manager" />
                    <el-option label="门店员工" value="store_employee" />
                  </el-select>
                  <span v-else>{{ getRoleText(user.roleCode) }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="状态">
                  <el-select
                    v-if="isEditing"
                    v-model="editForm.status"
                    placeholder="请选择状态"
                  >
                    <el-option label="正常" value="active" />
                    <el-option label="禁用" value="inactive" />
                    <el-option label="待审核" value="pending" />
                    <el-option label="已禁用" value="banned" />
                    <el-option label="审核不通过" value="audit_rejected" />
                  </el-select>
                  <span v-else>{{ formatUserStatus(user.status) }}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-card>
        </el-tab-pane>

        <!-- 审核记录 -->
        <el-tab-pane label="审核记录" name="audit">
          <el-card class="tab-card">
            <AuditHistory :user-id="user.id" />
          </el-card>
        </el-tab-pane>

        <!-- 信用历史 -->
        <el-tab-pane label="信用历史" name="credit">
          <el-card class="tab-card">
            <CreditHistory :user-id="user.id" />
          </el-card>
        </el-tab-pane>

        <!-- 风险事件 -->
        <el-tab-pane label="风险事件" name="risk">
          <el-card class="tab-card">
            <RiskHistory :user-id="user.id" />
          </el-card>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 图片上传对话框 -->
    <el-dialog
      v-model="avatarDialogVisible"
      title="更换头像"
      width="400px"
    >
      <el-upload
        ref="uploadRef"
        :auto-upload="false"
        :show-file-list="false"
        accept="image/*"
        @change="handleAvatarChange"
      >
        <template #trigger>
          <el-button type="primary">选择图片</el-button>
        </template>
      </el-upload>

      <div v-if="avatarPreview" class="avatar-preview">
        <img :src="avatarPreview" alt="头像预览" />
      </div>

      <template #footer>
        <el-button @click="avatarDialogVisible = false">取消</el-button>
        <el-button
          type="primary"
          :loading="avatarUploading"
          @click="confirmAvatarUpload"
        >
          确认上传
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Edit,
  Close,
  Check,
  Lock,
  User,
  Plus
} from '@element-plus/icons-vue'
import type {
  User as UserType,
  UserTag,
  UserFilters,
  UserDetailProps,
  UserDetailEvents
} from '@/types/user'
import { UserApiService } from '@/api/user'
import {
  formatDate,
  hidePhone,
  hideEmail,
  formatIdCard,
  formatMoney,
  formatGender,
  formatUserStatus,
  formatRiskLevel
} from '@/utils/formatters'
import { validationRules } from '@/utils/validators'
import AuditHistory from './AuditHistory.vue'
import CreditHistory from './CreditHistory.vue'
import RiskHistory from './RiskHistory.vue'

// Props定义
const props = withDefaults(defineProps<UserDetailProps>(), {
  canEdit: true
})

// Emits定义
const emit = defineEmits<UserDetailEvents>()

// Refs
const uploadRef = ref()

// 响应式数据
const isEditing = ref(false)
const activeTab = ref('basic')
const user = ref<UserType>(props.user)
const editForm = reactive<Partial<UserType>>({})
const selectedTagIds = ref<string[]>([])
const availableTags = ref<UserTag[]>([])
const availableStores = ref<Array<{ id: string; name: string }>>([])

// 头像上传相关
const avatarDialogVisible = ref(false)
const avatarPreview = ref('')
const avatarFile = ref<File | null>(null)
const avatarUploading = ref(false)

// 信用等级颜色
const creditColors = ['#F56C6C', '#E6A23C', '#409EFF', '#67C23A', '#67C23A', '#67C23A']

// Computed
const selectedTags = computed(() => {
  return availableTags.value.filter(tag => selectedTagIds.value.includes(tag.id))
})

// Methods
const startEdit = () => {
  isEditing.value = true
  Object.assign(editForm, user.value)
  selectedTagIds.value = user.value.tags?.map(tag => tag.id) || []
}

const cancelEdit = () => {
  isEditing.value = false
  Object.assign(editForm, {})
  selectedTagIds.value = []
}

const saveEdit = async () => {
  try {
    // 验证必填字段
    if (!editForm.username?.trim()) {
      ElMessage.error('用户名不能为空')
      return
    }
    if (!editForm.realName?.trim()) {
      ElMessage.error('真实姓名不能为空')
      return
    }
    if (!editForm.phone?.trim()) {
      ElMessage.error('手机号不能为空')
      return
    }
    if (!validationRules.phone().pattern?.test(editForm.phone)) {
      ElMessage.error('手机号格式不正确')
      return
    }

    // 构建更新数据
    const updateData = {
      ...editForm,
      tags: selectedTagIds.value
    }

    // 调用API更新用户信息
    await UserApiService.updateUser(user.value.id, updateData)

    // 更新本地用户数据
    Object.assign(user.value, updateData)
    user.value.tags = availableTags.value.filter(tag => selectedTagIds.value.includes(tag.id))

    isEditing.value = false
    ElMessage.success('用户信息更新成功')
    emit('user-updated', user.value)
  } catch (error) {
    console.error('Failed to update user:', error)
    ElMessage.error('用户信息更新失败')
  }
}

const handleDisableUser = async () => {
  try {
    await ElMessageBox.confirm(
      `确定要禁用用户 "${user.value.username}" 吗？禁用后用户将无法正常使用系统。`,
      '确认禁用',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    await UserApiService.updateUserStatus(user.value.id, 'inactive')
    user.value.status = 'inactive'
    ElMessage.success('用户已被禁用')
    emit('user-updated', user.value)
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('Failed to disable user:', error)
      ElMessage.error('禁用用户失败')
    }
  }
}

const handleAvatarUpload = () => {
  avatarDialogVisible.value = true
}

const handleAvatarChange = (file: any) => {
  avatarFile.value = file.raw
  avatarPreview.value = URL.createObjectURL(file.raw)
}

const confirmAvatarUpload = async () => {
  if (!avatarFile.value) {
    ElMessage.error('请选择要上传的图片')
    return
  }

  avatarUploading.value = true
  try {
    const avatarUrl = await UserApiService.uploadAvatar(user.value.id, avatarFile.value)
    editForm.avatar = avatarUrl
    avatarDialogVisible.value = false
    ElMessage.success('头像上传成功')
  } catch (error) {
    console.error('Failed to upload avatar:', error)
    ElMessage.error('头像上传失败')
  } finally {
    avatarUploading.value = false
    avatarPreview.value = ''
    avatarFile.value = null
  }
}

const handleAddTag = () => {
  ElMessage.info('新建标签功能开发中...')
}

const removeTag = (tagId: string) => {
  const index = selectedTagIds.value.indexOf(tagId)
  if (index > -1) {
    selectedTagIds.value.splice(index, 1)
  }
}

// 工具方法
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

const getRiskTagType = (level: string) => {
  const typeMap: Record<string, string> = {
    low: 'success',
    medium: 'warning',
    high: 'danger',
    critical: 'danger'
  }
  return typeMap[level] || 'info'
}

const getEducationText = (education: string) => {
  const textMap: Record<string, string> = {
    primary: '小学',
    middle: '初中',
    high: '高中',
    college: '大专',
    bachelor: '本科',
    master: '硕士',
    doctor: '博士'
  }
  return textMap[education] || education
}

const getMaritalStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    single: '未婚',
    married: '已婚',
    divorced: '离异',
    widowed: '丧偶'
  }
  return textMap[status] || status
}

const getRegisterSourceText = (source: string) => {
  const textMap: Record<string, string> = {
    wechat: '微信小程序',
    app: '移动APP',
    web: '官方网站',
    admin: '管理员添加'
  }
  return textMap[source] || source
}

const getRoleText = (roleCode: string) => {
  const textMap: Record<string, string> = {
    platform_admin: '平台管理员',
    region_manager: '区域经理',
    store_manager: '门店经理',
    store_employee: '门店员工'
  }
  return textMap[roleCode] || roleCode
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

// 监听用户属性变化
watch(() => props.user, (newUser) => {
  if (newUser) {
    user.value = newUser
  }
}, { deep: true })

// 生命周期
onMounted(() => {
  loadTags()
  loadStores()
})

// 导出方法
defineExpose({
  startEdit,
  cancelEdit,
  saveEdit,
  isEditing,
  user
})
</script>

<style scoped lang="scss">
.user-detail {
  .detail-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid #ebeef5;

    .header-left {
      display: flex;
      align-items: center;
      gap: 12px;

      .detail-title {
        margin: 0;
        font-size: 20px;
        font-weight: 500;
        color: #303133;
      }
    }

    .header-right {
      display: flex;
      gap: 8px;
    }
  }

  .detail-content {
    .detail-tabs {
      .tab-card {
        margin-top: 16px;
      }
    }
  }

  .info-grid {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 32px;
    align-items: start;

    .avatar-section {
      text-align: center;

      .avatar-upload {
        margin-top: 16px;

        .el-button {
          width: 100%;
        }
      }
    }

    .basic-info {
      flex: 1;
    }
  }

  .tag-edit {
    .tag-selector {
      display: flex;
      align-items: center;
    }

    .selected-tags {
      .no-tags {
        color: #909399;
        font-style: italic;
      }
    }
  }

  .tag-display {
    .current-tags {
      .no-tags {
        color: #909399;
        font-style: italic;
      }
    }
  }

  .emergency-contact {
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    padding: 12px;
    background-color: #f8f9fa;
  }

  .avatar-preview {
    margin-top: 16px;
    text-align: center;

    img {
      max-width: 200px;
      max-height: 200px;
      border-radius: 4px;
    }
  }

  .el-form-item {
    margin-bottom: 16px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  span:not(.el-tag) {
    display: inline-block;
    padding: 8px 0;
    min-height: 32px;
    line-height: 16px;
  }

  .no-tags {
    color: #909399;
    font-style: italic;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .user-detail {
    .detail-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;

      .header-right {
        width: 100%;
        justify-content: flex-end;
      }
    }

    .info-grid {
      grid-template-columns: 1fr;
      gap: 24px;
    }

    .tag-edit {
      .tag-selector {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }
    }
  }
}
</style>