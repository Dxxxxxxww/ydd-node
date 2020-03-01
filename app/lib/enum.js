/**
 * @description 遍历查找用户传入的是否是我们需要的 type
 * @param {*} val type 值
 * @returns boolean
 */
function isThisType(val) {
  for (const key in this) {
    if (this[key] == val) {
      return true
    }
  }
  return false
}
// JS 模拟枚举，但不是真正的枚举，JS 难以实现真正的枚举（JS 对象无法实现枚举的一些特性）
const LoginType = {
	USER_MINI_PROGRAM: 100,
	USER_EMAIL: 101,
	USER_MOBILE: 102,
	ADMIN_EMAIL: 200,
	isThisType
}

module.exports = {
  LoginType
}