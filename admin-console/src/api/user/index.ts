/**
 * 用户管理API服务
 * @author 叨叨房车团队
 * @since 2025-11-12
 */

import { http } from '@/utils/request'
import type {
  User,
  UserProfile,
  UserTag,
  UserTagRelation,
  CreditEvaluation,
  RiskEvent,
  BlacklistRecord,
  AuditRecord,
  UserFilters,
  UserListResponse,
  UserStatistics,
  ApiResponse,
  PageResponse
} from '@/types/user'

/**
 * 用户API服务类
 */
export class UserApiService {
  private static readonly BASE_PATH = '/users'

  // ==================== 用户基础信息管理 ====================

  /**
   * 获取用户列表
   */
  static async getUserList(params: {
    page?: number
    pageSize?: number
    filters?: UserFilters
  }): Promise<UserListResponse> {
    return http.get<UserListResponse>(`${this.BASE_PATH}`, { params })
  }

  /**
   * 根据ID获取用户详情
   */
  static async getUserById(id: string): Promise<User> {
    return http.get<User>(`${this.BASE_PATH}/${id}`)
  }

  /**
   * 根据手机号获取用户信息
   */
  static async getUserByPhone(phone: string): Promise<User> {
    return http.get<User>(`${this.BASE_PATH}/by-phone`, { params: { phone } })
  }

  /**
   * 创建用户
   */
  static async createUser(userData: Partial<User>): Promise<User> {
    return http.post<User>(`${this.BASE_PATH}`, userData)
  }

  /**
   * 更新用户信息
   */
  static async updateUser(id: string, userData: Partial<User>): Promise<User> {
    return http.put<User>(`${this.BASE_PATH}/${id}`, userData)
  }

  /**
   * 删除用户
   */
  static async deleteUser(id: string): Promise<void> {
    return http.delete(`${this.BASE_PATH}/${id}`)
  }

  /**
   * 批量删除用户
   */
  static async batchDeleteUsers(ids: string[]): Promise<void> {
    return http.post(`${this.BASE_PATH}/batch-delete`, { ids })
  }

  /**
   * 更新用户状态
   */
  static async updateUserStatus(id: string, status: string): Promise<User> {
    return http.patch(`${this.BASE_PATH}/${id}/status`, { status })
  }

  /**
   * 重置用户密码
   */
  static async resetUserPassword(id: string): Promise<string> {
    return http.post<string>(`${this.BASE_PATH}/${id}/reset-password`)
  }

  // ==================== 用户扩展信息管理 ====================

  /**
   * 获取用户扩展信息
   */
  static async getUserProfile(userId: string): Promise<UserProfile> {
    return http.get<UserProfile>(`${this.BASE_PATH}/${userId}/profile`)
  }

  /**
   * 更新用户扩展信息
   */
  static async updateUserProfile(userId: string, profile: Partial<UserProfile>): Promise<UserProfile> {
    return http.put<UserProfile>(`${this.BASE_PATH}/${userId}/profile`, profile)
  }

  // ==================== 用户标签管理 ====================

  /**
   * 获取所有用户标签
   */
  static async getAllTags(): Promise<UserTag[]> {
    return http.get<UserTag[]>(`${this.BASE_PATH}/tags`)
  }

  /**
   * 根据类型获取标签
   */
  static async getTagsByType(type: string): Promise<UserTag[]> {
    return http.get<UserTag[]>(`${this.BASE_PATH}/tags`, { params: { type } })
  }

  /**
   * 创建用户标签
   */
  static async createTag(tagData: Partial<UserTag>): Promise<UserTag> {
    return http.post<UserTag>(`${this.BASE_PATH}/tags`, tagData)
  }

  /**
   * 更新用户标签
   */
  static async updateTag(id: string, tagData: Partial<UserTag>): Promise<UserTag> {
    return http.put<UserTag>(`${this.BASE_PATH}/tags/${id}`, tagData)
  }

