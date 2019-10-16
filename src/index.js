// IE 11 compatibility
import 'core-js/es/object/assign'
import 'core-js/es/object/entries'
import 'core-js/es/object/keys'
import 'core-js/es/array/includes'
import 'core-js/es/array/find'
import 'core-js/es/map'
import 'core-js/es/set'
import 'es6-promise/auto'
import 'core-js/features/url-search-params'

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
import * as Pages from 'pages'
import AuthenticatedRoute from 'components/AuthenticatedRoute/AuthenticatedRoute'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'index.css'
import 'index_highContrast.css'

import pdfjs from 'pdfjs-dist/build/pdf'
if (process.env.NODE_ENV !== 'production') {
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`
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
