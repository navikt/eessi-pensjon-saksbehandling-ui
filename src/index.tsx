
import RequireAuth from 'src/components/RequireAuth/RequireAuth'
import { IS_PRODUCTION } from 'src/constants/environment'
import 'core-js/stable'
import * as Amplitude from 'src/metrics/amplitude'
import * as Sentry from 'src/metrics/sentry'
import 'moment'
import 'moment/locale/en-gb'
import 'moment/locale/nb'
import '@navikt/ds-css'
import Pages from 'src/pages'
import { Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { I18nextProvider } from 'react-i18next'
import { Provider } from 'react-redux'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import 'regenerator-runtime/runtime'
// @ts-ignore
import { unregister } from 'src/registerServiceWorker'
import i18n from './i18n'

import store from './store'
import {GJENNY, PESYS} from "./constants/constants";
import {pdfjs} from "react-pdf";


if (!IS_PRODUCTION) {

  /* const axe = require('@axe-core/react')
  axe(React, ReactDOM, 1000, {}) */

} else {
  Sentry.init()
  Amplitude.init()
}

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

const container = document.getElementById('root') as HTMLElement
const root = createRoot(container)
root.render(
  <I18nextProvider i18n={i18n}>
    <Provider store={store}>
      <Suspense fallback={<span>...</span>}>
        <BrowserRouter>
          <Routes>
            <Route
              path='/' element={
                <RequireAuth>
                  <Pages.IndexPage indexType={PESYS}/>
                </RequireAuth>
              }
            />
            <Route
              path='/gjenny' element={
                <RequireAuth context={GJENNY}>
                  <Pages.IndexPage indexType={GJENNY}/>
                </RequireAuth>
              }
            />
            <Route
              path='/admin' element={
                <RequireAuth adminOnly={true}>
                  <Pages.AdminPage/>
                </RequireAuth>
              }
            />
            <Route path='/notlogged' element={<Pages.Error type='notLogged' />} />
            <Route path='/notinvited' element={<Pages.Error type='notInvited' />} />
            <Route path='/forbidden' element={<Pages.Error type='forbidden' />} />
            <Route path='/*' element={<Pages.Error type='error' />} />
          </Routes>
        </BrowserRouter>
      </Suspense>
    </Provider>
  </I18nextProvider>
)

unregister()
// registerServiceWorker()
