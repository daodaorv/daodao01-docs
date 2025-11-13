/**
 * 用户管理模块类型定义
 * @author 叨叨房车团队
 * @since 2025-11-12
 */

import { RoleCode } from './menu'

// ==================== 基础枚举定义 ====================

/**
 * 用户状态枚举
 */
export enum UserStatus {
  ACTIVE = 'active',       // 正常
  INACTIVE = 'inactive',   // 禁用
  PENDING = 'pending',     // 待审核
  BANNED = 'banned',       // 被禁止
  AUDIT_REJECTED = 'audit_rejected' // 审核不通过
}

/**
 * 用户信用等级枚举
 */
export enum CreditLevel {
  AAA = 'AAA',   // 信用极好
  AA = 'AA',     // 信用优秀
  A = 'A',       // 信用良好
  B = 'B',       // 信用一般
  C = 'C',       // 信用较差
  D = 'D'        // 信用很差
}

/**
 * 风险等级枚举
 */
export enum RiskLevel {
  LOW = 'low',       // 低风险
  MEDIUM = 'medium', // 中风险
  HIGH = 'high',     // 高风险
  CRITICAL = 'critical' // 严重风险
}

/**
 * 用户标签类型枚举
 */
export enum TagType {
  BEHAVIOR = 'behavior',   // 行为标签
  ATTRIBUTE = 'attribute', // 属性标签
  RISK = 'risk'           // 风险标签
}

/**
 * 黑名单类型枚举
 */
export enum BlacklistType {
  PERMANENT = 'permanent',     // 永久禁止
  TIME_LIMITED = 'time_limited', // 限时禁止
  FUNCTION_LIMITED = 'function_limited' // 功能限制
}

/**
 * 审核状态枚举
 */
export enum AuditStatus {
  PENDING = 'pending',   // 待审核
  APPROVED = 'approved', // 审核通过
  REJECTED = 'rejected', // 审核拒绝
  REQUIRE_REVIEW = 'require_review' // 需要复核
}

// ==================== 核心接口定义 ====================

/**
 * 用户基础信息接口
 */
export interface User {
  /** 用户ID */
  id: string
  /** 用户名 */
  username: string
  /** 手机号码 */
  phone: string
  /** 邮箱地址 */
  email: string
  /** 用户头像URL */
  avatar: string
  /** 真实姓名 */
  realName: string
  /** 身份证号 */
  idCard: string
  /** 用户状态 */
  status: UserStatus
  /** 信用等级 */
  creditLevel: CreditLevel
  /** 信用分数 */
  creditScore: number
  /** 注册时间 */
  registerTime: Date
  /** 最后登录时间 */
  lastLoginTime: Date
  /** 用户标签列表 */
  tags: UserTag[]
  /** 风险等级 */
  riskLevel: RiskLevel
  /** 用户扩展信息 */
  profile: UserProfile
  /** 用户角色代码 */
  roleCode: RoleCode
  /** 所属门店ID */
  storeId?: string
  /** 创建时间 */
  createTime: Date
  /** 更新时间 */
  updateTime: Date
}

/**
 * 用户扩展信息接口
 */
export interface UserProfile {
  /** 用户ID */
  userId: string
  /** 性别 */
  gender?: 'male' | 'female' | 'unknown'
  /** 出生日期 */
  birthDate?: Date
  /** 家庭地址 */
  address?: string
  /** 工作单位 */
  company?: string
  /** 职业 */
  occupation?: string
  /** 年收入 */
  annualIncome?: number
  /** 教育程度 */
  education?: string
  /** 婚姻状况 */
  maritalStatus?: string
  /** 紧急联系人姓名 */
  emergencyContactName?: string
  /** 紧急联系人电话 */
  emergencyContactPhone?: string
  /** 用户简介 */
  bio?: string
}

/**
 * 用户标签接口
 */
export interface UserTag {
  /** 标签ID */
  id: string
  /** 标签名称 */
  name: string
  /** 标签类型 */
  type: TagType
  /** 标签颜色 */
  color: string
  /** 标签描述 */
  description: string
  /** 创建时间 */
  createTime: Date
  /** 使用次数 */
  useCount: number
  /** 是否系统标签 */
  isSystem: boolean
  /** 创建人ID */
  creatorId: string
}

/**
 * 用户标签关联接口
 */
