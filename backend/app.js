const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const compression = require('compression')
const rateLimit = require('express-rate-limit')
require('dotenv').config()

// 导入数据库配置
const { testConnection, syncDatabase } = require('./config/database')

const app = express()
const PORT = process.env.PORT || 3000

// 中间件
app.use(helmet())
app.use(compression())
app.use(morgan('combined'))
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true
}))

// 速率限制
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100, // 限制每个IP 100个请求
  message: '请求过于频繁，请稍后再试'
})
app.use('/api/', limiter)

// 解析请求体
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// 路由
app.use('/api', require('./routes'))

// 健康检查
app.get('/health', (req, res) => {
  res.json({
    status: 'success',
    message: '叨叨后端服务运行正常',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  })
})

// 404处理
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: '接口不存在'
  })
})

// 全局错误处理
app.use((err, req, res, next) => {
  console.error('Error:', err)
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || '服务器内部错误'
  })
})

// 启动服务器
const startServer = async () => {
  try {
    // 测试数据库连接
    console.log('🔍 正在检查数据库连接...')
    const dbConnected = await testConnection()

    if (dbConnected) {
      // 同步数据库模型
      console.log('🔍 正在同步数据库模型...')
      await syncDatabase()
    }

    app.listen(PORT, () => {
      console.log(`🚀 叨叨后端服务启动成功`)
      console.log(`📍 服务地址: http://localhost:${PORT}`)
      console.log(`🏥 健康检查: http://localhost:${PORT}/health`)
      console.log(`📝 环境: ${process.env.NODE_ENV || 'development'}`)
      console.log(`🗄️  数据库: ${dbConnected ? '✅ 已连接' : '❌ 连接失败'}`)
    })
  } catch (error) {
    console.error('❌ 服务器启动失败:', error.message)
    process.exit(1)
  }
}

// 启动服务器
startServer()

module.exports = app