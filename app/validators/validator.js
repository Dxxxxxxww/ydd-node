const { Rule, LinValidator } = require('../../core/lin-validator-v2')
const { User } = require('../models/user')
const { LoginType, ArtType } = require('../lib/enum')
/**
 * 前端传递参数验证集合，用于验证参数传递的格式校验
 */

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
        max: 8,
      }),
    ]
    this.password1 = [
      new Rule('isLength', ' 密码至少6个字符，最多16个字符', {
        min: 6,
        max: 16,
      }),
      new Rule(
        'matches',
        ' 密码不符合规范',
        '^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]'
      ),
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
    //查询数据的写在 model 里比较好
    await User.isHaveEmail(email)
    // const user = await User.findOne({
    // 	where: { email }
    // })
    // if (user) {
    // 	throw new Error('email已存在')
    // }
  }
}
// web 端登录 账号+密码 account + password
// app 小程序登录，多元化
// 比如小程序 直接微信登录，因为微信已经把用户识别了，登录小程序的必然是一个合法用户
// 小程序登录 只需要获取 account
// 手机登录 (验证码)
// 如此多的登录方式，所以需要一个 type 字段
/**
 * @description token 校验器
 */
class TokenValidator extends LinValidator {
  constructor() {
    super()
    this.account = [
      new Rule('isLength', '不符合账号长度规则', { min: 6, max: 32 }),
    ]
    this.secret = [
      // lin-validate 的值，不是 validate 的。
      // 当字段被标记为 isOptional ，如果不传，则不校验，如果传值，就会根据后面的校验规则进行校验。
      new Rule('isOptional'),
      new Rule('isLength', '至少6个字符', { min: 6, max: 32 }),
    ]
  }
  //使用自定义函数校验 type 因为 登录type 是不同的，需要不同校验
  validateLoginType(val) {
    checkType(val, LoginType)
    // 抽离出来作为公共函数
    // if (!val.body.type) {
    // 	throw new Error('type是必传参数')
    // }
    // if (!LoginType.isThisType(val.body.type)) {
    // 	throw new Error('type参数不合法')
    // }
  }
}
/**
 * @description 验证token不为空的校验器
 */
class TokenNotEmptyValidator extends LinValidator {
  constructor() {
    super()
    this.token = [new Rule('isLength', 'token不允许为空', { min: 1 })]
  }
}
/**
 * @description 验证喜欢的 id 和 类型
 * 这里不需要校验 uid 因为可以从 token 中获取 uid
 * 如果从前端传，拿到 uid 具有较大的风险，用户可以修改(伪造) uid 去获取其他用户的信息
 */
class LikeValidator extends PositiveIntegerValidator {
  constructor() {
    super()
  }
  validateArtType(val) {
    checkType(val, ArtType)
  }
}
/**
 * @description 获取某一期刊的详细信息的校验器
 */
class ClassicValidator extends LikeValidator {
  validateArtType(val) {
    checkType(val, ArtType, 'path')
  }
  // const checker = new Checker(ArtType)
  // 使用 bind 改变 函数内 this 的指向。因为将函数赋给 this.validateArtType 后，函数的调用者是 lin-validator
  // 会报 this 指向错误
  // this.validateArtType = checker.check.bind(checker)
}
class SearchValidator extends LinValidator {
  constructor() {
    super()
    this.q = [new Rule('isLength', '搜索关键词不能为空', { min: 1, max: 16 })]
    this.start = [
      new Rule('isInt', 'start不符合规范', { min: 0, max: 60000 }),
      // lin-validate 的默认参数，如果前端不传 start 则默认为 0
      new Rule('isOptional', '', 0),
    ]
    this.count = [
      new Rule('isInt', 'count不符合规范', { min: 1, max: 20 }),
      new Rule('isOptional', '', 20),
    ]
  }
}
/**
 * @description 短评长度限制
 */
class AddShortCommentValidator extends PositiveIntegerValidator {
  constructor() {
    super()
    this.content = [
      new Rule('isLength', '必须在1到12个字符之间', {
        min: 1,
        max: 12,
      }),
    ]
  }
}

// 我采用的是传参的形式，还可以直接再写一个 checkType 函数，两个 checkType 一个是针对 login 的，另一个针对 Art 的。
function checkType(val, typ, position = 'body') {
  const type = val[position].type
  if (!type) {
    throw new Error('type是必传参数')
  }
  const intType = parseInt(type)
  if (!typ.isThisType(intType)) {
    throw new Error('type参数不合法')
  }
}

// 老师使用 class 方法，虽然他自己也认为针对这个问题这样写太麻烦了，他推荐用另写一个 checkType 函数
// 不过用类解决函数所局限的问题是一个很好的方向，在其他复杂业务中可以考虑使用类来解决
// 为什么用函数不能解决而类可以
// 因为函数不能保持变量(虽然js可以这么写但是不推荐)，函数被设计出来就是过程式的，是为了去干什么事，解决什么问题的
// 它本身不能保存状态。但是类可以

// class Checker {
// 	constructor(type) {
// 		this.enumType = type
// 	}

// 	check(vals) {
// 		let type = vals.body.type || vals.path.type
// 		if (!type) {
// 			throw new Error('type是必传参数')
// 		}
// 		type = parseInt(type)
// 		if (!this.enumType.isThisType(type)) {
// 			throw new Error('type参数不合法')
// 		}
// 	}
// }

module.exports = {
  PositiveIntegerValidator,
  RegisterValidator,
  TokenValidator,
  TokenNotEmptyValidator,
  LikeValidator,
  ClassicValidator,
  SearchValidator,
  AddShortCommentValidator,
}
