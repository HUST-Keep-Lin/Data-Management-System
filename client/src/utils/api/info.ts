import service from '..'
import { DataType } from '../../type'

// 获取数据信息
export const getData =  (name: string, tags: string[], addTime: string[]) => {
  return service({
    method: 'GET',
    url: `/infos?name=${name}&tags=${tags}&addTime=${addTime}`,
  })
}
//删除key为key的数据
export const deleteData = (key: any) => {
  return service({
    method: 'DELETE',
    url: `/infos/${key}`,
  })
}
//新增数据
export const addData = (values:{})=> {
  return service({
    method: 'POST',
    url: '/infos',
    data: values,
  })
}
//修改数据
export const editData = (values: DataType)=> {
  return service({
    method: 'PUT',
    url: `/infos/${values.key}`,
    data: values,
  })
}
