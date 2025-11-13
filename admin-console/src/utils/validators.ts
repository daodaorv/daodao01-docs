/**
 * 表单验证工具
 * @author 叨叨房车团队
 * @since 2025-11-12
 */

/**
 * 验证规则接口
 */
export interface ValidationRule {
  required?: boolean
  message?: string
  trigger?: 'blur' | 'change' | 'submit'
  min?: number
  max?: number
  pattern?: RegExp
  validator?: (value: any) => boolean | string
}

/**
 * 表单验证规则集合
 */
export const validationRules = {
  // 必填项验证
  required: (message: string = '此字段为必填项'): ValidationRule => ({
    required: true,
    message,
    trigger: 'blur'
  }),

  // 长度验证
  length: (min: number, max: number, message?: string): ValidationRule => ({
    min,
    max,
    message: message || `长度应在 ${min} 到 ${max} 个字符之间`,
    trigger: 'blur'
  }),

  // 手机号验证
  phone: (message: string = '请输入正确的手机号'): ValidationRule => ({
    pattern: /^1[3-9]\d{9}$/,
    message,
    trigger: 'blur'
  }),

  // 邮箱验证
  email: (message: string = '请输入正确的邮箱地址'): ValidationRule => ({
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message,
    trigger: 'blur'
  }),

  // 身份证号验证
  idCard: (message: string = '请输入正确的身份证号'): ValidationRule => ({
    pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
    message,
    trigger: 'blur'
  }),

  // 密码验证（8-20位，包含字母和数字）
  password: (message: string = '密码应为8-20位，且包含字母和数字'): ValidationRule => ({
    pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,20}$/,
    message,
    trigger: 'blur'
  }),

  // 数字验证
  number: (message: string = '请输入有效数字'): ValidationRule => ({
    pattern: /^[+-]?\d+(\.\d+)?$/,
    message,
    trigger: 'blur'
  }),

  // 正整数验证
  positiveInteger: (message: string = '请输入正整数'): ValidationRule => ({
    pattern: /^[1-9]\d*$/,
    message,
    trigger: 'blur'
  }),

  // 年龄验证（18-120）
  age: (message: string = '年龄应在18到120之间'): ValidationRule => ({
    pattern: /^(1[89]|[2-9]\d|1[01]\d|120)$/,
    message,
    trigger: 'blur'
  }),

  // 中文姓名验证
  chineseName: (message: string = '请输入正确的中文姓名'): ValidationRule => ({
    pattern: /^[\u4e00-\u9fa5]{2,8}$/,
    message,
    trigger: 'blur'
  }),

  // URL验证
  url: (message: string = '请输入正确的URL地址'): ValidationRule => ({
    pattern: /^https?:\/\/[^\s/$.?#].[^\s]*$/,
    message,
    trigger: 'blur'
  }),

  // 自定义验证器
  custom: (validator: (value: any) => boolean | string, message?: string): ValidationRule => ({
    validator: (value: any) => {
      const result = validator(value)
      if (typeof result === 'string') {
        return result
      }
      return result || message || '验证失败'
    },
    trigger: 'blur'
  })
}

/**
 * 表单验证器类
 */
export class FormValidator {
  private errors: Map<string, string[]> = new Map()

  /**
   * 验证单个字段
   */
  validateField(value: any, rules: ValidationRule[]): string[] {
    const errors: string[] = []

    for (const rule of rules) {
      if (rule.required && (value === undefined || value === null || value === '')) {
        errors.push(rule.message || '此字段为必填项')
        continue
      }

      if (value && rule.min && rule.max && value.length < rule.min) {
        errors.push(rule.message || `长度不能少于${rule.min}个字符`)
      }

      if (value && rule.min && rule.max && value.length > rule.max) {
        errors.push(rule.message || `长度不能超过${rule.max}个字符`)
      }

      if (value && rule.pattern && !rule.pattern.test(value)) {
        errors.push(rule.message || '格式不正确')
      }

      if (value && rule.validator) {
        const result = rule.validator(value)
        if (typeof result === 'string') {
          errors.push(result)
        } else if (!result) {
          errors.push(rule.message || '验证失败')
        }
      }
    }

    return errors
  }

  /**
   * 验证整个表单
   */
  validateForm(data: Record<string, any>, rules: Record<string, ValidationRule[]>): boolean {
    this.errors.clear()
    let isValid = true

    for (const [field, fieldRules] of Object.entries(rules)) {
      const value = data[field]
      const fieldErrors = this.validateField(value, fieldRules)

      if (fieldErrors.length > 0) {
        this.errors.set(field, fieldErrors)
        isValid = false
      }
    }

    return isValid
  }

  /**
   * 获取字段错误
   */
  getFieldErrors(field: string): string[] {
    return this.errors.get(field) || []
  }

  /**
   * 获取所有错误
   */
  getAllErrors(): Record<string, string[]> {
    const result: Record<string, string[]> = {}
    for (const [field, errors] of this.errors) {
      result[field] = errors
    }
    return result
  }

  /**
   * 清除字段错误
   */
  clearFieldError(field: string): void {
    this.errors.delete(field)
  }

  /**
   * 清除所有错误
   */
  clearAllErrors(): void {
    this.errors.clear()
  }

  /**
   * 检查字段是否有错误
   */
  hasFieldError(field: string): boolean {
    const errors = this.errors.get(field)
    return errors ? errors.length > 0 : false
  }

  /**
   * 检查表单是否有错误
   */
  hasErrors(): boolean {
    return this.errors.size > 0
  }
}

/**
 * 常用验证函数
 */
export const validators = {
  // 验证手机号
  isPhone: (value: string): boolean => {
    return /^1[3-9]\d{9}$/.test(value)
  },

  // 验证邮箱
  isEmail: (value: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  },

  // 验证身份证号
  isIdCard: (value: string): boolean => {
    return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value)
  },

  // 验证密码强度
  isStrongPassword: (value: string): boolean => {
    return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,20}$/.test(value)
  },

  // 验证年龄
  isAge: (value: number): boolean => {
    return value >= 18 && value <= 120
  },

  // 验证URL
  isUrl: (value: string): boolean => {
    try {
      new URL(value)
      return true
    } catch {
      return false
    }
  },

  // 验证中文姓名
  isChineseName: (value: string): boolean => {
    return /^[\u4e00-\u9fa5]{2,8}$/.test(value)
  },

  // 验证银行卡号
  isBankCard: (value: string): boolean => {
    return /^\d{16,19}$/.test(value)
  },

  // 验证车牌号
  isLicensePlate: (value: string): boolean => {
    return /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-Z0-9]{4}[A-Z0-9挂学警港澳]$/.test(value)
  },

  // 验证邮政编码
  isZipCode: (value: string): boolean => {
    return /^\d{6}$/.test(value)
  }
}

/**
 * 创建表单验证实例
 */
export const createValidator = (): FormValidator => {
  return new FormValidator()
}

// 导出默认实例
export const validator = createValidator()