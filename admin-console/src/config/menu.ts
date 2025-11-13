import type { MenuItem } from '@/types/menu'

/**
 * 管理端菜单配置
 * 基于功能设计文档的四大功能模块
 */

// 核心业务管理菜单
export const coreBusinessMenus: MenuItem[] = [
  {
    id: 'user-manage',
    name: 'UserManage',
    title: '用户管理',
    icon: 'User',
    type: 'menu',
    sort: 1,
    children: [
      {
        id: 'user-list',
        name: 'UserList',
        title: '用户列表',
        path: '/core-business/user/list',
        component: '@/views/core-business/user/List.vue',
        type: 'page',
        sort: 1,
        permission: ['user:list']
      },
      {
        id: 'user-audit',
        name: 'UserAudit',
        title: '注册审核',
        path: '/core-business/user/audit',
        component: '@/views/core-business/user/Audit.vue',
        type: 'page',
        sort: 2,
        permission: ['user:audit']
      },
      {
        id: 'user-tags',
        name: 'UserTags',
        title: '标签管理',
        path: '/core-business/user/tags',
        component: '@/views/core-business/user/Tags.vue',
        type: 'page',
        sort: 3,
        permission: ['user:tags']
      },
      {
        id: 'user-credit',
        name: 'UserCredit',
        title: '信用评估',
        path: '/core-business/user/credit',
        component: '@/views/core-business/user/Credit.vue',
        type: 'page',
        sort: 4,
        permission: ['user:credit']
      },
      {
        id: 'risk-control',
        name: 'RiskControl',
        title: '风控管理',
        path: '/core-business/user/risk',
        component: '@/views/core-business/user/Risk.vue',
        type: 'page',
        sort: 5,
        permission: ['user:risk']
      },
      {
        id: 'blacklist',
        name: 'Blacklist',
        title: '黑名单',
        path: '/core-business/user/blacklist',
        component: '@/views/core-business/user/Blacklist.vue',
        type: 'page',
        sort: 6,
        permission: ['user:blacklist']
      }
    ]
  },
  {
    id: 'vehicle-manage',
    name: 'VehicleManage',
    title: '车辆管理',
    icon: 'Van',
    type: 'menu',
    sort: 2,
    children: [
      {
        id: 'vehicle-models',
        name: 'VehicleModels',
        title: '车型库管理',
        path: '/core-business/vehicle/models',
        component: '@/views/core-business/vehicle/Models.vue',
        type: 'page',
        sort: 1,
        permission: ['vehicle:models']
      },
      {
        id: 'vehicle-list',
        name: 'VehicleList',
        title: '车辆列表',
        path: '/core-business/vehicle/list',
        component: '@/views/core-business/vehicle/List.vue',
        type: 'page',
        sort: 2,
        permission: ['vehicle:list']
      },
      {
        id: 'vehicle-status',
        name: 'VehicleStatus',
        title: '车辆状态',
        path: '/core-business/vehicle/status',
        component: '@/views/core-business/vehicle/Status.vue',
        type: 'page',
        sort: 3,
        permission: ['vehicle:status']
      },
      {
        id: 'maintenance',
        name: 'Maintenance',
        title: '维保管理',
        path: '/core-business/vehicle/maintenance',
        component: '@/views/core-business/vehicle/Maintenance.vue',
        type: 'page',
        sort: 4,
        permission: ['vehicle:maintenance']
      },
      {
        id: 'insurance',
        name: 'Insurance',
        title: '保险管理',
        path: '/core-business/vehicle/insurance',
        component: '@/views/core-business/vehicle/Insurance.vue',
        type: 'page',
        sort: 5,
        permission: ['vehicle:insurance']
      },
      {
        id: 'violations',
        name: 'Violations',
        title: '违章管理',
        path: '/core-business/vehicle/violations',
        component: '@/views/core-business/vehicle/Violations.vue',
        type: 'page',
        sort: 6,
        permission: ['vehicle:violations']
      }
    ]
  },
  {
    id: 'store-manage',
    name: 'StoreManage',
    title: '门店管理',
    icon: 'Shop',
    type: 'menu',
    sort: 3,
    children: [
      {
        id: 'store-list',
        name: 'StoreList',
        title: '门店列表',
        path: '/core-business/store/list',
        component: '@/views/core-business/store/List.vue',
        type: 'page',
        sort: 1,
        permission: ['store:list']
      },
      {
        id: 'store-settings',
        name: 'StoreSettings',
        title: '门店设置',
        path: '/core-business/store/settings',
        component: '@/views/core-business/store/Settings.vue',
        type: 'page',
        sort: 2,
        permission: ['store:settings']
      },
      {
        id: 'service-config',
        name: 'ServiceConfig',
        title: '服务配置',
        path: '/core-business/store/service',
        component: '@/views/core-business/store/Service.vue',
        type: 'page',
        sort: 3,
        permission: ['store:service']
      },
      {
        id: 'city-manage',
        name: 'CityManage',
        title: '城市管理',
        path: '/core-business/store/city',
        component: '@/views/core-business/store/City.vue',
        type: 'page',
        sort: 4,
        permission: ['store:city']
      },
      {
        id: 'area-manage',
        name: 'AreaManage',
        title: '区域管理',
        path: '/core-business/store/area',
        component: '@/views/core-business/store/Area.vue',
        type: 'page',
        sort: 5,
        permission: ['store:area']
      }
    ]
  },
  {
    id: 'order-manage',
    name: 'OrderManage',
    title: '订单管理',
    icon: 'Document',
    type: 'menu',
    sort: 4,
    children: [
      {
        id: 'order-list',
        name: 'OrderList',
        title: '订单列表',
        path: '/core-business/order/list',
        component: '@/views/core-business/order/List.vue',
        type: 'page',
        sort: 1,
        permission: ['order:list']
      },
      {
        id: 'order-detail',
        name: 'OrderDetail',
        title: '订单详情',
        path: '/core-business/order/detail',
        component: '@/views/core-business/order/Detail.vue',
        type: 'page',
        sort: 2,
        permission: ['order:detail']
      },
      {
        id: 'exception-handle',
        name: 'ExceptionHandle',
        title: '异常处理',
        path: '/core-business/order/exception',
        component: '@/views/core-business/order/Exception.vue',
        type: 'page',
        sort: 3,
        permission: ['order:exception']
      },
      {
        id: 'refund-manage',
        name: 'RefundManage',
        title: '退款管理',
        path: '/core-business/order/refund',
        component: '@/views/core-business/order/Refund.vue',
        type: 'page',
        sort: 4,
        permission: ['order:refund']
      },
      {
        id: 'evaluation-manage',
        name: 'EvaluationManage',
        title: '评价管理',
        path: '/core-business/order/evaluation',
        component: '@/views/core-business/order/Evaluation.vue',
        type: 'page',
        sort: 5,
        permission: ['order:evaluation']
      }
    ]
  },
  {
    id: 'crowdfunding-manage',
    name: 'CrowdfundingManage',
    title: '众筹管理',
    icon: 'Money',
    type: 'menu',
    sort: 5,
    children: [
      {
        id: 'crowdfunding-projects',
        name: 'CrowdfundingProjects',
        title: '众筹项目',
        path: '/core-business/crowdfunding/projects',
        component: '@/views/core-business/crowdfunding/Projects.vue',
        type: 'page',
        sort: 1,
        permission: ['crowdfunding:projects']
      },
      {
        id: 'vehicle-relation',
        name: 'VehicleRelation',
        title: '车辆关联',
        path: '/core-business/crowdfunding/vehicle',
        component: '@/views/core-business/crowdfunding/Vehicle.vue',
        type: 'page',
        sort: 2,
        permission: ['crowdfunding:vehicle']
      },
      {
        id: 'share-manage',
        name: 'ShareManage',
        title: '份额管理',
        path: '/core-business/crowdfunding/share',
        component: '@/views/core-business/crowdfunding/Share.vue',
        type: 'page',
        sort: 3,
        permission: ['crowdfunding:share']
      },
      {
        id: 'share-trade',
        name: 'ShareTrade',
        title: '份额交易',
        path: '/core-business/crowdfunding/trade',
        component: '@/views/core-business/crowdfunding/Trade.vue',
        type: 'page',
        sort: 4,
        permission: ['crowdfunding:trade']
      }
    ]
  },
  {
    id: 'cooperation-manage',
    name: 'CooperationManage',
    title: '合作管理',
    icon: 'Handshake',
    type: 'menu',
    sort: 6,
    children: [
      {
        id: 'cooperator-manage',
        name: 'CooperatorManage',
        title: '合作商管理',
        path: '/core-business/cooperation/partner',
        component: '@/views/core-business/cooperation/Partner.vue',
        type: 'page',
        sort: 1,
        permission: ['cooperation:partner']
      },
      {
        id: 'cooperation-vehicle',
        name: 'CooperationVehicle',
        title: '合作车辆',
        path: '/core-business/cooperation/vehicle',
        component: '@/views/core-business/cooperation/Vehicle.vue',
        type: 'page',
        sort: 2,
        permission: ['cooperation:vehicle']
      },
      {
        id: 'supplier-manage',
        name: 'SupplierManage',
        title: '供应商管理',
        path: '/core-business/cooperation/supplier',
        component: '@/views/core-business/cooperation/Supplier.vue',
        type: 'page',
        sort: 3,
        permission: ['cooperation:supplier']
      },
      {
        id: 'settlement-manage',
        name: 'SettlementManage',
        title: '结算管理',
        path: '/core-business/cooperation/settlement',
        component: '@/views/core-business/cooperation/Settlement.vue',
        type: 'page',
        sort: 4,
        permission: ['cooperation:settlement']
      }
    ]
  },
  {
    id: 'campsite-manage',
    name: 'CampsiteManage',
    title: '营地管理',
    icon: 'Campsite',
    type: 'menu',
    sort: 7,
    children: [
      {
        id: 'campsite-list',
        name: 'CampsiteList',
        title: '营地列表',
        path: '/core-business/campsite/list',
        component: '@/views/core-business/campsite/List.vue',
        type: 'page',
        sort: 1,
        permission: ['campsite:list']
      },
      {
        id: 'campsite-settings',
        name: 'CampsiteSettings',
        title: '营地设置',
        path: '/core-business/campsite/settings',
        component: '@/views/core-business/campsite/Settings.vue',
        type: 'page',
        sort: 2,
        permission: ['campsite:settings']
      },
      {
        id: 'booking-manage',
        name: 'BookingManage',
        title: '预订管理',
        path: '/core-business/campsite/booking',
        component: '@/views/core-business/campsite/Booking.vue',
        type: 'page',
        sort: 3,
        permission: ['campsite:booking']
      },
      {
        id: 'consult-config',
        name: 'ConsultConfig',
        title: '咨询配置',
        path: '/core-business/campsite/consult',
        component: '@/views/core-business/campsite/Consult.vue',
        type: 'page',
        sort: 4,
        permission: ['campsite:consult']
      }
    ]
  }
]

