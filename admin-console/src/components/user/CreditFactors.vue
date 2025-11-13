<template>
  <div class="credit-factors">
    <!-- 因子列表 -->
    <div class="factors-section">
      <div class="section-header">
        <h4>信用评估因子</h4>
        <el-button
          type="primary"
          size="small"
          :icon="Plus"
          @click="showAddFactorDialog = true"
        >
          新增因子
        </el-button>
      </div>

      <el-table
        :data="factors"
        v-loading="loading"
        row-key="id"
      >
        <el-table-column label="因子名称" prop="name" />

        <el-table-column label="类别" width="120">
          <template #default="{ row }">
            <el-tag size="small" :type="getCategoryTagType(row.category)">
              {{ getCategoryText(row.category) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="权重" width="100">
          <template #default="{ row }">
            <el-slider
              v-model="row.weight"
              :min="0"
              :max="100"
              :step="1"
              show-input
              :show-input-controls="false"
              @change="updateFactorWeight(row)"
              :loading="row.loading"
            />
          </template>
        </el-table-column>

        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-switch
              v-model="row.enabled"
              @change="toggleFactor(row)"
              :loading="row.loading"
            />
          </template>
        </el-table-column>

        <el-table-column label="描述" prop="description" show-overflow-tooltip />

        <el-table-column label="最后更新" width="160">
          <template #default="{ row }">
            {{ formatDate(row.updatedAt, 'MM-DD HH:mm') }}
          </template>
        </el-table-column>

        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button
              type="text"
              size="small"
              @click="editFactor(row)"
            >
              编辑
            </el-button>
            <el-button
              type="text"
              size="small"
              @click="testFactor(row)"
            >
              测试
            </el-button>
            <el-button
              type="text"
              size="small"
              style="color: #f56c6c"
              @click="deleteFactor(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 权重配置提示 -->
    <el-alert
      type="info"
      show-icon
      :closable="false"
      style="margin: 16px 0"
    >
      <template #title>
        权重配置说明
      </template>
      <div>
        <p>• 各因子权重之和应等于100%</p>
        <p>• 权重越高，该因子对信用评分的影响越大</p>
        <p>• 修改权重后需要重新评估用户的信用分数</p>
      </div>
    </el-alert>

    <!-- 预设因子模板 -->
    <div class="templates-section">
      <div class="section-header">
        <h4>预设因子模板</h4>
      </div>

      <el-row :gutter="16">
        <el-col
          v-for="template in factorTemplates"
          :key="template.id"
          :span="8"
          class="template-col"
        >
          <el-card class="template-card" shadow="hover">
            <div class="template-content">
              <div class="template-name">{{ template.name }}</div>
              <div class="template-desc">{{ template.description }}</div>
              <div class="template-meta">
                <el-tag size="small" type="info">{{ template.factors.length }}个因子</el-tag>
              </div>
            </div>
            <div class="template-actions">
              <el-button
                type="primary"
                size="small"
                @click="applyTemplate(template)"
              >
                应用模板
              </el-button>
              <el-button
                type="text"
                size="small"
                @click="previewTemplate(template)"
              >
                预览
              </el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 新增/编辑因子对话框 -->
    <el-dialog
      v-model="showAddFactorDialog"
      :title="editingFactor.id ? '编辑因子' : '新增因子'"
      width="600px"
    >
      <el-form
        ref="factorFormRef"
        :model="factorForm"
        :rules="factorFormRules"
        label-width="100px"
      >
        <el-form-item label="因子名称" prop="name">
          <el-input
            v-model="factorForm.name"
            placeholder="请输入因子名称"
          />
        </el-form-item>

        <el-form-item label="因子类别" prop="category">
          <el-select v-model="factorForm.category" placeholder="请选择因子类别">
            <el-option label="历史信用" value="history" />
            <el-option label="行为数据" value="behavior" />
            <el-option label="交易记录" value="transaction" />
            <el-option label="身份信息" value="identity" />
            <el-option label="社交关系" value="social" />
            <el-option label="资产状况" value="asset" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>

        <el-form-item label="权重" prop="weight">
          <el-input-number
            v-model="factorForm.weight"
            :min="0"
            :max="100"
            :step="1"
            :precision="1"
            placeholder="权重（0-100）"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="计算方式" prop="calculationMethod">
          <el-select v-model="factorForm.calculationMethod" placeholder="请选择计算方式">
            <el-option label="直接评分" value="direct" />
            <el-option label="比例评分" value="ratio" />
            <el-option label="分级评分" value="level" />
            <el-option label="复合评分" value="composite" />
          </el-select>
        </el-form-item>

        <el-form-item label="配置参数">
          <el-input
            v-model="factorForm.config"
            type="textarea"
            :rows="3"
            placeholder="JSON格式的配置参数"
          />
        </el-form-item>

        <el-form-item label="因子描述" prop="description">
          <el-input
            v-model="factorForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入因子描述"
          />
        </el-form-item>

        <el-form-item label="排序权重">
          <el-input-number
            v-model="factorForm.sortOrder"
            :min="0"
            :max="9999"
            placeholder="排序权重"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="showAddFactorDialog = false">取消</el-button>
        <el-button
          type="primary"
          :loading="submitLoading"
          @click="submitFactor"
        >
          {{ editingFactor.id ? '更新' : '创建' }}
        </el-button>
      </template>
    </el-dialog>

    <!-- 模板预览对话框 -->
    <el-dialog
      v-model="showPreviewDialog"
      title="模板预览"
      width="800px"
    >
      <div v-if="previewingTemplate" class="template-preview">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="模板名称">
            {{ previewingTemplate.name }}
          </el-descriptions-item>
          <el-descriptions-item label="模板描述">
            {{ previewingTemplate.description }}
          </el-descriptions-item>
        </el-descriptions>

        <h4 style="margin: 20px 0 16px 0;">包含因子</h4>
        <el-table :data="previewingTemplate.factors" size="small">
          <el-table-column label="因子名称" prop="name" />
          <el-table-column label="类别" width="120">
            <template #default="{ row }">
              <el-tag size="small">{{ getCategoryText(row.category) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="权重" width="100">
            <template #default="{ row }">
              {{ row.weight }}%
            </template>
          </el-table-column>
          <el-table-column label="描述" prop="description" show-overflow-tooltip />
        </el-table>
      </div>

      <template #footer>
        <el-button @click="showPreviewDialog = false">关闭</el-button>
        <el-button
          type="primary"
          @click="applyTemplate(previewingTemplate)"
        >
          应用模板
        </el-button>
      </template>
    </el-dialog>

    <!-- 因子测试对话框 -->
    <el-dialog
      v-model="showTestDialog"
      title="因子测试"
      width="600px"
    >
      <div v-if="testingFactor" class="factor-test">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="因子名称">
            {{ testingFactor.name }}
          </el-descriptions-item>
          <el-descriptions-item label="计算方式">
            {{ getCalculationMethodText(testingFactor.calculationMethod) }}
          </el-descriptions-item>
        </el-descriptions>

        <div class="test-input">
          <h4>测试数据</h4>
          <el-form :model="testData" label-width="120px">
            <el-form-item label="用户ID">
              <el-input v-model="testData.userId" placeholder="输入用户ID进行测试" />
            </el-form-item>
            <el-form-item label="测试参数">
              <el-input
                v-model="testData.params"
                type="textarea"
                :rows="3"
                placeholder="JSON格式的测试参数"
              />
            </el-form-item>
          </el-form>
        </div>

        <div class="test-result">
          <h4>测试结果</h4>
          <div v-if="testResult" class="result-content">
            <el-alert
              :title="`因子得分: ${testResult.score}`"
              type="success"
              show-icon
            >
              <div>
                <p>权重后得分: {{ testResult.weightedScore }}</p>
                <p>计算详情: {{ testResult.detail }}</p>
              </div>
            </el-alert>
          </div>
        </div>
      </div>

      <template #footer>
        <el-button @click="showTestDialog = false">关闭</el-button>
        <el-button
          type="primary"
          :loading="testRunning"
          @click="runTest"
        >
          运行测试
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, defineProps, defineEmits } from 'vue'
import { ElMessage, ElMessageBox, ElForm } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { formatDate } from '@/utils/formatters'

// Props
interface Props {
  userId: string
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  'factor-updated': []
}>()

// 因子接口
interface CreditFactor {
  id: string
  name: string
  category: string
  weight: number
  calculationMethod: string
  config: string
  description: string
  enabled: boolean
  sortOrder: number
  loading?: boolean
  updatedAt: string
}

// 模板接口
interface FactorTemplate {
  id: string
  name: string
  description: string
  factors: Array<{
    name: string
    category: string
    weight: number
    description: string
  }>
}

// Refs
const factorFormRef = ref<InstanceType<typeof ElForm>>()

// 响应式数据
const loading = ref(false)
const submitLoading = ref(false)
const testRunning = ref(false)
const factors = ref<CreditFactor[]>([])
const factorTemplates = ref<FactorTemplate[]>([])
const showAddFactorDialog = ref(false)
const showPreviewDialog = ref(false)
const showTestDialog = ref(false)
const previewingTemplate = ref<FactorTemplate | null>(null)
const testingFactor = ref<CreditFactor | null>(null)
const testResult = ref<any>(null)

const editingFactor = reactive<Partial<CreditFactor>>({
  id: '',
  name: '',
  category: '',
  weight: 0,
  calculationMethod: '',
  config: '',
  description: '',
  sortOrder: 0
})

const factorForm = reactive({
  name: '',
  category: '',
  weight: 0,
  calculationMethod: '',
  config: '',
  description: '',
  sortOrder: 0
})

const testData = reactive({
  userId: props.userId,
  params: '{}'
})

const factorFormRules = {
  name: [
    { required: true, message: '请输入因子名称', trigger: 'blur' }
  ],
  category: [
    { required: true, message: '请选择因子类别', trigger: 'change' }
  ],
  weight: [
    { required: true, message: '请输入权重', trigger: 'blur' },
    { type: 'number', min: 0, max: 100, message: '权重应在0-100之间', trigger: 'blur' }
  ],
  calculationMethod: [
    { required: true, message: '请选择计算方式', trigger: 'change' }
  ]
}

// Computed
const totalWeight = computed(() => {
  return factors.value
    .filter(factor => factor.enabled)
    .reduce((sum, factor) => sum + factor.weight, 0)
})

// Methods
const loadFactors = async () => {
  loading.value = true
  try {
    // Mock数据
    factors.value = [
      {
        id: '1',
        name: '历史信用记录',
        category: 'history',
        weight: 25,
        calculationMethod: 'direct',
        config: '{"baseScore": 500}',
        description: '基于用户的历史信用记录进行评分',
        enabled: true,
        sortOrder: 100,
        updatedAt: '2025-11-10T10:00:00Z'
      },
      {
        id: '2',
        name: '行为数据分析',
        category: 'behavior',
        weight: 20,
        calculationMethod: 'composite',
        config: '{"loginFreq": 0.3, "transactionFreq": 0.4, "interactionFreq": 0.3}',
        description: '分析用户的使用行为数据',
        enabled: true,
        sortOrder: 90,
        updatedAt: '2025-11-09T15:30:00Z'
      },
      {
        id: '3',
        name: '交易记录',
        category: 'transaction',
        weight: 18,
        calculationMethod: 'ratio',
        config: '{"successRate": 0.6, "amountScore": 0.4}',
        description: '基于用户的交易记录进行评分',
        enabled: true,
        sortOrder: 80,
        updatedAt: '2025-11-08T09:15:00Z'
      }
    ]
  } catch (error) {
    console.error('Failed to load factors:', error)
    ElMessage.error('加载因子失败')
  } finally {
    loading.value = false
  }
}

const loadTemplates = async () => {
  try {
    factorTemplates.value = [
      {
        id: 'template_1',
        name: '基础信用模型',
        description: '适用于一般用户的信用评估模型',
        factors: [
          { name: '历史信用', category: 'history', weight: 30, description: '历史信用记录' },
          { name: '行为数据', category: 'behavior', weight: 25, description: '用户行为分析' },
          { name: '交易记录', category: 'transaction', weight: 20, description: '交易行为分析' },
          { name: '身份信息', category: 'identity', weight: 15, description: '身份验证程度' },
          { name: '资产状况', category: 'asset', weight: 10, description: '资产状况评估' }
        ]
      },
      {
        id: 'template_2',
        name: '高级信用模型',
        description: '包含更多维度的综合信用评估模型',
        factors: [
          { name: '深度信用分析', category: 'history', weight: 25, description: '深度历史信用' },
          { name: '智能行为分析', category: 'behavior', weight: 20, description: 'AI行为分析' },
          { name: '复杂交易模式', category: 'transaction', weight: 18, description: '交易模式识别' },
          { name: '身份验证', category: 'identity', weight: 15, description: '多维度身份验证' },
          { name: '社交网络', category: 'social', weight: 12, description: '社交关系分析' },
          { name: '资产评估', category: 'asset', weight: 10, description: '综合资产评估' }
        ]
      }
    ]
  } catch (error) {
    console.error('Failed to load templates:', error)
  }
}

const editFactor = (factor: CreditFactor) => {
  Object.assign(editingFactor, factor)
  Object.assign(factorForm, {
    name: factor.name,
    category: factor.category,
    weight: factor.weight,
    calculationMethod: factor.calculationMethod,
    config: factor.config,
    description: factor.description,
    sortOrder: factor.sortOrder
  })
  showAddFactorDialog.value = true
}

const testFactor = (factor: CreditFactor) => {
  testingFactor.value = factor
  testResult.value = null
  showTestDialog.value = true
}

const runTest = async () => {
  if (!testingFactor.value || !testData.userId) {
    ElMessage.warning('请输入测试用户ID')
    return
  }

  testRunning.value = true
  try {
    // Mock测试结果
    testResult.value = {
      score: Math.floor(Math.random() * 100),
      weightedScore: Math.floor(Math.random() * testingFactor.value.weight),
      detail: '测试成功，因子运行正常'
    }

    ElMessage.success('测试完成')
  } catch (error) {
    ElMessage.error('测试失败')
  } finally {
    testRunning.value = false
  }
}

const updateFactorWeight = async (factor: CreditFactor) => {
  factor.loading = true
  try {
    // await CreditApiService.updateFactor(factor.id, { weight: factor.weight })
    emit('factor-updated')
  } catch (error) {
    // 恢复原权重
    ElMessage.error('权重更新失败')
  } finally {
    factor.loading = false
  }
}

const toggleFactor = async (factor: CreditFactor) => {
  factor.loading = true
  try {
    // await CreditApiService.updateFactor(factor.id, { enabled: factor.enabled })
    emit('factor-updated')
  } catch (error) {
    factor.enabled = !factor.enabled
    ElMessage.error('操作失败')
  } finally {
    factor.loading = false
  }
}

const deleteFactor = async (factor: CreditFactor) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除因子 "${factor.name}" 吗？`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    // await CreditApiService.deleteFactor(factor.id)
    ElMessage.success('因子删除成功')
    loadFactors()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const submitFactor = async () => {
  if (!factorFormRef.value) return

  try {
    await factorFormRef.value.validate()

    submitLoading.value = true

    if (editingFactor.id) {
      // 更新因子
      // await CreditApiService.updateFactor(editingFactor.id, factorForm)
      ElMessage.success('因子更新成功')
    } else {
      // 创建因子
      // await CreditApiService.createFactor(factorForm)
      ElMessage.success('因子创建成功')
    }

    showAddFactorDialog.value = false
    loadFactors()
    emit('factor-updated')
  } catch (error: any) {
    if (error.message) {
      ElMessage.error(error.message)
    }
  } finally {
    submitLoading.value = false
  }
}

const applyTemplate = async (template: FactorTemplate) => {
  try {
    await ElMessageBox.confirm(
      `应用模板 "${template.name}" 将替换当前所有因子配置，确定继续吗？`,
      '确认应用',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    // await CreditApiService.applyFactorTemplate(template.id)
    ElMessage.success('模板应用成功')
    loadFactors()
    emit('factor-updated')
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('应用模板失败')
    }
  }
}

const previewTemplate = (template: FactorTemplate) => {
  previewingTemplate.value = template
  showPreviewDialog.value = true
}

const getCategoryText = (category: string) => {
  const categoryMap: Record<string, string> = {
    history: '历史信用',
    behavior: '行为数据',
    transaction: '交易记录',
    identity: '身份信息',
    social: '社交关系',
    asset: '资产状况',
    other: '其他'
  }
  return categoryMap[category] || category
}

const getCategoryTagType = (category: string) => {
  const typeMap: Record<string, string> = {
    history: 'primary',
    behavior: 'success',
    transaction: 'warning',
    identity: 'info',
    social: 'success',
    asset: 'warning',
    other: 'info'
  }
  return typeMap[category] || 'info'
}

const getCalculationMethodText = (method: string) => {
  const methodMap: Record<string, string> = {
    direct: '直接评分',
    ratio: '比例评分',
    level: '分级评分',
    composite: '复合评分'
  }
  return methodMap[method] || method
}

// 生命周期
onMounted(() => {
  loadFactors()
  loadTemplates()
})
</script>

<style scoped lang="scss">
.credit-factors {
  .factors-section,
  .templates-section {
    margin-bottom: 32px;

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;

      h4 {
        margin: 0;
        color: #303133;
      }
    }
  }

  .template-col {
    margin-bottom: 16px;

    .template-card {
      height: 140px;

      .template-content {
        height: 80px;
        display: flex;
        flex-direction: column;

        .template-name {
          font-weight: 500;
          color: #303133;
          margin-bottom: 4px;
        }

        .template-desc {
          font-size: 12px;
          color: #909399;
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .template-meta {
          margin-top: 4px;
        }
      }

      .template-actions {
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      }
    }
  }

  .template-preview {
    .test-input,
    .test-result {
      margin-top: 16px;

      h4 {
        margin-bottom: 8px;
        color: #303133;
      }
    }

    .result-content {
      padding: 16px;
      background-color: #f8f9fa;
      border-radius: 4px;
    }
  }

  .factor-test {
    .test-input,
    .test-result {
      margin-top: 16px;

      h4 {
        margin-bottom: 8px;
        color: #303133;
      }
    }

    .result-content {
      padding: 16px;
      background-color: #f8f9fa;
      border-radius: 4px;
    }
  }
}
</style>