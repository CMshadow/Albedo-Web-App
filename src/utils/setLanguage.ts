import { TFunction } from 'i18next';
import i18n from '../i18n';
import { Locale } from '../store/types/locale'

interface ISetLanguage {
  (locale: Locale): Promise<TFunction>
}

export const setLanguage: ISetLanguage = (locale) => {
  localStorage.setItem('language', locale)
  return i18n.changeLanguage(locale)
}
