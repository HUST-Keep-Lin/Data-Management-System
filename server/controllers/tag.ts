/*
  切换语言接口的控制模块
*/

export {};
import {DataType, TagsType} from '../type'
const dataDb = require('../db/index')
const { v4: uuidv4 } = require("uuid");

module.exports = {
  // 获取标签信息
  info: async (ctx:any) => {
    let data = await dataDb.get('tags')
    ctx.status = 200
    ctx.body = data
    console.log('获取标签数据');
  },
  //新增标签信息 判断原先是否存在此标签，存在就不添加
  add: async (ctx: any) => {
    let {name} = ctx.request.body
    const tagsData = await dataDb.get('tags').value()
    let index = tagsData.findIndex((tag: TagsType) => tag.name === name)
    //存在此标签，禁止添加
    if(index !== -1){
      ctx.status = 409
    }else{
      ctx.status = 200
      let newTag: TagsType = {name} as TagsType
      newTag["key"] = uuidv4().toString()
      await dataDb.get('tags').unshift(newTag).write()
    }
    ctx.body = await dataDb.get('tags')
  },
  //删除标签信息  需要判断infos是否有用到这个标签，如果有则不可删除
  delete: async(ctx: any) => {
    let {ID} = ctx.params
    const infosData = await dataDb.get('infos').value()
    const hasKeyInfo = infosData.some((info: DataType) => {
      return info.tags.some(tag => tag.key === ID)
    })
    console.log('是否包含有要删除的标签元素', hasKeyInfo);
    if(!hasKeyInfo){
      await dataDb.get('tags').remove({key:ID}).write()
      ctx.status = 200
    }else {
      ctx.status = 409
    }
    ctx.body = await dataDb.get('tags').value()
    console.log(`删除key=${ID}的标签数据`);
  },
  //修改标签信息 注意此时infos数据表中的标签要做相应的修改 done
  edit: async (ctx: any) => {
    let {ID} = ctx.params
    let {name} = ctx.request.body
    //需要修改tags数据表对应ID的tag的name
    await dataDb
      .get('tags')
      .find({key: ID})
      .assign({key: ID, name})
      .write()
    //同时也需要修改infos数据表中的使用了此ID的info done
    const infosData = dataDb.get('infos').value()
    const newInfosData = infosData.map((item: DataType) => {
      const updatedTags = item.tags.map(tag => {
        if(tag.key === ID){
          return {...tag, name}
        }
        return tag
      })
      return {...item, tags: updatedTags}
    })
    dataDb.set('infos', newInfosData).write()

    ctx.body = await dataDb.get('tags')
    ctx.status = 200
    console.log(`修改了key=${ID}的标签数据`);
  }
}