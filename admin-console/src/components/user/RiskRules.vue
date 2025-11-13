<template>
  <div class="risk-rules">
    <!-- 规则列表 -->
    <div class="rules-section">
      <div class="section-header">
        <h4>现有风控规则</h4>
        <el-button
          type="primary"
          size="small"
          :icon="Plus"
          @click="showAddRuleDialog = true"
        >
          新增规则
        </el-button>
      </div>

      <el-table
        :data="riskRules"
        v-loading="rulesLoading"
        row-key="id"
        size="small"
      >
        <el-table-column label="规则名称" prop="name" />

        <el-table-column label="触发条件" width="200">
          <template #default="{ row }">
            <span class="condition-text">{{ getConditionText(row) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="风险等级" width="100">
          <template #default="{ row }">
            <el-tag :type="getRiskTagType(row.riskLevel)" size="small">
              {{ getRiskLevelText(row.riskLevel) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="状态" width="80">
          <template #default="{ row }">
            <el-switch
              v-model="row.enabled"
              @change="toggleRule(row)"
              :loading="row.loading"
            />
          </template>
        </el-table-column>

        <el-table-column label="创建时间" width="160">
          <template #default="{ row }">
            {{ formatDate(row.createdAt, 'MM-DD HH:mm') }}
          </template>
        </el-table-column>

        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button
              type="text"
              size="small"
              @click="editRule(row)"
            >
              编辑
            </el-button>
            <el-button
              type="text"
              size="small"
              @click="testRule(row)"
            >
              测试
            </el-button>
            <el-button
              type="text"
              size="small"
              style="color: #f56c6c"
              @click="deleteRule(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 规则模板 -->
    <div class="templates-section">
      <div class="section-header">
        <h4>规则模板</h4>
        <el-button
          type="text"
          size="small"
          @click="loadRuleTemplates"
        >
          刷新模板
        </el-button>
      </div>

      <el-row :gutter="16">
        <el-col
          v-for="template in ruleTemplates"
          :key="template.id"
          :span="8"
          class="template-col"
        >
          <el-card class="template-card" shadow="hover">
            <div class="template-content">
              <div class="template-name">{{ template.name }}</div>
              <div class="template-desc">{{ template.description }}</div>
              <div class="template-meta">
                <el-tag size="small" :type="getRiskTagType(template.riskLevel)">
                  {{ getRiskLevelText(template.riskLevel) }}
                </el-tag>
              </div>
            </div>
            <div class="template-actions">
              <el-button
                type="primary"
                size="small"
                @click="useTemplate(template)"
              >
                使用模板
              </el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 新增/编辑规则对话框 -->
    <el-dialog
      v-model="showAddRuleDialog"
      :title="editingRule.id ? '编辑风控规则' : '新增风控规则'"
      width="700px"
    >
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="ruleFormRules"
        label-width="100px"
      >
        <el-form-item label="规则名称" prop="name">
          <el-input
            v-model="ruleForm.name"
            placeholder="请输入规则名称"
          />
        </el-form-item>

        <el-form-item label="规则类型" prop="type">
          <el-select v-model="ruleForm.type" placeholder="请选择规则类型">
            <el-option label="登录异常" value="login_abnormal" />
            <el-option label="行为异常" value="behavior_anomaly" />
            <el-option label="交易风险" value="transaction_risk" />
            <el-option label="投诉风险" value="complaint_risk" />
            <el-option label="信用风险" value="credit_risk" />
          </el-select>
        </el-form-item>

        <el-form-item label="触发条件" prop="conditions">
          <div class="conditions-editor">
            <div
              v-for="(condition, index) in ruleForm.conditions"
              :key="index"
              class="condition-row"
            >
              <el-select
                v-model="condition.field"
                placeholder="字段"
                style="width: 120px"
              >
                <el-option label="登录次数" value="login_count" />
                <el-option label="登录IP" value="login_ip" />
                <el-option label="操作频率" value="operation_frequency" />
                <el-option label="交易金额" value="transaction_amount" />
                <el-option label="投诉次数" value="complaint_count" />
                <el-option label="信用分" value="credit_score" />
              </el-select>
              <el-select
                v-model="condition.operator"
                placeholder="操作符"
                style="width: 80px; margin: 0 8px"
              >
                <el-option label=">" value="gt" />
                <el-option label=">=" value="gte" />
                <el-option label="<" value="lt" />
                <el-option label="<=" value="lte" />
                <el-option label="=" value="eq" />
                <el-option label!=" value="ne" />
              </el-select>
              <el-input
                v-model="condition.value"
                placeholder="值"
                style="width: 120px"
              />
              <el-button
                type="text"
                style="margin-left: 8px"
                @click="removeCondition(index)"
              >
                删除
              </el-button>
            </div>
            <el-button
              type="text"
              :icon="Plus"
              @click="addCondition"
            >
              添加条件
            </el-button>
          </div>
        </el-form-item>

        <el-form-item label="条件关系">
          <el-radio-group v-model="ruleForm.conditionRelation">
            <el-radio label="AND">满足所有条件</el-radio>
            <el-radio label="OR">满足任一条件</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="风险等级" prop="riskLevel">
          <el-select v-model="ruleForm.riskLevel" placeholder="请选择风险等级">
            <el-option label="低风险" value="low" />
            <el-option label="中风险" value="medium" />
            <el-option label="高风险" value="high" />
            <el-option label="严重风险" value="critical" />
          </el-select>
        </el-form-item>

        <el-form-item label="自动处理" prop="autoAction">
          <el-select v-model="ruleForm.autoAction" placeholder="请选择自动处理方式">
            <el-option label="仅预警" value="alert" />
            <el-option label="自动警告" value="warn" />
            <el-option label="自动限制" value="restrict" />
            <el-option label="自动冻结" value="freeze" />
          </el-select>
        </el-form-item>

        <el-form-item label="规则描述" prop="description">
          <el-input
            v-model="ruleForm.description"
            type="textarea"
            :rows="3"
            placeholder="请描述此规则的作用和适用场景"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="showAddRuleDialog = false">取消</el-button>
        <el-button
          type="primary"
          :loading="ruleSubmitting"
          @click="submitRule"
        >
          确认
        </el-button>
      </template>
    </el-dialog>

    <!-- 规则测试对话框 -->
    <el-dialog
      v-model="showTestDialog"
      title="规则测试"
      width="600px"
    >
      <div v-if="testingRule" class="rule-test">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="规则名称">
            {{ testingRule.name }}
          </el-descriptions-item>
          <el-descriptions-item label="触发条件">
            {{ getConditionText(testingRule) }}
          </el-descriptions-item>
        </el-descriptions>

        <div class="test-input">
          <h4>测试数据</h4>
          <el-form :model="testData" label-width="120px">
            <el-form-item label="用户ID">
              <el-input v-model="testData.userId" placeholder="输入用户ID进行测试" />
            </el-form-item>
          </el-form>
        </div>

        <div class="test-result">
          <h4>测试结果</h4>
          <div v-if="testResult" class="result-content">
            <el-alert
              :title="testResult.triggered ? '规则触发' : '规则未触发'"
              :type="testResult.triggered ? 'warning' : 'success'"
              show-icon
            >
              <div v-if="testResult.triggered">
                <p>风险等级：{{ getRiskLevelText(testResult.riskLevel) }}</p>
                <p>建议处理：{{ testResult.suggestedAction }}</p>
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
import { ref, reactive, onMounted, defineProps } from 'vue'
import { ElMessage, ElMessageBox, ElForm } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { formatDate, formatRiskLevel } from '@/utils/formatters'
import { UserApiService } from '@/api/user'

// Props
interface Props {
  userId: string
}

const props = defineProps<Props>()

// 规则相关接口
interface RiskRule {
  id: string
  name: string
  type: string
  conditions: Array<{
    field: string
    operator: string
    value: string
  }>
  conditionRelation: 'AND' | 'OR'
  riskLevel: string
  autoAction: string
  description: string
  enabled: boolean
  createdAt: string
  loading?: boolean
}

interface RuleTemplate {
  id: string
  name: string
  description: string
  type: string
  riskLevel: string
  conditions: Array<{
    field: string
    operator: string
    value: string
  }>
  autoAction: string
}

// Refs
const ruleFormRef = ref<InstanceType<typeof ElForm>>()

// 响应式数据
const rulesLoading = ref(false)
const riskRules = ref<RiskRule[]>([])
const ruleTemplates = ref<RuleTemplate[]>([])
const showAddRuleDialog = ref(false)
const showTestDialog = ref(false)
const ruleSubmitting = ref(false)
const testRunning = ref(false)

const editingRule = reactive<Partial<RiskRule>>({
  id: '',
  name: '',
  type: '',
  conditions: [{}],
  conditionRelation: 'AND',
  riskLevel: '',
  autoAction: '',
  description: ''
})

const ruleForm = reactive({
  name: '',
  type: '',
  conditions: [{ field: '', operator: '>', value: '' }],
  conditionRelation: 'AND' as 'AND' | 'OR',
  riskLevel: '',
  autoAction: '',
  description: ''
})

const ruleFormRules = {
  name: [
    { required: true, message: '请输入规则名称', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择规则类型', trigger: 'change' }
  ],
  riskLevel: [
    { required: true, message: '请选择风险等级', trigger: 'change' }
  ],
  autoAction: [
    { required: true, message: '请选择自动处理方式', trigger: 'change' }
  ]
}

const testingRule = ref<RiskRule | null>(null)
const testResult = ref<any>(null)
const testData = reactive({
  userId: props.userId
})

// Methods
const loadRiskRules = async () => {
  rulesLoading.value = true
  try {
    // 这里需要实现获取风控规则的API
    // const rules = await RiskApiService.getRiskRules()
    // riskRules.value = rules

    // Mock数据
    riskRules.value = [
      {
        id: '1',
        name: '异常登录检测',
        type: 'login_abnormal',
        conditions: [
          { field: 'login_count', operator: 'gt', value: '10' },
          { field: 'login_ip', operator: 'ne', value: 'normal_ip' }
        ],
        conditionRelation: 'OR',
        riskLevel: 'high',
        autoAction: 'warn',
        description: '检测用户的异常登录行为',
        enabled: true,
        createdAt: '2025-11-10T10:00:00Z'
      },
      {
        id: '2',
        name: '高频操作检测',
        type: 'behavior_anomaly',
        conditions: [
          { field: 'operation_frequency', operator: 'gt', value: '100' }
        ],
        conditionRelation: 'AND',
        riskLevel: 'medium',
        autoAction: 'alert',
        description: '检测用户的高频操作行为',
        enabled: true,
        createdAt: '2025-11-09T15:30:00Z'
      }
    ]
  } catch (error) {
    console.error('Failed to load risk rules:', error)
    ElMessage.error('加载风控规则失败')
  } finally {
    rulesLoading.value = false
  }
}

const loadRuleTemplates = async () => {
  try {
    // Mock数据
    ruleTemplates.value = [
      {
        id: 'template_1',
        name: '多地登录检测',
        description: '检测用户在短时间内从多个不同地点登录',
        type: 'login_abnormal',
        riskLevel: 'high',
        conditions: [
          { field: 'login_location_count', operator: 'gt', value: '3' },
          { field: 'time_range', operator: 'lt', value: '1h' }
        ],
        autoAction: 'warn'
      },
      {
        id: 'template_2',
        name: '大额交易预警',
        description: '检测用户的大额交易行为',
        type: 'transaction_risk',
        riskLevel: 'medium',
        conditions: [
          { field: 'transaction_amount', operator: 'gt', value: '10000' }
        ],
        autoAction: 'alert'
      },
      {
        id: 'template_3',
        name: '投诉频率检测',
        description: '检测用户的投诉频率异常',
        type: 'complaint_risk',
        riskLevel: 'high',
        conditions: [
          { field: 'complaint_count', operator: 'gt', value: '3' },
          { field: 'time_range', operator: 'lt', value: '7d' }
        ],
        autoAction: 'restrict'
      }
    ]
  } catch (error) {
    console.error('Failed to load rule templates:', error)
  }
}

const addCondition = () => {
  ruleForm.conditions.push({ field: '', operator: '>', value: '' })
}

const removeCondition = (index: number) => {
  if (ruleForm.conditions.length > 1) {
    ruleForm.conditions.splice(index, 1)
  }
}

const editRule = (rule: RiskRule) => {
  Object.assign(editingRule, rule)
  Object.assign(ruleForm, {
    name: rule.name,
    type: rule.type,
    conditions: [...rule.conditions],
    conditionRelation: rule.conditionRelation,
    riskLevel: rule.riskLevel,
    autoAction: rule.autoAction,
    description: rule.description
  })
  showAddRuleDialog.value = true
}

const useTemplate = (template: RuleTemplate) => {
  Object.assign(ruleForm, {
    name: template.name,
    type: template.type,
    conditions: [...template.conditions],
    conditionRelation: 'AND',
    riskLevel: template.riskLevel,
    autoAction: template.autoAction,
    description: template.description
  })
  showAddRuleDialog.value = true
}

const submitRule = async () => {
  if (!ruleFormRef.value) return

  try {
    await ruleFormRef.value.validate()

    ruleSubmitting.value = true

    if (editingRule.id) {
      // 更新规则
      // await RiskApiService.updateRule(editingRule.id, ruleForm)
      ElMessage.success('规则更新成功')
    } else {
      // 新增规则
      // await RiskApiService.createRule(ruleForm)
      ElMessage.success('规则创建成功')
    }

    showAddRuleDialog.value = false
    loadRiskRules()
  } catch (error: any) {
    if (error.message) {
      ElMessage.error(error.message)
    }
  } finally {
    ruleSubmitting.value = false
  }
}

const toggleRule = async (rule: RiskRule) => {
  rule.loading = true
  try {
    // await RiskApiService.updateRule(rule.id, { enabled: rule.enabled })
    ElMessage.success(`规则已${rule.enabled ? '启用' : '禁用'}`)
  } catch (error) {
    rule.enabled = !rule.enabled // 恢复原状态
    ElMessage.error('操作失败')
  } finally {
    rule.loading = false
  }
}

const testRule = (rule: RiskRule) => {
  testingRule.value = rule
  testResult.value = null
  showTestDialog.value = true
}

const runTest = async () => {
  if (!testingRule.value || !testData.userId) {
    ElMessage.warning('请输入测试用户ID')
    return
  }

  testRunning.value = true
  try {
    // testResult.value = await RiskApiService.testRule(testingRule.value.id, testData.userId)

    // Mock测试结果
    testResult.value = {
      triggered: Math.random() > 0.5,
      riskLevel: testingRule.value.riskLevel,
      suggestedAction: testingRule.value.autoAction
    }

    ElMessage.success('测试完成')
  } catch (error) {
    ElMessage.error('测试失败')
  } finally {
    testRunning.value = false
  }
}

const deleteRule = async (rule: RiskRule) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除规则 "${rule.name}" 吗？`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    // await RiskApiService.deleteRule(rule.id)
    ElMessage.success('规则删除成功')
    loadRiskRules()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 工具方法
const getConditionText = (rule: RiskRule | RuleTemplate) => {
  if (!rule.conditions || rule.conditions.length === 0) {
    return '无条件'
  }

  const conditionTexts = rule.conditions.map(condition => {
    const fieldMap: Record<string, string> = {
      login_count: '登录次数',
      login_ip: '登录IP',
      operation_frequency: '操作频率',
      transaction_amount: '交易金额',
      complaint_count: '投诉次数',
      credit_score: '信用分'
    }

    const operatorMap: Record<string, string> = {
      gt: '>',
      gte: '>=',
      lt: '<',
      lte: '<=',
      eq: '=',
      ne: '!='
    }

    const fieldName = fieldMap[condition.field] || condition.field
    const operator = operatorMap[condition.operator] || condition.operator

    return `${fieldName} ${operator} ${condition.value}`
  })

  const relation = rule.conditionRelation || 'AND'
  const relationText = relation === 'AND' ? ' 且 ' : ' 或 '

  return conditionTexts.join(relationText)
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

const getRiskTagType = (level: string) => {
  const typeMap: Record<string, string> = {
    low: 'success',
    medium: 'warning',
    high: 'danger',
    critical: 'danger'
  }
  return typeMap[level] || 'info'
}

// 生命周期
onMounted(() => {
  loadRiskRules()
  loadRuleTemplates()
})
</script>

<style scoped lang="scss">
.risk-rules {
  .rules-section,
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
      height: 120px;

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
      }
    }
  }

  .conditions-editor {
    .condition-row {
      display: flex;
      align-items: center;
      margin-bottom: 8px;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  .rule-test {
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

  .condition-text {
    font-size: 12px;
    color: #606266;
  }
}
</style>