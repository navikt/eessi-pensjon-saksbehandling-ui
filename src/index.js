import 'core-js/es/object/assign' // IE 11 compatibility
import 'core-js/es/object/entries' // IE 11 compatibility
import 'core-js/es/object/keys' // IE 11 compatibility
import 'core-js/es/array/includes' // IE 11 compatibility
import 'core-js/es/array/find' // IE 11 compatibility
import 'core-js/es/map' // IE 11 compatibility
import 'core-js/es/set' // IE 11 compatibility
import 'es6-promise/auto' // IE 11 compatibility

import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import { createBrowserHistory } from 'history'
import { Switch, Redirect, Route, Router } from 'react-router'
import { I18nextProvider } from 'react-i18next'
import 'moment'
import 'moment/locale/en-gb'
import 'moment/locale/nb'

import { StoreProvider } from 'store'
import reducer, { initialState } from 'reducer'
import i18n from './i18n'
import * as routes from 'constants/routes'
import { unregister } from 'registerServiceWorker'
import * as Applications from 'applications'
import * as Pages from 'pages'
import AuthenticatedRoute from 'components/AuthenticatedRoute/AuthenticatedRoute'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'index.css'
import 'index_highContrast.css'

ReactDOM.render(
  <I18nextProvider i18n={i18n}>
    <StoreProvider initialState={initialState} reducer={reducer}>
      <Suspense fallback={<span>...</span>}>
        <Router history={createBrowserHistory()}>
          <Switch>
            <AuthenticatedRoute exact path={routes.PINFO} component={Applications.PInfo} />
            <AuthenticatedRoute path={routes.INDEX} component={Pages.IndexPage} />
            <Route path={routes.NOT_LOGGED} render={() => <Pages.Error type='notLogged' />} />
            <Route path={routes.NOT_INVITED} render={() => <Pages.Error type='notInvited' />} />
            <Route path={routes.FORBIDDEN} render={() => <Pages.Error type='forbidden' />} />
            <Route path={routes.ROOT + ':PATH+'} render={() => <Pages.Error type='error' />} />
            <AuthenticatedRoute path={routes.ROOT} component={Pages.FirstPage} displayName />
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
