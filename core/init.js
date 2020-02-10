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
    //process node.js里的全局变量
    //process.cwd() 可以找到绝对路径
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
