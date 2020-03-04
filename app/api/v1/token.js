const Router = require('koa-router')
const { TokenValidator } = require('../../validators/validator')
const { LoginType } = require('../../lib/enum')
const { User } = require('../../models/user')
const { generateToken } = require('../../../core/util')
const { Auth } = require('../../../middlewares/auth')

const router = new Router({
	prefix: '/v1/token'
})

//传统网站，涉及到登录时，就会用到 session 有状态的
// session open -> 取数据 -> close
//现代 token 无状态
// token 一串无意义随机字符串
// jwt token 一串无意义随机字符串 + 可以携带数据
//不管用户如何登录，都转化为对令牌的获取 -> 令牌颁布
router.post('/', async ctx => {
	//编写接口的第一步是编写校验器
	const v = await new TokenValidator().validate(ctx)
	let token
	switch (v.get('body.type')) {
		case LoginType.USER_EMAIL:
			token = await emailLogin(v.get('body.account'), v.get('body.secret'))
			break
		case LoginType.USER_MINI_PROGRAM:
			break
		default:
			//最好在这里抛出一个异常
			throw new global.errs.ParameterException('没有相应的处理函数')
			break
	}
	ctx.body = {
		token
	}
})

async function emailLogin(account, secret) {
  const user = await User.verifyEmailPassword(account, secret)
  // 生成 token
	const token = generateToken(user.id, Auth.USER)
  return token
  // 权限是一个复杂的东西
  // 我们需要通过权限来限制 
}

module.exports = router
