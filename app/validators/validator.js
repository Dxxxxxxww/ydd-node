const { Rule, LinValidator } = require('../../core/lin-validator')

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
}

module.exports = {
	PositiveIntegerValidator,
	RegisterValidator
}
