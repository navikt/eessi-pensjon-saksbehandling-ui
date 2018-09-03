import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import * as Nav from '../Nav';

const mapStateToProps = (state) => {
    return {
        serverErrorMessage : state.alert.serverErrorMessage
    }
};

class ServerAlert extends Component {

    render () {

        let { t, serverErrorMessage } = this.props;

        if (!serverErrorMessage) { return null }

        return <Nav.AlertStripe type='advarsel' solid={true}>{t(serverErrorMessage)}</Nav.AlertStripe>
    }
}

ServerAlert.propTypes = {
    t                  : PT.func.isRequired,
    serverErrorMessage : PT.string
}

export default connect(
    mapStateToProps,
    {}
)(
    translate()(ServerAlert)
);
