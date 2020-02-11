let p1 = new Promise(function(resolve, reject) {
	resolve(42)
})
let p2 = new Promise(function(resolve, reject) {
	reject(43)
})
p1.then(function(value) {
	// 第一个完成处理函数
	console.log(value) // 42
	return p2
}).catch(function(value) {
	// 第二个完成处理函数
	console.log(value) // 永不被调用
})
