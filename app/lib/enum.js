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
// 权限级别，用于判断用户是否有权限
const AuthLevel = {
	USER: 8,
	USER_VIP: 9,
	USER_SVIP: 10,
	ADMIN: 16,
	SUPER_ADMIN: 32
}

const ArtType = {
	MOVIE: 100,
	MUSIC: 200,
	SENTENCE: 300,
	BOOK: 400,
	isThisType
}

module.exports = {
	LoginType,
  AuthLevel,
  ArtType
}
