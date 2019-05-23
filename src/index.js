import 'core-js/es/object/assign' // IE 11 compatibility
import 'core-js/es/object/entries' // IE 11 compatibility
import 'core-js/es/array/includes' // IE 11 compatibility
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

import { StoreProvider } from './store'
import reducer, { initialState } from './reducer'
import i18n from './i18n'
import * as routes from './constants/routes'
import { unregister } from './registerServiceWorker'
import * as Applications from './applications'
import * as Pages from './pages'
import AuthenticatedRoute from './components/app/AuthenticatedRoute'
import WaitingPanel from './components/app/WaitingPanel'

import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import './index_highContrast.css'

ReactDOM.render(
  <I18nextProvider i18n={i18n}>
    <StoreProvider initialState={initialState} reducer={reducer}>
      <Suspense fallback={<WaitingPanel message='...' />}>
        <Router history={createBrowserHistory()}>
          <Switch>
            <AuthenticatedRoute exact path={routes.PINFO} component={Applications.PInfo} />
            <AuthenticatedRoute exact path={routes.P4000_ROUTE} component={Applications.P4000} />
            <AuthenticatedRoute exact path={routes.PDF_GENERATE} component={Applications.GeneratePDF} />
            <AuthenticatedRoute exact path={routes.PDF_EDIT} component={Applications.EditPDF} />
            <AuthenticatedRoute exact path={routes.PDF_SELECT} component={Applications.SelectPDF} />
            <Redirect from={routes.PDF} to={{ pathname: routes.PDF_SELECT }} />
            <AuthenticatedRoute exact path={`${routes.BUC}/:step?`} component={Pages.BUC} />
            <AuthenticatedRoute path={routes.INDEX} component={Pages.IndexPage} />
            <AuthenticatedRoute path={routes.RESEND} component={Pages.Resend} />
            <Route path={routes.NOT_LOGGED} render={() => <Pages.Error type='notLogged' />} />
            <Route path={routes.NOT_INVITED} render={(props) => <Pages.Error type='notInvited' />} />
            <Route path={routes.FORBIDDEN} render={(props) => <Pages.Error type='forbidden' />} />
            <Route path={routes.ROOT + ':PATH+'} render={() => <Pages.Error type='error' />} />
            <AuthenticatedRoute path={routes.ROOT} component={Pages.FirstPage} />
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
