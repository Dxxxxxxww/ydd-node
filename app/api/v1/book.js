const Router = require('koa-router')
// const { HttpException } = require('../../../core/http-exception') 不需要每个文件导入，使用挂在全局的方式
const { HotBook } = require('@models/hot_book')
const { Book } = require('@models/book')
const { Favor } = require('@models/favor')
const {
  PositiveIntegerValidator,
  SearchValidator,
} = require('../../validators/validator')
const { Auth } = require('../../../middlewares/auth')
const { AuthLevel } = require('../../lib/enum')

const router = new Router({ prefix: '/v1/book' })

router.get('/hot_list', async (ctx, next) => {
  const books = await HotBook.getAll()
  ctx.body = { books }
})

router.get('/:id/detail', async (ctx) => {
  const v = await new PositiveIntegerValidator().validate(ctx)
  const book = new Book(v.get('path.id'))
  ctx.body = await book.getDetail()
})

router.get('/search', async (ctx) => {
  const v = await new SearchValidator().validate(ctx)
  const result = await Book.searchFromYuShu(
    v.get('query.q'),
    v.get('query.start'),
    v.get('query.count')
  )
  ctx.body = {
    result,
  }
})
// 获取喜欢的书籍数量
router.get('/favor/count', new Auth(AuthLevel.USER).m, async (ctx) => {
  const count = await Book.getMyFavorBookCount(ctx.auth.uid)
  ctx.body = {
    count,
  }
})
// 获取书籍点赞情况
router.get('/:book_id/favor', new Auth(AuthLevel.USER).m, async (ctx) => {
  // 使用 lin-validate 提供的别名
  const v = await new PositiveIntegerValidator().validate(ctx, {
    id: 'book_id',
  })
  const favor = await Favor.getBookFavor(ctx.auth.uid, v.get('path.book_id'))
  ctx.body = favor
})

router.post('/:id/latest', async (ctx, next) => {
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
