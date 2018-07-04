import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import * as Nav from './Nav';

const mapStateToProps = (state) => {
    return {
        serverError : state.ui.serverError
    }
};

class AlertHeader extends Component {

    render () {

        let { t, serverError } = this.props;

        if (!serverError) { return null }

        return <Nav.AlertStripe type='advarsel' solid={true}>{t('error:' + serverError)}</Nav.AlertStripe>
    }
}

AlertHeader.propTypes = {
    t           : PT.func.isRequired,
    serverError : PT.string
}

export default connect(
    mapStateToProps,
    {}
)(
    translate()(AlertHeader)
);
