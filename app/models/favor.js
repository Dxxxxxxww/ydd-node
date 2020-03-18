const { Sequelize, Model } = require('sequelize')
const { sequelize } = require('../../core/db')

class Favor extends Model {}

Favor.init(
	{
		uid: Sequelize.INTEGER,
		art_id: Sequelize.INTEGER,
		type: Sequelize.INTEGER // 是否喜欢
	},
	{
		sequelize,
		tableName: 'favor'
	}
)

module.exports = {
	Favor
}
