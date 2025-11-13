/**
 * HTTP请求工具
 * @author 叨叨房车团队
 * @since 2025-11-12
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'

/**
 * API响应基础接口
 */
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
  timestamp: number
  requestId: string
}

/**
 * HTTP请求配置
 */
export interface RequestConfig extends AxiosRequestConfig {
  /** 是否显示loading */
  showLoading?: boolean
  /** 是否显示错误消息 */
  showError?: boolean
  /** 自定义错误处理 */
  customErrorHandler?: (error: AxiosError) => void
}

/**
 * HTTP请求工具类
 */
export class HttpClient {
  private static instance: HttpClient
  private axiosInstance: AxiosInstance

  static getInstance(): HttpClient {
    if (!HttpClient.instance) {
      HttpClient.instance = new HttpClient()
    }
    return HttpClient.instance
  }

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    this.setupInterceptors()
  }

  /**
   * 设置请求和响应拦截器
   */
  private setupInterceptors() {
    // 请求拦截器
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // 添加认证token
        const token = localStorage.getItem('token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }

        // 添加请求ID
        config.headers['X-Request-ID'] = this.generateRequestId()

        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // 响应拦截器
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => {
        const { data } = response

        // 检查业务状态码
        if (data.code === 0) {
          return response
        } else {
          // 业务错误处理
          ElMessage.error(data.message || '请求失败')
          return Promise.reject(new Error(data.message))
        }
      },
      (error: AxiosError) => {
        this.handleRequestError(error)
        return Promise.reject(error)
      }
    )
  }

  /**
   * 处理请求错误
   */
  private handleRequestError(error: AxiosError) {
    if (error.response) {
      const { status, data } = error.response as AxiosResponse<ApiResponse>

      switch (status) {
        case 401:
          // 未授权，跳转登录页
          ElMessageBox.alert('登录已过期，请重新登录', '提示', {
            confirmButtonText: '确定',
            callback: () => {
              localStorage.removeItem('token')
              localStorage.removeItem('userInfo')
              window.location.href = '/login'
            }
          })
          break
        case 403:
          ElMessage.error('没有权限访问此资源')
          break
        case 404:
          ElMessage.error('请求的资源不存在')
          break
        case 500:
          ElMessage.error('服务器内部错误')
          break
        default:
          ElMessage.error((data as ApiResponse)?.message || `请求失败 (${status})`)
      }
    } else if (error.request) {
      ElMessage.error('网络连接失败，请检查网络设置')
    } else {
      ElMessage.error('请求配置错误')
    }
  }

  /**
   * 生成请求ID
   */
  private generateRequestId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  /**
   * GET请求
   */
  async get<T = any>(url: string, config?: RequestConfig): Promise<T> {
    return this.axiosInstance.get(url, config).then(response => response.data.data)
  }

  /**
   * POST请求
   */
  async post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.axiosInstance.post(url, data, config).then(response => response.data.data)
  }

  /**
   * PUT请求
   */
  async put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.axiosInstance.put(url, data, config).then(response => response.data.data)
  }

  /**
   * DELETE请求
   */
  async delete<T = any>(url: string, config?: RequestConfig): Promise<T> {
    return this.axiosInstance.delete(url, config).then(response => response.data.data)
  }

  /**
   * PATCH请求
   */
  async patch<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.axiosInstance.patch(url, data, config).then(response => response.data.data)
  }

  /**
   * 文件上传
   */
  async upload<T = any>(url: string, file: File, config?: RequestConfig): Promise<T> {
    const formData = new FormData()
    formData.append('file', file)

    return this.axiosInstance.post(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config?.headers
      }
    }).then(response => response.data.data)
  }

  /**
   * 批量文件上传
   */
  async uploadMultiple<T = any>(url: string, files: File[], config?: RequestConfig): Promise<T> {
    const formData = new FormData()
    files.forEach((file, index) => {
      formData.append(`files[${index}]`, file)
    })

    return this.axiosInstance.post(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config?.headers
      }
    }).then(response => response.data.data)
  }

  /**
   * 下载文件
   */
  async download(url: string, filename?: string, config?: RequestConfig): Promise<void> {
    return this.axiosInstance.get(url, {
      ...config,
      responseType: 'blob'
    }).then(response => {
      const blob = new Blob([response.data])
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = filename || 'download'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)
    })
  }

  /**
   * 取消请求
   */
  createCancelToken() {
    return axios.CancelToken.source()
  }

  /**
   * 检查是否为取消错误
   */
  isCancel(error: any): boolean {
    return axios.isCancel(error)
  }
}

// 导出单例实例
export const http = HttpClient.getInstance()

// 导出默认实例
export default http