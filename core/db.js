const Sequelize = require('sequelize') //配合数据库驱动(mysql2)，用于在 js 中编写数据库
const { dbName, host, port, user, password } = global.database

const sequelize = new Sequelize(dbName, user, password, {
	dialect: 'mysql',
	host,
	port,
	loading: true,
	timezone: '+08:00',
	define: {}
})

module.exports = {
  sequelize
}