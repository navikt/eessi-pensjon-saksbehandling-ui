import 'babel-polyfill' // IE 11 compatibility
import 'core-js/es6/map' // IE 11 compatibility
import 'core-js/es6/set' // IE 11 compatibility
import 'es6-promise/auto' // IE 11 compatibility

import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import createBrowserHistory from 'history/createBrowserHistory'
import { Switch, Redirect, Route, Router } from 'react-router'
import { createStore, applyMiddleware, combineReducers, compose } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import { I18nextProvider } from 'react-i18next'
import 'moment'
import 'moment/locale/en-gb'
import 'moment/locale/nb'

import i18n from './i18n'
import * as reducers from './reducers'
import * as routes from './constants/routes'
import { unregister } from './registerServiceWorker'
import * as Pages from './pages'
import AuthenticatedRoute from './components/app/AuthenticatedRoute'
import * as constants from './constants/constants'
import WaitingPanel from './components/app/WaitingPanel'

import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import './index_highContrast.css'

const history = createBrowserHistory()

const createStoreWithMiddleware = compose(
  applyMiddleware(thunk),
  window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore)

const reducer = combineReducers({
  ...reducers
})

const initialState = { ui: {
  language: i18n.language,
  locale: i18n.locale,
  modalOpen: false,
  modalBucketOpen: false,
  drawerEnabled: false,
  drawerOpen: false,
  footerOpen: false,
  drawerWidth: 10,
  drawerOldWidth: 250,
  highContrast: false
} }

const store = createStoreWithMiddleware(reducer, initialState)

ReactDOM.render(

  <I18nextProvider i18n={i18n}>
    <Provider store={store}>
      <Suspense fallback={<WaitingPanel/>}>
      <Router history={history}>
        <Switch>
          <AuthenticatedRoute exact path={routes.PSELV} component={Pages.PSelv} roles={[constants.SAKSBEHANDLER]} />
          <AuthenticatedRoute exact path={routes.PINFO} component={Pages.PInfo} roles={[constants.SAKSBEHANDLER, constants.BRUKER]} />
          <AuthenticatedRoute exact path={routes.PINFO_SAKSBEHANDLER} component={Pages.PInfoSaksbehandler} roles={[constants.SAKSBEHANDLER]} />
          <AuthenticatedRoute exact path={routes.P4000_ROUTE} component={Pages.P4000} roles={[constants.SAKSBEHANDLER, constants.BRUKER]} />
          <AuthenticatedRoute exact path={routes.PDF_GENERATE} component={Pages.GeneratePDF} roles={[constants.SAKSBEHANDLER, constants.BRUKER]} />
          <AuthenticatedRoute exact path={routes.PDF_EDIT} component={Pages.EditPDF} roles={[constants.SAKSBEHANDLER, constants.BRUKER]} />
          <AuthenticatedRoute exact path={routes.PDF_SELECT} component={Pages.SelectPDF} roles={[constants.SAKSBEHANDLER, constants.BRUKER]} />
          <Redirect from={routes.PDF} to={{ pathname: routes.PDF_SELECT }} />

          <AuthenticatedRoute exact path={routes.CASE_START} component={Pages.StartCase} roles={[constants.SAKSBEHANDLER]} />
          <AuthenticatedRoute exact path={routes.CASE_CONFIRM} component={Pages.ConfirmCase} roles={[constants.SAKSBEHANDLER]} />
          <AuthenticatedRoute exact path={routes.CASE_GENERATE} component={Pages.GenerateCase} roles={[constants.SAKSBEHANDLER]} />
          <AuthenticatedRoute exact path={routes.CASE_SAVE} component={Pages.SaveCase} roles={[constants.SAKSBEHANDLER]} />
          <AuthenticatedRoute exact path={routes.CASE_SEND} component={Pages.SendCase} roles={[constants.SAKSBEHANDLER]} />
          <Redirect from={routes.CASE} to={{ pathname: routes.CASE_START }} />

          <AuthenticatedRoute path={routes.INDEX} component={Pages.IndexPage} roles={[constants.SAKSBEHANDLER, constants.BRUKER]} />
          <Route path={routes.NOT_LOGGED} render={() => <Pages.Error type='notLogged' />} />
          <Route path={routes.NOT_INVITED} render={() => <Pages.Error type='notInvited' />} />
          <Route path={routes.FORBIDDEN} render={() => <Pages.Error type='forbidden' />} />
          <Route path={routes.ROOT + ':PATH+'} render={() => <Pages.Error type='error' />} />
          <AuthenticatedRoute path={routes.ROOT} component={Pages.FirstPage} roles={[constants.SAKSBEHANDLER, constants.BRUKER]} />
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
