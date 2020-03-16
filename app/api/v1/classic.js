const Router = require('koa-router')

const { Auth } = require('../../../middlewares/auth')
const { AuthLevel } = require('../../lib/enum')
const { Flow } = require('../../models/flow')
const { Art } = require('../../models/art')

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
	const flow = await Flow.findOne({
		order: [['index', 'DESC']]
	})
	const art = await Art.getData(flow.art_id, flow.type)
	// 直接这样定义一个 index 属性是没有用的
	// 这里涉及到序列化的问题
	// 序列化是指把某一种语言的相关对象转换成 json
	// 这里的 art 不是普通的字面量对象，它是一个数据库查询结果的返回对象，可以打印查看 art 的解构
	// 这里只有 dataValues 里的字段会作为 json 返回回去
	// 这样写其实不太好，因为如果不看 art 数据结构源码是不知道要这样写的，这样写可以成功是因为 js 是一门动态语音
	// 可以使用 sequelize 的方法 setDataValue
	// art.dataValues.index = flow.index
	art.setDataValue('index', flow.index)
	ctx.body = art
})

module.exports = { router }
