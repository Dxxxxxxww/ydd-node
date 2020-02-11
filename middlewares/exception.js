const { HttpException } = require('../core/http-exception')
const catchError = async (ctx, next) => {
	try {
		await next()
	} catch (error) {
		//解决已知异常
		if (error instanceof HttpException) {
			ctx.body = {
				msg: error.msg,
				request: `${ctx.method} ${ctx.path}`,
				error_code: error.errorCode
			}
			ctx.status = error.status
		} else {
			//解决未知异常
			ctx.body = {
				msg: 'we made mistake',
				request: `${ctx.method} ${ctx.path}`,
				error_code: 999
			}
			ctx.status = 500
		}
	}
	/*
    http status code
    message
    error_code 开发者自定义的
    request_url 当前请求的url
  */

	//已知型错误
	//已知 int string 类型
	//try catch
	//明确的

	//未知型错误
	//未知的，潜在的 无意识的，根本不知道它出错了
}

module.exports = catchError
