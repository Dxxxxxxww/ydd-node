//配合数据库驱动(mysql2)，用于在 js 中编写数据库,数据库的配置
const { Sequelize, Model } = require('sequelize')
const { unset, clone } = require('lodash')
const {
  dbName,
  host,
  port,
  user,
  password,
} = require('../config/config').database
const sequelize = new Sequelize(dbName, user, password, {
  dialect: 'mysql',
  host,
  port,
  loading: true,
  timezone: '+08:00',
  define: {
    timestamps: true, //生成 创建时间，更新时间字段，默认为 true
    paranoid: true, //生成 删除时间字段，默认为 false
    createAt: 'create_at',
    updateAt: 'update_at',
    deleteAt: 'delete_at',
    underscored: true, //将驼峰转为下划线连接
    freezeTableName: true,
    scopes: {
      bh: {
        attributes: {
          exclude: [
            'created_at',
            'updated_at',
            'deleted_at',
            'createdAt',
            'updatedAt',
            'deletedAt',
          ],
        },
      },
    },
  },
})
//这句调用必须有
sequelize.sync() //sequelize.sync({force:true}),严重不推荐，当想添加字段的时候，实质是删除旧表添加新表(新表中包含想要新增字段)
// 1.每个 model 类都要定义，太麻烦了 => 写在 Model 基类上
Model.prototype.toJSON = function () {
  // 通过拷贝的方式获取所有字段，不建议直接在原来的数据模型上删除
  let data = clone(this.dataValues)
  // 又或者改写 toJSON 方法, 循环判断如果是 image 属性,就拼接。但是这种是特殊化处理，预设条件
  // 是数据库存储的是不完整路径，但是书籍的图片是完整的路径，所以还得加强特殊，
  // 再增加判断，如果它有http就说明它是完整的路径，就不拼接(个人觉得好麻烦啊，还不如不用 toJSON，使用scope，虽说scope需要在每个api地方使用，也挺麻烦)
  for (const key in data) {
    if (key === 'image') {
      if (!data[key].startsWith('http')) {
        data[key] = global.config.host + data[key]
      }
    }
  }

  // unset(data, 'created_at')
  // unset(data, 'updated_at')
  // unset(data, 'deleted_at')
  // 这样写太单一了，需要改进，而且 toJSON 方法不能够接收参数，所以不能通过传参来指定排除字段
  // 所以可以挂载到 this 上，这样的话在 model 实例上直接添加一个 exclude 数组，里面写上想要排除的字段就好了
  // ['id', 'name']
  // 判断是否是数组
  if (Array.isArray(this.exclude)) {
    this.exclude.forEach((v) => {
      unset(data, v)
    })
  }
  return data
}

module.exports = {
  sequelize,
}