// 营销运营管理菜单
export const marketingMenus: MenuItem[] = [
  {
    id: 'marketing-manage',
    name: 'MarketingManage',
    title: '营销管理',
    icon: 'Promotion',
    type: 'menu',
    sort: 1,
    children: [
      {
        id: 'price-strategy',
        name: 'PriceStrategy',
        title: '价格策略',
        path: '/marketing/price/strategy',
        component: '@/views/marketing/price/Strategy.vue',
        type: 'page',
        sort: 1,
        permission: ['marketing:price']
      },
      {
        id: 'coupon-manage',
        name: 'CouponManage',
        title: '优惠券管理',
        path: '/marketing/coupon/list',
        component: '@/views/marketing/coupon/List.vue',
        type: 'page',
        sort: 2,
        permission: ['marketing:coupon']
      },
      {
        id: 'promotion-activity',
        name: 'PromotionActivity',
        title: '营销活动',
        path: '/marketing/promotion/activity',
        component: '@/views/marketing/promotion/Activity.vue',
        type: 'page',
        sort: 3,
        permission: ['marketing:promotion']
      },
      {
        id: 'special-package',
        name: 'SpecialPackage',
        title: '特惠套餐',
        path: '/marketing/package/special',
        component: '@/views/marketing/package/Special.vue',
        type: 'page',
        sort: 4,
        permission: ['marketing:package']
      },
      {
        id: 'custom-tour',
        name: 'CustomTour',
        title: '定制旅游',
        path: '/marketing/tour/custom',
        component: '@/views/marketing/tour/Custom.vue',
        type: 'page',
        sort: 5,
        permission: ['marketing:tour']
      },
      {
        id: 'extra-fee',
        name: 'ExtraFee',
        title: '增值费用管理',
        path: '/marketing/fee/extra',
        component: '@/views/marketing/fee/Extra.vue',
        type: 'page',
        sort: 6,
        permission: ['marketing:fee']
      }
    ]
  },
  {
    id: 'community-manage',
    name: 'CommunityManage',
    title: '社区管理',
    icon: 'ChatDotRound',
    type: 'menu',
    sort: 2,
    children: [
      {
        id: 'content-audit',
        name: 'ContentAudit',
        title: '内容审核',
        path: '/marketing/community/audit',
        component: '@/views/marketing/community/Audit.vue',
        type: 'page',
        sort: 1,
        permission: ['community:audit']
      },
      {
        id: 'community-config',
        name: 'CommunityConfig',
        title: '社区配置',
        path: '/marketing/community/config',
        component: '@/views/marketing/community/Config.vue',
        type: 'page',
        sort: 2,
        permission: ['community:config']
      },
      {
        id: 'report-handle',
        name: 'ReportHandle',
        title: '举报处理',
        path: '/marketing/community/report',
        component: '@/views/marketing/community/Report.vue',
        type: 'page',
        sort: 3,
        permission: ['community:report']
      },
      {
        id: 'content-manage',
        name: 'ContentManage',
        title: '内容管理',
        path: '/marketing/community/content',
        component: '@/views/marketing/community/Content.vue',
        type: 'page',
        sort: 4,
        permission: ['community:content']
      }
    ]
  },
  {
    id: 'service-manage',
    name: 'ServiceManage',
    title: '客服管理',
    icon: 'Service',
    type: 'menu',
    sort: 3,
    children: [
      {
        id: 'service-config',
        name: 'ServiceConfig',
        title: '客服配置',
        path: '/marketing/service/config',
        component: '@/views/marketing/service/Config.vue',
        type: 'page',
        sort: 1,
        permission: ['service:config']
      },
      {
        id: 'ticket-manage',
        name: 'TicketManage',
        title: '工单管理',
        path: '/marketing/service/ticket',
        component: '@/views/marketing/service/Ticket.vue',
        type: 'page',
        sort: 2,
        permission: ['service:ticket']
      },
      {
        id: 'quality-monitor',
        name: 'QualityMonitor',
        title: '质量监控',
        path: '/marketing/service/quality',
        component: '@/views/marketing/service/Quality.vue',
        type: 'page',
        sort: 3,
        permission: ['service:quality']
      },
      {
        id: 'knowledge-base',
        name: 'KnowledgeBase',
        title: '知识库',
        path: '/marketing/service/knowledge',
        component: '@/views/marketing/service/Knowledge.vue',
        type: 'page',
        sort: 4,
        permission: ['service:knowledge']
      }
    ]
  },
  {
    id: 'profit-sharing',
    name: 'ProfitSharing',
    title: '分润管理',
    icon: 'Share',
    type: 'menu',
    sort: 4,
    children: [
      {
        id: 'crowdfunding-profit',
        name: 'CrowdfundingProfit',
        title: '众筹分润',
        path: '/marketing/profit/crowdfunding',
        component: '@/views/marketing/profit/Crowdfunding.vue',
        type: 'page',
        sort: 1,
        permission: ['profit:crowdfunding']
      },
      {
        id: 'cooperation-profit',
        name: 'CooperationProfit',
        title: '差价分润（合作商）',
        path: '/marketing/profit/cooperation',
        component: '@/views/marketing/profit/Cooperation.vue',
        type: 'page',
        sort: 2,
        permission: ['profit:cooperation']
      },
      {
        id: 'employee-incentive',
        name: 'EmployeeIncentive',
        title: '员工激励',
        path: '/marketing/profit/employee',
        component: '@/views/marketing/profit/Employee.vue',
        type: 'page',
        sort: 3,
        permission: ['profit:employee']
      },
      {
        id: 'promotion-profit',
        name: 'PromotionProfit',
        title: '推广分润',
        path: '/marketing/profit/promotion',
        component: '@/views/marketing/profit/Promotion.vue',
        type: 'page',
        sort: 4,
        permission: ['profit:promotion']
      },
      {
        id: 'profit-config',
        name: 'ProfitConfig',
        title: '分润配置',
        path: '/marketing/profit/config',
        component: '@/views/marketing/profit/Config.vue',
        type: 'page',
        sort: 5,
        permission: ['profit:config']
      },
      {
        id: 'profit-settlement',
        name: 'ProfitSettlement',
        title: '结算管理',
        path: '/marketing/profit/settlement',
        component: '@/views/marketing/profit/Settlement.vue',
        type: 'page',
        sort: 6,
        permission: ['profit:settlement']
      },
      {
        id: 'withdraw-audit',
        name: 'WithdrawAudit',
        title: '提现审核',
        path: '/marketing/profit/withdraw',
        component: '@/views/marketing/profit/Withdraw.vue',
        type: 'page',
        sort: 7,
        permission: ['profit:withdraw']
      }
    ]
  }
]

