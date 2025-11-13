# 叨叨项目技术栈详解

## 前端技术栈

### 统一技术配置
- **Vue版本**: Vue 3 Composition API
- **TypeScript支持**: 部分支持(PC端已配置，移动端规划中)
- **状态管理**: Vuex 4.x / Pinia 2.x
- **路由管理**: Vue Router 4.x
- **HTTP客户端**: Axios
- **构建工具**: Vite (PC端) / uni-app CLI (移动端)

### C端小程序 (miniprogram/)
```json
{
  "框架": "uni-app 3.x",
  "UI库": "uView UI",
  "开发工具": "HBuilderX",
  "平台": "微信小程序 + H5 + App(可选)",
  "特性": [
    "跨端适配能力",
    "微信小程序原生能力",
    "位置服务集成",
    "支付集成"
  ],
  "已配置": [
    "微信小程序appid: wx545d8668053b84a8",
    "位置权限申请",
    "腾讯地图集成"
  ]
}
```

### B端PC管理 (admin-console/)
```json
{
  "框架": "uni-app H5版 + Vue 3",
  "UI库": "Element Plus 2.3.8",
  "开发工具": "VS Code",
  "特性": [
    "响应式设计",
    "丰富的组件库",
    "TypeScript支持",
    "自动导入插件",
    "组件自动注册"
  ],
  "已配置": [
    "Vite构建工具",
    "TypeScript支持",
    "Element Plus Icons",
    "自动导入组件",
    "Sass预处理"
  ]
}
```

### B端移动管理 (mobile-admin/)
```json
{
  "框架": "uni-app 3.x",
  "UI库": "uni-ui",
  "开发工具": "HBuilderX",
  "特性": [
    "移动端优化",
    "触控友好界面",
    "离线功能支持"
  ],
  "状态": "基础框架已初始化"
}
```

## 后端技术栈

### 核心框架配置
```json
{
  "运行时": "Node.js 18.x+",
  "框架": "Express.js 4.18.2",
  "项目结构": "MVC架构",
  "模块系统": "CommonJS"
}
```

### 数据库配置
```json
{
  "主数据库": {
    "类型": "MySQL 8.0",
    "ORM": "Sequelize 6.32.1",
    "驱动": "mysql2 3.6.0",
    "连接配置": {
      "host": "localhost",
      "port": 3306,
      "database": "daodao",
      "username": "daodao_dev",
      "password": "daodao_dev_2024"
    }
  },
  "缓存": {
    "类型": "Redis 7.0",
    "用途": "会话存储、API缓存",
    "连接": "localhost:6379"
  }
}
```

### 中间件和安全
```json
{
  "安全": [
    "helmet: 7.0.0 - 安全头部设置",
    "bcryptjs: 2.4.3 - 密码加密",
    "jsonwebtoken: 9.0.2 - JWT认证",
    "express-rate-limit: 6.8.1 - 请求限流"
  ],
  "工具": [
    "cors: 2.8.5 - 跨域处理",
    "morgan: 1.10.0 - 日志记录",
    "multer: 1.4.5 - 文件上传",
    "compression: 1.7.4 - 响应压缩",
    "express-session: 1.17.3 - 会话管理"
  ],
  "数据验证": [
    "express-validator: 7.0.1 - 请求数据验证"
  ]
}
```

### 开发工具
```json
{
  "开发": [
    "nodemon: 3.0.1 - 开发热重载",
    "eslint: 8.45.0 - 代码检查",
    "eslint-config-standard: 17.1.0 - 代码规范"
  ],
  "测试": [
    "jest: 29.6.2 - 测试框架",
    "supertest: 6.3.3 - API测试"
  ]
}
```

## 开发环境配置

### 系统要求
```bash
Node.js: >= 18.0.0
npm: >= 8.0.0
Docker: latest
HBuilderX: latest (for uni-app development)
VS Code: latest (for backend + admin-console)
```

### 环境变量配置
```javascript
// 后端 .env 配置
NODE_ENV=development
PORT=3000

// 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_NAME=daodao
DB_USER=daodao_dev
DB_PASSWORD=daodao_dev_2024

// Redis配置
REDIS_HOST=localhost
REDIS_PORT=6379

// JWT配置
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRES_IN=7d

// 文件上传配置
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880  // 5MB
```

### 开发服务配置
```json
{
  "后端服务": {
    "地址": "http://localhost:3000",
    "健康检查": "/health",
    "API前缀": "/api",
    "启动命令": "npm run dev"
  },
  "PC管理端": {
    "地址": "http://localhost:8080",
    "启动命令": "npm run dev",
    "构建命令": "npm run build"
  },
  "小程序端": {
    "平台": "微信小程序",
    "开发工具": "HBuilderX",
    "启动方式": "运行到小程序模拟器"
  },
  "移动管理端": {
    "平台": "微信小程序",
    "开发工具": "HBuilderX",
    "启动方式": "运行到小程序模拟器"
  }
}
```

## API设计规范

### RESTful API结构
```javascript
// 基础响应格式
{
  "status": "success|error",
  "message": "响应消息",
  "data": {},
  "code": 200,
  "timestamp": "2024-01-01T00:00:00.000Z"
}

// API端点设计
GET    /api/v1/users          // 获取用户列表
POST   /api/v1/users          // 创建用户
GET    /api/v1/users/:id      // 获取特定用户
PUT    /api/v1/users/:id      // 更新用户
DELETE /api/v1/users/:id      // 删除用户
```

### 认证授权
```javascript
// 请求头格式
headers: {
  'Authorization': 'Bearer ' + token,
  'Content-Type': 'application/json'
}

// CORS配置
allowedOrigins: [
  'http://localhost:3000',
  'http://localhost:8080',
  'http://localhost:5173'
]
```

## 代码规范与约定

### JavaScript规范
- **代码风格**: Standard + ESLint
- **命名规范**: 
  - 变量和函数: camelCase
  - 常量: UPPER_SNAKE_CASE
  - 文件名: kebab-case
  - 组件名: PascalCase

### Vue.js规范
- **组件结构**: Composition API
- **响应式数据**: ref, reactive
- **生命周期**: onMounted, onUnmounted
- **事件处理**: on事件处理器

### Git提交规范
```bash
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式调整
refactor: 重构
test: 测试相关
chore: 构建过程或辅助工具的变动
```

## 测试策略

### 后端测试
```bash
# 单元测试
npm run test

# API测试
npm run test:api

# 覆盖率测试
npm run test:coverage
```

### 前端测试
- **规划中**: Vue Test Utils + Jest
- **E2E测试**: Cypress (规划中)

## 部署配置

### Docker服务
```yaml
# docker-compose.yml 关键配置
services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_DATABASE: daodao
      MYSQL_USER: daodao_dev
      MYSQL_PASSWORD: daodao_dev_2024
  
  redis:
    image: redis:7.0-alpine
    
  adminer:
    image: adminer:latest
    ports: ["8080:8080"]
```

### 构建配置
```json
{
  "后端构建": "npm run build (规划中)",
  "PC端构建": "vite build",
  "小程序构建": "HBuilderX云构建",
  "移动管理构建": "HBuilderX云构建"
}
```

## 性能优化

### 后端优化
- **数据库**: 连接池、查询优化、索引设计
- **缓存**: Redis缓存热点数据
- **压缩**: Gzip响应压缩
- **限流**: API请求频率限制

### 前端优化
- **代码分割**: 路由级别代码分割
- **懒加载**: 组件按需加载
- **资源优化**: 图片压缩、资源合并
- **缓存策略**: 合理的浏览器缓存配置