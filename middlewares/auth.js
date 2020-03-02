const basicAuth = require('basic-auth')
/**
 * @description 检测权限类，产生一个检测 token 的中间件，在其他中间件前使用，用来拦截 token 不合法请求。
 */
class Auth {
  constructor() {

  }

  get m() {
    return async (ctx, next) => {
      //token 检测
      const token = basicAuth(ctx.req)
      // console.log('ctx.req--->',ctx.req)
      ctx.body = token
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