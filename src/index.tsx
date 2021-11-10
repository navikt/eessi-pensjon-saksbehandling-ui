// IE11
import RequireAuth from 'components/RequireAuth/RequireAuth'
import { IS_PRODUCTION } from 'constants/environment'
import 'core-js/stable'
import * as Amplitude from 'metrics/amplitude'
import * as Sentry from 'metrics/sentry'
import 'moment'
import 'moment/locale/en-gb'
import 'moment/locale/nb'
import 'nav-frontend-alertstriper-style/dist/main.css'
import 'nav-frontend-chevron-style/dist/main.css'
import 'nav-frontend-core/dist/main.css'
import 'nav-frontend-ekspanderbartpanel-style/dist/main.css'
import 'nav-frontend-knapper-style/dist/main.css'
import 'nav-frontend-lenkepanel-style/dist/main.css'
import 'nav-frontend-lenker-style/dist/main.css'
import 'nav-frontend-lukknapp-style/dist/main.css'
import 'nav-frontend-modal-style/dist/main.css'
import 'nav-frontend-paneler-style/dist/main.css'
import 'nav-frontend-skjema-style/dist/main.css'
import 'nav-frontend-spinner-style/dist/main.css'
import 'nav-frontend-tabell-style/dist/main.css'
import 'nav-frontend-tabs-style/dist/main.css'
import 'nav-frontend-typografi-style/dist/main.css'
import 'nav-frontend-veileder-style/dist/main.css'
import Pages from 'pages'
import React, { Suspense } from 'react'
import 'react-app-polyfill/ie11'
import 'react-app-polyfill/ie9'
import ReactDOM from 'react-dom'
import { I18nextProvider } from 'react-i18next'
import { Provider } from 'react-redux'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { applyMiddleware, combineReducers, compose, createStore, Store } from 'redux'
import thunk from 'redux-thunk'
import 'regenerator-runtime/runtime'
import { unregister } from 'registerServiceWorker'
import { createGlobalStyle } from 'styled-components'
import i18n from './i18n'
import * as reducers from './reducers'

const GlobalStyle = createGlobalStyle`
  html {
    height: 100%;
  }

  body {
    background-color: rgb(233, 231, 231);
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    height: 100vh;
    font-family: 'Source Sans Pro', Arial, sans-serif;
  }

  pre {
    font-family: 'Source Sans Pro', Arial, sans-serif;
  }

  code.block {
    display: block;
    white-space: pre-wrap
  }

  dd {
    margin-bottom: .5rem;
    margin-left: 0;
  }

  ol {
    list-style-type: decimal;
  }

  .etikett {
    display: inline-block;
    padding: 4px 9px;
    border-radius: 4px;
  }
  .etikett--advarsel {
    background-color: #e3b0a8;
    border: 1px solid #ba3a26;
  }
  .etikett--suksess {
    background-color: #9bd0b0;
    border: 1px solid #06893a;
  }
  .etikett--fokus {
    background-color: #ffd399;
    border: 1px solid #d87f0a;
  }
  .etikett--info {
    background-color: #c2eaf7;
    border: 1px solid #5690a2;
  }
  .etikett--mini {
    padding: 1px 8px;
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
  .skjemaelement__label {
    margin-bottom: 0px !important;
  }
  .modal__overlay {
    position: fixed;
    z-index: 1000;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(61, 56, 49, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;
  }
`

// IE11
/* if (Number && isFinite && !Number.isFinite) {
  Number.isFinite = isFinite
} */
const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const store: Store = createStore(combineReducers(reducers), composeEnhancers(applyMiddleware(thunk)))

if (!IS_PRODUCTION) {
  const axe = require('@axe-core/react')
  axe(React, ReactDOM, 1000, {})
} else {
  Sentry.init()
  Amplitude.init()
}

ReactDOM.render(
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
  </React.StrictMode>,
  document.getElementById('root')
)

unregister()
// registerServiceWorker()