// 系统管理菜单
export const systemMenus: MenuItem[] = [
  {
    id: 'employee-manage',
    name: 'EmployeeManage',
    title: '员工管理',
    icon: 'Avatar',
    type: 'menu',
    sort: 1,
    children: [
      {
        id: 'employee-list',
        name: 'EmployeeList',
        title: '员工列表',
        path: '/system/employee/list',
        component: '@/views/system/employee/List.vue',
        type: 'page',
        sort: 1,
        permission: ['employee:list']
      },
      {
        id: 'role-assignment',
        name: 'RoleAssignment',
        title: '角色分配',
        path: '/system/employee/role',
        component: '@/views/system/employee/Role.vue',
        type: 'page',
        sort: 2,
        permission: ['employee:role']
      },
      {
        id: 'store-employee',
        name: 'StoreEmployee',
        title: '门店员工',
        path: '/system/employee/store',
        component: '@/views/system/employee/Store.vue',
        type: 'page',
        sort: 3,
        permission: ['employee:store']
      },
      {
        id: 'service-staff',
        name: 'ServiceStaff',
        title: '客服人员',
        path: '/system/employee/service',
        component: '@/views/system/employee/Service.vue',
        type: 'page',
        sort: 4,
        permission: ['employee:service']
      },
      {
        id: 'performance-manage',
        name: 'PerformanceManage',
        title: '绩效管理',
        path: '/system/employee/performance',
        component: '@/views/system/employee/Performance.vue',
        type: 'page',
        sort: 5,
        permission: ['employee:performance']
      }
    ]
  },
  {
    id: 'permission-manage',
    name: 'PermissionManage',
    title: '权限管理',
    icon: 'Lock',
    type: 'menu',
    sort: 2,
    children: [
      {
        id: 'role-manage',
        name: 'RoleManage',
        title: '角色管理',
        path: '/system/permission/role',
        component: '@/views/system/permission/Role.vue',
        type: 'page',
        sort: 1,
        permission: ['permission:role']
      },
      {
        id: 'permission-config',
        name: 'PermissionConfig',
        title: '权限配置',
        path: '/system/permission/config',
        component: '@/views/system/permission/Config.vue',
        type: 'page',
        sort: 2,
        permission: ['permission:config']
      },
      {
        id: 'menu-permission',
        name: 'MenuPermission',
        title: '菜单权限',
        path: '/system/permission/menu',
        component: '@/views/system/permission/Menu.vue',
        type: 'page',
        sort: 3,
        permission: ['permission:menu']
      },
      {
        id: 'data-permission',
        name: 'DataPermission',
        title: '数据权限',
        path: '/system/permission/data',
        component: '@/views/system/permission/Data.vue',
        type: 'page',
        sort: 4,
        permission: ['permission:data']
      },
      {
        id: 'operation-log',
        name: 'OperationLog',
        title: '操作日志',
        path: '/system/permission/log',
        component: '@/views/system/permission/Log.vue',
        type: 'page',
        sort: 5,
        permission: ['permission:log']
      }
    ]
  },
  {
    id: 'system-manage',
    name: 'SystemManage',
    title: '系统管理',
    icon: 'Setting',
    type: 'menu',
    sort: 3,
    children: [
      {
        id: 'system-config',
        name: 'SystemConfig',
        title: '系统配置',
        path: '/system/system/config',
        component: '@/views/system/system/Config.vue',
        type: 'page',
        sort: 1,
        permission: ['system:config']
      },
      {
        id: 'parameter-setting',
        name: 'ParameterSetting',
        title: '参数设置',
        path: '/system/system/parameter',
        component: '@/views/system/system/Parameter.vue',
        type: 'page',
        sort: 2,
        permission: ['system:parameter']
      },
      {
        id: 'smart-warning',
        name: 'SmartWarning',
        title: '智能预警',
        path: '/system/system/warning',
        component: '@/views/system/system/Warning.vue',
        type: 'page',
        sort: 3,
        permission: ['system:warning']
      },
      {
        id: 'system-monitor',
        name: 'SystemMonitor',
        title: '系统监控',
        path: '/system/system/monitor',
        component: '@/views/system/system/Monitor.vue',
        type: 'page',
        sort: 4,
        permission: ['system:monitor']
      },
      {
        id: 'audit-log',
        name: 'AuditLog',
        title: '审计日志',
        path: '/system/system/audit',
        component: '@/views/system/system/Audit.vue',
        type: 'page',
        sort: 5,
        permission: ['system:audit']
      },
      {
        id: 'data-backup',
        name: 'DataBackup',
        title: '数据备份',
        path: '/system/system/backup',
        component: '@/views/system/system/Backup.vue',
        type: 'page',
        sort: 6,
        permission: ['system:backup']
      }
    ]
  }
]

