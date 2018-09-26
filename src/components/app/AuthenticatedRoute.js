import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';
import { withCookies, Cookies } from 'react-cookie';
import { Route, withRouter } from 'react-router';
import classNames from 'classnames';
import { translate } from 'react-i18next';

import * as Nav from '../ui/Nav';

import * as urls from '../../constants/urls';
import * as appActions from '../../actions/app';
import * as statusActions from '../../actions/status';

const mapStateToProps = () => {
    return {
    }
};

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, appActions, statusActions), dispatch)};
};

class AuthenticatedRoute extends Component {

    state = {
        loggedIn : false
    }

    componentDidMount() {

        const { cookies, actions, location } = this.props;

        let idtoken = cookies.get('eessipensjon-idtoken-public');

        if (!idtoken) {

            let redirectUrl = urls.APP_LOGIN_URL + '?redirectTo=' + encodeURIComponent(window.location.href);
            window.location.href = redirectUrl;

        } else {
            this.setState({
                loggedIn: true
            });
        }

        let params = new URLSearchParams(location.search);
        const rinaIdFromParam = params.get('rinaId');

        if (rinaIdFromParam) {
            actions.setStatusParam('rinaId', rinaIdFromParam);
            actions.getStatus(rinaIdFromParam);
            actions.getCase(rinaIdFromParam);
        }

        const saksNrFromParam = params.get('saksNr');

        if (saksNrFromParam) {
            actions.setStatusParam('saksNr', saksNrFromParam);
        }

        const fnrFromParam = params.get('fnr');

        if (fnrFromParam) {
            actions.setStatusParam('fnr', fnrFromParam);
        }
    }

    render () {

        const { t, className } = this.props;

        return this.state.loggedIn ? <Route {...this.props}/> :
            <div className={classNames('w-100 text-center p-5', className)}>
                <Nav.NavFrontendSpinner/>
                <p>{t('ui:authenticating')}</p>
            </div>
    }
}

AuthenticatedRoute.propTypes = {
    t              : PT.func.isRequired,
    className      : PT.string,
    cookies        : PT.instanceOf(Cookies),
    actions        : PT.object.isRequired
};

export default withCookies(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(
        translate()(
            withRouter(AuthenticatedRoute)
        )
    )
)