  /**
   * 删除用户标签
   */
  static async deleteTag(id: string): Promise<void> {
    return http.delete(`${this.BASE_PATH}/tags/${id}`)
  }

  /**
   * 获取用户标签关联
   */
  static async getUserTagRelations(userId: string): Promise<UserTagRelation[]> {
    return http.get<UserTagRelation[]>(`${this.BASE_PATH}/${userId}/tags`)
  }

  /**
   * 为用户分配标签
   */
  static async assignTagsToUser(userId: string, tagIds: string[]): Promise<UserTagRelation[]> {
    return http.post<UserTagRelation[]>(`${this.BASE_PATH}/${userId}/tags`, { tagIds })
  }

  /**
   * 移除用户标签
   */
  static async removeTagFromUser(userId: string, tagId: string): Promise<void> {
    return http.delete(`${this.BASE_PATH}/${userId}/tags/${tagId}`)
  }

  /**
   * 批量为用户分配标签
   */
  static async batchAssignTags(userIds: string[], tagIds: string[]): Promise<void> {
    return http.post(`${this.BASE_PATH}/batch-assign-tags`, { userIds, tagIds })
  }

  // ==================== 用户搜索和筛选 ====================

  /**
   * 搜索用户
   */
  static async searchUsers(params: {
    keyword: string
    page?: number
    pageSize?: number
    filters?: UserFilters
  }): Promise<UserListResponse> {
    return http.get<UserListResponse>(`${this.BASE_PATH}/search`, { params })
  }

  /**
   * 高级搜索用户
   */
  static async advancedSearch(params: {
    filters: UserFilters
    page?: number
    pageSize?: number
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }): Promise<UserListResponse> {
    return http.post<UserListResponse>(`${this.BASE_PATH}/advanced-search`, params)
  }

  /**
   * 获取用户统计信息
   */
  static async getUserStatistics(): Promise<UserStatistics> {
    return http.get<UserStatistics>(`${this.BASE_PATH}/statistics`)
  }

  // ==================== 用户审核管理 ====================

  /**
   * 获取待审核用户列表
   */
  static async getPendingAudits(params?: {
    page?: number
    pageSize?: number
  }): Promise<PageResponse<AuditRecord>> {
    return http.get<PageResponse<AuditRecord>>(`${this.BASE_PATH}/audits/pending`, { params })
  }

  /**
   * 获取审核记录详情
   */
  static async getAuditRecord(id: string): Promise<AuditRecord> {
    return http.get<AuditRecord>(`${this.BASE_PATH}/audits/${id}`)
  }

  /**
   * 审核通过
   */
  static async approveAudit(id: string, comment?: string): Promise<AuditRecord> {
    return http.post<AuditRecord>(`${this.BASE_PATH}/audits/${id}/approve`, { comment })
  }

  /**
   * 审核拒绝
   */
  static async rejectAudit(id: string, reason: string): Promise<AuditRecord> {
    return http.post<AuditRecord>(`${this.BASE_PATH}/audits/${id}/reject`, { reason })
  }

  /**
   * 批量审核
   */
  static async batchApprove(ids: string[], comment?: string): Promise<AuditRecord[]> {
    return http.post<AuditRecord[]>(`${this.BASE_PATH}/audits/batch-approve`, { ids, comment })
  }

  /**
   * 批量拒绝
   */
  static async batchReject(params: { ids: string[]; reason: string }): Promise<AuditRecord[]> {
    return http.post<AuditRecord[]>(`${this.BASE_PATH}/audits/batch-reject`, params)
  }

  /**
   * 获取用户审核历史
   */
  static async getUserAuditHistory(userId: string): Promise<AuditRecord[]> {
    return http.get<AuditRecord[]>(`${this.BASE_PATH}/${userId}/audit-history`)
  }

  // ==================== 用户信用评估管理 ====================

  /**
   * 获取用户信用评估记录
   */
  static async getCreditEvaluations(userId: string): Promise<CreditEvaluation[]> {
    return http.get<CreditEvaluation[]>(`${this.BASE_PATH}/${userId}/credit-evaluations`)
  }

