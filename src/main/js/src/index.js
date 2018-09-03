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
import * as routes from './constants/routes';

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
                    <Route exact path={routes.PSELV} component={Pages.PSelv}/>
                    <Route exact path={routes.PINFO}  component={Pages.PInfo}/>
                    <Route exact path={routes.P4000}  component={Pages.P4000}/>

                    <Route exact path={routes.PDF_GENERATE} component={Pages.GeneratePDF}/>
                    <Route exact path={routes.PDF_EDIT}     component={Pages.EditPDF}/>
                    <Route exact path={routes.PDF_SELECT}   component={Pages.SelectPDF}/>

                    <Route exact path={routes.CASE_GET}               component={Pages.GetCase}/>
                    <Route exact path={routes.CASE_EDIT_WITHOUT_RINA} component={Pages.EditCase}/>
                    <Route exact path={routes.CASE_EDIT_WITH_RINA}    component={Pages.EditCase}/>

                    <Route exact path={routes.CASE_CONFIRM}  component={Pages.ConfirmCase}/>
                    <Route exact path={routes.CASE_GENERATE} component={Pages.GenerateCase}/>
                    <Route exact path={routes.CASE_SAVE}     component={Pages.SaveCase}/>
                    <Route exact path={routes.CASE_SEND}     component={Pages.SendCase}/>

                    <Route path={routes.ROOT} component={Pages.FrontPage}/>
                </Switch>
            </ConnectedRouter>
        </Provider>
    </I18nextProvider>,
    document.getElementById('root')
);

registerServiceWorker();
