import i18n from '../i18n';

export const setLanguage = (locale) => {
  localStorage.setItem('language', locale)
  return i18n.changeLanguage(locale)
}
