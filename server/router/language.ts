const router = require('@koa/router')()
const language = require('../controllers/language')

router
  //语言查询接口：查询数据库中存储的设置
  .get('/', language.change)
  //语言切换接口：接收设置的信息，
  .post('/')

export = router