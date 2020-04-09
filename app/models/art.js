const { flatten } = require('lodash')
const { Op } = require('sequelize')
const { Movie, Sentence, Music } = require('./classic')
// const { Favor } = require('./favor')

// 如果写在 classic model 中，就会是给每一个表都写一个查询的静态类方法。
// 这样做太过重复了，所以可以抽离出来写一个类方法去查询
class Art {
  constructor(artId, type) {
    this.artId = artId
    this.type = type
  }
  async getDetail(uid) {
    // 避免循环导入，将导入写在函数内部
    const { Favor } = require('./favor')

    const artDetail = await Art.getData(this.artId, this.type)
    if (!artDetail) {
      throw new global.errs.NotFound()
    }
    // 这里的 Favor 会是 undefined ，是因为在此文件中引入了 favor.js, 在 favor 里又导入了 art.js
    // 造成循环导入了
    const likeStatus = await Favor.userLikeIt(this.artId, this.type, uid)
    // 这里不合并写是因为 like 和 art 本身是不同种，不同表的数据，不太建议合并。
    // artDetail.setDataValue('likeStatus', likeStatus)
    return {
      artDetail,
      likeStatus,
    }
  }
  /**
   * @description 获取所有期刊的具体信息
   * @param {*} artList 期刊数组
   */
  static async getList(artList) {
    const artObj = {
      100: [],
      200: [],
      300: [],
    }
    for (const art of artList) {
      // 这里不用 if 和 switch，因为已知 art 类型，就可以直接定义对象来获取id
      artObj[art.type].push(art.art_id)
    }
    const arts = []
    for (let key in artObj) {
      // 如果要在循环里进行复杂的逻辑，建议封装成函数
      // 做判断，防止空数组
      const ids = artObj[key]
      if (ids.length === 0) {
        continue
      }
      key = parseInt(key)
      arts.push(await Art._getListByType(ids, key))
    }
    return flatten(arts)
  }
  /**
   * @description 获取期刊信息
   * @param {*} artId
   * @param {*} type
   * @param {*} useScope
   * @returns art 单个信息
   */
  static async getData(artId, type, useScope = true) {
    const finder = {
      where: {
        id: artId,
      },
    }
    let art = null
    // 这里通过 scope 的方式来在查询数据库的时候就不查这几个字段，也可以在 json 序列化的时候排除这几个字段
    // 增加这个是因为 sequelize 的 bug，在使用添加了 scope 的查询后如果对数据进行改动就会生成错误的sql,
    // 所以使用第三个参数来判断是否使用 scope
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
  /**
   * @description 通过 ids 和 type 使用 in 来查询一组数据
   * @param {*} ids art id 集合
   * @param {*} type art 类型
   * @returns art 具体信息集合
   */
  static async _getListByType(ids, type) {
    const finder = {
      where: {
        id: {
          [Op.in]: ids,
        },
      },
    }
    let arts = []
    const scope = 'bh'
    switch (type) {
      case 100:
        arts = await Movie.scope(scope).findAll(finder)
        break
      case 200:
        arts = await Music.scope(scope).findAll(finder)
        break
      case 300:
        arts = await Sentence.scope(scope).findAll(finder)
        break
      default:
        break
    }
    return arts
  }
}

module.exports = {
  Art,
}
