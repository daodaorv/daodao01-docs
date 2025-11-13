# 叨叨后端服务

基于 Express.js 4.x + Node.js 18.x 的后端API服务

## 技术栈

- **运行时**: Node.js 18.x+
- **框架**: Express.js 4.x
- **数据库**: MySQL + Sequelize ORM
- **身份验证**: JWT
- **安全**: Helmet, CORS, Rate Limiting
- **日志**: Morgan
- **测试**: Jest + Supertest

## 快速开始

### 1. 安装依赖
```bash
npm install
```

### 2. 配置环境变量
```bash
cp .env.example .env
# 修改 .env 文件中的配置
```

### 3. 启动服务
```bash
# 开发模式
npm run dev

# 生产模式
npm start
```

### 4. 健康检查
访问 http://localhost:3000/health

## API文档

### 基础接口
- `GET /health` - 健康检查
- `GET /api/test` - API测试接口

## 项目结构

```
backend/
├── app.js              # 应用入口
├── package.json        # 依赖管理
├── .env.example        # 环境变量示例
├── routes/             # 路由定义
├── controllers/        # 控制器
├── models/            # 数据模型
├── middleware/        # 中间件
├── utils/             # 工具函数
├── config/            # 配置文件
├── services/          # 业务服务
└── tests/             # 测试文件
```

## 开发指南

### 代码规范
- 使用 ESLint 进行代码检查
- 遵循 RESTful API 设计原则
- 统一的错误处理机制

### 测试
```bash
# 运行测试
npm test

# 代码检查
npm run lint

# 自动修复
npm run lint:fix
```