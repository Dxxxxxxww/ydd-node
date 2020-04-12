const { Sequelize, Model } = require('sequelize')
const { sequelize } = require('../../core/db')

const classicFields = {
  image: {
    type: Sequelize.STRING,
    // get() {
    // 这样写完之后，在需要的地方通过 .get('image')  .image 都能获取到拼接后的数据
    // 想要获取未拼接的数据可以使用 .getDataValue('image')
    // 但是这样会和 Model 基类 上的自定义 toJSON 方法冲突，如果Model 基类 上自定义了 toJSON 方法，
    // 因为 我们 toJSON 上使用的是 this.dataValues ， dataValues 不受 get set 影响，
    // 它存储的永远是原始的数据
    // 如果我们不自定义 toJSON 方法(而是使用scope的方式)，这种方式就可以了。

    // 又或者改写 toJSON 方法, 循环判断如果是 image 属性,就拼接。但是这种是特殊化处理，预设条件
    // 是数据库存储的是不完整路径，但是书籍的图片是完整的路径，所以还得加强特殊，
    // 再增加判断，如果它有http就说明它是完整的路径，就不拼接(个人觉得好麻烦啊，还不如不用 toJSON，使用scope，虽说scope需要在每个api地方使用，也挺麻烦)
    // 不太推荐在 art 里面改，因为要改多个地方，麻烦
    // sequelize 提供的钩子没有查询时的钩子，否则可以在钩子里对数据进行拼接
    // 这就展示了真实编程里的思维过程，每个实现方法的对比，从中挑选出较好的来实现
    // return global.config.host + this.getDataValue('image')
    // },
  },
  content: Sequelize.STRING,
  pubdate: Sequelize.STRING,
  fav_nums: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
  type: Sequelize.STRING,
}
/**
 * @description Movie 数据表
 */
class Movie extends Model {}
Movie.init(classicFields, {
  sequelize,
  tableName: 'movie',
})
/**
 * @description Sentence 数据表
 */
class Sentence extends Model {}
Sentence.init(classicFields, {
  sequelize,
  tableName: 'sentence',
})
/**
 * @description Music 数据表
 */
class Music extends Model {}
Music.init(
  { ...classicFields, url: Sequelize.STRING },
  {
    sequelize,
    tableName: 'music',
  }
)

module.exports = {
  Movie,
  Sentence,
  Music,
}
