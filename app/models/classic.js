const { Sequelize, Model } = require('sequelize')
const { sequelize } = require('../../core/db')

const classicFields = {
  image: Sequelize.STRING,
  content: Sequelize.STRING,
  pubdate: Sequelize.STRING,
  fav_nums: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  type: Sequelize.STRING
}
/**
 * @description Movie 数据表
 */
class Movie extends Model {}
Movie.init(classicFields, {
  sequelize,
  tableName: 'movie'
})
/**
 * @description Sentence 数据表
 */
class Sentence extends Model {}
Sentence.init(classicFields, {
  sequelize,
  tableName: 'sentence'
})
/**
 * @description Music 数据表
 */
class Music extends Model {}
Music.init(
  { ...classicFields, url: Sequelize.STRING },
  {
    sequelize,
    tableName: 'music'
  }
)

module.exports = {
  Movie,
  Sentence,
  Music
}
