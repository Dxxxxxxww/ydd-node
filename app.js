const Koa = require('koa')
//一个返回中间件的函数 用于获取请求的 body 里的参数
const parser = require('koa-bodyparser')
const InitManager = require('./core/init')

const app = new Koa()
app.use(parser()) //调用后返回中间件
InitManager.initCore(app)


// router.get('/hello', (ctx, next) => {
//   ctx.body = { key: 'world' }
// })

// app.use(router.routes())

app.listen(3000)
