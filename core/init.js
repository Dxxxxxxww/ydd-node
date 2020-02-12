const requireDirectory = require('require-directory')
const Router = require('koa-router')

/**
 * 自动导入路由 类
 * */
class InitManager {
	// 入口文件
	static initCore(app) {
		InitManager.app = app
		InitManager.initLoadRouters()
		InitManager.loadHttpException()
	}

	// 初始化路由
	static initLoadRouters() {
		//process node.js里的全局变量
		//process.cwd() 可以找到绝对路径
		const apiDirectory = `${process.cwd()}/app/api`
		const whenModulesLoad = function(obj) {
			if (obj instanceof Router) { //book
				InitManager.app.use(obj.routes())
			} else {
				//兼容带有{}的导出路由  classic
				for (const key in obj) {
					if (obj[key] instanceof Router) {
						InitManager.app.use(obj[key].routes())
					}
				}
			}
		}

		requireDirectory(module, apiDirectory, {
			visit: whenModulesLoad
		})
	}

	static loadHttpException() {
		//挂载到全局的缺陷是一旦有拼写错误，极难查到错误
		const error = require('./http-exception')
		global.errs = error
	}
}

module.exports = InitManager
