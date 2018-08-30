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
import 'moment';
import 'moment/locale/en-gb';
import 'moment/locale/nb';

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

const initialState = {ui: {
    language : i18n.language,
    locale   : i18n.locale,
    modalOpen: false
}};

const store = createStoreWithMiddleware(reducer, initialState);

ReactDOM.render(
    <I18nextProvider i18n={i18n}>
        <Provider store={store}>
            <ConnectedRouter history={history}>
                <Switch>
                    <Route exact path='/react/pselv' component={Pages.PSelv}/>
                    <Route exact path='/react/pinfo' component={Pages.PInfo}/>
                    <Route exact path='/react/P4000' component={Pages.P4000}/>

                    <Route exact path='/react/pdf/generate' component={Pages.GeneratePDF}/>
                    <Route exact path='/react/pdf/edit'     component={Pages.EditPDF}/>
                    <Route exact path='/react/pdf/select'   component={Pages.SelectPDF}/>

                    <Route exact path='/react/case/get'                          component={Pages.GetCase}/>
                    <Route exact path='/react/case/get/:caseid/:actorid'         component={Pages.EditCase}/>
                    <Route exact path='/react/case/get/:caseid/:actorid/:rinaid' component={Pages.EditCase}/>

                    <Route exact path='/react/case/confirm'  component={Pages.ConfirmCase}/>
                    <Route exact path='/react/case/generate' component={Pages.GenerateCase}/>
                    <Route exact path='/react/case/save'     component={Pages.SaveCase}/>
                    <Route exact path='/react/case/send'     component={Pages.SendCase}/>

                    <Route path='/' component={Pages.FrontPage}/>
                </Switch>
            </ConnectedRouter>
        </Provider>
    </I18nextProvider>,
    document.getElementById('root')
);

registerServiceWorker();
