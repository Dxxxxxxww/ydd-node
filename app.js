require('module-alias/register')

const Koa = require('koa')
//一个返回中间件的函数 用于获取请求的 body 里的参数
const parser = require('koa-bodyparser')
const InitManager = require('./core/init')
const catchError = require('./middlewares/exception') //导入全局捕获异常中间件
const static = require('koa-static')
const path = require('path')
// require('./app/models/classic')
// require('./app/models/flow')

const app = new Koa()
// console.log('app-',app)
app.use(parser()) //调用后返回中间件
app.use(catchError) //当有中间件出现异常时会被捕获
// console.log(__dirname)
// 通过调用 static() 函数来返回一个中间件，参数是资源路径。
// path.join() node 内置方法，拼凑路径
// __dirname 项目目录绝对路径
// 因为数据库里存的路径是 images/xxx , 所以这里只需要拼接到 static 下就行
// 因为有 router 所以前端访问 api 可以访问到，但是如果直接访问图片路径是获取(图片)不到的，
// 需要将图片以流的形式在api中发送给前端,这样太麻烦了，现成的库直接使用路径访问就能获取到。
// 这里使用库来提供一种通过地址就能访问图片的形式，然后在 art model 里将 localhost 与 数据库存的地址 拼接成文正地址就可以在前端访问了
app.use(static(path.join(__dirname, './static')))
InitManager.initCore(app)

// router.get('/hello', (ctx, next) => {
//   ctx.body = { key: 'world' }
// })

// app.use(router.routes())

app.listen(8000)
