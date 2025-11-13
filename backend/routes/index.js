const express = require('express')
const router = express.Router()

// 示例路由
router.get('/test', (req, res) => {
  res.json({
    status: 'success',
    message: '叨叨API接口正常工作',
    timestamp: new Date().toISOString()
  })
})

// 用户相关路由
// router.use('/users', require('./users'))

// 业务相关路由
// router.use('/business', require('./business'))

module.exports = router