const util = require('util')
const axios = require('axios')
const { Sequelize, Model } = require('sequelize')
const { sequelize } = require('../../core/db')
const { Favor } = require('./favor')

// 存储 book 的相关业务数据，因为书籍的详细信息都可以在服务里获取，这里只需要保存 fav_nums 这个业务数据
class Book extends Model {
  // 如果设置了构造函数，那么返回的实例里只会包含 定义了 defaultValue 的字段
  // 所以这里还是不要用构造函数传参了，
  constructor() {
    super()
  }
  // 方法还是可以用实例方法(个人感觉没必要了，还不如直接改成类方法),在方法上传递参数
  async getDetail(id) {
    const url = util.format(global.config.yushu.detailUrl, id)
    const detail = await axios.get(url)
    return detail.data
  }
  // summary yushu api 如果传此值则返回概要信息，不传则详细
  /**
   * @description 涉及数据的还是写在模型里好
   * @param {*} q
   * @param {*} start
   * @param {*} count
   * @param {*} summary
   */
  static async searchFromYuShu(q, start, count, summary = 1) {
    const url = util.format(
      global.config.yushu.keywordUrl,
      encodeURI(q),
      start,
      count,
      summary
    )
    const detail = await axios.get(url)
    return detail.data
  }
  static async getMyFavorBookCount(uid) {
    // 求数量的方法(只求数量)
    const count = await Favor.count({
      where: {
        type: 400,
        uid,
      },
    })
    return count
  }
}

Book.init(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    fav_nums: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: 'book',
  }
)
module.exports = {
  Book,
}
