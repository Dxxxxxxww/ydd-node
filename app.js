const Koa = require('koa')

const InitManager = require('./core/init')

const app = new Koa()
InitManager.initCore(app)


// router.get('/hello', (ctx, next) => {
//   ctx.body = { key: 'world' }
// })

// app.use(router.routes())

app.listen(3000)
