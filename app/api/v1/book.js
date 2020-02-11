const Router = require('koa-router')
const { HttpException } = require('../../../core/http-exception')
const router = new Router()

router.post('/v1/:id/book/latest', (ctx, next) => {
	const params = ctx.params //url里的参数 这里是 :id
	const querys = ctx.request.query //url里 ？ 后的参数
	const headers = ctx.request.header //放在请求头里的参数
	const bodys = ctx.request.body //post的参数
	if (true) {
		const error = new HttpException('这里出了错误', 10001, 400)
		throw error
	}
})

module.exports = router
