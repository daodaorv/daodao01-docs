const { Sequelize } = require('sequelize')

// 数据库连接配置
const sequelize = new Sequelize(
  process.env.DB_NAME || 'daodao',
  process.env.DB_USER || 'daodao_dev',
  process.env.DB_PASSWORD || 'daodao_dev_2024',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
    timezone: '+08:00',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
)

// 测试数据库连接
const testConnection = async () => {
  try {
    await sequelize.authenticate()
    console.log('✅ 数据库连接成功')
    return true
  } catch (error) {
    console.error('❌ 数据库连接失败:', error.message)
    return false
  }
}

// 同步数据库模型
const syncDatabase = async () => {
  try {
    await sequelize.sync({ force: false })
    console.log('✅ 数据库模型同步成功')
    return true
  } catch (error) {
    console.error('❌ 数据库模型同步失败:', error.message)
    return false
  }
}

module.exports = {
  sequelize,
  testConnection,
  syncDatabase
}