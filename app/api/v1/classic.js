const Router = require('koa-router')

const { Auth } = require('../../../middlewares/auth')
const { AuthLevel } = require('../../lib/enum')
const { Flow } = require('@models/flow')
const { Art } = require('@models/art')
const { Favor } = require('@models/favor')
const {
	PositiveIntegerValidator,
	ClassicValidator
} = require('../../validators/validator')

const router = new Router({
	prefix: '/v1/classic'
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
		order: [['index', 'DESC']]
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

router.get('/:index/next', new Auth(AuthLevel.USER).m, async ctx => {
	const v = await new PositiveIntegerValidator().validate(ctx, {
		id: 'index'
	})
	const index = v.get('path.index')
	// 查询最好放在 model 中，这句足够简单就懒得拿出去了。但是如果逻辑复杂就一定要抽离出去
	const flow = await Flow.findOne({
		where: { index: index + 1 }
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

router.get('/:index/previous', new Auth(AuthLevel.USER).m, async ctx => {
	const v = await new PositiveIntegerValidator().validate(ctx, {
		id: 'index'
	})
	const index = v.get('path.index')
	// 查询最好放在 model 中，这句足够简单就懒得拿出去了。但是如果逻辑复杂就一定要抽离出去
	const flow = await Flow.findOne({
		where: { index: index - 1 }
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

router.get('/:type/:id/favor', new Auth(AuthLevel.USER).m, async ctx => {
  const v = await new ClassicValidator().validate(ctx)
  const id = v.get('path.id')
  const type = parseInt(v.get('path.type'))
  const art = await Art.getData(id, type)
  if (!art) {
    throw new global.errs.NotFound
  }
  const like = await Favor.userLikeIt(id, type, ctx.auth.uid)
  ctx.body = {
		favNums: art.fav_nums,
		likeStatus: like
	}
})

async function _mixArtData(artId, type, uid, index) {
	const art = await Art.getData(artId, type)
	art.setDataValue('index', index)
	const likeStatus = await Favor.userLikeIt(artId, type, uid)
	art.setDataValue('likeStatus', likeStatus)
	return art
}

module.exports = { router }
