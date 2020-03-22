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
		// 执行事务 sequelize.transaction 这个函数一定要 return
		// 事务如果执行失败就会 roll back
		return sequelize.transaction(async t => {
			await Favor.create({ art_id, type, uid }, { transaction: t })
			// 将实体表中对应数据的 fav_nums 加 1
			// 增加这个是因为 sequelize 的 bug，在使用添加了 scope 的查询后如果对数据进行改动就会生成错误的 sql

			const art = await Art.getData(art_id, type, false)
			// Model 实例的一个方法，指定一个字段自增
			await art.increment('fav_nums', {
				by: 1,
				transaction: t
			})
		})
	}
	static async dislike(art_id, type, uid) {
		const favor = await Favor.findOne({
			where: {
				art_id,
				type,
				uid
			}
		})

		if (!favor) {
			throw new global.errs.DislikeError()
		}
		// 执行事务
		return sequelize.transaction(async t => {
			// 注意这里需要用 favor 实例，而不是类。因为如果要销毁数据，那么数据实例就一定存在。
			// force 值为 false： 软删除，即给数据添加删除日期值。
			//            true： 物理删除，删除了这条数据。
			await favor.destroy({
				force: false,
				transaction: t
			})
			// 将实体表中对应数据的 fav_nums 减 1
			// 增加这个是因为 sequelize 的 bug，在使用添加了 scope 的查询后如果对数据进行改动就会生成错误的 sql
			const art = await Art.getData(art_id, type, false)
			// Model 实例的一个方法，指定一个字段自减
			await art.decrement('fav_nums', {
				by: 1,
				transaction: t
			})
		})
	}

	static async userLikeIt(art_id, type, uid) {
		const favor = await Favor.findOne({
			where: {
				art_id,
				type,
				uid
			}
		})
		return favor ? true : false
	}
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
