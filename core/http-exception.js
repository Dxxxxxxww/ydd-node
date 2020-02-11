class HttpException extends Error {
	constructor(msg = '', errorCode = 10000, status = 200) {
		super()
		this.msg = msg
		this.errorCode = errorCode
		this.status = status
	}
}

module.exports = { HttpException }
