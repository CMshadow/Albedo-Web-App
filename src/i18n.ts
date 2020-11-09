import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { getLanguage } from './utils/getLanguage'
import CNindex from './locales/zhCNIndex'
import USindex from './locales/enUSIndex'

const resources = {
  'zh-CN': {
    translation: {
      ...CNindex,
    },
  },
  'en-US': {
    translation: {
      ...USindex,
    },
  },
}

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: getLanguage(),

    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  })

export default i18n
