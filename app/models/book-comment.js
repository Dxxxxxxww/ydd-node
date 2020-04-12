const { Sequelize, Model } = require('sequelize')
const { sequelize } = require('../../core/db')

// 我们返回的对象基本上都是查询出来的 model 对象，
// model 对象肯定会有一个基类，那么我们在基类上定义一个 toJSON 方法，这样就能控制对象序列化的行为了
class BookComment extends Model {
  // 这种方法也不行，这里是 Sequelize 的bug
  // 如果设置了构造函数，那么返回的实例里只会包含 定义了 defaultValue 的字段
  // 可以取消注释访问 获取短评 api 尝试
  // 使用 sequelize 的时候严禁使用 constructor
  // constructor() {
  // super()
  // this.exclude = []
  // }
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
    // 如果想要用 Model 基类上定义的 toJSON 方法，这里 comments 本身是一个实例数组，就要做循环很麻烦
    // 可以通过在原型上定义，这就是一种简洁的做法，这样每个实例上都能通过原型拿到 exclude 属性
    // 但是这种写死的方法不推荐，因为这样以后每个实例都会排除这两个字段。
    // 所以如果想用这种方式的 exclude 还是得在实例上添加。在最终的 api 上面决定排除哪些字段(详见 classic 下一期)
    // 所以实例数组的方式要么还是循环，要么还是用 scope
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
  // 这种方法的局限性：
  // 1.每个 model 类都要定义，太麻烦了 => 写在 Model 基类上
  // 2.假如说我这个类里有很多获取数据的方法，并且每一方法获取的数据还都不太一样，这样这个
  // toJSON 方法所返回对象就难以定义了。所以需要灵活一点视不同业务情况而定
  // toJSON() {
  //   // this.dataValues 可以获取模型的所有字段(this指向模型实例)
  //   // 假如说字段很多，只想排除一两个，就可以获取所有模型字段后，复制一下这个对象，然后删除不想要的字段，
  //   // 再返回就行了
  //   return {
  //     content: this.content, // this.getDataValue('content') 也可以使用 model 的方法(this指向模型实例)
  //     nums: this.nums, // this.getDataValue('nums')  (this指向模型实例)
  //   }
  // }
}

// 如果想要用 Model 基类上定义的 toJSON 方法，这里 comments 本身是一个数组，就要做循环很麻烦
// 可以通过在原型上定义，这就是一种简洁的做法，这样每个实例上都能通过原型拿到 exclude 属性
// 但是这种写死的方法不推荐，因为这样以后每个实例都会排除这两个字段。
// 所以如果想用这种方式的 exclude 还是得在实例上添加。在最终的 api 上面决定排除哪些字段(详见 classic 下一期)
BookComment.prototype.exclude = ['bookId', 'id']

BookComment.init(
  {
    content: Sequelize.STRING(12),
    nums: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    bookId: Sequelize.INTEGER,
    // 不能通过在这里通过定义一个自定义字段的方式来进行排除，这种写法会导致 Sequelize 直接报错
    // exclude: []
  },
  {
    sequelize,
    tableName: 'book_comment',
  }
)

module.exports = {
  BookComment,
}
