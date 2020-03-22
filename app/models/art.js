const { Movie, Sentence, Music } = require('./classic')
// 如果写在 classic model 中，就会是给每一个表都写一个查询的静态类方法。
// 这样做太过重复了，所以可以抽离出来写一个类方法去查询
class Art {
	static async getData(artId, type, useScope = true) {
		const finder = {
			where: {
				id: artId
			}
		}
    let art = null
    // 增加这个是因为 sequelize 的 bug，在使用添加了 scope 的查询后如果对数据进行改动就会生成错误的sql
		const scope = useScope ? 'bh' : null
		switch (type) {
			case 100:
				art = await Movie.scope(scope).findOne(finder)
				break
			case 200:
				art = await Music.scope(scope).findOne(finder)
				break
			case 300:
				art = await Sentence.scope(scope).findOne(finder)
				break
			case 400:
				break
			default:
				break
		}
		return art
	}
}

module.exports = {
	Art
}
