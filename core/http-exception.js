/** 定义各种异常类*/ 
class HttpException extends Error {
	constructor(msg = '', errorCode = 10000, status = 200) {
		super()
		this.msg = msg
		this.errorCode = errorCode
		this.status = status
	}
}

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