// 数据分析菜单
export const dataAnalysisMenus: MenuItem[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    title: '工作台',
    icon: 'DataBoard',
    type: 'menu',
    sort: 1,
    children: [
      {
        id: 'data-overview',
        name: 'DataOverview',
        title: '数据概览',
        path: '/dashboard/overview',
        component: '@/views/dashboard/Overview.vue',
        type: 'page',
        sort: 1,
        permission: ['dashboard:overview']
      },
      {
        id: 'todo-list',
        name: 'TodoList',
        title: '今日待办',
        path: '/dashboard/todo',
        component: '@/views/dashboard/Todo.vue',
        type: 'page',
        sort: 2,
        permission: ['dashboard:todo']
      },
      {
        id: 'quick-actions',
        name: 'QuickActions',
        title: '快捷操作',
        path: '/dashboard/quick',
        component: '@/views/dashboard/Quick.vue',
        type: 'page',
        sort: 3,
        permission: ['dashboard:quick']
      }
    ]
  },
  {
    id: 'finance-manage',
    name: 'FinanceManage',
    title: '财务管理',
    icon: 'Money',
    type: 'menu',
    sort: 2,
    children: [
      {
        id: 'income-statistics',
        name: 'IncomeStatistics',
        title: '收入统计',
        path: '/finance/income',
        component: '@/views/finance/Income.vue',
        type: 'page',
        sort: 1,
        permission: ['finance:income']
      },
      {
        id: 'expense-manage',
        name: 'ExpenseManage',
        title: '支出管理',
        path: '/finance/expense',
        component: '@/views/finance/Expense.vue',
        type: 'page',
        sort: 2,
        permission: ['finance:expense']
      },
      {
        id: 'reconciliation',
        name: 'Reconciliation',
        title: '对账结算',
        path: '/finance/reconciliation',
        component: '@/views/finance/Reconciliation.vue',
        type: 'page',
        sort: 3,
        permission: ['finance:reconciliation']
      },
      {
        id: 'financial-report',
        name: 'FinancialReport',
        title: '财务报表',
        path: '/finance/report',
        component: '@/views/finance/Report.vue',
        type: 'page',
        sort: 4,
        permission: ['finance:report']
      },
      {
        id: 'invoice-manage',
        name: 'InvoiceManage',
        title: '发票管理',
        path: '/finance/invoice',
        component: '@/views/finance/Invoice.vue',
        type: 'page',
        sort: 5,
        permission: ['finance:invoice']
      }
    ]
  }
]

