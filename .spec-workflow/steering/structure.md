# 叨叨房车租赁平台 - 代码组织结构

## 项目根目录结构

```
daodao01-docs/                          # 项目根目录
├── miniprogram/                        # C端小程序 (uni-app项目)
│   ├── src/                           # 源代码目录
│   │   ├── pages/                     # 页面文件
│   │   ├── components/                # 公共组件
│   │   ├── utils/                     # 工具函数
│   │   ├── api/                       # API接口
│   │   ├── store/                     # 状态管理
│   │   ├── static/                    # 静态资源
│   │   └── style/                     # 全局样式
│   ├── pages.json                     # 页面配置
│   ├── manifest.json                  # 应用配置
│   ├── App.vue                        # 应用入口
│   └── main.js                        # 入口文件
├── admin-console/                     # B端PC管理端 (uni-app H5项目)
│   ├── src/                           # 源代码目录
│   │   ├── views/                     # 页面视图
│   │   ├── components/                # 公共组件
│   │   ├── layout/                    # 布局组件
│   │   ├── router/                    # 路由配置
│   │   ├── store/                     # 状态管理
│   │   ├── api/                       # API接口
│   │   ├── utils/                     # 工具函数
│   │   ├── directives/                # 自定义指令
│   │   ├── styles/                    # 样式文件
│   │   └── assets/                    # 静态资源
│   ├── public/                        # 公共资源
│   ├── index.html                     # HTML模板
│   ├── vite.config.js                 # Vite配置
│   └── package.json                   # 依赖配置
├── mobile-admin/                      # B端移动管理端 (uni-app项目)
│   ├── src/                           # 源代码目录
│   │   ├── pages/                     # 页面文件
│   │   ├── components/                # 公共组件
│   │   ├── api/                       # API接口
│   │   ├── utils/                     # 工具函数
│   │   └── store/                     # 状态管理
│   ├── pages.json                     # 页面配置
│   ├── manifest.json                  # 应用配置
│   └── App.vue                        # 应用入口
├── backend/                           # 后端API服务 (Express.js项目)
│   ├── src/                           # 源代码目录
│   │   ├── controllers/               # 控制器层
│   │   ├── services/                  # 业务逻辑层
│   │   ├── models/                    # 数据模型层
│   │   ├── routes/                    # 路由定义
│   │   ├── middleware/                # 中间件
│   │   ├── utils/                     # 工具函数
│   │   ├── config/                    # 配置文件
│   │   ├── validators/                # 数据验证
│   │   └── database/                  # 数据库相关
│   ├── tests/                         # 测试文件
│   ├── docs/                          # API文档
│   ├── logs/                          # 日志文件
│   ├── uploads/                       # 上传文件
│   ├── app.js                         # 应用入口
│   └── package.json                   # 依赖配置
├── Docs/                              # 项目文档
│   ├── 需求文档/                      # 需求分析文档
│   ├── 设计文档/                      # 技术设计文档
│   ├── 测试文档/                      # 测试相关文档
│   └── 部署文档/                      # 部署运维文档
├── 数据字典/                          # 数据字典文档
├── docker/                            # Docker相关配置
│   ├── mysql/                         # MySQL配置
│   └── redis/                         # Redis配置
├── .spec-workflow/                    # Spec Workflow工作流
├── CLAUDE.md                          # Claude Code项目指导
├── README.md                          # 项目说明文档
├── docker-compose.yml                 # Docker编排文件
└── .gitignore                         # Git忽略文件
```

## 前端项目结构详解

### C端小程序 (miniprogram/)

#### 页面组织 (src/pages/)
```
src/pages/
├── index/                             # 首页
│   ├── index.vue                      # 首页主文件
│   └── index.json                     # 页面配置
├── vehicle/                           # 车辆相关
│   ├── list/                          # 车辆列表页
│   ├── detail/                        # 车辆详情页
│   └── search/                        # 车辆搜索页
├── order/                             # 订单相关
│   ├── create/                        # 创建订单
│   ├── list/                          # 订单列表
│   ├── detail/                        # 订单详情
│   └── payment/                       # 支付页面
├── user/                              # 用户相关
│   ├── profile/                       # 个人资料
│   ├── orders/                        # 用户订单
│   ├── favorites/                     # 收藏夹
│   └── settings/                      # 设置页面
└── common/                            # 公共页面
    ├── login/                         # 登录页面
    ├── register/                      # 注册页面
    └── help/                          # 帮助中心
```

