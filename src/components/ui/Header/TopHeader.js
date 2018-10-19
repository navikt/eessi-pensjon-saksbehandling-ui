import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';
import PT from 'prop-types';
import { translate } from 'react-i18next';

import Icons from '../Icons';
import { Ikon } from '../Nav';

import * as constants from '../../../constants/constants';
import * as navLogo from '../../../resources/images/nav.svg';
import * as appActions from '../../../actions/app';
import * as uiActions from '../../../actions/ui';

import './TopHeader.css';

const mapStateToProps = (state) => {
    return {
        username        : state.app.username,
        userRole        : state.app.userRole,
        gettingUserInfo : state.loading.gettingUserInfo
    };
};

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, uiActions, appActions), dispatch)};
};

class TopHeader extends Component {

    componentDidMount() {

        const { username, actions } = this.props;

        if (!username) {
            actions.getUserInfo();
        }
    }

    onLogoClick () {

        const { actions, userRole } = this.props;

        if (userRole === constants.SAKSBEHANDLER) {
            actions.toggleDrawerEnable();
        }
    }

    render () {

        let { t, username, userRole, gettingUserInfo } = this.props;

        return <header className="c-ui-topHeader">
            <div className="brand">
                <a href="#toggleDrawerEnable" onClick={this.onLogoClick.bind(this)}>
                    <img className="logo" src={navLogo} alt="To personer på NAV kontor"/>
                </a>
                <div className="skillelinje" />
                <div className="tittel"><span>{t('headerTitle')}</span></div>
            </div>
            <div className='user'>
                {userRole ? <div title={userRole} className={userRole}><Icons kind='user'/></div> : null}
                <div className="mr-4 ml-2 name">{
                    gettingUserInfo ? t('case:loading-gettingUserInfo') :
                        username ? username : <div>
                            <Ikon size={16} kind='advarsel-trekant'/>
                            <span className='ml-2'>{t('unknown')}</span>
                        </div>
                }</div>
            </div>
        </header>
    }
}

TopHeader.propTypes = {
    t               : PT.func.isRequired,
    username        : PT.string,
    userRole        : PT.string,
    actions         : PT.object,
    gettingUserInfo : PT.bool
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    translate()(TopHeader)
);
