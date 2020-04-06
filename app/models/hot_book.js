const { Sequelize, Model, Op } = require('sequelize')
const { sequelize } = require('../../core/db')
const { Favor } = require('./favor')

class HotBook extends Model {
  static async getAll() {
    // 取出所有 book 数据
    const books = await HotBook.findAll({
      order: ['index']
    })
    const ids = []
    books.forEach(async book => {
      ids.push(book.id)
    })
    // 在点赞表里查询 是否含有点赞的书籍
    const favors = await Favor.findAll({
      art_id: {
        where: {
          [Op.in]: ids,
          type: 400
        }
      },
      group: ['art_id'],
      // 查询哪些字段 ,Sequelize.fn sequelize提供的工具方法集合，COUNT，查询数据总数， SUM 对字段求和
      // 命名为 count
      attributes: ['art_id', [Sequelize.fn('COUNT', '*'), 'count']]
    })
    // const books = []
    books.forEach(book => {
      HotBook._getEachBookStatus(book, favors)
    })
    return books
  }
  /**
   * @description 合并 book 信息，将 favor 里的点赞数量添加到 book 上
   * @param {*} book 单个 book
   * @param {*} favors 点赞数集合
   * @returns book 返回 book 实例 方便后续 . 调用
   */
  static _getEachBookStatus(book, favors) {
    let count = 0
    favors.forEach(favor => {
      if (book.id === favor.art_id) {
        count = favor.get('count')
      }
    })
    book.setDataValue('count', count)
    return book
  }
}

// 图书基础信息，与业务是没有关联的，所以将图书基础数据作为服务的形式
// 我们不应该把图书基础信息放到这个项目里面，而应该作为服务的形式提供数据
// 这样做的好处：1.避免大量的数据存放在单个项目中。
//             2.数据公用性，图书基础数据不仅仅只服务于该项目，还可以服务于其他项目

// node.js 中间层
// 微服务
// 我们这里的图书基础数据就是上述两者的雏形

// 虽然通过外部服务的形式获取 图书基础信息，但是项目还是得需要建立 自己的book表，用以存放图书业务数据

HotBook.init(
  {
    index: Sequelize.INTEGER, // 序号
    image: Sequelize.STRING, // 封面
    author: Sequelize.STRING, // 作者
    title: Sequelize.STRING // 标题
  },
  {
    sequelize,
    tableName: 'hot_book'
  }
)

module.exports = {
  HotBook
}
