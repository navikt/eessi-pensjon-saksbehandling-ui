import 'core-js/stable'
import '@navikt/ds-css'
import { createRoot } from 'react-dom/client'
import { I18nextProvider } from 'react-i18next'
import { Provider } from 'react-redux'
import i18n from './i18n'

import store from './store'
import {pdfjs} from "react-pdf";
import App from "src/App";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

const container = document.getElementById('root') as HTMLElement
const root = createRoot(container)
root.render(
  <I18nextProvider i18n={i18n}>
    <Provider store={store}>
      <App/>
    </Provider>
  </I18nextProvider>
)
