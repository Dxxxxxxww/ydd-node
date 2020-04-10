const Router = require('koa-router')

const { Auth } = require('../../../middlewares/auth')
const { AuthLevel } = require('../../lib/enum')
const { Flow } = require('@models/flow')
const { Art } = require('@models/art')
const { Favor } = require('@models/favor')
const {
  PositiveIntegerValidator,
  ClassicValidator,
} = require('../../validators/validator')

const router = new Router({
  prefix: '/v1/classic',
})

// koa router 上可以使用多个中间件，但是顺序一定要做好。
// 这里的 new Auth().m m 是 get 修饰的属性，不是方法，所以不需要加 ()。
// js 里的 getter 是获取属性，setter 是设置属性。
router.get('/latest', new Auth(AuthLevel.USER).m, async (ctx, next) => {
  //服务端渲染
  // const html = `
  //     <h1>koa2 request post demo</h1>
  //     <form method="POST" action="/">
  //       用户名:<input name="name" /><br/>
  //       年龄:<input name="age" /><br/>
  //       邮箱: <input name="email" /><br/>
  //       <button type="submit">submit</button>
  //     </form>
  //   `
  // ctx.body = html
  // ctx.body = {
  // 	key: 'classic'
  // }

  // 可以在 attributes 属性，数组值，attributes: ['a','b'] 来查找想要的指定字段
  // 也可以通过 attributes: {exclude:['a','b']} 来排除指定字段
  // 但是这样每一个查询都要添加，太麻烦
  // 所以使用 sequelize 的 scope 直接在模型上定义，排除指定字段 (scope 可以理解为预先定义好的sql)
  // 但是这样每一个模型也都需要配置 scope。所以使用全局定义 scope。(在 sequelize 实例上定义)
  const flow = await Flow.findOne({
    order: [['index', 'DESC']],
  })
  // 直接这样定义一个 index 属性是没有用的
  // 这里涉及到序列化的问题
  // 序列化是指把某一种语言的相关对象转换成 json
  // 这里的 art 不是普通的字面量对象，它是一个数据库查询结果的返回对象，可以打印查看 art 的解构
  // 这里只有 dataValues 里的字段会作为 json 返回回去
  // 这样写其实不太好，因为如果不看 art 数据结构源码是不知道要这样写的，这样写可以成功是因为 js 是一门动态语音
  // 可以使用 sequelize 的方法 setDataValue
  // art.dataValues.index = flow.index

  const art = await _mixArtData(
    flow.art_id,
    flow.type,
    ctx.auth.uid,
    flow.index
  )
  ctx.body = art
})

router.get('/:index/next', new Auth(AuthLevel.USER).m, async (ctx) => {
  const v = await new PositiveIntegerValidator().validate(ctx, {
    id: 'index',
  })
  const index = v.get('path.index')
  // 查询最好放在 model 中，这句足够简单就懒得拿出去了。但是如果逻辑复杂就一定要抽离出去
  const flow = await Flow.findOne({
    where: { index: index + 1 },
  })
  if (!flow) {
    throw new global.errs.NotFound()
  }
  const art = await _mixArtData(
    flow.art_id,
    flow.type,
    ctx.auth.uid,
    flow.index
  )
  // 如果不使用 scope ，可以通过在 Model 基类上定义的 toJSON 方法来定义一个 exclude 属性数组，排除不想要的字段
  // 如果实例本身就是一个集合，处理方式参见 book-comment.js 直接将此属性定义在原型上
  // art.exclude = ['index', 'likeStatus']
  ctx.body = art
})

