// node.js 提供的工具库
const util = require('util')
const axios = require('axios')

const { User } = require('../../models/user')
const { generateToken } = require('../../../core/util')
const { Auth } = require('../../../middlewares/auth')

const { loginUrl, appId, appSecret } = global.config.wx
class WXManager {
	/**
	 * @description 使用 code 来获取微信的 token
	 * @param {*} code  小程序端登录时生成的 code
	 */
	static async codeToToken(code) {
		const url = util.format(loginUrl, appId, appSecret, code)

    const res = await axios.get(url)
		if (res.status !== 200) {
			throw new global.errs.AuthFailed('openId获取失败')
		}
    const errcode = res.data.errcode
    const errmsg = res.data.errmsg
		if (errcode) {
			throw new global.errs.AuthFailed(`openId获取失败:${errmsg}`)
		}
		// 拿到 openid 之后，就需要在档案里建立 user 了。
		// 但不推荐使用 openid 作为 uid
		// 因为 openid 过长，查询效率低，而且 openid 是为机密，
		// 拿 openid 进行小程序与服务端进行传递 非常容易泄露。

		// 小程序登录时，需要查询 openid 是否在数据库里已经存在
		// 如果存在，则是 token 到期，重新发布 token 重新登录即可
		// 如果不存在，就是第一次登录，需要写入数据库中
		let user = await User.getUserByOpenid(res.data.openid)
		if (!user) {
			user = await User.registerByOpenid(res.data.openid)
		}
		return generateToken(user.id, Auth.USER)
	}
}

module.exports = {
	WXManager
}
