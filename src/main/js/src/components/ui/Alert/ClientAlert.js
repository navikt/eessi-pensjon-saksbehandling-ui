import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import classNames from 'classnames';
import { bindActionCreators }  from 'redux';

import * as alertActions from '../../../actions/alert';

import * as Nav from '../Nav';
import './ClientAlert.css'

const mapStateToProps = (state) => {
    return {
        clientErrorStatus  : state.alert.clientErrorStatus,
        clientErrorMessage : state.alert.clientErrorMessage
    }
};

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, alertActions), dispatch)};
};

class ClientAlert extends Component {

    state = {
        status  : undefined,
        message : undefined,
        timeout : undefined
    }

    handleTimeouts() {

        const { clientErrorStatus, clientErrorMessage, actions } = this.props;

        if (clientErrorStatus !== this.state.status || clientErrorMessage !== this.state.message) {
            if (this.state.timeout) {
                clearTimeout(this.state.timeout);
            }

            let timeout = undefined;

            if (clientErrorStatus === 'OK') {
                timeout = setTimeout(() => {
                    actions.clientClear();
                }, 5000);
            }

            this.setState({
                timeout: timeout,
                status: clientErrorStatus,
                message: clientErrorMessage
            });
        }
    }

    render () {

        let { t, clientErrorStatus, clientErrorMessage } = this.props;

        if (!clientErrorMessage) { return null }

        this.handleTimeouts();

        return <Nav.AlertStripe className={classNames({'toFade' : clientErrorStatus === 'OK'})}
            type={clientErrorStatus === 'OK' ? 'suksess' : 'advarsel'}>
            {t(clientErrorMessage)}
        </Nav.AlertStripe>;
    }
}

ClientAlert.propTypes = {
    t                  : PT.func.isRequired,
    clientErrorStatus  : PT.string,
    clientErrorMessage : PT.string,
    actions            : PT.object.isRequired
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    translate()(ClientAlert)
);
