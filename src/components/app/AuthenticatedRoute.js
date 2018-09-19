import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';
import { withCookies, Cookies } from 'react-cookie';
import { Route, withRouter } from 'react-router';
import classNames from 'classnames';
import { translate } from 'react-i18next';

import * as Nav from '../ui/Nav';

import * as appActions from '../../actions/app';

const mapStateToProps = (state) => {
    return {}
};

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, appActions), dispatch)};
};

class AuthenticatedRoute extends Component {

    state = {loggedIn : false}

    componentDidMount() {

        const { cookies, actions } = this.props;

        let idtoken = cookies.get('eessipensjon-idtoken-public');

        if (!idtoken) {
            actions.login({
                redirectTo: encodeURIComponent(window.location.pathname)
            });
        } else {
            this.setState({
                loggedIn: true
            });
        }
    }

    render () {

        const { t, className } = this.props;

        return this.state.loggedIn ? <Route {...this.props}/> :
        <div className={classNames('w-100 text-center p-5', className)}>
            <Nav.NavFrontendSpinner/>
            <p>{t('authenticating')}</p>
        </div>
    }
}

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