export interface UserTagRelation {
  /** 关联ID */
  id: string
  /** 用户ID */
  userId: string
  /** 标签ID */
  tagId: string
  /** 标签信息 */
  tag: UserTag
  /** 创建时间 */
  createTime: Date
  /** 创建人ID */
  creatorId: string
}

/**
 * 信用评估接口
 */
export interface CreditEvaluation {
  /** 评估ID */
  id: string
  /** 用户ID */
  userId: string
  /** 信用分数 */
  score: number
  /** 信用等级 */
  level: CreditLevel
  /** 评估因子列表 */
  factors: CreditFactor[]
  /** 评估人ID */
  evaluatorId: string
  /** 评估时间 */
  evaluateTime: Date
  /** 调整原因 */
  reason?: string
  /** 是否自动评估 */
  isAuto: boolean
}

/**
 * 信用评估因子接口
 */
export interface CreditFactor {
  /** 因子ID */
  id: string
  /** 因子名称 */
  name: string
  /** 因子权重 */
  weight: number
  /** 因子分数 */
  score: number
  /** 因子描述 */
  description: string
}

/**
 * 风控事件接口
 */
export interface RiskEvent {
  /** 事件ID */
  id: string
  /** 用户ID */
  userId: string
  /** 事件类型 */
  type: string
  /** 风险等级 */
  level: RiskLevel
  /** 事件描述 */
  description: string
  /** 事件状态 */
  status: 'pending' | 'processing' | 'resolved'
  /** ��建时间 */
  createTime: Date
  /** 解决时间 */
  resolveTime?: Date
  /** 风险行为列表 */
  actions: RiskAction[]
  /** 事件详情 */
  details: Record<string, any>
}

/**
 * 风控行为接口
 */
export interface RiskAction {
  /** 行为ID */
  id: string
  /** 行为类型 */
  type: 'freeze' | 'limit' | 'warning' | 'monitor'
  /** 行为描述 */
  description: string
  /** 执行时间 */
  executeTime: Date
  /** 执行人ID */
  executorId: string
  /** 是否生效 */
  isActive: boolean
}

/**
 * 黑名单记录接口
 */
export interface BlacklistRecord {
  /** 记录ID */
  id: string
  /** 用户ID */
  userId: string
  /** 黑名单类型 */
  type: BlacklistType
  /** 加入原因 */
  reason: string
  /** 加入时间 */
  createTime: Date
  /** 到期时间 */
  expireTime?: Date
  /** 创建人ID */
  creatorId: string
  /** 是否生效 */
  isActive: boolean
  /** 备注 */
  remark?: string
}

/**
 * 注册审核记录接口
 */
export interface AuditRecord {
  /** 审核ID */
  id: string
  /** 用户ID */
  userId: string
  /** 审核状态 */
  status: AuditStatus
  /** 审核意见 */
  comment?: string
  /** 审核人ID */
  auditorId?: string
  /** 审核时间 */
  auditTime?: Date
  /** 申请资料 */
  applicationData: UserApplicationData
}

/**
 * 用户申请资料接口
 */
export interface UserApplicationData {
  /** 身份证正面照片 */
  idCardFront?: string
  /** 身份证背面照片 */
  idCardBack?: string
  /** 驾驶证照片 */
  driverLicense?: string
  /** 用户手持身份证照片 */
  userPhoto?: string
  /** 其他证明文件 */
  otherDocuments?: string[]
  /** 申请时间 */
  applyTime: Date
  /** 申请备注 */
  remark?: string
}

// ==================== 组件Props接口定义 ====================

/**
 * 用户表格组件Props接口
 */
export interface UserTableProps {
  /** 用户列表数据 */
  users: User[]
  /** 是否加载中 */
  loading?: boolean
  /** 选中的用户ID列表 */
  selection?: string[]
  /** 行选择函数 */
  selectable?: (user: User) => boolean
  /** 是否显示操作列 */
  showActions?: boolean
  /** 表格高度 */
  height?: number | string
  /** 是否显示复选框 */
  showSelection?: boolean
}

/**
 * 用户搜索组件Props接口
 */
export interface UserSearchProps {
  /** 筛选条件 */
  filters?: UserFilters
  /** 是否显示高级搜索 */
  showAdvanced?: boolean
  /** 占位符文本 */
  placeholder?: string
  /** 是否显示重置按钮 */
  showReset?: boolean
}

/**
 * 用户筛选条件接口
 */
