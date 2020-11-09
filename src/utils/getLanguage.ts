interface IgetLanguage {
  (): 'zh-CN' | 'en-US'
}

interface INavigator extends Navigator {
  userLanguage?: string
}

export const getLanguage: IgetLanguage = () => {
  const localLang = localStorage.getItem('language') || ''
  const navigator: INavigator = window.navigator
  const lang = navigator.language || navigator.userLanguage || '' // 常规浏览器语言和IE浏览器
  const unionLang = (localLang || lang).toLowerCase()
  let language: 'zh-CN' | 'en-US'
  if (unionLang === 'zh-cn' || unionLang === 'zh') {
    language = 'zh-CN'
  } else {
    language = 'en-US'
  }
  return language
}