#### 组件组织 (src/components/)
```
src/components/
├── common/                            # 通用组件
│   ├── daodao-header/                 # 页面头部
│   ├── daodao-footer/                 # 页面底部
│   ├── daodao-loading/                # 加载组件
│   └── daodao-empty/                  # 空状态组件
├── vehicle/                           # 车辆相关组件
│   ├── vehicle-card/                  # 车辆卡片
│   ├── vehicle-gallery/               # 车辆图片轮播
│   └── vehicle-filter/                # 车辆筛选器
├── order/                             # 订单相关组件
│   ├── order-item/                    # 订单项
│   ├── order-status/                  # 订单状态
│   └── payment-method/                # 支付方式
└── user/                              # 用户相关组件
    ├── user-avatar/                   # 用户头像
    └── user-info/                     # 用户信息
```

#### API接口组织 (src/api/)
```
src/api/
├── index.js                           # API统一出口
├── config.js                          # API配置文件
├── request.js                         # 网络请求封装
├── vehicle.js                         # 车辆相关接口
├── order.js                           # 订单相关接口
├── user.js                            # 用户相关接口
├── payment.js                         # 支付相关接口
└── upload.js                          # 文件上传接口
```

### B端PC管理端 (admin-console/)

#### 视图组织 (src/views/)
```
src/views/
├── dashboard/                         # 仪表盘
│   └── Dashboard.vue                  # 主控制台
├── vehicle/                           # 车辆管理
│   ├── VehicleList.vue                # 车辆列表
│   ├── VehicleDetail.vue              # 车辆详情
│   ├── VehicleCreate.vue              # 创建车辆
│   └── VehicleEdit.vue                # 编辑车辆
├── order/                             # 订单管理
│   ├── OrderList.vue                  # 订单列表
│   ├── OrderDetail.vue                # 订单详情
│   └── OrderStatistics.vue            # 订单统计
├── user/                              # 用户管理
│   ├── UserList.vue                   # 用户列表
│   ├── UserDetail.vue                 # 用户详情
│   └── UserApproval.vue               # 用户审核
├── finance/                           # 财务管理
│   ├── IncomeStatistics.vue           # 收入统计
│   ├── Settlement.vue                 # 结算管理
│   └── Refund.vue                     # 退款管理
├── system/                            # 系统管理
│   ├── AdminList.vue                  # 管理员列表
│   ├── RolePermission.vue             # 角色权限
│   └── SystemConfig.vue               # 系统配置
└── common/                            # 公共页面
    ├── Login.vue                      # 登录页面
    ├── NotFound.vue                   # 404页面
    └── Layout.vue                     # 布局组件
```

#### 组件组织 (src/components/)
```
src/components/
├── layout/                            # 布局组件
│   ├── AppHeader.vue                  # 顶部导航
│   ├── AppSidebar.vue                 # 侧边栏
│   ├── AppBreadcrumb.vue              # 面包屑
│   └── AppFooter.vue                  # 页脚
├── business/                          # 业务组件
│   ├── VehicleCard.vue                # 车辆卡片
│   ├── OrderTable.vue                 # 订单表格
│   ├── UserCard.vue                   # 用户卡片
│   └── StatisticsChart.vue            # 统计图表
├── form/                              # 表单组件
│   ├── VehicleForm.vue                # 车辆表单
│   ├── UserForm.vue                   # 用户表单
│   └── SearchForm.vue                 # 搜索表单
└── common/                            # 通用组件
    ├── DataTable.vue                  # 数据表格
    ├── Pagination.vue                 # 分页组件
    ├── ImageUpload.vue                # 图片上传
    └── RichEditor.vue                 # 富文本编辑器
```

### B端移动管理端 (mobile-admin/)

移动管理端结构基本与C端小程序类似，但功能更加简化，主要包括：
- 车辆快速管理
- 订单状态更新
- 消息通知处理
- 基础数据查看

## 后端项目结构详解

### 控制器层 (src/controllers/)
```
src/controllers/
├── index.js                           # 控制器统一出口
├── VehicleController.js               # 车辆控制器
├── OrderController.js                 # 订单控制器
├── UserController.js                  # 用户控制器
├── PaymentController.js               # 支付控制器
├── UploadController.js                # 上传控制器
├── AdminController.js                 # 管理员控制器
├── StatisticsController.js            # 统计控制器
└── SystemController.js                # 系统控制器
```

### 业务逻辑层 (src/services/)
```
src/services/
├── index.js                           # 服务统一出口
├── VehicleService.js                  # 车辆业务逻辑
├── OrderService.js                    # 订单业务逻辑
├── UserService.js                     # 用户业务逻辑
├── PaymentService.js                  # 支付业务逻辑
├── MessageService.js                  # 消息服务
├── EmailService.js                    # 邮件服务
├── SMSService.js                      # 短信服务
├── FileService.js                     # 文件处理服务
└── AuthService.js                     # 认证服务
```

### 数据模型层 (src/models/)
```
src/models/
├── index.js                           # 模型统一出口
├── User.js                            # 用户模型
├── Vehicle.js                         # 车辆模型
├── Order.js                           # 订单模型
├── Payment.js                         # 支付模型
├── VehicleImage.js                    # 车辆图片模型
├── VehicleSpec.js                     # 车辆规格模型
├── Review.js                          # 评价模型
├── AdminUser.js                       # 管理员模型
└── SystemLog.js                       # 系统日志模型
```

