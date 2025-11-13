/**
 * 数据格式化工具
 * @author 叨叨房车团队
 * @since 2025-11-12
 */

/**
 * 格式化日期
 */
export const formatDate = (date: string | Date, format: string = 'YYYY-MM-DD'): string => {
  const d = new Date(date)

  if (isNaN(d.getTime())) {
    return ''
  }

  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')

  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

/**
 * 格式化日期时间（友好显示）
 */
export const formatDateTime = (date: string | Date): string => {
  const d = new Date(date)
  if (isNaN(d.getTime())) {
    return ''
  }

  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 1) {
    return '刚刚'
  } else if (diffMins < 60) {
    return `${diffMins}分钟前`
  } else if (diffHours < 24) {
    return `${diffHours}小时前`
  } else if (diffDays < 7) {
    return `${diffDays}天前`
  } else {
    return formatDate(date, 'YYYY-MM-DD')
  }
}

/**
 * 格式化手机号
 */
export const formatPhone = (phone: string): string => {
  if (!phone || phone.length !== 11) {
    return phone
  }
  return phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
}

/**
 * 隐藏手机号中间四位
 */
export const hidePhone = (phone: string): string => {
  if (!phone || phone.length !== 11) {
    return phone
  }
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

/**
 * 隐藏邮箱
 */
export const hideEmail = (email: string): string => {
  if (!email || !email.includes('@')) {
    return email
  }
  const [username, domain] = email.split('@')
  const hiddenUsername = username.slice(0, 2) + '***' + username.slice(-1)
  return `${hiddenUsername}@${domain}`
}

/**
 * 格式化身份证号
 */
export const formatIdCard = (idCard: string): string => {
  if (!idCard || idCard.length < 18) {
    return idCard
  }
  return idCard.replace(/(\d{6})(\d{8})(\d{4})/, '$1********$3')
}

/**
 * 格式化金额
 */
export const formatMoney = (amount: number | string, currency: string = '¥'): string => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount
  if (isNaN(num)) {
    return '0.00'
  }
  return `${currency}${num.toFixed(2)}`
}

/**
 * 格式化百分比
 */
export const formatPercent = (value: number, decimals: number = 2): string => {
  return `${(value * 100).toFixed(decimals)}%`
}

/**
 * 格式化文件大小
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'

  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * 格式化数字（千分位分隔）
 */
export const formatNumber = (num: number | string): string => {
  const n = typeof num === 'string' ? parseFloat(num) : num
  if (isNaN(n)) {
    return '0'
  }
  return n.toLocaleString('zh-CN')
}

/**
 * 格式化性别
 */
export const formatGender = (gender: string): string => {
  const genderMap: Record<string, string> = {
    male: '男',
    female: '女',
    unknown: '未知'
  }
  return genderMap[gender] || gender
}

/**
 * 格式化用户状态
 */
export const formatUserStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    active: '正常',
    inactive: '禁用',
    pending: '待审核',
    banned: '已禁用',
    audit_rejected: '审核不通过'
  }
  return statusMap[status] || status
}

/**
 * 格式化信用等级
 */
export const formatCreditLevel = (level: string): string => {
  const levelMap: Record<string, string> = {
    AAA: '信用极好',
    AA: '信用优秀',
    A: '信用良好',
    B: '信用一般',
    C: '信用较差',
    D: '信用很差'
  }
  return levelMap[level] || level
}

/**
 * 格式化风险等级
 */
export const formatRiskLevel = (level: string): string => {
  const levelMap: Record<string, string> = {
    low: '低风险',
    medium: '中风险',
    high: '高风险',
    critical: '严重风险'
  }
  return levelMap[level] || level
}

/**
 * 格式化时长（秒转换为时分秒）
 */
export const formatDuration = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds}秒`
  }

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60

  if (hours > 0) {
    return `${hours}小时${minutes}分钟${remainingSeconds}秒`
  } else if (minutes > 0) {
    return `${minutes}分钟${remainingSeconds}秒`
  } else {
    return `${remainingSeconds}秒`
  }
}

/**
 * 格式化URL（添加协议）
 */
export const formatUrl = (url: string): string => {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  return `https://${url}`
}

/**
 * 截取文本
 */
export const truncateText = (text: string, length: number = 50, suffix: string = '...'): string => {
  if (!text) return ''
  if (text.length <= length) return text
  return text.substring(0, length) + suffix
}

/**
 * 首字母大写
 */
export const capitalize = (str: string): string => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * 驼峰转驼峰
 */
export const kebabToCamel = (str: string): string => {
  return str.replace(/-([a-z])/g, (_, char) => char.toUpperCase())
}

/**
 * 驼峰转下划线
 */
export const camelToKebab = (str: string): string => {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase()
}

/**
 * 生成随机ID
 */
export const generateId = (length: number = 8): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * 颜色值转换（hex转rgb）
 */
export const hexToRgb = (hex: string): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})`
    : hex
}

/**
 * 检查是否为有效的URL
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * 检查是否为有效的邮箱
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * 检查是否为有效的手机号
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^1[3-9]\d{9}$/
  return phoneRegex.test(phone)
}

/**
 * 检查是否为有效的身份证号
 */
export const isValidIdCard = (idCard: string): boolean => {
  const idCardRegex = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
  return idCardRegex.test(idCard)
}