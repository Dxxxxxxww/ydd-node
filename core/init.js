const requireDirectory = require('require-directory')
const Router = require('koa-router')

class InitManager {
	// 入口文件
	static initCore(app) {
		InitManager.app = app
		InitManager.initLoadRouters()
	}

	// 初始化路由
	static initLoadRouters() {
		const apiDirectory = `${process.cwd()}/app/api`
		const whenModulesLoad = function(obj) {
			if (obj instanceof Router) {
				InitManager.app.use(obj.routes())
			}
    }
    
		requireDirectory(module, apiDirectory, {
			visit: whenModulesLoad
		})
	}
}

module.exports = InitManager
