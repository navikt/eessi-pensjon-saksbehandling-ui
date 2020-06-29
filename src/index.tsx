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
import 'minibootstrap.css'
import 'index.css'
import 'index_highContrast.css'

// IE11
if (Number && isFinite && !Number.isFinite) {
  Number.isFinite = isFinite
}

const store: Store = createStore(combineReducers(reducers), applyMiddleware(thunk))

if (IS_PRODUCTION) {
  Sentry.init()
  Amplitude.init()
}

const renderErrorPage = (type: string) => {
  return (): any => (<Pages.Error type={type} />)
}

ReactDOM.render(
  <React.StrictMode>
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
