/*
  数据模块接口的控制模块

*/

const dataDb = require("../db/index");
const { v4: uuidv4 } = require("uuid");

import { DataType } from "../type";

export = {
  //获取数据,包含查询参数
  info: async (ctx: any) => {
    let {name, tags, addTime} = ctx.query
    let data = await dataDb.get("infos")
    addTime = addTime.split(',')
    let start = new Date(addTime[0]).getTime()
    let end = new Date(addTime[1]).getTime() + 24 * 60 * 60 * 1000
    //如果传了name则过滤 需要对name进行处理
    if(name) {
      name = name.replace(/^\s+|\s+$/g, '') //去除首位空格
      data = await data.filter((item: DataType) => item.name.toLowerCase().indexOf(name.toLowerCase()) > -1)
    }
    //如果传递了tags参数，则过滤
    if(tags) {
      const tagsName = tags.split(',')
      data = data.filter((item: DataType) => tagsName.every((tagName:string) => item.tags.some(tag => tag.name === tagName)))
    }
    if(!Number.isNaN(start)){ 
      data = data.filter((item: DataType) => item.addTime >= start && item.addTime <= end)
    }
    ctx.status = 200;
    ctx.body = data;
    console.log("获取数据");
  },
  //新增一条数据
  updateInfo: async (ctx: any) => {
    let { name, describe, tags } = ctx.request.body;
    let newData: DataType = { name, describe, tags } as DataType;
    newData["key"] = uuidv4();
    newData["addTime"] = Date.now()
    await dataDb.get("infos").unshift(newData).write();
    ctx.status = 200;
    console.log("新增数据", newData);
  },
  //删除一条数据
  delete: async (ctx: any) => {
    let { ID } = ctx.params;
    await dataDb.get("infos").remove({ key: ID }).write();
    ctx.status = 200;
    console.log(`删除key=${ID}的那条数据`);
  },
  //修改数据
  edit: async (ctx: any) => {
    //得到ID以及更新的数据
    let { ID } = ctx.params;
    let { name, describe, tags, addTime } = ctx.request.body;
    //得到key=ID的数据并修改
    await dataDb
      .get("infos")
      .find({ key: ID })
      .assign({ key: ID, name, describe, tags, addTime })
      .write();
    ctx.status = 200;
    console.log(`修改key=${ID}的那条数据`);
  }
};
