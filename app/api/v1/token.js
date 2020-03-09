const Router = require('koa-router')

const { TokenValidator } = require('../../validators/validator')
const { LoginType } = require('../../lib/enum')
const { User } = require('../../models/user')
const { generateToken } = require('../../../core/util')
const { Auth } = require('../../../middlewares/auth')
const { WXManager } = require('../services/wx')

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
	// 1 在接口中编写业务逻辑 (不好)
	// 2 在 Model 里
	// MVC 写在 Model 里
	// 业务分层，对于小型项目可以写在 Model 里就行了。
	// 对于大型项目,可以在 Model 的基础上再分一层 Service，甚至还可以分层(视业务复杂度)
	let token
	switch (v.get('body.type')) {
		case LoginType.USER_EMAIL:
			token = await emailLogin(v.get('body.account'), v.get('body.secret'))
			break
		case LoginType.USER_MINI_PROGRAM:
			token = await WXManager.codeToToken(v.get('body.account'))
			break
		default:
			//最好在这里抛出一个异常
			throw new global.errs.ParameterException('没有相应的处理函数')
	}
	ctx.body = {
		token
	}
})

async function emailLogin(account, secret) {
	const user = await User.verifyEmailPassword(account, secret)
	// 生成 token。 但是有个问题，如果通过登录方式来限制权限级别，vip 这种的该怎么做(普通用户升级成 vip 了)
	// 要么就是更改权限的生成，要么 vip 体系通过另一套方案验证。
	const token = generateToken(user.id, Auth.USER)
	return token
	// 权限是一个复杂的东西
	// 权限是分角色的 某一些 api 只有某一些角色可以访问。 普通用户 管理员
}

async function miniProgramLogin(account, code) {}

module.exports = router
