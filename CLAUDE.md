# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

叨叨房车租赁平台是基于 uni-app 3.x + Vue 3 + Express.js 的全栈应用，包含C端小程序、B端PC管理、B端移动管理三个前端应用，以及Express.js后端API服务。项目已完成各端文件初始化创建。

## 常用开发命令

### Docker 服务管理
```bash
# 启动数据库服务
docker compose up -d mysql redis

# 检查服务状态
docker compose ps

# 查看日志
docker compose logs mysql redis

# 重启服务
docker compose restart mysql redis

# 停止所有服务
docker compose down
```

### 后端服务 (backend/)
```bash
cd backend

# 安装依赖
npm install

# 开发模式启动
npm run dev

# 生产模式启动
npm start

# 健康检查
curl http://localhost:3000/health
```

### 前端服务

#### PC管理端 (admin-console/) - VS Code开发
```bash
cd admin-console

# 安装依赖
npm install

# 开发模式启动
npm run dev

# 访问地址
http://localhost:8080
```

#### 小程序端 (miniprogram/) - HBuilderX开发
```bash
# 使用HBuilderX导入项目
# 项目路径: miniprogram/
# 运行: 运行到小程序模拟器 → 微信开发者工具

# 或使用命令行
cd miniprogram
npm run dev:mp-weixin
```

#### 移动管理端 (mobile-admin/) - HBuilderX开发
```bash
# 使用HBuilderX导入项目
# 项目路径: mobile-admin/
# 运行: 运行到小程序模拟器 → 微信开发者工具

# 或使用命令行
cd mobile-admin
npm run dev:mp-weixin
```

## 核心架构

### 技术栈配置
- **小程序端**: uni-app 3.x + Vue 3 + uView UI (HBuilderX开发)
- **PC管理端**: uni-app H5版 + Vue 3 + Element Plus (VS Code开发)
- **移动管理端**: uni-app 3.x + Vue 3 (HBuilderX开发)
- **后端**: Express.js 4.x + Node.js 18.x+ + Sequelize ORM
- **数据库**: MySQL 8.0 + Redis 7.0 (Docker部署)
- **开发工具**: HBuilderX + VS Code + Docker

### 项目文件结构
```
daodao01-docs/
├── miniprogram/        # C端小程序 - uni-app项目已初始化
├── admin-console/      # B端PC管理 - Vite+Vue3项目已初始化
├── mobile-admin/       # B端移动管理 - uni-app项目已初始化
├── backend/           # 后端API - Express.js项目已初始化
├── Docs/              # 技术设计文档
├── docker-compose.yml # 数据库服务配置
└── 数据字典/           # 项目数据字典文档
```

### 服务端口分配
- **3000**: 后端API服务
- **3306**: MySQL数据库
- **6379**: Redis缓存
- **8080**: Adminer数据库管理工具
- **5173**: PC管理端开发服务器

### 开发分工与工具
- **VS Code开发**: backend/、admin-console/
- **HBuilderX开发**: miniprogram/、mobile-admin/

## 环境配置

### 数据库连接
```javascript
// MySQL (开发环境)
host: 'localhost'
port: 3306
database: 'daodao'
username: 'daodao_dev'
password: 'daodao_dev_2024'

// Redis
host: 'localhost'
port: 6379
```

### API接口规范
```javascript
// 基础响应格式
{
  "status": "success|error",
  "message": "响应消息",
  "data": {},
  "code": 200
}

// 认证方式
headers: {
  'Authorization': 'Bearer ' + token,
  'Content-Type': 'application/json'
}
```

### 跨域配置
后端已配置CORS，支持域名：
- http://localhost:3000
- http://localhost:8080
- http://localhost:8080

## 默认账户信息
- **管理员账户**: admin / admin123
- **数据库根用户**: root / daodao_root_2024
- **数据库开发用户**: daodao_dev / daodao_dev_2024

## 技术文档参考
- 前端安装指导: `前端项目安装指导.md`
- 数据库配置: `数据库连接说明.md`
- 开发分工说明: `项目开发分工说明.md`