### 路由定义 (src/routes/)
```
src/routes/
├── index.js                           # 路由总入口
├── api/                               # API路由
│   ├── v1/                            # API版本1
│   │   ├── auth.js                    # 认证路由
│   │   ├── vehicles.js                # 车辆路由
│   │   ├── orders.js                  # 订单路由
│   │   ├── users.js                   # 用户路由
│   │   ├── payments.js                # 支付路由
│   │   ├── upload.js                  # 上传路由
│   │   └── admin.js                   # 管理员路由
│   └── index.js                       # API路由入口
└── web/                               # Web页面路由 (可选)
    └── index.js
```

### 中间件 (src/middleware/)
```
src/middleware/
├── index.js                           # 中间件统一出口
├── auth.js                            # 身份认证中间件
├── validation.js                      # 数据验证中间件
├── rateLimit.js                       # 限流中间件
├── logger.js                          # 日志中间件
├── error.js                           # 错误处理中间件
├── cors.js                            # 跨域中间件
└── upload.js                          # 文件上传中间件
```

### 工具函数 (src/utils/)
```
src/utils/
├── index.js                           # 工具统一出口
├── logger.js                          # 日志工具
├── response.js                        # 响应格式化工具
├── pagination.js                      # 分页工具
├── date.js                            # 日期工具
├── file.js                            # 文件处理工具
├── crypto.js                          # 加密工具
├── validator.js                       # 验证工具
└── constants.js                       # 常量定义
```

### 配置文件 (src/config/)
```
src/config/
├── index.js                           # 配置统一出口
├── database.js                        # 数据库配置
├── redis.js                           # Redis配置
├── jwt.js                             # JWT配置
├── upload.js                          # 上传配置
├── payment.js                         # 支付配置
├── sms.js                             # 短信配置
└── app.js                             # 应用配置
```

### 数据验证 (src/validators/)
```
src/validators/
├── index.js                           # 验证器统一出口
├── user.js                            # 用户数据验证
├── vehicle.js                         # 车辆数据验证
├── order.js                           # 订单数据验证
└── common.js                          # 通用验证规则
```

## 命名规范

### 文件和目录命名
- **组件文件**: PascalCase (如: VehicleCard.vue)
- **工具文件**: camelCase (如: dateUtil.js)
- **配置文件**: camelCase (如: database.js)
- **页面目录**: kebab-case (如: vehicle-list/)
- **API文件**: camelCase (如: vehicleAPI.js)

### 变量和函数命名
- **变量**: camelCase (如: userName, vehicleList)
- **函数**: camelCase (如: getUserInfo, createOrder)
- **常量**: UPPER_SNAKE_CASE (如: API_BASE_URL, MAX_FILE_SIZE)
- **类名**: PascalCase (如: UserService, VehicleController)

### 数据库命名
- **表名**: snake_case (如: user_profiles, vehicle_images)
- **字段名**: snake_case (如: created_at, user_id)
- **索引名**: idx_table_column (如: idx_users_email)

## 模块依赖原则

### 分层依赖
- **表现层** → **应用层** → **业务层** → **数据层**
- 下层可以依赖上层，上层不能依赖下层
- 同层之间通过接口或事件通信

### 模块间通信
- **前端**: 使用事件总线或状态管理
- **后端**: 使用服务注入或依赖注入
- **跨模块**: 通过定义好的接口协议

## 代码复用策略

### 前端复用
- **组件库**: 建立统一的组件库
- **工具函数**: 抽取通用工具函数
- **状态管理**: 共享状态模块
- **样式系统**: 统一的设计系统

### 后端复用
- **基础服务**: 抽取通用基础服务
- **中间件**: 可复用的中间件
- **工具类**: 通用工具类库
- **数据模型**: 可扩展的数据模型

## 版本控制策略

### 分支管理
- **master**: 生产环境代码
- **develop**: 开发环境代码
- **feature/***: 功能开发分支
- **hotfix/***: 紧急修复分支

### 提交规范
- **feat**: 新功能
- **fix**: 修复bug
- **docs**: 文档更新
- **style**: 代码格式调整
- **refactor**: 代码重构
- **test**: 测试相关
- **chore**: 构建或工具相关

## 部署结构

### 目录权限
- **源代码**: 只读权限，版本控制
- **上传文件**: 读写权限，定期备份
- **日志文件**: 写入权限，定期清理
- **配置文件**: 敏感信息，权限控制

### 环境隔离
- **开发环境**: 本地开发调试
- **测试环境**: 功能测试验证
- **预生产环境**: 生产前验证
- **生产环境**: 正式运行环境