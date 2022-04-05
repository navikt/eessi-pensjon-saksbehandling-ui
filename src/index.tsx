
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
import React, { Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { I18nextProvider } from 'react-i18next'
import { Provider } from 'react-redux'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import 'regenerator-runtime/runtime'
import { unregister } from 'registerServiceWorker'
import { createGlobalStyle } from 'styled-components/macro'
import i18n from './i18n'
import * as reducers from './reducers'
import 'nav-frontend-tabs-style/dist/main.css'
import 'nav-frontend-tabell-style/dist/main.css'

const GlobalStyle = createGlobalStyle`
  html {
    height: 100%;
  }
  body {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    height: 100vh;
  }
  pre {
    font-family: 'Source Sans Pro', Arial, sans-serif;
  }
  code.block {
    display: block;
    white-space: pre-wrap;
  }
  dd {
    margin-bottom: .5rem;
    margin-left: 0;
  }
  ol {
    list-style-type: decimal;
  }

  .print-version {
    width: 100%;
    margin-top: 0.5rem;
    @media print {
      @page {
        size: A4 landscape;
      }
      td {
        padding: 0.5rem;
      }
    }
  }
`

// IE11
/* if (Number && isFinite && !Number.isFinite) {
  Number.isFinite = isFinite
} */
const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const store: Store = createStore(combineReducers(reducers), composeEnhancers(applyMiddleware(thunk)))

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
  <React.StrictMode>
    <GlobalStyle />
    <I18nextProvider i18n={i18n}>
      <Provider store={store}>
        <Suspense fallback={<span>...</span>}>
          <BrowserRouter>
            <Routes>
              <Route path='/' element={<Navigate to={{ pathname: '/_/', search: window.location.search }} />} />
              <Route
                path='/_/' element={
                  <RequireAuth>
                    <Pages.IndexPage />
                  </RequireAuth>
              }
              />
              <Route path='/_/notlogged' element={<Pages.Error type='notLogged' />} />
              <Route path='/_/notinvited' element={<Pages.Error type='notInvited' />} />
              <Route path='/_/forbidden' element={<Pages.Error type='forbidden' />} />
              <Route path='/_/*' element={<Pages.Error type='error' />} />
            </Routes>
          </BrowserRouter>
        </Suspense>
      </Provider>
    </I18nextProvider>
  </React.StrictMode>
)

unregister()
// registerServiceWorker()
