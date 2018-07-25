import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';

import PT from 'prop-types';
import { translate } from 'react-i18next';

import './TopHeader.css';
import * as navLogo from '../../resources/images/nav.svg';

import * as uiActions from '../../actions/ui';
const mapStateToProps = (state) => {
    return {
        userInfo        : state.ui.userInfo,
        gettingUserInfo : state.loading.gettingUserInfo
    };
};

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, uiActions), dispatch)};
};


class TopHeader extends Component {

    componentDidMount() {

        const { userInfo, actions } = this.props;

        if (!userInfo) {
            actions.getUserInfo();
        }
    }

    render () {

        let { t, userInfo, gettingUserInfo } = this.props;

        let userText = (userInfo ? userInfo : (gettingUserInfo ? t('case:loadingGettingUserInfo') : ''));

        return <header className="topplinje">
            <div className="topplinje__brand">
                <Link to="/" alt="NAV, lenke hovedsiden">
                    <img className="brand__logo" src={navLogo} alt="To personer på NAV kontor"/>
                </Link>
                <div className="brand__skillelinje" />
                <div className="brand__tittel"><span>{t('headerTitle')}</span></div>
            </div>
            <div className="topplinje__saksbehandler">
                <div className="saksbehandler__navn">{userText}</div>
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
