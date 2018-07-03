import React from 'react';
import ReactDOM from 'react-dom';

import createBrowserHistory from 'history/createBrowserHistory';
import registerServiceWorker from './registerServiceWorker';
import { Route, Switch } from 'react-router';
import { ConnectedRouter, routerMiddleware } from 'react-router-redux';
import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import i18n from './i18n';
import { I18nextProvider } from 'react-i18next';

import Index from './pages/Index';
import GetCase from './pages/GetCase';
import EditCase from './pages/EditCase';
import ConfirmEditCase from './pages/ConfirmEditCase';
import EndCase from './pages/EndCase';

import './index.css';

import * as reducers from './reducers';

const history = createBrowserHistory();
const routeMiddleware = routerMiddleware(history);

const createStoreWithMiddleware = compose(
  applyMiddleware(thunk),
  applyMiddleware(routeMiddleware),
  window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore);

const reducer = combineReducers({
  ...reducers
});

const store = createStoreWithMiddleware(reducer);

ReactDOM.render(
  <I18nextProvider i18n={i18n}>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Switch>
          <Route path='/getcase'     component={GetCase}/>
          <Route path='/case/:id'    component={EditCase}/>
          <Route path='/confirmcase' component={ConfirmEditCase}/>
          <Route path='/endcase'     component={EndCase}/>
          <Route path='/'            component={Index}/>
        </Switch>
      </ConnectedRouter>
    </Provider>
  </I18nextProvider>, document.getElementById('root'));

registerServiceWorker();
