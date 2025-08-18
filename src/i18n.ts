import i18n from 'i18next'
import Backend from 'i18next-http-backend'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: 'nb',
    fallbackLng: {
      default: ['nb']
    },
    debug: false,
    ns: ['buc', 'message', 'p2000', 'p4000', 'p5000', 'p8000', 'ui', 'validation'],
    defaultNS: 'ui',
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json'
    },
    interpolation: {
      escapeValue: false
    },
    react: {
      bindI18n: 'languageChange loaded',
      nsMode: 'default'
    }
  }, (err) => {
    if (err) return console.log('Loading i18n error', err)
    i18n.changeLanguage('nb')
  })

i18n.loadLanguages(['nb', 'en'], () => {})
i18n.language = 'nb'
document.documentElement.lang = 'nb'
export default i18n
