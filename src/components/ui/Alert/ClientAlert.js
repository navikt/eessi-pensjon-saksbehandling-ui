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

    clear () {
        const { clientErrorStatus, actions } = this.props;

        // after 5 seconds, if the client alert is still not an error, then clear it
        if (clientErrorStatus !== 'ERROR') {
            actions.clientClear();
        }
    }

    handleTimeouts() {

        const { clientErrorStatus, clientErrorMessage } = this.props;

        if (clientErrorStatus !== this.state.status || clientErrorMessage !== this.state.message) {
            if (this.state.timeout) {
                clearTimeout(this.state.timeout);
            }

            let timeout = undefined;
            let self = this;

            if (clientErrorStatus === 'OK') {
                timeout = setTimeout(() => {
                    self.clear();
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

        let { t, clientErrorStatus, clientErrorMessage, permanent, className } = this.props;

        if (!clientErrorMessage) {
                return permanent ? <div style={{height: '75px'}}
                className={classNames(className, 'p-4', 'm-4')}>&nbsp;</div> : null
        }

        this.handleTimeouts();

        let message = undefined;
        let separatorIndex = clientErrorMessage.lastIndexOf('|');

        if (separatorIndex >= 0) {
            message = t(clientErrorMessage.substring(0, separatorIndex)) + ': ' + clientErrorMessage.substring(separatorIndex + 1);
        } else {
            message = t(clientErrorMessage);
        }
        return <Nav.AlertStripe className={classNames(className, 'clientAlert', 'm-4', {'toFade' : clientErrorStatus === 'OK'})}
            type={clientErrorStatus === 'OK' ? 'suksess' : 'advarsel'}>
            {message}
        </Nav.AlertStripe>;
    }
}

ClientAlert.propTypes = {
    t                  : PT.func.isRequired,
    permanent          : PT.bool,
    clientErrorStatus  : PT.string,
    clientErrorMessage : PT.string,
    actions            : PT.object.isRequired,
    className          : PT.string
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    translate()(ClientAlert)
);
