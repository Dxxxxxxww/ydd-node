const Router = require('koa-router')
const router = new Router()

//传统网站，涉及到登录时，就会用到 session 有状态的
// session open -> 取数据 -> close
//现代 token 无状态
// token 一串无意义随机字符串
// jwt token 一串无意义随机字符串 + 可以携带数据
//不管用户如何登录，都转化为对令牌的获取 -> 令牌颁布
router.post('/', async ctx => {
	//编写接口的第一步是编写校验器
})