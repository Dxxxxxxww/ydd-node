/** 定义各种已知异常类*/

/**
 *  C<->S 客户端与服务器之间通信异常类
 */
class HttpException extends Error {
	constructor(msg = '', errorCode = 10000, status = 200) {
		super()
		this.msg = msg
		this.errorCode = errorCode
		this.status = status
	}
}

/**
 * 参数异常类，继承于通信异常类
 */
class ParameterException extends HttpException {
	constructor(msg = '参数异常', errorCode = 10001) {
		super()
		this.msg = msg
		this.errorCode = errorCode
		this.status = 400
	}
}

module.exports = {
	HttpException,
	ParameterException
}
