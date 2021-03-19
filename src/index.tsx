// IE11
import 'core-js/stable'
import 'react-app-polyfill/ie11'
import 'react-app-polyfill/ie9'
import 'regenerator-runtime/runtime'
import * as Sentry from 'metrics/sentry'
import * as Amplitude from 'metrics/amplitude'
import AuthenticatedRoute from 'components/AuthenticatedRoute/AuthenticatedRoute'
import { IS_PRODUCTION } from 'constants/environment'
import * as routes from 'constants/routes'
import { createBrowserHistory } from 'history'
import 'moment'
import 'moment/locale/en-gb'
import 'moment/locale/nb'
import Pages from 'pages'
import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import { I18nextProvider } from 'react-i18next'
import { Provider } from 'react-redux'
import { Redirect, Route, Router, Switch } from 'react-router-dom'
import { applyMiddleware, combineReducers, createStore, Store } from 'redux'
import thunk from 'redux-thunk'
import { unregister } from 'registerServiceWorker'
import i18n from './i18n'
import * as reducers from './reducers'
import { createGlobalStyle } from 'styled-components'

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
import 'nav-frontend-tabs-style/dist/main.css'
import 'nav-frontend-tabell-style/dist/main.css'
import 'nav-frontend-typografi-style/dist/main.css'
import 'nav-frontend-veileder-style/dist/main.css'
import './index.css'

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
`

// IE11
/* if (Number && isFinite && !Number.isFinite) {
  Number.isFinite = isFinite
} */

const store: Store = createStore(combineReducers(reducers), applyMiddleware(thunk))

if (!IS_PRODUCTION) {
  const axe = require('@axe-core/react')
  axe(React, ReactDOM, 1000, {})
} else {
  Sentry.init()
  Amplitude.init()
}

const renderErrorPage = (type: string) => {
  return (): any => (<Pages.Error type={type} />)
}

ReactDOM.render(
  <React.StrictMode>
    <GlobalStyle />
    <I18nextProvider i18n={i18n}>
      <Provider store={store}>
        <Suspense fallback={<span>...</span>}>
          <Router history={createBrowserHistory()}>
            <Switch>
              <Route path={routes.NOT_LOGGED} render={renderErrorPage('notLogged')} />
              <Route path={routes.NOT_INVITED} render={renderErrorPage('notInvited')} />
              <Route path={routes.FORBIDDEN} render={renderErrorPage('forbidden')} />
              <Route path={routes.ROOT + ':PATH+'} render={renderErrorPage('error')} />
              <AuthenticatedRoute path={routes.ROOT} component={Pages.IndexPage} />
              <Redirect from='/' to={{ pathname: routes.ROOT, search: window.location.search }} />
            </Switch>
          </Router>
        </Suspense>
      </Provider>
    </I18nextProvider>
  </React.StrictMode>,
  document.getElementById('root')
)

unregister()
// registerServiceWorker()
