# API设计规范

**文档版本**: v1.0 | **创建时间**: 2025-11-12 | **维护者**: 叨叨房车技术团队

## 📋 文档说明

本文档定义叨叨房车项目API接口的详细设计规范，包括URL设计、请求格式、响应格式、错误处理等，确保前后端开发的一致性和可维护性。

**关联文档**：
- [技术栈与架构设计.md](./技术栈与架构设计.md) - 技术架构和基础规范
- [数据库设计.md](./数据库设计.md) - 数据库表结构设计
- [数据字典.md](./数据字典.md) - 字段定义和枚举值

---

## 📋 目录

1. [API设计原则](#1-api设计原则)
2. [URL设计规范](#2-url设计规范)
3. [HTTP方法规范](#3-http方法规范)
4. [请求格式规范](#4-请求格式规范)
5. [响应格式规范](#5-响应格式规范)
6. [错误处理规范](#6-错误处理规范)
7. [认证授权规范](#7-认证授权规范)
8. [接口文档规范](#8-接口文档规范)
9. [API接口列表](#9-api接口列表)

---

## 1. API设计原则

### 1.1 RESTful设计
- 使用标准的HTTP方法（GET, POST, PUT, DELETE）
- 资源导向的URL设计
- 无状态的服务器设计
- 统一的接口设计

### 1.2 一致性原则
- 统一的命名规范
- 统一的响应格式
- 统一的错误处理
- 统一的版本管理

### 1.3 安全性原则
- HTTPS强制使用
- 输入数据验证
- 认证授权机制
- 敏感数据保护

### 1.4 可扩展性原则
- 版本化API设计
- 向后兼容保证
- 模块化接口设计
- 灵活的查询参数

---

## 2. URL设计规范

### 2.1 基础格式
```
https://api.daodaorv.com/api/v1/{module}/{resource}[/id][/action]
```

### 2.2 命名规范
- **小写字母**: 使用小写字母
- **连字符分隔**: 使用连字符(-)分隔单��
- **复数形式**: 资源名使用复数形式
- **避免层级**: URL层级不超过3层

### 2.3 模块划分
```javascript
// 用户模块
/api/v1/users
/api/v1/user-profiles
/api/v1/user-roles

// 车辆模块
/api/v1/vehicles
/api/v1/vehicle-brands
/api/v1/vehicle-models

// 订单模块
/api/v1/orders
/api/v1/order-status-logs

// 支付模块
/api/v1/payments
/api/v1/payment-methods

// 门店模块
/api/v1/stores
/api/v1/store-users

// 营销模块
/api/v1/coupons
/api/v1/user-coupons

// 系统模块
/api/v1/system/configs
/api/v1/system/logs
```

### 2.4 URL示例
```javascript
// 基础CRUD
GET    /api/v1/vehicles              // 获取车辆列表
POST   /api/v1/vehicles              // 创建车辆
GET    /api/v1/vehicles/{id}         // 获取单个车辆
PUT    /api/v1/vehicles/{id}         // 更新车辆
DELETE /api/v1/vehicles/{id}         // 删除车辆

// 嵌套资源
GET    /api/v1/users/{userId}/orders // 获取用户订单列表
POST   /api/v1/orders/{orderId}/payments // 创建订单支付

// 特定动作
POST   /api/v1/orders/{id}/confirm  // 确认订单
POST   /api/v1/orders/{id}/cancel   // 取消订单
POST   /api/v1/users/{id}/activate  // 激活用户
```

---

## 3. HTTP方法规范

### 3.1 方法使用规则
| 方法 | 用途 | 幂等性 | 安全性 |
|------|------|--------|--------|
| GET | 查询资源 | ✅ 幂等 | ✅ 安全 |
| POST | 创建资源 | ❌ 非幂等 | ❌ 不安全 |
| PUT | 更新资源（完整） | ✅ 幂等 | ❌ 不安全 |
| PATCH | 更新资源（部分） | ❌ 非幂等 | ❌ 不安全 |
| DELETE | 删除资源 | ✅ 幂等 | ❌ 不安全 |

### 3.2 使用示例
```javascript
// GET - 查询操作
GET /api/v1/vehicles?page=1&pageSize=20&status=available

// POST - 创建操作
POST /api/v1/orders
{
  "vehicleId": 123,
  "startDate": "2025-12-01",
  "endDate": "2025-12-03"
}

// PUT - 完整更新
PUT /api/v1/users/123
{
  "username": "newusername",
  "email": "newemail@example.com",
  "phone": "13800138000"
}

// PATCH - 部分更新
PATCH /api/v1/vehicles/123
{
  "status": "maintenance",
  "remark": "定期保养"
}

// DELETE - 删除操作
DELETE /api/v1/coupons/123
```

---

## 4. 请求格式规范

### 4.1 请求头设置
```javascript
// 必需的请求头
Content-Type: application/json
Authorization: Bearer {token}
X-Request-ID: {unique_request_id}
X-Client-Version: {client_version}

// 可选的请求头
X-Platform: miniapp|mobile-admin|pc-admin
X-Device-ID: {device_identifier}
Accept: application/json
```

### 4.2 查询参数规范
```javascript
// 分页参数
page: 1                    // 页码，从1开始
pageSize: 20              // 每页大小，默认20，最大100

// 排序参数
sort: createdAt,desc      // 排序字段和方向
sort: price,asc

// 筛选参数
status: available|rented  // 状态筛选
store_id: 123             // 门店ID筛选
price_min: 100            // 最低价格
price_max: 500            // 最高价格

// 搜索参数
search: keyword           // 关键词搜索
fields: id,name,status    // 返回字段

// 日期范围
created_at[gte]: 2025-11-01
created_at[lte]: 2025-11-30
```

### 4.3 请求体格式
```javascript
// 创建资源请求
POST /api/v1/orders
{
  "vehicleId": 123,
  "storeId": 456,
  "startDate": "2025-12-01",
  "endDate": "2025-12-03",
  "startTime": "09:00:00",
  "endTime": "18:00:00",
  "remark": "需要儿童座椅"
}

// 批量操作请求
POST /api/v1/vehicles/batch-update
{
  "vehicleIds": [1, 2, 3],
  "updates": {
    "status": "maintenance"
  }
}

// 文件上传请求
POST /api/v1/upload
Content-Type: multipart/form-data
{
  "file": [binary_data],
  "type": "vehicle_image",
  "vehicleId": 123
}
```

---

## 5. 响应格式规范

### 5.1 标准响应结构
```javascript
{
  "code": 0,                    // 状态码
  "message": "success",        // 状态消息
  "data": {},                  // 响应数据
  "pagination": {},            // 分页信息（列表接口）
  "meta": {                    // 元数据
    "requestId": "req_1736728800000_001",
    "timestamp": "2025-11-12T10:00:00+08:00",
    "version": "v1.0"
  }
}
```

### 5.2 成功响应示例
```javascript
// 单个资源响应
{
  "code": 0,
  "message": "success",
  "data": {
    "id": 123,
    "licensePlate": "京A12345",
    "brand": "长城房车",
    "model": "V71",
    "dailyRate": 500.00,
    "status": "available",
    "createdAt": "2025-11-12T10:00:00+08:00"
  },
  "meta": {
    "requestId": "req_1736728800000_001",
    "timestamp": "2025-11-12T10:00:00+08:00"
  }
}

// 列表响应
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "id": 1,
      "licensePlate": "京A12345",
      "brand": "长城房车",
      "model": "V71"
    },
    {
      "id": 2,
      "licensePlate": "京B67890",
      "brand": "上汽大通",
      "model": "RG10"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 150,
    "pages": 8,
    "hasNext": true,
    "hasPrev": false
  },
  "meta": {
    "requestId": "req_1736728800000_002",
    "timestamp": "2025-11-12T10:00:00+08:00"
  }
}
```

### 5.3 错误响应示例
```javascript
// 业务错误
{
  "code": 300000,
  "message": "ORDER_NOT_FOUND",
  "details": "订单不存在或已取消",
  "meta": {
    "requestId": "req_1736728800000_003",
    "timestamp": "2025-11-12T10:00:00+08:00"
  }
}

// 验证错误
{
  "code": 100001,
  "message": "VALIDATION_ERROR",
  "details": "请求参数验证失败",
  "errors": [
    {
      "field": "email",
      "message": "邮箱格式不正确",
      "code": "INVALID_EMAIL"
    },
    {
      "field": "phone",
      "message": "手机号不能为空",
      "code": "REQUIRED_FIELD"
    }
  ],
  "meta": {
    "requestId": "req_1736728800000_004",
    "timestamp": "2025-11-12T10:00:00+08:00"
  }
}
```

---

## 6. 错误处理规范

### 6.1 HTTP状态码使用
| 状态码 | 含义 | 使用场景 |
|--------|------|----------|
| 200 | OK | 请求成功 |
| 201 | Created | 资源创建成功 |
| 204 | No Content | 删除成功，无返回内容 |
| 400 | Bad Request | 请求参数错误 |
| 401 | Unauthorized | 未授权/Token无效 |
| 403 | Forbidden | 权限不足 |
| 404 | Not Found | 资源不存在 |
| 409 | Conflict | 资源冲突 |
| 422 | Unprocessable Entity | 参数验证失败 |
| 429 | Too Many Requests | 请求频率超限 |
| 500 | Internal Server Error | 服务器内部错误 |

### 6.2 错误码设计
```javascript
// 通用错误码 (100000-199999)
100000: 系统内部错误
100001: 请求参数验证失败
100002: 请求频率过高
100003: 服务暂时不可用
100100: Token无效或已过期
100101: Token缺失
100102: 权限不足

// 业务错误码 (200000-699999)
200000: 用户不存在
300000: 订单不存在
400000: 支付失败
500000: 车辆不存在
600000: 文件上传失败
```

### 6.3 错误处理最佳实践
```javascript
// 1. 详细错误信息
{
  "code": 300001,
  "message": "ORDER_STATUS_INVALID",
  "details": "当前订单状态不允许此操作，当前状态：已支付，期望状态：待确认"
}

// 2. 错误分类和代码
{
  "errors": [
    {
      "field": "startDate",
      "message": "取车日期不能早于今天",
      "code": "INVALID_DATE_RANGE"
    }
  ]
}

// 3. 帮助信息
{
  "code": 100002,
  "message": "RATE_LIMIT_EXCEEDED",
  "details": "请求频率过高，请稍后重试",
  "retryAfter": 60
}
```

---

## 7. 认证授权规范

### 7.1 JWT Token结构
```javascript
// Token Header
{
  "alg": "HS256",
  "typ": "JWT"
}

// Token Payload
{
  "userId": 12345,
  "userType": "customer",        // customer|mobile_admin|pc_admin
  "roleId": 2,
  "permissions": [
    "order:read",
    "order:create"
  ],
  "storeId": 5,                  // 仅管理端用户
  "exp": 1736789400,             // 过期时间
  "iat": 1736703000,             // 签发时间
  "iss": "daodaorv-api"          // 签发者
}
```

### 7.2 认证流程
```javascript
// 1. 用户登录
POST /api/v1/auth/login
{
  "phone": "13800138000",
  "password": "password123"
}

// 2. 返回Token
{
  "code": 0,
  "message": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh_token_here",
    "expiresIn": 86400,
    "user": {
      "id": 123,
      "username": "testuser",
      "userType": "customer"
    }
  }
}

// 3. 后续请求携带Token
GET /api/v1/users/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 7.3 权限控制
```javascript
// 基于角色的权限控制
const permissions = {
  customer: [
    "vehicle:read",
    "order:create",
    "order:read:own",
    "payment:create"
  ],
  mobile_admin: [
    "vehicle:read",
    "vehicle:update:store",
    "order:read:store",
    "order:update:store",
    "user:read:store"
  ],
  pc_admin: [
    "vehicle:*",
    "order:*",
    "user:*",
    "store:*",
    "system:*"
  ]
};

// 权限验证中间件示例
function checkPermission(requiredPermission) {
  return (req, res, next) => {
    const { userType, permissions } = req.user;

    if (!permissions.includes(requiredPermission)) {
      return res.status(403).json({
        code: 100102,
        message: "PERMISSION_DENIED",
        details: "权限不足"
      });
    }

    next();
  };
}
```

---

## 8. 接口文档规范

### 8.1 接口文档模板
```markdown
### 接口名称
获取车辆列表

### 接口描述
获取车辆列表，支持分页、排序、筛选等功能

### 请求URL
`GET /api/v1/vehicles`

### 请求头
```
Content-Type: application/json
Authorization: Bearer {token}
```

### 请求参数
| 参数名 | 类型 | 必填 | 说明 | 示例 |
|--------|------|------|------|------|
| page | integer | 否 | 页���，从1开始 | 1 |
| pageSize | integer | 否 | 每页大小，默认20，最大100 | 20 |
| status | string | 否 | 车辆状态筛选 | available |
| store_id | integer | 否 | 门店ID筛选 | 123 |
| sort | string | 否 | 排序字段和方向 | daily_rate,asc |

### 响应示例
```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "id": 1,
      "licensePlate": "京A12345",
      "brand": "长城房车",
      "model": "V71",
      "dailyRate": 500.00,
      "status": "available"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 150,
    "pages": 8
  }
}
```

### 错误码
| 错误码 | 说明 | 解决方案 |
|--------|------|----------|
| 100001 | 参数验证失败 | 检查请求参数格式 |
| 100102 | 权限不足 | 联系管理员分配权限 |
| 500000 | 车辆不存在 | 检查车辆ID是否正确 |
```

### 8.2 接口测试规范
```javascript
// 接口测试用例
describe('GET /api/v1/vehicles', () => {
  test('成功获取车辆列表', async () => {
    const response = await request
      .get('/api/v1/vehicles')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.code).toBe(0);
    expect(response.body.data).toBeInstanceOf(Array);
    expect(response.body.pagination).toBeDefined();
  });

  test('分页参数验证', async () => {
    const response = await request
      .get('/api/v1/vehicles?page=1&pageSize=10')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.pagination.page).toBe(1);
    expect(response.body.pagination.pageSize).toBe(10);
  });

  test('无权限访问', async () => {
    await request
      .get('/api/v1/vehicles')
      .expect(401);
  });
});
```

---

## 9. API接口列表

### 9.1 认证相关接口
```javascript
// 用户认证
POST   /api/v1/auth/login              // 用户登录
POST   /api/v1/auth/logout             // 用户登出
POST   /api/v1/auth/refresh            // 刷新Token
POST   /api/v1/auth/register           // 用户注册
POST   /api/v1/auth/sms-code           // 发送短信验证码
POST   /api/v1/auth/verify-code        // 验证短信验证码
POST   /api/v1/auth/reset-password     // 重置密码
```

### 9.2 用户相关接口
```javascript
// 用户管理
GET    /api/v1/users                   // 获取用户列表
GET    /api/v1/users/{id}              // 获取用户详情
POST   /api/v1/users                   // 创建用户
PUT    /api/v1/users/{id}              // 更新用户信息
DELETE /api/v1/users/{id}              // 删除用户

// 用户档案
GET    /api/v1/user-profiles            // 获取用户档案
PUT    /api/v1/user-profiles            // 更新用户档案
POST   /api/v1/user-profiles/upload    // 上传用户头像
```

### 9.3 车辆相关接口
```javascript
// 车辆管理
GET    /api/v1/vehicles                 // 获取车辆列表
GET    /api/v1/vehicles/{id}            // 获取车辆详情
POST   /api/v1/vehicles                 // 创建车辆
PUT    /api/v1/vehicles/{id}            // 更新车辆信息
DELETE /api/v1/vehicles/{id}            // 删除车辆

// 车辆品牌和型号
GET    /api/v1/vehicle-brands           // 获取车辆品牌列表
GET    /api/v1/vehicle-models           // 获取车辆型号列表
POST   /api/v1/vehicle-brands           // 创建车辆品牌
POST   /api/v1/vehicle-models           // 创建车辆型号
```

### 9.4 订单相关接口
```javascript
// 订单管理
GET    /api/v1/orders                   // 获取订单列表
GET    /api/v1/orders/{id}              // 获取订单详情
POST   /api/v1/orders                   // 创建订单
PUT    /api/v1/orders/{id}              // 更新订单信息
DELETE /api/v1/orders/{id}              // 删除订单

// 订单操作
POST   /api/v1/orders/{id}/confirm      // 确认订单
POST   /api/v1/orders/{id}/cancel       // 取消订单
POST   /api/v1/orders/{id}/pickup       // 确认取车
POST   /api/v1/orders/{id}/return       // 确认还车
GET    /api/v1/orders/{id}/logs         // 获取订单操作日志
```

### 9.5 支付相关接口
```javascript
// 支付管理
GET    /api/v1/payments                 // 获取支付记录
GET    /api/v1/payments/{id}            // 获取支付详情
POST   /api/v1/payments                 // 创建支付
POST   /api/v1/payments/{id}/refund     // 申请退款
GET    /api/v1/payment-methods          // 获取支付方式列表
```

### 9.6 门店相关接口
```javascript
// 门店管理
GET    /api/v1/stores                   // 获取门店列表
GET    /api/v1/stores/{id}              // 获取门店详情
POST   /api/v1/stores                   // 创建门店
PUT    /api/v1/stores/{id}              // 更新门店信息
DELETE /api/v1/stores/{id}              // 删除门店

// 门店用户
GET    /api/v1/store-users              // 获取门店用户列表
POST   /api/v1/store-users              // 添加门店用户
DELETE /api/v1/store-users/{id}         // 移除门店用户
```

### 9.7 营销相关接口
```javascript
// 优惠券管理
GET    /api/v1/coupons                  // 获取优惠券列表
GET    /api/v1/coupons/{id}             // 获取优惠券详情
POST   /api/v1/coupons                  // 创建优惠券
PUT    /api/v1/coupons/{id}             // 更新优惠券
DELETE /api/v1/coupons/{id}             // 删除优惠券

// 用户优惠券
GET    /api/v1/user-coupons             // 获取用户优惠券列表
POST   /api/v1/user-coupons/receive     // 领取优惠券
POST   /api/v1/user-coupons/use         // 使用优惠券
```

### 9.8 系统相关接口
```javascript
// 系统配置
GET    /api/v1/system/configs           // 获取系统配置
PUT    /api/v1/system/configs/{key}     // 更新系统配置

// 文件上传
POST   /api/v1/upload                   // 文件上传
POST   /api/v1/upload/image             // 图片上传
POST   /api/v1/upload/document          // 文档上传

// 日志查询
GET    /api/v1/system/logs              // 获取系统日志
GET    /api/v1/system/logs/{id}         // 获取日志详情
```

---

## 10. API版本管理

### 10.1 版本策略
- **URL版本控制**: `/api/v1/`, `/api/v2/`
- **向后兼容**: 保持旧版本API至少6个月
- **废弃通知**: 提前30天通知API废弃
- **迁移指南**: 提供版本迁移文档

### 10.2 版本升级流程
```javascript
// 1. 新版本API开发
// 在新版本中添加新功能或修改现有功能
GET /api/v2/vehicles?include=features

// 2. 旧版本兼容
// 保持旧版本API正常运行
GET /api/v1/vehicles

// 3. 版本废弃通知
// 在响应头中添加废弃警告
Deprecated: true
Sunset: 2026-06-01
Link: </api/v2/vehicles>; rel="successor-version"

// 4. 完全废弃
// 在废弃日期后停止支持旧版本
```

---

**文档维护**: 叨叨房车技术团队
**最后更新**: 2025-11-12
**版本**: v1.0
**下次审核**: 2025-12-12