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
        ns: ['ui', 'case', 'pdf', 'pinfo', 'pselv', 'p4000'],
        defaultNS: 'ui',
        backend: {
            loadPath: '/locales/{{lng}}/{{ns}}.json'
        },
        interpolation: {
            escapeValue: false
        },
        react: {
            wait: true,
            withRef: true,
            bindI18n: 'languageChange loaded',
            bindStore: 'added removed',
            nsMode: 'default'
        }
    }).loadLanguages(['nb','en-gb']);

i18next.locale = 'nb';
i18next.language = 'nb';
export default i18next;
