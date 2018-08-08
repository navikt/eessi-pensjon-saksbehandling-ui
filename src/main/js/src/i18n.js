import i18next from 'i18next';
import Backend from 'i18next-xhr-backend';
import { reactI18nextModule } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18next
    .use(Backend)
    .use(LanguageDetector)
    .use(reactI18nextModule)
    .init({
        lng: 'nb',
        fallbackLng: 'nb',
        debug: true,
        ns: ['translation', 'ui', 'error', 'case', 'pdf', 'p4000'],
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
    }).loadLanguages(['nb','en']);

i18next.locale = 'nb';
export default i18next;
