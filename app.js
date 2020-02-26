const Koa = require('koa')
//一个返回中间件的函数 用于获取请求的 body 里的参数
const parser = require('koa-bodyparser')
const InitManager = require('./core/init')
const catchError = require('./middlewares/exception') //导入全局捕获异常中间件
// require('./app/models/user')

const app = new Koa()
// console.log('app-',app)
app.use(parser()) //调用后返回中间件
app.use(catchError) //当有中间件出现异常时会被捕获
InitManager.initCore(app)


// router.get('/hello', (ctx, next) => {
//   ctx.body = { key: 'world' }
// })

// app.use(router.routes())

app.listen(3000)
