const Router = require('koa-router')
// const { HttpException } = require('../../../core/http-exception')
const router = new Router()

router.post('/v1/:id/book/latest', (ctx, next) => {
	const params = ctx.params //url里的参数 这里是 :id
	const querys = ctx.request.query //url里 ？ 后的参数
	const headers = ctx.request.header //放在请求头里的参数
  const bodys = ctx.request.body //post的参数
  // abc //测试未知异常
	if (true) {
		//挂载到全局，如果 ParameterException 拼写错误，请求接口发生的错误难以排查
		const error = new global.errs.ParameterException()
		throw error
	}
})

module.exports = router