// 完整菜单配置
export const allMenus: MenuItem[] = [
  ...coreBusinessMenus,
  ...marketingMenus,
  ...systemMenus,
  ...dataAnalysisMenus
]

// 按角色分组的菜单配置
export const roleMenus = {
  [RoleCode.PLATFORM_ADMIN]: allMenus, // 平台管理员：所有权限
  [RoleCode.REGION_MANAGER]: [
    ...coreBusinessMenus.filter(m => m.id !== 'employee-manage'),
    ...marketingMenus,
    ...dataAnalysisMenus
  ], // 区域经理：除了员工管理外的所有权限
  [RoleCode.STORE_MANAGER]: [
    // 门店经理：基础业务权限
    coreBusinessMenus[0], // 用户管理
    coreBusinessMenus[1], // 车辆管理
    coreBusinessMenus[2], // 门店管理
    coreBusinessMenus[3], // 订单管理
    marketingMenus[0],    // 营销管理
    dataAnalysisMenus[0]  // 工作台
  ],
  [RoleCode.STORE_EMPLOYEE]: [
    // 门店员工：基础操作权限
    coreBusinessMenus[0], // 用户管理
    coreBusinessMenus[1], // 车辆管理
    coreBusinessMenus[3], // 订单管理
    dataAnalysisMenus[0]  // 工作台
  ]
}