router.get('/:index/previous', new Auth(AuthLevel.USER).m, async (ctx) => {
  const v = await new PositiveIntegerValidator().validate(ctx, {
    id: 'index',
  })
  const index = v.get('path.index')
  // 查询最好放在 model 中，这句足够简单就懒得拿出去了。但是如果逻辑复杂就一定要抽离出去
  const flow = await Flow.findOne({
    where: { index: index - 1 },
  })
  if (!flow) {
    throw new global.errs.NotFound()
  }
  const art = await _mixArtData(
    flow.art_id,
    flow.type,
    ctx.auth.uid,
    flow.index
  )
  ctx.body = art
})
/**
 * @description 获取期刊详细信息
 * 这里的逻辑与下面的相似，但是也不建议抽离出来，抽离成函数建议3次重复再抽离。
 * 而且这里函数的逻辑比较复杂，也不好抽离。
 * 这里展示一下类方法的抽离，但是没啥必要
 */
router.get('/:type/:id', new Auth(AuthLevel.USER).m, async (ctx) => {
  const v = await new ClassicValidator().validate(ctx)
  const id = v.get('path.id')
  const type = parseInt(v.get('path.type'))

  /**
   * 如果一个类下面都是静态方法，那么这个类的意义其实是不太大的，但是不代表是没意义的。因为即便是纯静态类，
   * 它也是把一些方法聚集到类的内部，这也是有意义的。
   *
   * 如果说项目比较简单，或者业务比较简单，使用实例方法就会相对麻烦，感觉没有意义(指使用 getDetail 方法)。
   * 静态方法更加符合我们的思维，因为静态方法是面向过程的，不是面向对象的。纯静态的类实际上还是面向过程的。
   *
   * 面向过程的思维方式是人类正常的思考问题的方式。
   * 这里使用 art 的实例方法显示不出来优势在哪，这是因为 art 类还是偏简单了。在业务更复杂的情况下，实例方法
   * 的优势就能体现出来了。
   *
   * 举一个例子：假如说一个类下面的方法有几十个，如果这几十个方法都是静态方法，那么传参(传很多参数，或者重复传参)就是一件很痛苦的事情。
   * 但是如果使用实例方法，很多描述类特征的参数就可以传入类属性，保存在实例的属性上，这样就避免了静态方法那样
   * 需要传递大量参数。静态方法不太具有复用性，因为是面向过程。但是实例方法是具有复用性的，我们可以在各个实例方法
   * 中复用对象的特征参数(属性)
   */
  // 有了实例方法后这个文件里的很多写法都可以用实例方法替代了
  const art = await new Art(id, type).getDetail(ctx.auth.uid)
  // 这里不合并写是因为 like 和 art 本身是不同种，不同表的数据，不太建议合并。
  art.artDetail.setDataValue('likeStatus', art.likeStatus)
  ctx.body = art.artDetail

  // const art = await Art.getData(id, type)
  // if (!art) {
  //   throw new global.errs.NotFound()
  // }
  // const like = await Favor.userLikeIt(id, type, ctx.auth.uid)
  // ctx.body = {
  //   favNums: art.fav_nums,
  //   likeStatus: like
  // }
})
/**
 * @description 获取期刊点赞信息
 */
router.get('/:type/:id/favor', new Auth(AuthLevel.USER).m, async (ctx) => {
  const v = await new ClassicValidator().validate(ctx)
  const id = v.get('path.id')
  const type = parseInt(v.get('path.type'))
  // const art = await Art.getData(id, type)
  // if (!art) {
  //   throw new global.errs.NotFound()
  // }
  // const like = await Favor.userLikeIt(id, type, ctx.auth.uid)
  const art = await new Art(id, type).getDetail(ctx.auth.uid)
  ctx.body = {
    favNums: art.artDetail.fav_nums,
    likeStatus: art.likeStatus,
  }
})
/**
 * @description 获取用户喜欢的所有期刊
 */
router.get('/favor', new Auth(AuthLevel.USER).m, async (ctx) => {
  const arts = await Favor.getMyClassicFavors(ctx.auth.uid)
  ctx.body = arts
})

async function _mixArtData(artId, type, uid, index) {
  const art = await Art.getData(artId, type)
  art.setDataValue('index', index)
  const likeStatus = await Favor.userLikeIt(artId, type, uid)
  art.setDataValue('likeStatus', likeStatus)
  return art
}

module.exports = { router }
