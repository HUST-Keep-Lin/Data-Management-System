const router = require('@koa/router')()

const info = require('../controllers/info')

router
  .get('/', info.info)   //获取信息 查询信息  完成 done
  .post('/', info.updateInfo)   //新增一条数据,unshift到最前面 done
  .delete('/:ID', info.delete)   //删除某一条数据 done
  .put('/:ID', info.edit)   //修改ID为ID的数据 done

 export = router