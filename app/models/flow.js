const { Sequelize, Model } = require('sequelize')
const { sequelize } = require('../../core/db')

class Flow extends Model {}

Flow.init(
	{
		index: Sequelize.INTEGER, // 期刊序号
		art_id: Sequelize.INTEGER, // 实体表数据的 id 号
		type: Sequelize.INTEGER // 实体类型
	},
	{
		sequelize,
		tableName: 'flow'
	}
)
// 通过 art_id 与 type 字段就实现了 Flow 表与 classic 三表之间的关联。设计表一定要考虑表与表之间的关联，以及靠什么来关联

module.exports = {
  Flow
}