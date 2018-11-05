import 'babel-polyfill' // IE 11 compatibility
import 'core-js/es6/map' // IE 11 compatibility
import 'core-js/es6/set' // IE 11 compatibility

import React from 'react'
import ReactDOM from 'react-dom'
import createBrowserHistory from 'history/createBrowserHistory'
import { Switch, Redirect } from 'react-router'
import { ConnectedRouter, routerMiddleware } from 'react-router-redux'
import { createStore, applyMiddleware, combineReducers, compose } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import { I18nextProvider } from 'react-i18next'
import { CookiesProvider } from 'react-cookie'
import 'moment'
import 'moment/locale/en-gb'
import 'moment/locale/nb'

import i18n from './i18n'
import * as reducers from './reducers'
import * as routes from './constants/routes'
import registerServiceWorker from './registerServiceWorker'
import * as Pages from './pages'
import AuthenticatedRoute from './components/app/AuthenticatedRoute'
import * as constants from './constants/constants'

import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'

const history = createBrowserHistory()
const routeMiddleware = routerMiddleware(history)

const createStoreWithMiddleware = compose(
  applyMiddleware(thunk),
  applyMiddleware(routeMiddleware),
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
  drawerWidth: 10,
  drawerOldWidth: 250,
  breadcrumbs: []
} }

const store = createStoreWithMiddleware(reducer, initialState)

ReactDOM.render(
  <I18nextProvider i18n={i18n}>
    <CookiesProvider>
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Switch>
            <AuthenticatedRoute exact path={routes.PSELV} component={Pages.PSelv} roles={[constants.SAKSBEHANDLER]} />
            <AuthenticatedRoute exact path={routes.PINFO} component={Pages.PInfo} roles={[constants.SAKSBEHANDLER, constants.BRUKER]} />
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

            <AuthenticatedRoute path={routes.ROOT} component={Pages.FrontPage} roles={[constants.SAKSBEHANDLER, constants.BRUKER]} />
            <Redirect from='/' to={{ pathname: routes.ROOT, search: window.location.search }} />
          </Switch>
        </ConnectedRouter>
      </Provider>
    </CookiesProvider>
  </I18nextProvider>,
  document.getElementById('root')
)

registerServiceWorker()
