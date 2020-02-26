const { Rule, LinValidator } = require('../../core/lin-validator-v2')
const { User } = require('../models/user')
/**
 * 正整数验证器
 * 用于抛出参数异常
 */
class PositiveIntegerValidator extends LinValidator {
	constructor() {
		super()
		this.id = [new Rule('isInt', ': 需要输入正整数', { min: 1 })]
	}
}

/**
 * @description 注册验证器
 * 用于抛出参数异常
 */
class RegisterValidator extends LinValidator {
	constructor() {
		super()
		this.email = [new Rule('isEmail', ' Email格式不正确')]
		this.nickname = [
			new Rule('isLength', ' 昵称至少2个字符，最多8个字符', {
				min: 2,
				max: 8
			})
		]
		this.password1 = [
			new Rule('isLength', ' 密码至少6个字符，最多16个字符', {
				min: 6,
				max: 16
			}),
			new Rule(
				'matches',
				' 密码不符合规范',
				'^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]'
			)
		]
		this.password2 = this.password1
	}

	validatePassword(val) {
		const psw1 = val.body.password1,
			psw2 = val.body.password2
		if (psw1 !== psw2) {
			throw new Error('两次密码不一致')
		}
	}

	async validateEmail(val) {
		const email = val.body.email
		console.log('123123,', email)
		const user = await User.findOne({
			where: { email }
		})
		console.log('123456', user)
		if (user) {
			throw new Error('email已存在')
		}
	}
}

// web 端登录 账号+密码 account + password
// app 小程序登录，多元化
// 比如小程序 直接微信登录，因为微信已经把用户识别了，登录小程序的必然是一个合法用户
// 小程序登录 只需要获取 account
// 手机登录 (验证码)
/**
 * @description token 校验器
 */
class TokenValidator extends LinValidator {
  constructor() {
    super()
  }
}

module.exports = {
	PositiveIntegerValidator,
	RegisterValidator
}
