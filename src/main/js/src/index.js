import 'babel-polyfill';  // IE 11 compatibility
import 'core-js/es6/map'; // IE 11 compatibility
import 'core-js/es6/set'; // IE 11 compatibility

import React from 'react';
import ReactDOM from 'react-dom';

import createBrowserHistory from 'history/createBrowserHistory';
import { Route, Switch } from 'react-router';
import { ConnectedRouter, routerMiddleware } from 'react-router-redux';
import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { I18nextProvider } from 'react-i18next';

import * as reducers from './reducers';
import i18n from './i18n';
import registerServiceWorker from './registerServiceWorker';
import * as Pages from './pages';

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

const initialState = {ui: {language : i18n.language}};

const store = createStoreWithMiddleware(reducer, initialState);

ReactDOM.render(
    <I18nextProvider i18n={i18n}>
        <Provider store={store}>
            <ConnectedRouter history={history}>
                <Switch>
                    <Route exact path='/react/get'                  component={Pages.GetCase}/>
                    <Route       path='/react/get/:caseid/:actorid' component={Pages.EditCase}/>
                    <Route exact path='/react/confirm'              component={Pages.ConfirmCase}/>
                    <Route exact path='/react/generate'             component={Pages.GenerateCase}/>
                    <Route exact path='/react/end'                  component={Pages.EndCase}/>
                    <Route       path='/'                           component={Pages.FrontPage}/>
                </Switch>
            </ConnectedRouter>
        </Provider>
    </I18nextProvider>, document.getElementById('root'));

registerServiceWorker();
