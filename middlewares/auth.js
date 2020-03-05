const basicAuth = require('basic-auth')
const jwt = require('jsonwebtoken')
/**
 * @description 检测权限类，产生一个检测 token 的中间件，在其他中间件前使用，用来拦截 token 不合法请求。
 */
class Auth {
	constructor(level = 1) {
    this.level = level
		Auth.USER = 8
		Auth.ADMIN = 16
		Auth.SUPER_ADMIN = 32
	}

	get m() {
		return async (ctx, next) => {
			//token 检测
			const userToken = basicAuth(ctx.req)
			let errMsg = 'token不合法',
				decode = {}
			// console.log('ctx.req--->',ctx.req)
			if (!userToken || !userToken.name) {
				throw new global.errs.Forbidden(errMsg)
			}
			try {
				// jwt.verify() 用于验证 token
				decode = jwt.verify(userToken.name, global.config.security.secretKey)
			} catch (error) {
				// 判断 token 是否过期
				if (error.name == 'TokenExpiredError') {
					errMsg = 'token已过期'
				}
				throw new global.errs.Forbidden(errMsg)
      }
      
      if (decode.scope < this.level) {
        errMsg = '权限不足'
				throw new global.errs.Forbidden(errMsg)
      }
      

			ctx.auth = {
				uid: decode.uid,
				scope: decode.scope
			}

			await next()
			//koa 是对 node.js 的封装
			//ctx.req 是 node.js 原生 request 对象
			//ctx.request 是 koa 对 node.js 封装的 request 对象。

			//basicAuth 有一个加密和解密的过程，实际写的时候前端发起请求需要 base64 加密，服务端使用了 basic-auth 包进行解密
		}
	}
}

module.exports = {
	Auth
}
