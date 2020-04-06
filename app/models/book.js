const util = require('util')
const axios = require('axios')
const { Sequelize, Model } = require('sequelize')
const { sequelize } = require('../../core/db')

// 存储 book 的相关业务数据，因为书籍的详细信息都可以在服务里获取，这里只需要保存 fav_nums 这个业务数据
class Book extends Model {
  constructor(id) {
    super()
    this.id = id
  }
  async getDetail() {
    const url = util.format(global.config.yushu.detailUrl, this.id)
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
}

Book.init(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    fav_nums: {
      type: Sequelize.INTEGER,
      default: 0
    }
  },
  {
    sequelize,
    tableName: 'book'
  }
)
module.exports = {
  Book
}
