import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';

import PT from 'prop-types';
import { translate } from 'react-i18next';

import './TopHeader.css';
import * as navLogo from '../../../resources/images/nav.svg';

import * as appActions from '../../../actions/app';
import * as uiActions from '../../../actions/ui';

const mapStateToProps = (state) => {
    return {
        userInfo        : state.app.userInfo,
        gettingUserInfo : state.loading.gettingUserInfo
    };
};

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, uiActions, appActions), dispatch)};
};

class TopHeader extends Component {

    componentDidMount() {

        const { userInfo, actions } = this.props;

        if (!userInfo) {
            actions.getUserInfo();
        }
    }

    onLogoClick () {

        const { actions } = this.props;

        actions.toggleDrawerEnable();
    }

    render () {

        let { t, userInfo, gettingUserInfo } = this.props;

        let userText = (userInfo ? userInfo : (gettingUserInfo ? t('case:loading-gettingUserInfo') : ''));

        return <header className="topplinje">
            <div className="topplinje__brand">
                <a href="#toggleDrawerEnable" onClick={this.onLogoClick.bind(this)}>
                    <img className="brand__logo" src={navLogo} alt="To personer på NAV kontor"/>
                </a>
                <div className="brand__skillelinje" />
                <div className="brand__tittel"><span>{t('headerTitle')}</span></div>
            </div>
            <div className="topplinje__saksbehandler">
                <div className="mr-4 saksbehandler__navn">{typeof(userText)==='string'? userText: userText.principal}</div>
            </div>
        </header>
    }
}

TopHeader.propTypes = {
    t               : PT.func.isRequired,
    userInfo        : PT.string,
    actions         : PT.object,
    gettingUserInfo : PT.bool
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    translate()(TopHeader)
);
