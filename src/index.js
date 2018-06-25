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
import Case from './pages/Case';
import Handle from './pages/Handle';

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
          <Route path='/case/:id' component={Case}/>
          <Route path='/handle' component={Handle}/>
          <Route path='/' component={Index}/>
        </Switch>
      </ConnectedRouter>
    </Provider>
  </I18nextProvider>, document.getElementById('root'));

registerServiceWorker();