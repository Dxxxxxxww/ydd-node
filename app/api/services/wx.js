// node.js 提供的帮助工具
const util = require('util')

class WXManager {
	static async codeToToken(code) {
		const { appId, appSecret, loginUrl } = global.config.wx
		const url = util.format(loginUrl, appId, appSecret, code)
	}
}
