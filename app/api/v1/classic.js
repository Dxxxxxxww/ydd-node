const Router = require('koa-router')

const { Auth } = require('../../../middlewares/auth')
const { AuthLevel } = require('../../lib/enum')
const { Flow } = require('../../models/flow')


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
	ctx.body = flow
})

module.exports = { router }
