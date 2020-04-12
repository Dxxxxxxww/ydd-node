const Router = require('koa-router')
// const { HttpException } = require('../../../core/http-exception') 不需要每个文件导入，使用挂在全局的方式
const { HotBook } = require('@models/hot_book')
const { Book } = require('@models/book')
const { Favor } = require('@models/favor')
const { BookComment } = require('@models/book-comment')
const {
  PositiveIntegerValidator,
  SearchValidator,
  AddShortCommentValidator,
} = require('../../validators/validator')
const { Auth } = require('../../../middlewares/auth')
const { AuthLevel } = require('../../lib/enum')

const router = new Router({ prefix: '/v1/book' })
// 获取热门书籍列表
router.get('/hot_list', async (ctx, next) => {
  const books = await HotBook.getAll()
  ctx.body = books
})
// 获取书籍详细信息
router.get('/:id/detail', async (ctx) => {
  const v = await new PositiveIntegerValidator().validate(ctx)
  const book = new Book()
  ctx.body = await book.getDetail(v.get('path.id'))
})
// 搜索书籍
router.get('/search', async (ctx) => {
  const v = await new SearchValidator().validate(ctx)
  const result = await Book.searchFromYuShu(
    v.get('query.q'),
    v.get('query.start'),
    v.get('query.count')
  )
  ctx.body = result
})
// 获取喜欢的书籍数量
router.get('/favor/count', new Auth(AuthLevel.USER).m, async (ctx) => {
  const count = await Book.getMyFavorBookCount(ctx.auth.uid)
  ctx.body = {
    count,
  }
})
// 获取书籍点赞情况
router.get('/:bookId/favor', new Auth(AuthLevel.USER).m, async (ctx) => {
  // 使用 lin-validate 提供的别名
  const v = await new PositiveIntegerValidator().validate(ctx, {
    id: 'bookId',
  })
  const favor = await Favor.getBookFavor(ctx.auth.uid, v.get('path.bookId'))
  ctx.body = favor
})
// 新增短评
router.post('/add/shortComment', new Auth(AuthLevel.USER).m, async (ctx) => {
  const v = await new AddShortCommentValidator().validate(ctx, {
    id: 'bookId',
  })
  await BookComment.addComment(v.get('body.bookId'), v.get('body.content'))
  throw new global.errs.Success()
})
// 获取短评
router.get('/:bookId/shortComment', new Auth(AuthLevel.USER).m, async (ctx) => {
  const v = await new PositiveIntegerValidator().validate(ctx, {
    id: 'bookId',
  })
  // 这里通过 scope 的方式来在查询数据库的时候就不查这几个字段，也可以在 json 序列化的时候排除这几个字段
  // const comments = await BookComment.getComments(v.get('path.bookId'))
  // 由于 BookComment 定义了 toJSON 方法，这样查询到结果后，当 koa 隐式的进行 JSON 序列化的时候
  // 就会找到 对象上的 toJSON 方法，会对 toJSON 方法返回值进行序列化
  const book_id = v.get('path.bookId')
  const comments = await BookComment.getComments(book_id)
  ctx.body = {
    comments,
    book_id,
  }
})
// 模拟实现热搜，因为热搜(推荐)需要深度学习的技术,不在web服务开发的范畴
// 为何不能把用户的输入记下来，然后统计返回搜索次数最多的当做热搜？
// 可以这么做，但是如果只用搜索次数最多的，那么热搜几乎永远不会变化。
// 本身热搜搜索次数就多，那么人看到热搜又点进去搜索，那次数就更多了
// 这样的结果就是热门的东西越热门。
// 热搜算的应该是频率和趋势，而不是简单的累加
// 而且热搜很多时候也不是真的热搜，而是一个营销工具
// 热搜 = 需要算法参考 + 人工编辑
router.get('/hotKeyword', async (ctx) => {
  ctx.body = {
    hot: ['ECMAScript', 'TypeScript', 'Python', '哈利·波特', '韩寒', '金庸'],
  }
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
