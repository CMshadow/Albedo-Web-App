export const getLanguage = () => {
  let language = localStorage.getItem('language');
  const lang = navigator.language || navigator.userLanguage; // 常规浏览器语言和IE浏览器
  language = language || lang;
  language = language.toLowerCase();
  if (language === 'zh-cn' || language === 'zh') {
    language = 'zh-CN';
  } else {
    language = 'en-US';
  }
  return language;
}
