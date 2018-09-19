import React, { Component } from 'react';
import PT from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';
import { withCookies, Cookies } from 'react-cookie';
import { translate } from 'react-i18next';

import * as Nav from './Nav'
import TopHeader from './Header/TopHeader';
import ServerAlert from './Alert/ServerAlert';
import Modal from './Modal';

import * as statusActions from '../../actions/status';
import * as appActions from '../../actions/app';

const mapStateToProps = (state) => {
    return {}
};

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, appActions, statusActions), dispatch)};
};

class TopContainer extends Component {

    state = {
        isReady : false
    }

    componentDidMount() {

        const { actions, location, cookies } = this.props;

        let idtoken = cookies.get('eessipensjon-idtoken-public');

        if (!idtoken) {
            actions.login({
                redirectTo: encodeURIComponent(window.location.href)
            });
        } else {
            this.setState({
                isReady: true
            });
        }

        const rinaId = new URLSearchParams(location.search).get('rinaId');

        actions.setRinaId(rinaId); // if rinaId is undefined, it erases rinaId

        if (rinaId) {
            actions.getStatus(rinaId);
            actions.getCase(rinaId);
        }
    }

    render () {

        const { t, className, style } = this.props;

        if (!this.state.isReady) {
            return <div style={style} className={classNames(className)}>
               <TopHeader/>
               <ServerAlert/>
               <div className='w-100 text-center p-5'>
                 <Nav.NavFrontendSpinner/>
                 <p>{t('authenticating')}</p>
               </div>
            </div>
        }

        return <div style={style} className={classNames(className)}>
            <TopHeader/>
            <ServerAlert/>
            <Modal/>
            <Nav.Container fluid={true}>
                {this.props.children}
            </Nav.Container>
        </div>
    }
}

TopContainer.propTypes = {
    children  : PT.node.isRequired,
    className : PT.string,
    style     : PT.object,
    actions   : PT.object.isRequired,
    t         : PT.function,
    cookies   : PT.instanceOf(Cookies)
};

export default withCookies(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(
        translate()(TopContainer)
    )
);
