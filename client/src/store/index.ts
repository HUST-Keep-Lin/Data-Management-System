//创建全局store对象并暴露
import { configureStore } from "@reduxjs/toolkit";
//引入reducer
import languageSlice from '../slice/language'

export const store = configureStore({
  reducer: {
    language: languageSlice
  }
})

//定义store的state类型
export type RootState = ReturnType<typeof store.getState>

//定义dispatch的类型
export type RootDispatch = typeof store.dispatch