  /**
   * 获取最新信用评估
   */
  static async getLatestCreditEvaluation(userId: string): Promise<CreditEvaluation> {
    return http.get<CreditEvaluation>(`${this.BASE_PATH}/${userId}/credit-evaluation/latest`)
  }

  /**
   * 手动调整信用分
   */
  static async adjustCreditScore(userId: string, params: {
    score: number
    reason: string
  }): Promise<CreditEvaluation> {
    return http.post<CreditEvaluation>(`${this.BASE_PATH}/${userId}/credit-adjustment`, params)
  }

  /**
   * 自动计算信用分
   */
  static async calculateCreditScore(userId: string): Promise<CreditEvaluation> {
    return http.post<CreditEvaluation>(`${this.BASE_PATH}/${userId}/credit-calculation`)
  }

  /**
   * 获取信用分历史趋势
   */
  static async getCreditHistory(userId: string, params?: {
    startDate?: string
    endDate?: string
  }): Promise<CreditEvaluation[]> {
    return http.get<CreditEvaluation[]>(`${this.BASE_PATH}/${userId}/credit-history`, { params })
  }

  // ==================== 用户风控管理 ====================

  /**
   * 获取用户风控事件
   */
  static async getRiskEvents(params?: {
    userId?: string
    level?: string
    status?: string
    page?: number
    pageSize?: number
  }): Promise<PageResponse<RiskEvent>> {
    return http.get<PageResponse<RiskEvent>>(`${this.BASE_PATH}/risk-events`, { params })
  }

  /**
   * 获取用户风控事件详情
   */
  static async getRiskEvent(id: string): Promise<RiskEvent> {
    return http.get<RiskEvent>(`${this.BASE_PATH}/risk-events/${id}`)
  }

  /**
   * 处理风控事件
   */
  static async handleRiskEvent(id: string, params: {
    action: string
    comment?: string
  }): Promise<RiskEvent> {
    return http.post<RiskEvent>(`${this.BASE_PATH}/risk-events/${id}/handle`, params)
  }

  /**
   * 设置风控规则
   */
  static async setRiskRules(params: {
    rules: Array<{
      type: string
      threshold: number
      action: string
    }>
  }): Promise<void> {
    return http.post(`${this.BASE_PATH}/risk-rules`, params)
  }

  /**
   * 获取用户风险等级
   */
  static async getUserRiskLevel(userId: string): Promise<{ level: string; score: number }> {
    return http.get<{ level: string; score: number }>(`${this.BASE_PATH}/${userId}/risk-level`)
  }

  // ==================== 用户黑名单管理 ====================

  /**
   * 获取黑名单列表
   */
  static async getBlacklist(params?: {
    type?: string
    isActive?: boolean
    page?: number
    pageSize?: number
  }): Promise<PageResponse<BlacklistRecord>> {
    return http.get<PageResponse<BlacklistRecord>>(`${this.BASE_PATH}/blacklist`, { params })
  }

  /**
   * 添加用户到黑名单
   */
  static async addToBlacklist(params: {
    userId: string
    type: string
    reason: string
    expireTime?: string
    remark?: string
  }): Promise<BlacklistRecord> {
    return http.post<BlacklistRecord>(`${this.BASE_PATH}/blacklist`, params)
  }

  /**
   * 从黑名单移除用户
   */
  static async removeFromBlacklist(id: string): Promise<void> {
    return http.delete(`${this.BASE_PATH}/blacklist/${id}`)
  }

  /**
   * 更新黑名单记录
   */
  static async updateBlacklist(id: string, params: Partial<BlacklistRecord>): Promise<BlacklistRecord> {
    return http.put<BlacklistRecord>(`${this.BASE_PATH}/blacklist/${id}`, params)
  }

  /**
   * 检查用户是否在黑名单中
   */
  static async checkUserInBlacklist(userId: string): Promise<{ isInBlacklist: boolean; record?: BlacklistRecord }> {
    return http.get<{ isInBlacklist: boolean; record?: BlacklistRecord }>(`${this.BASE_PATH}/${userId}/blacklist-status`)
  }

