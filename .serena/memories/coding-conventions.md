# 叨叨项目代码规范与最佳实践

## JavaScript/TypeScript规范

### 代码风格
- **规范标准**: Standard + ESLint
- **缩进**: 2个空格
- **字符串**: 优先使用单引号
- **分号**: 必须使用分号
- **尾随逗号**: 多行时使用尾随逗号

### 命名约定
```javascript
// ✅ 正确命名
const userName = 'john_doe'           // camelCase for variables
const getUserInfo = () => {}          // camelCase for functions
const MAX_FILE_SIZE = 5242880         // UPPER_SNAKE_CASE for constants
const API_BASE_URL = 'http://...'    // UPPER_SNAKE_CASE for constants

class UserService {}                  // PascalCase for classes
class OrderManager {}

// 文件命名
user-service.js                      // kebab-case for files
order-manager.js
api-config.js

// ❌ 错误命名
const user_name = 'john'             // 不使用snake_case
const getUserinfo = () => {}         // 避免缩写
const userservice = {}               // 避免连写
```

### 函数和变量声明
```javascript
// ✅ 推荐
const getUserById = async (userId) => {
  try {
    const user = await User.findById(userId)
    return user
  } catch (error) {
    logger.error('获取用户失败:', error)
    throw new Error('用户不存在')
  }
}

// ✅ 使用默认参数
const createUser = (userData = {}) => {
  return {
    id: generateId(),
    createdAt: new Date(),
    ...userData
  }
}

// ❌ 避免var，避免未声明变量
var userName = 'john'                 // 使用const或let
globalVar = 'value'                   // 避免全局变量
```

### 异步处理
```javascript
// ✅ 优先使用async/await
const fetchUsers = async () => {
  try {
    const response = await axios.get('/api/users')
    return response.data
  } catch (error) {
    console.error('获取用户列表失败:', error)
    throw error
  }
}

// ✅ 并行处理多个异步操作
const fetchUserData = async (userId) => {
  const [user, orders, reviews] = await Promise.all([
    fetchUser(userId),
    fetchUserOrders(userId),
    fetchUserReviews(userId)
  ])
  
  return { user, orders, reviews }
}

// ❌ 避免回调地狱
getUser((user) => {
  getOrders(user.id, (orders) => {
    getReviews(orders.id, (reviews) => {
      // 嵌套过深
    })
  })
})
```

## Vue.js规范 (Vue 3 Composition API)

### 组件结构
```vue
<template>
  <!-- 模板内容 -->
</template>

<script setup>
// 导入
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

// Props定义
const props = defineProps({
  userId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    default: '默认标题'
  }
})

// Emits定义
const emit = defineEmits(['update', 'delete', 'refresh'])

// 响应式数据
const loading = ref(false)
const formData = reactive({
  name: '',
  email: '',
  phone: ''
})

// 计算属性
const fullName = computed(() => {
  return `${formData.name} ${formData.lastName}`
})

// 方法
const handleSubmit = async () => {
  loading.value = true
  try {
    await submitForm(formData)
    ElMessage.success('提交成功')
    emit('refresh')
  } catch (error) {
    ElMessage.error('提交失败')
  } finally {
    loading.value = false
  }
}

// 生命周期
onMounted(() => {
  loadInitialData()
})
</script>

<style scoped>
/* 组件样式 */
</style>
```

### 组件命名规范
```javascript
// ✅ 组件文件命名 (PascalCase)
UserList.vue
OrderForm.vue
UserProfile.vue

// ✅ 组件注册 (使用PascalCase)
import UserList from '@/components/UserList.vue'

// ✅ 模板中使用 (kebab-case)
<template>
  <user-list :users="users" />
  <order-form @submit="handleSubmit" />
</template>
```

### 状态管理最佳实践
```javascript
// ✅ 使用Pinia进行状态管理
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  // state
  const users = ref([])
  const currentUser = ref(null)
  const loading = ref(false)
  
  // getters
  const activeUsers = computed(() => 
    users.value.filter(user => user.status === 'active')
  )
  
  // actions
  const fetchUsers = async () => {
    loading.value = true
    try {
      const response = await userApi.getUsers()
      users.value = response.data
    } catch (error) {
      console.error('获取用户失败:', error)
    } finally {
      loading.value = false
    }
  }
  
  const createUser = async (userData) => {
    try {
      const response = await userApi.createUser(userData)
      users.value.push(response.data)
      return response.data
    } catch (error) {
      console.error('创建用户失败:', error)
      throw error
    }
  }
  
  return {
    // state
    users,
    currentUser,
    loading,
    // getters
    activeUsers,
    // actions
    fetchUsers,
    createUser
  }
})
```

