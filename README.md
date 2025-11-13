# 叨叨项目

基于 uni-app 3.x + Vue 3 + Express.js 的全栈应用

## 项目结构

```
daodao01-docs/
├── miniprogram/        # C端小程序 (uni-app 3.x + Vue 3)
├── admin-console/      # B端PC管理 (uni-app H5版 + Element Plus)
├── mobile-admin/       # B端移动管理 (uni-app 3.x + Vue 3)
├── backend/           # 后端API (Express.js 4.x + Node.js)
├── Docs/              # 项目文档
└── README.md          # 项目说明
```

## 技术栈

### 前端技术栈
- **框架**: uni-app 3.x
- **UI库**: uni-ui, Element Plus (PC端)
- **Vue版本**: Vue 3 Composition API
- **开发工具**: HBuilderX
- **编程语言**: JavaScript

### 后端技术栈
- **运行时**: Node.js 18.x+
- **框架**: Express.js 4.x
- **数据库**: MySQL + Sequelize ORM
- **身份验证**: JWT
- **编程语言**: JavaScript

## 快速开始

### 环境要求
- Node.js >= 18.0.0
- npm >= 8.0.0
- HBuilderX (用于uni-app开发)

### 1. 安装依赖

#### 后端依赖
```bash
cd backend
npm install
```

#### 前端依赖 (需要使用HBuilderX或uni-app CLI)
```bash
# 小程序端
cd miniprogram
npm install

# PC管理端
cd ../admin-console
npm install

# 移动管理端
cd ../mobile-admin
npm install
```

### 2. 启动服务

#### 后端服务
```bash
cd backend
cp .env.example .env
# 配置数据库连接等信息
npm run dev  # 开发模式
# 或
npm start    # 生产模式
```

#### 前端服务
使用 HBuilderX 打开对应项目并运行，或使用以下命令：

```bash
# 小程序端 - 微信小程序
cd miniprogram
npm run dev:mp-weixin

# PC管理端 - H5
cd admin-console
npm run dev

# 移动管理端 - 微信小程序
cd mobile-admin
npm run dev:mp-weixin
```

## 开发指南

### 代码规范
- 使用 ESLint 进行代码检查
- 遵循 Vue 3 Composition API 最佳实践
- 统一的项目结构和命名规范

### 提交规范
- feat: 新功能
- fix: 修复bug
- docs: 文档更新
- style: 代码格式调整
- refactor: 重构
- test: 测试相关
- chore: 构建过程或辅助工具的变动

## 部署

### 后端部署
1. 配置生产环境变量
2. 构建应用: `npm run build` (如果有)
3. 启动服务: `npm start`

### 前端部署
1. 构建各端应用
2. 部署到对应平台(微信小程序、Web服务器等)

## 联系方式

项目开发完成后可以添加联系方式信息