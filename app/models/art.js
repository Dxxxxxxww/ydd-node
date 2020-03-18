const { Movie, Sentence, Music } = require('./classic')
// 如果写在 classic model 中，就会是给每一个表都写一个查询的静态类方法。
// 这样做太过重复了，所以可以抽离出来写一个类方法去查询
class Art {
	static async getData(artId, type) {
		const finder = {
			where: {
				id: artId
			}
		}
		let art = null
		switch (type) {
			case 100:
				art = await Movie.findOne(finder)
				break
			case 200:
				art = await Music.findOne(finder)
				break
			case 300:
				art = await Sentence.findOne(finder)
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
