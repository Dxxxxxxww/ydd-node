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
 * @description 请求成功
 */
class Success extends HttpException {
  constructor(msg = '成功', errorCode = 0) {
    super()
    this.msg = msg
    this.errorCode = errorCode
    this.status = 201
  }
}
/**
 * @description 参数异常类，继承于通信异常类
 */
class ParameterException extends HttpException {
	constructor(msg = '参数异常', errorCode = 10001) {
		super()
		this.msg = msg
		this.errorCode = errorCode
		this.status = 400
	}
}
/**
 * @description 资源未找到异常
 */
class NotFound extends HttpException {
  constructor(msg = '资源未找到', errorCode = 10002) {
    super()
    this.msg = msg
    this.errorCode = errorCode
    this.status = 404
  }
}
/**
 * @description 密码不正确
 */
class AuthFailed extends HttpException {
  constructor(msg = '授权失败', errorCode = 10003) {
    super()
    this.msg = msg
    this.errorCode = errorCode
    this.status = 401
  }
}

class Forbidden extends HttpException {
  constructor(msg= '禁止访问', errorCode = 10004) {
    super()
    this.msg = msg
    this.errorCode = errorCode
    this.status= 403
  }
}

module.exports = {
	HttpException,
	Success,
	ParameterException,
	NotFound,
	AuthFailed,
	Forbidden
}
