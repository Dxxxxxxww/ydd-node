const Router = require('koa-router')
// const bcrypt = require('bcryptjs')

const { RegisterValidator } = require('../../validators/validator')
const { User } = require('../../models/user')

const router = new Router({
	prefix: '/v1/user'
})

router.post('/register', async (ctx, next) => {
	//await求值，当前线程就卡在这里，不会往下走。好处在于如果 validate() 抛出异常了，由于是异步
	//代码仍然会往下走，难以排查问题。
	//我们需要当出现错误时，代码就不能往下走了，这就是同步编程的好处，易于调试。
	//起到 "守门员" 的作用
	const v = await new RegisterValidator().validate(ctx)
	// 不希望将这段代码写在api里，可以使用模型里的 set 方法
	// const salt = bcrypt.genSaltSync(10)
	// const pwd = bcrypt.hashSync(v.get('body.password2'), salt)

	const user = {
		nickname: v.get('body.nickname'),
		password: v.get('body.password2'),
		email: v.get('body.email')
	}
	const r = await User.create(user)
	throw new global.errs.Success()
})

module.exports = router
