// IE11
import 'core-js/stable'
import 'regenerator-runtime/runtime'

import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import { createBrowserHistory } from 'history'
import { Switch, Redirect, Route, Router } from 'react-router'
import { I18nextProvider } from 'react-i18next'
import { combineReducers, applyMiddleware, createStore, Store } from 'redux'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'
import * as reducers from './reducers'
import { IS_PRODUCTION } from 'constants/environment'
import 'moment'
import 'moment/locale/en-gb'
import 'moment/locale/nb'
import i18n from './i18n'
import * as routes from 'constants/routes'
import { unregister } from 'registerServiceWorker'
import AuthenticatedRoute from 'components/AuthenticatedRoute/AuthenticatedRoute'
import 'eessi-pensjon-ui/dist/minibootstrap.css'
import 'eessi-pensjon-ui/dist/nav.css'
import 'index.css'
import 'index_highContrast.css'

const store: Store = createStore(combineReducers(reducers), applyMiddleware(thunk))

const Pages = {
  Error: require('./pages/Error/Error').default,
  IndexPage: require('./pages/IndexPage/IndexPage').default
}

window.onerror = (msg, src, lineno, colno, error) => {
  console.log('error', msg, src, lineno, colno, error)
  return <div>Error</div>
}

if (!IS_PRODUCTION) {
  var axe = require('react-axe')
  axe(React, ReactDOM, 1000)
}

const renderErrorPage = (type: string) => {
  return (): any => (<Pages.Error type={type} />)
}

ReactDOM.render(
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
  </I18nextProvider>,
  document.getElementById('root')
)

unregister()
// registerServiceWorker()
