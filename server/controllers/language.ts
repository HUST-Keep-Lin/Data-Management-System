/*
  切换语言接口的控制模块
*/

export {};

const dataDb = require('../db/index')

module.exports = {
  // 切换语言
  change: async (ctx: any) => {
    let {type} = ctx.query
    let data = await dataDb.get('languages').filter((item:any) => item.type == type)
    ctx.body = data
    console.log(data);
    console.log('切换语言为' + type);
  }
}