## 后端API开发规范

### 控制器结构
```javascript
// controllers/userController.js
const userService = require('../services/userService')
const { validationResult } = require('express-validator')
const logger = require('../utils/logger')

class UserController {
  // 获取用户列表
  async getUsers(req, res) {
    try {
      const { page = 1, limit = 10, search } = req.query
      
      // 参数验证
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          status: 'error',
          message: '参数验证失败',
          errors: errors.array(),
          code: 400
        })
      }
      
      const result = await userService.getUsers({
        page: parseInt(page),
        limit: parseInt(limit),
        search
      })
      
      res.json({
        status: 'success',
        message: '获取用户列表成功',
        data: result,
        code: 200
      })
    } catch (error) {
      logger.error('获取用户列表失败:', error)
      res.status(500).json({
        status: 'error',
        message: '服务器内部错误',
        code: 500
      })
    }
  }
  
  // 创建用户
  async createUser(req, res) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          status: 'error',
          message: '参数验证失败',
          errors: errors.array(),
          code: 400
        })
      }
      
      const userData = req.body
      const user = await userService.createUser(userData)
      
      res.status(201).json({
        status: 'success',
        message: '用户创建成功',
        data: user,
        code: 201
      })
    } catch (error) {
      logger.error('创建用户失败:', error)
      
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({
          status: 'error',
          message: '用户已存在',
          code: 409
        })
      }
      
      res.status(500).json({
        status: 'error',
        message: '服务器内部错误',
        code: 500
      })
    }
  }
}

module.exports = new UserController()
```

### 服务层结构
```javascript
// services/userService.js
const { User, UserDetail } = require('../models')
const { Op } = require('sequelize')
const logger = require('../utils/logger')

class UserService {
  // 获取用户列表
  async getUsers({ page, limit, search }) {
    const offset = (page - 1) * limit
    const where = {}
    
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { phone: { [Op.like]: `%${search}%` } }
      ]
    }
    
    const { count, rows } = await User.findAndCountAll({
      where,
      include: [
        {
          model: UserDetail,
          as: 'details'
        }
      ],
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    })
    
    return {
      users: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      }
    }
  }
  
  // 创建用户
  async createUser(userData) {
    try {
      const user = await User.create({
        ...userData,
        status: 'active'
      })
      
      // 创建用户详细信息
      await UserDetail.create({
        userId: user.id,
        preferences: {},
        settings: {}
      })
      
      return user
    } catch (error) {
      logger.error('创建用户服务错误:', error)
      throw error
    }
  }
  
  // 获取用户详细信息
  async getUserById(userId) {
    const user = await User.findByPk(userId, {
      include: [
        {
          model: UserDetail,
          as: 'details'
        }
      ]
    })
    
    if (!user) {
      throw new Error('用户不存在')
    }
    
    return user
  }
}

module.exports = new UserService()
```

### 路由定义
```javascript
// routes/users.js
const express = require('express')
const { body, query, param } = require('express-validator')
const authMiddleware = require('../middleware/auth')
const userController = require('../controllers/userController')

const router = express.Router()

// 输入验证规则
const createUserValidation = [
  body('name')
    .notEmpty()
    .withMessage('姓名不能为空')
    .isLength({ max: 50 })
    .withMessage('姓名长度不能超过50个字符'),
  body('email')
    .isEmail()
    .withMessage('邮箱格式不正确')
    .normalizeEmail(),
  body('phone')
    .matches(/^1[3-9]\d{9}$/)
    .withMessage('手机号格式不正确')
]

const getUserValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('页码必须是正整数'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('每页数量必须在1-100之间'),
  query('search')
    .optional()
    .isLength({ max: 100 })
    .withMessage('搜索关键词长度不能超过100')
]

// 路由定义
router.get('/', 
  authMiddleware, 
  getUserValidation, 
  userController.getUsers
)

router.post('/', 
  authMiddleware, 
  createUserValidation, 
  userController.createUser
)

router.get('/:id', 
  authMiddleware, 
  [param('id').isUUID().withMessage('用户ID格式不正确')], 
  userController.getUserById
)

module.exports = router
```

## 数据库设计规范

### 模型定义
```javascript
// models/User.js
const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: { msg: '姓名不能为空' },
        len: { args: [2, 50], msg: '姓名长度必须在2-50个字符之间' }
      }
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: { msg: '邮箱格式不正确' }
      }
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      validate: {
        is: { args: /^1[3-9]\d{9}$/, msg: '手机号格式不正确' }
      }
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'banned'),
      defaultValue: 'active',
      allowNull: false
    },
    lastLoginAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'users',
    timestamps: true,
    paranoid: true, // 软删除
    indexes: [
      {
        fields: ['email']
      },
      {
        fields: ['phone']
      },
      {
        fields: ['status']
      }
    ]
  })
  
  User.associate = (models) => {
    User.hasOne(models.UserDetail, {
      foreignKey: 'userId',
      as: 'details'
    })
    User.hasMany(models.Order, {
      foreignKey: 'userId',
      as: 'orders'
    })
  }
  
  return User
}
```

