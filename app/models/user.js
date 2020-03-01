const bcrypt = require('bcryptjs')
//如果导出是 { sequelize } 则导入想改名形式为 { sequelize: db } 适用于 npm 包导入想改名，原理：解构赋值
//如果到出是{ db: sequelize }，则导入就为 db
const { sequelize } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')
/**
 * user 数据表
 */
class User extends Model {
	/**
	 * @description 验证密码是否正确
	 * @param {*} email 输入的 email
	 * @param {*} plainPassword 输入的密码
	 * @returns 数据项 Object
	 */
	static async verifyEmailPassword(email, plainPassword) {
		const user = await User.findOne({
			where: {
				email
			}
		})
		if (!user) {
			throw new global.errs.NotFound('账号不存在')
		}
		const correct = bcrypt.compareSync(plainPassword, user.password)
		if (!correct) {
			throw new global.errs.AuthFailed('密码不正确')
		}
		return user
	}
	/**
	 * @description 验证 email 是否已经存在
	 * @param {*} email 输入的 email
	 */
	static async isHaveEmail(email) {
		const user = await User.findOne({
			where: { email }
		})
		if (user) {
			throw new Error('email已存在')
		}
	}
}

User.init(
	{
		//主键  关系型数据库，不能重复，不能为空
		//使用自己设计：注册 User -> id 设计 -> id编号系统 600001 6000002
		//(建议为纯数字，数据库查询快，不推荐使用字符串，尤其不要使用随机字符串 GUID(很长，算法保证唯一)，一旦数据量大，查询慢)
		//如果是自己设计，并发问题->计算重复。如何递增问题->每次新用户注册需要去查找上一个用户ID 才能递增。
		//或者使用：自动增长id编号 1，2，3
		//容易暴露用户 id
		//见解：应该使用暴露用户编号来做一些攻击防范，而不是防止用户id暴露
		//即使别人知道用户id 也无法攻击 -> 接口保护 权限 token
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		nickname: Sequelize.STRING,
		email: {
			type: Sequelize.STRING(128),
			unique: true
		},
		password: {
			type: Sequelize.STRING,
			// 观察者模式
			// model 的属性操作，每个字段都有这个 set 函数
			set(val) {
				const salt = bcrypt.genSaltSync(10)
				const pwd = bcrypt.hashSync(val, salt)
				this.setDataValue('password', pwd)
			}
		},
		openid: {
			type: Sequelize.STRING(64),
			unique: true
		}

		//用户 小程序 openid 唯一且不变
		//对于 不同的小程序，用户的 openid 是不同的
		//用户A 小程序A openid1
		//用户A 小程序B openid2
		//对于小程序，公众号，用户有唯一且不变的标识   unionId
	},
	{
		sequelize,
		tableName: 'user'
	}
	//数据迁移 当表中已有大量数据时，得用 sql 更新，使用成本高，有风险
)

module.exports = { User }
