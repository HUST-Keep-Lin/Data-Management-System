// 关于标签的接口
const router = require('@koa/router')()
const dataDb = require('../db/index')

const tag = require('../controllers/tag')


router
  //标签获取接口 done
  .get('/', tag.info)
  //标签添加接口 
  .post('/', tag.add)
  //标签删除接口
  .delete('/:ID', tag.delete)
  //标签编辑接口
  .put('/:ID', tag.edit)


export = router