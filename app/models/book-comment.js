const { Sequelize, Model } = require('sequelize')
const { sequelize } = require('../../core/db')

// 我们返回的对象基本上都是查询出来的 model 对象，
// model 对象肯定会有一个基类，那么我们在基类上定义一个 toJSON 方法，这样就能控制对象序列化的行为了
class BookComment extends Model {
  /**
   * @description 新增短评
   * @param {*} bookId
   * @param {*} content
   */
  static async addComment(bookId, content) {
    const comment = await BookComment.findOne({
      where: {
        bookId,
        content,
      },
    })
    if (!comment) {
      return await BookComment.create({
        bookId,
        content,
        nums: 1,
      })
    } else {
      return await comment.increment('nums', {
        by: 1,
      })
    }
  }
  /**
   * @description 获取短评
   * @param {*} bookId
   */
  static async getComments(bookId) {
    const scope = 'bh'
    // 这里通过 scope 的方式来在查询数据库的桑畅就不查这几个字段，也可以在 json 序列化的时候排除这几个字段
    const comments = await BookComment.scope(scope).findAll({
      where: {
        bookId,
      },
    })
    return comments
  }
  // 我们返回的对象基本上都是查询出来的 model 对象，
  // model 对象肯定会有一个基类，那么我们在基类上定义一个 toJSON 方法，这样就能控制对象序列化的行为了
  // toJSON 方法不能传参，所以通过 this 来获取数值
  // 这种方法的局限性，假如说我这个类里有很多获取数据的方法，并且每一方法获取的数据还都不太一样，这样这个
  // toJSON 方法所返回对象就难以定义了。所以需要灵活一点视不同业务情况而定
  toJSON() {
    // this.dataValues 可以获取模型的所有字段(this指向模型实例)
    // 假如说字段很多，只想排除一两个，就可以获取所有模型字段后，复制一下这个对象，然后删除不想要的字段，
    // 再返回就行了
    return {
      content: this.content, // this.getDataValue('content') 也可以使用 model 的方法(this指向模型实例)
      nums: this.nums, // this.getDataValue('nums')  (this指向模型实例)
    }
  }
}

BookComment.init(
  {
    content: Sequelize.STRING(12),
    nums: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    bookId: Sequelize.INTEGER,
  },
  {
    sequelize,
    tableName: 'book_comment',
  }
)

module.exports = {
  BookComment,
}
