const Router = require('koa-router')
// const { HttpException } = require('../../../core/http-exception') 不需要每个文件导入，使用挂在全局的方式
const { HotBook } = require('@models/hot_book')
const { Book } = require('@models/book')
const {
  PositiveIntegerValidator,
  SearchValidator
} = require('../../validators/validator')
const router = new Router({ prefix: '/v1/book' })

router.get('/hot_list', async (ctx, next) => {
  const books = await HotBook.getAll()
  ctx.body = { books }
})

router.get('/:id/detail', async ctx => {
  const v = await new PositiveIntegerValidator().validate(ctx)
  const book = new Book(v.get('path.id'))
  ctx.body = await book.getDetail()
})

router.get('/search', async ctx => {
  const v = await new SearchValidator().validate(ctx)
  const result = await Book.searchFromYuShu(
    v.get('query.q'),
    v.get('query.start'),
    v.get('query.count')
  )
  ctx.body = {
    result
  }
})

router.post('/v1/book/:id/latest', async (ctx, next) => {
  const params = ctx.params //url里的参数 这里是 :id
  const querys = ctx.request.query //url里 ？ 后的参数
  const headers = ctx.request.header //放在请求头里的参数
  const bodys = ctx.request.body //post的参数
  // abc //测试未知异常
  const v = await new PositiveIntegerValidator().validate(ctx)
  const id = v.get('path.id', false)
  ctx.body = 'success'

  // if (true) {
  // 	//挂载到全局，如果 ParameterException 拼写错误，请求接口发生的错误难以排查
  // 	const error = new global.errs.ParameterException()
  // 	throw error
  // }
})

module.exports = router
