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

   /* handleTimeouts() {

        const { status, actions } = this.props;

        if (status !== this.state.status) {
            if (this.state.timeout) {
                clearTimeout(this.state.timeout);
            }
            let timeout = setTimeout(() => {
                actions.clearStatus();
            }, 5000);

            this.setState({
                timeout: timeout,
                status: status
            });
        }
    }

    getSnapshotBeforeUpdate() {

        const { actions, clientErrorStatus, clientErrorMessage } = this.props;
        const { status, timeout } = this.state;

        if (!clientErrorStatus) {
            this.setState({
                status  : undefined,
                message : undefined
            });

        } else {

            if (clientErrorStatus !== status) {
                if (timeout) {
                    clearTimeout(timeout);
                }
                let _timeout = setTimeout(() => {
                    actions.clearStatus();
                }, 5000);

               this.setState({
                    timeout : _timeout,
                    status  : clientErrorStatus,
                    message : clientErrorMessage
                });
            }
        }
    }*/

    render () {

        let { t, clientErrorStatus, clientErrorMessage } = this.props;

        if (!clientErrorMessage) { return null }

        return <Nav.AlertStripe className='toFade'
            type={clientErrorStatus === 'OK' ? 'suksess' : 'advarsel'}>
                {t(clientErrorMessage)}
            </Nav.AlertStripe>;
    }
}

ClientAlert.propTypes = {
    t                  : PT.func.isRequired,
    clientErrorStatus  : PT.string,
    clientErrorMessage : PT.string
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    translate()(ClientAlert)
);
