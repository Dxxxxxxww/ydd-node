const Koa = require('koa')
const Router = require('koa-router')

const app = new Koa()
const router = new Router()

router.get('/hello', (ctx, next) => {
  ctx.body = { key: 'world' }
})

app.use(router.routes())

/* 
  app.use(async (ctx, next) => {
    const a = await next()
  })

  app.use(async (ctx, next) => {
  const axios = require('axios')
  const start = Date.now()
  //await 求值关键字， 1.对 promise 对象求值 普通表达式直接返回。 2.阻塞当前线程
  const res = await axios.get('http://7yue.pro')
  const end = Date.now()
  console.log(end - start)
  return 'yd'
})
 */
app.listen(3000)
