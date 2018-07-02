import i18next from 'i18next';
import Backend from 'i18next-xhr-backend';
import { reactI18nextModule} from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18next
  .use(Backend)
  .use(LanguageDetector)
  .use(reactI18nextModule)
  .init({
    lng: 'en',
    fallbackLng: 'en',
    debug: true,
    ns: ['translation'],
    defaultNs: 'translation',
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json'
    },
    interpolation: {
      escapeValue: false
    },
    react: {
      wait: true,
      withRef: false,
      bindI18n: 'languageChange loaded',
      bindStore: 'added removed',
      nsMode: 'default'
    }
  }).loadLanguages(['nb','nn','en']);

export default i18next;