export interface UserFilters {
  /** 关键词搜索 */
  keyword?: string
  /** 用户状态筛选 */
  status?: UserStatus
  /** 信用等级筛选 */
  creditLevel?: CreditLevel
  /** 风险等级筛选 */
  riskLevel?: RiskLevel
  /** 注册时间范围 */
  registerDateRange?: [Date, Date]
  /** 最后登录时间范围 */
  loginDateRange?: [Date, Date]
  /** 用户标签筛选 */
  tagIds?: string[]
  /** 角色筛选 */
  roleCode?: RoleCode
  /** 门店筛选 */
  storeId?: string
}

/**
 * 用户详情组件Props接口
 */
export interface UserDetailProps {
  /** 用户数据 */
  user: User
  /** 显示模式：view | edit */
  mode: 'view' | 'edit'
  /** 是否可编辑 */
  editable?: boolean
  /** 当前激活的标签页 */
  activeTab?: string
}

/**
 * 标签选择器组件Props接口
 */
export interface TagSelectorProps {
  /** 选中的标签ID列表 */
  modelValue: string[]
  /** 标签类型筛选 */
  tagType?: TagType
  /** 是否多选 */
  multiple?: boolean
  /** 是否显示创建标签功能 */
  allowCreate?: boolean
  /** 占位符文本 */
  placeholder?: string
  /** 最大选择数量 */
  maxCount?: number
}

/**
 * 审核弹窗组件Props接口
 */
export interface AuditModalProps {
  /** 是否显示弹窗 */
  modelValue: boolean
  /** 审核记录数据 */
  auditRecord?: AuditRecord
  /** 用户数据 */
  user?: User
  /** 弹窗标题 */
  title?: string
}

// ==================== API响应接口定义 ====================

/**
 * API响应基础接口
 */
export interface ApiResponse<T = any> {
  /** 响应码 */
  code: number
  /** 响应消息 */
  message: string
  /** 响应数据 */
  data: T
  /** 响应时间戳 */
  timestamp: number
  /** 请求ID */
  requestId: string
}

/**
 * 分页响应接口
 */
export interface PageResponse<T> {
  /** 数据列表 */
  list: T[]
  /** 总记录数 */
  total: number
  /** 当前页码 */
  page: number
  /** 每页大小 */
  pageSize: number
  /** 总页数 */
  totalPages: number
}

/**
 * 用户列表响应接口
 */
export interface UserListResponse extends PageResponse<User> {
  /** 统计信息 */
  statistics: UserStatistics
}

/**
 * 用户统计信息接口
 */
export interface UserStatistics {
  /** 总用户数 */
  totalUsers: number
  /** 活跃用户数 */
  activeUsers: number
  /** 新注册用户数 */
  newUsers: number
  /** 待审核用户数 */
  pendingUsers: number
  /** 风险用户数 */
  riskUsers: number
}

// ==================== 事件接口定义 ====================

/**
 * 用户表格事件接口
 */
export interface UserTableEvents {
  /** 选择变化事件 */
  'selection-change': (selection: User[]) => void
  /** 行点击事件 */
  'row-click': (user: User) => void
  /** 排序变化事件 */
  'sort-change': (sort: { prop: string; order: string }) => void
  /** 编辑用户事件 */
  'edit-user': (user: User) => void
  /** 查看详情事件 */
  'view-detail': (user: User) => void
  /** 删除用户事件 */
  'delete-user': (user: User) => void
  /** 批量操作事件 */
  'batch-operation': (operation: string, users: User[]) => void
}

/**
 * 用户搜索事件接口
 */
export interface UserSearchEvents {
  /** 搜索事件 */
  'search': (filters: UserFilters) => void
  /** 重置事件 */
  'reset': () => void
  /** 筛选变化事件 */
  'filter-change': (filters: UserFilters) => void
}

// ==================== 配置接口定义 ====================

/**
 * 用户管理配置接口
 */
export interface UserManagementConfig {
  /** 分页配置 */
  pagination: {
    defaultPageSize: number
    pageSizes: number[]
  }
  /** 表格配置 */
  table: {
    height: number | string
    stripe: boolean
    border: boolean
  }
  /** 搜索配置 */
  search: {
    placeholder: string
    showAdvanced: boolean
  }
}

/**
 * 导出配置接口
 */
export interface ExportConfig {
  /** 导出格式 */
  format: 'excel' | 'csv' | 'pdf'
  /** 导出字段 */
  fields: string[]
  /** 是否包含敏感信息 */
  includeSensitive: boolean
  /** 导出条件 */
  filters?: UserFilters
}