  // ==================== 用户导出功能 ====================

  /**
   * 导出用户列表
   */
  static async exportUsers(params: {
    filters?: UserFilters
    format?: 'excel' | 'csv'
    fields?: string[]
  }): Promise<void> {
    const { format = 'excel', fields = [], filters = {} } = params
    const filename = `users_${Date.now()}.${format}`

    return http.download(
      `${this.BASE_PATH}/export`,
      filename,
      {
        params: { format, fields, ...filters }
      }
    )
  }

  /**
   * 导出审核记录
   */
  static async exportAuditRecords(params?: {
    startDate?: string
    endDate?: string
    status?: string
    format?: 'excel' | 'csv'
  }): Promise<void> {
    const { format = 'excel', ...restParams } = params || {}
    const filename = `audit_records_${Date.now()}.${format}`

    return http.download(
      `${this.BASE_PATH}/audits/export`,
      filename,
      { params: { format, ...restParams } }
    )
  }

  // ==================== 用户验证功能 ====================

  /**
   * 验证用户手机号
   */
  static async validatePhone(phone: string): Promise<{ isAvailable: boolean }> {
    return http.get<{ isAvailable: boolean }>(`${this.BASE_PATH}/validate/phone`, { params: { phone } })
  }

  /**
   * 验证用户邮箱
   */
  static async validateEmail(email: string): Promise<{ isAvailable: boolean }> {
    return http.get<{ isAvailable: boolean }>(`${this.BASE_PATH}/validate/email`, { params: { email } })
  }

  /**
   * 验证身份证号
   */
  static async validateIdCard(idCard: string): Promise<{ isValid: boolean; info?: any }> {
    return http.get<{ isValid: boolean; info?: any }>(`${this.BASE_PATH}/validate/id-card`, { params: { idCard } })
  }

  // ==================== 用户操作日志 ====================

  /**
   * 获取用户操作日志
   */
  static async getUserOperationLogs(userId: string, params?: {
    page?: number
    pageSize?: number
    startDate?: string
    endDate?: string
  }): Promise<PageResponse<any>> {
    return http.get<PageResponse<any>>(`${this.BASE_PATH}/${userId}/operation-logs`, { params })
  }

  /**
   * 记录用户操作
   */
  static async logUserOperation(params: {
    userId: string
    operation: string
    details?: any
  }): Promise<void> {
    return http.post(`${this.BASE_PATH}/operation-logs`, params)
  }
}

// 导出默认实例
export default UserApiService

// 导出所有方法作为独立函数，方便按需导入
export const {
  getUserList,
  getUserById,
  getUserByPhone,
  createUser,
  updateUser,
  deleteUser,
  batchDeleteUsers,
  updateUserStatus,
  resetUserPassword,
  getUserProfile,
  updateUserProfile,
  getAllTags,
  getTagsByType,
  createTag,
  updateTag,
  deleteTag,
  getUserTagRelations,
  assignTagsToUser,
  removeTagFromUser,
  batchAssignTags,
  searchUsers,
  advancedSearch,
  getUserStatistics,
  getPendingAudits,
  getAuditRecord,
  approveAudit,
  rejectAudit,
  batchApprove,
  batchReject,
  getUserAuditHistory,
  getCreditEvaluations,
  getLatestCreditEvaluation,
  adjustCreditScore,
  calculateCreditScore,
  getCreditHistory,
  getRiskEvents,
  getRiskEvent,
  handleRiskEvent,
  setRiskRules,
  getUserRiskLevel,
  getBlacklist,
  addToBlacklist,
  removeFromBlacklist,
  updateBlacklist,
  checkUserInBlacklist,
  exportUsers,
  exportAuditRecords,
  validatePhone,
  validateEmail,
  validateIdCard,
  getUserOperationLogs,
  logUserOperation
} = UserApiService