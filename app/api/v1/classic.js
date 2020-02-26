const Router = require('koa-router')
const router = new Router()

router.get('/v1/classic/latest', (ctx, next) => {
  //服务端渲染
	const html = `
      <h1>koa2 request post demo</h1>
      <form method="POST" action="/">
        用户名:<input name="name" /><br/>
        年龄:<input name="age" /><br/>
        邮箱: <input name="email" /><br/>
        <button type="submit">submit</button>
      </form>
    `
	ctx.body = html
	// ctx.body = {
	// 	key: 'classic'
	// }
})

module.exports = { router }
