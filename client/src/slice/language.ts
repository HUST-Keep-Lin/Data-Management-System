import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { getLanguage } from "../utils/api/language";

//初始值 默认中文
const initialState = {
  type: 'zh-CN',
  content:{
    theme: "数据管理平台",
    set: "设置",
    nav: ["数据管理", "标签管理"],
    id: "编号",
    name: "名称",
    desc: "描述",
    time: "添加时间",
    tags: "标签",
    action: "操作",
    btns: ["搜索", "重置", "添加", "编辑", "删除"],
  }
};
/*
创建异步的任务并导出  createAsyncThunk函数可以帮助我们更方便地创建带有异步操作的 action，
并将异步操作的结果作为 action 的 payload 返回
*/

export const getDataAsync = createAsyncThunk(
  'language/fetchLanguage',
  async (languageType: string) => {
    const res = await getLanguage(languageType)
    return res.data  
    // The value we return becomes the `fulfilled` action payload
  }
);

//创建language分片
const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDataAsync.pending, state => {
        //异步等待
        console.log('pending');
      })
      .addCase(getDataAsync.fulfilled, (state, action) => {
        console.log('fulfilled');
        console.log('222', action.payload[0]);
        // important 只有这种方法可以导致state的改变
        return {
          ...state,
          type: action.payload[0].type,
          content: action.payload[0].content
        }
      })
      .addCase(getDataAsync.rejected, state => {
        console.log('rejected');
      })
}
})

console.log('111', languageSlice.actions);
export default languageSlice.reducer
