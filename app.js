const Koa = require('koa')
const requireDirectory = require('require-directory')
const Router = require('koa-router')

const app = new Koa()

requireDirectory(module,'/api', {
  visit: whenModulesLoad
})

const whenModulesLoad = function (obj) {
  if (obj instanceof Router) {
    app.use(obj.routes())
  }
}

// router.get('/hello', (ctx, next) => {
//   ctx.body = { key: 'world' }
// })

// app.use(router.routes())

app.listen(3000)
