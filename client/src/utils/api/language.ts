import service from '..'

// 获取语言信息
export const getLanguage =  (languageType: string) => {
  return service({
    method: 'GET',
    url: `/language?type=${languageType}`,
  })
}

