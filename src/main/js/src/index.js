import React from 'react';
import ReactDOM from 'react-dom';

import createBrowserHistory from 'history/createBrowserHistory';
import { Route, Switch } from 'react-router';
import { ConnectedRouter, routerMiddleware } from 'react-router-redux';
import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import * as reducers from './reducers';
import i18n from './i18n';
import { I18nextProvider } from 'react-i18next';
import registerServiceWorker from './registerServiceWorker';

import Index from './pages/Index';
import GetCase from './pages/GetCase';
import EditCase from './pages/EditCase';
import ConfirmEditCase from './pages/ConfirmEditCase';
import EndCase from './pages/EndCase';

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

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

const initialState = {'language' : i18n.language};

const store = createStoreWithMiddleware(reducer, initialState);

ReactDOM.render(
  <I18nextProvider i18n={i18n}>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Switch>
          <Route exact path='/case/get'     component={GetCase}/>
          <Route exact path='/case/get/:id' component={EditCase}/>
          <Route exact path='/case/confirm' component={ConfirmEditCase}/>
          <Route exact path='/case/end'     component={EndCase}/>
          <Route path='/'                   component={Index}/>
        </Switch>
      </ConnectedRouter>
    </Provider>
  </I18nextProvider>, document.getElementById('root'));

registerServiceWorker();