## 错误处理规范

### 统一错误处理中间件
```javascript
// middleware/errorHandler.js
const logger = require('../utils/logger')

const errorHandler = (err, req, res, next) => {
  let error = { ...err }
  error.message = err.message
  
  // 记录错误日志
  logger.error(err)
  
  // Mongoose错误处理
  if (err.name === 'CastError') {
    const message = '资源未找到'
    error = { message, statusCode: 404 }
  }
  
  // Sequelize错误处理
  if (err.name === 'SequelizeValidationError') {
    const message = err.errors.map(e => e.message).join(', ')
    error = { message, statusCode: 400 }
  }
  
  if (err.name === 'SequelizeUniqueConstraintError') {
    const message = '数据已存在'
    error = { message, statusCode: 409 }
  }
  
  // JWT错误处理
  if (err.name === 'JsonWebTokenError') {
    const message = '无效的访问令牌'
    error = { message, statusCode: 401 }
  }
  
  if (err.name === 'TokenExpiredError') {
    const message = '访问令牌已过期'
    error = { message, statusCode: 401 }
  }
  
  res.status(error.statusCode || 500).json({
    status: 'error',
    message: error.message || '服务器内部错误',
    code: error.statusCode || 500,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
}

module.exports = errorHandler
```

## Git提交规范

### Commit Message格式
```bash
# 基本格式
<type>(<scope>): <description>

# 示例
feat(user): 添加用户注册功能
fix(order): 修复订单创建时的数据验证问题
docs(api): 更新API文档
style(frontend): 格式化用户界面代码
refactor(auth): 重构认证中间件
test(user): 添加用户服务单元测试
chore(deps): 更新依赖包版本
```

### 类型说明
- **feat**: 新功能
- **fix**: 修复bug
- **docs**: 文档更新
- **style**: 代码格式调整（不影响功能）
- **refactor**: 重构代码（既不是新增功能，也不是修复bug）
- **test**: 测试相关
- **chore**: 构建过程或辅助工具的变动

## 项目文件组织规范

### 后端目录结构
```
backend/
├── config/           # 配置文件
├── controllers/      # 控制器层
├── services/         # 业务逻辑层
├── models/           # 数据模型
├── routes/           # 路由定义
├── middleware/       # 中间件
├── utils/            # 工具函数
├── validators/       # 数据验证规则
├── tests/            # 测试文件
└── docs/             # API文档
```

### 前端目录结构
```
src/
├── components/       # 可复用组件
├── views/           # 页面组件
├── store/           # 状态管理
├── router/          # 路由配置
├── api/             # API接口
├── utils/           # 工具函数
├── assets/          # 静态资源
├── styles/          # 全局样式
└── mixins/          # 混入
```

## 性能优化最佳实践

### 前端优化
```javascript
// ✅ 组件懒加载
const UserList = defineAsyncComponent(() => import('./UserList.vue'))

// ✅ 路由懒加载
const routes = [
  {
    path: '/users',
    component: () => import('../views/Users.vue')
  }
]

// ✅ 使用computed缓存计算结果
const filteredUsers = computed(() => {
  return users.value.filter(user => 
    user.name.toLowerCase().includes(searchTerm.value.toLowerCase())
  )
})

// ✅ 使用防抖
import { debounce } from 'lodash-es'

const handleSearch = debounce((keyword) => {
  searchUsers(keyword)
}, 300)
```

### 后端优化
```javascript
// ✅ 数据库查询优化
const users = await User.findAll({
  attributes: ['id', 'name', 'email'], // 只查询需要的字段
  include: [
    {
      model: Order,
      as: 'orders',
      attributes: ['id', 'total'], // 避免查询过多字段
      required: false // 使用LEFT JOIN
    }
  ],
  limit: 10,
  offset: (page - 1) * 10
})

// ✅ 缓存策略
const getUserById = async (userId) => {
  const cacheKey = `user:${userId}`
  
  // 尝试从缓存获取
  let user = await redis.get(cacheKey)
  if (user) {
    return JSON.parse(user)
  }
  
  // 从数据库获取
  user = await User.findByPk(userId)
  if (user) {
    // 存入缓存，设置过期时间
    await redis.setex(cacheKey, 3600, JSON.stringify(user))
  }
  
  return user
}
```