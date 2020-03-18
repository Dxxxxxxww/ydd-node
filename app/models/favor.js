const { Sequelize, Model } = require('sequelize')
const { sequelize } = require('../../core/db')
const { Art } = require('./art')

class Favor extends Model {
	static async like(art_id, type, uid) {
		// 1、往 favor 表里插入数据。 2、classic 表的 fav_nums 字段数量 +1
		// 必须要两个操作同时进行，保证数据的准确性
		// 这里就可以用到数据库的 事务 。数据库事务能保证对数据库的多个操作，要么同时成功，如果有一个操作失败，就全失败。
		// 可以保证数据的一致性
		// 设计比较严谨的数据库通常会有四个特性： ACID
		// A 原子性 C 一致性 I 隔离性(独立性) D 持久性

		// 首先查询，如果没有就插入
		const favor = await Favor.findOne({
			where: {
				art_id,
				type,
				uid
			}
		})

		if (favor) {
			throw new global.errs.LikeError()
		}
    // 执行事务
		return sequelize.transaction(async t => {
			await Favor.create({ art_id, type, uid }, { transaction: t })
			const art = await Art.getData(art_id, type)
			// Model 实例的一个方法，指定一个字段自增
			await art.increment('fav_nums', { by: 1, transaction: t })
		})
	}
	static async dislike(art_id, type, uid) {}
}
// 不需要用字段来表示是否喜欢，只要 favor 表里有数据，就代表喜欢
Favor.init(
	{
		uid: Sequelize.INTEGER,
		art_id: Sequelize.INTEGER,
		type: Sequelize.INTEGER
	},
	{
		sequelize,
		tableName: 'favor'
	}
)

module.exports = {
	Favor
}
