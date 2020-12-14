import { TFunction } from 'i18next'
import { Locale } from '../@types'
import i18n from '../i18n'

interface ISetLanguage {
  (locale: Locale): Promise<TFunction>
}

export const setLanguage: ISetLanguage = locale => {
  localStorage.setItem('language', locale)
  return i18n.changeLanguage(locale)
}
