const router = require('@koa/router')()

// import info from './info'
import info from './info'
import tag from './tag'
import language from './language'

router
  .use('/infos', info.routes(), info.allowedMethods())
  .use('/tags', tag.routes(), tag.allowedMethods())
  .use('/language', language.routes(), language.allowedMethods())

export = router