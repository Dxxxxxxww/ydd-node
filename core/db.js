//配合数据库驱动(mysql2)，用于在 js 中编写数据库,数据库的配置
const Sequelize = require('sequelize')
const { dbName, host, port, user, password } = require('../config/config').database
console.log(dbName, host, port, user, password)
const sequelize = new Sequelize(dbName, user, password, {
	dialect: 'mysql',
	host,
	port,
	loading: true,
	timezone: '+08:00',
	define: {
    timestamps: true,//生成 创建时间，更新时间字段，默认为 true
    paranoid: true,//生成 删除时间字段，默认为 false
    // createAt: 'create_at',
    // updateAt: 'update_at',
    // deleteAt: 'delete_at',
    underscored: true,//将驼峰转为下划线连接
  }
})
//这句调用必须有
sequelize.sync() //sequelize.sync({force:true}),严重不推荐，当想添加字段的时候，实质是删除旧表添加新表(新表中包含想要新增字段)

module.exports = {
	sequelize
}
