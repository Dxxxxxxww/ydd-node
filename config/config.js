/**
 * 配置文件
 */
module.exports = {
	environment: 'dev', //'prod'
	//数据库配置
	database: {
		dbName: 'ydd-node',
		host: 'localhost',
		port: 3306,
		user: 'root',
		password: 'qwerd123'
  },
  security: {
    secretKey: 'dxxyttxixuxixixu',//通常情况下这个key要复杂且无规律，否则token易被破解
    expiresIn:60*60*24,//令牌过期时间，这里是一天，真实项目不要这么长时间，2h左右。
  }
}