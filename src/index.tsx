
import RequireAuth from 'components/RequireAuth/RequireAuth'
import { IS_PRODUCTION } from 'constants/environment'
import 'core-js/stable'
import * as Amplitude from 'metrics/amplitude'
import * as Sentry from 'metrics/sentry'
import 'moment'
import 'moment/locale/en-gb'
import 'moment/locale/nb'
import '@navikt/ds-css'
import Pages from 'pages'
import { Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { I18nextProvider } from 'react-i18next'
import { Provider } from 'react-redux'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import 'regenerator-runtime/runtime'
import { unregister } from 'registerServiceWorker'
import i18n from './i18n'
import 'nav-frontend-tabell-style/dist/main.css'

import store from './store'

if (!IS_PRODUCTION) {
  // const axe = require('@axe-core/react')
  // axe(React, ReactDOM, 1000, {})
} else {
  Sentry.init()
  Amplitude.init()
}

const container = document.getElementById('root')
const root = createRoot(container!)
root.render(
  <I18nextProvider i18n={i18n}>
    <Provider store={store}>
      <Suspense fallback={<span>...</span>}>
        <BrowserRouter>
          <Routes>
            <Route
              path='/' element={
                <RequireAuth>
                  <Pages.IndexPage />
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
