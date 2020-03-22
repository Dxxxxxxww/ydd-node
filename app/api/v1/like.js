const Router = require('koa-router')

const { Auth } = require('../../../middlewares/auth')
const { AuthLevel } = require('../../lib/enum')
const { LikeValidator } = require('../../validators/validator')
const { Favor } = require('../../models/favor')

const router = new Router({
	prefix: '/v1/like'
})

router.post('/', new Auth(AuthLevel.USER).m, async ctx => {
	// 第一步，参数校验
	const v = await new LikeValidator().validate(ctx, { id: 'art_id' })
	// 这里不需要校验 uid 因为可以从 token 中获取 uid
	// 如果从前端传，拿到 uid 具有较大的风险，用户可以修改(伪造) uid 去获取其他用户的信息 尤其是支付，金融功能
	// 这不是权限问题。因为如果 A用户 通过修改 uid 拿到 B用户的 uid 的时候， A,B都有权限的，A拥有自己的令牌token
	// 如果 A 在没有令牌的情况下拿到了 B 的 uid 这是一个权限问题
	await Favor.like(v.get('body.art_id'), v.get('body.type'), ctx.auth.uid)
	throw new global.errs.Success()
})

router.post('/cancel', new Auth(AuthLevel.USER).m, async ctx => {
	// 第一步，参数校验
	const v = await new LikeValidator().validate(ctx, { id: 'art_id' })
	// 这里不需要校验 uid 因为可以从 token 中获取 uid
	// 如果从前端传，拿到 uid 具有较大的风险，用户可以修改(伪造) uid 去获取其他用户的信息 尤其是支付，金融功能
	// 这不是权限问题。因为如果 A用户 通过修改 uid 拿到 B用户的 uid 的时候， A,B都有权限的，A拥有自己的令牌token
	// 如果 A 在没有令牌的情况下拿到了 B 的 uid 这是一个权限问题
	await Favor.dislike(v.get('body.art_id'), v.get('body.type'), ctx.auth.uid)
	throw new global.errs.Success()
})

module.exports = router
