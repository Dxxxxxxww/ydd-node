const Router = require('koa-router')
const router = new Router()

router.post('/v1/:id/book/latest', (ctx, next) => {
	const params = ctx.params //url里的参数 这里是 :id
	const querys = ctx.request.query //url里 ？ 后的参数
	const headers = ctx.request.header //放在请求头里的参数
	const bodys = ctx.request.body //post的参数
	ctx.body = {
		key: 'book'
	}
})

module.exports = router
