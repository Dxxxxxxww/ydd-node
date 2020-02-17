const requireDirectory = require('require-directory')
const Router = require('koa-router')

/**
 * 初始化类
 * */
class InitManager {
	/**
	 * 入口
	 *  */
	static initCore(app) {
		InitManager.app = app
		InitManager.initLoadRouters()
		InitManager.loadHttpException()
		InitManager.loadConfig()
	}

	/**
	 * 初始化配置
	 */
	static loadConfig(path = '') {
    const configPath = path || `${process.cwd()}/config/config`
    const config = require(configPath)
    global.config = config
	}

	/**
	 * 初始化路由
	 *  */
	static initLoadRouters() {
		//process node.js里的全局变量
		//process.cwd() 可以找到绝对路径
		const apiDirectory = `${process.cwd()}/app/api`
		const whenModulesLoad = function(obj) {
			if (obj instanceof Router) {
				//book
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
		//通过 requireDirectory 可以找到所有的路由，不用精确到每一个文件
		requireDirectory(module, apiDirectory, {
			visit: whenModulesLoad
		})
	}

	/**
	 * 初始化异常
	 *  */
	static loadHttpException() {
		//挂载到全局的缺陷是一旦有拼写错误，极难查到错误
		const error = require(`${process.cwd()}/core/http-exception`)
		global.errs = error
	}
}

module.exports = InitManager
