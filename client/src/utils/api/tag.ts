import service from '..'
import { TagsType } from '../../type'

// 获取标签信息
export const getTags =  () => {
  return service({
    method: 'GET',
    url: '/tags',
  })
}
//修改标签信息
export const editTag = (value: TagsType) => {
  return service({
    method: 'PUT',
    url: `/tags/${value.key}`,
    data: value,
  })
}
//新增标签信息
export const addTag = (value: any) => {
  return service({
    method: 'POST',
    url: '/tags',
    data: value,
  })
}
//删除标签
export const deleteTag = (key: any) => {
  return service({
    method: 'DELETE',
    url: `/tags/${key}`,
  })
}
