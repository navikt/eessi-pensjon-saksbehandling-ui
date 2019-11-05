// IE 11 compatibility
import 'core-js/es/object/assign'
import 'core-js/es/object/entries'
import 'core-js/es/object/keys'
import 'core-js/es/array/includes'
import 'core-js/es/array/find'
import 'core-js/es/map'
import 'core-js/es/set'
import 'core-js/stable/promise'
import 'core-js/stable/url-search-params'

import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import { createBrowserHistory } from 'history'
import { Switch, Redirect, Route, Router } from 'react-router'
import { I18nextProvider } from 'react-i18next'
import { StoreProvider } from 'store'
import Loadable from 'loadable'
import reducer, { initialState } from 'reducer'
import 'moment'
import 'moment/locale/en-gb'
import 'moment/locale/nb'
import i18n from './i18n'
import * as routes from 'constants/routes'
import { unregister } from 'registerServiceWorker'
import AuthenticatedRoute from 'components/AuthenticatedRoute/AuthenticatedRoute'
import 'eessi-pensjon-ui/dist/nav.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'index.css'
import 'index_highContrast.css'

const Pages = {
  Error: Loadable({ loader: () => import('./pages/Error/Error') }),
  IndexPage: Loadable({ loader: () => import('./pages/IndexPage/IndexPage') })
}

window.onerror = (msg, src, lineno, colno, error) => {
  console.log('error', msg, src, lineno, colno, error)
  return <div>Error</div>
}

ReactDOM.render(
  <I18nextProvider i18n={i18n}>
    <StoreProvider initialState={initialState} reducer={reducer}>
      <Suspense fallback={<span>...</span>}>
        <Router history={createBrowserHistory()}>
          <Switch>
            <Route path={routes.NOT_LOGGED} render={() => <Pages.Error type='notLogged' />} />
            <Route path={routes.NOT_INVITED} render={() => <Pages.Error type='notInvited' />} />
            <Route path={routes.FORBIDDEN} render={() => <Pages.Error type='forbidden' />} />
            <Route path={routes.ROOT + ':PATH+'} render={() => <Pages.Error type='error' />} />
            <AuthenticatedRoute path={routes.ROOT} component={Pages.IndexPage} />
            <Redirect from='/' to={{ pathname: routes.ROOT, search: window.location.search }} />
          </Switch>
        </Router>
      </Suspense>
    </StoreProvider>
  </I18nextProvider>,
  document.getElementById('root')
)

unregister()
// registerServiceWorker()
