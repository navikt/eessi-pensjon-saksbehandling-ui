import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PT from 'prop-types';
import { translate } from 'react-i18next';

import * as Nav from '../../../components/ui/Nav'

const mapStateToProps = (state) => {
    return {
    }
};

class Daily extends Component {

    render() {

        const { t } = this.props;

        return <Nav.Row className='mt-4 text-left'>
            <Nav.Column>
                Daily
            </Nav.Column>
        </Nav.Row>
    }
}

Daily.propTypes = {
    t        : PT.func
};

export default connect(
    mapStateToProps,
    {}
)(
    translate()(Daily)
);
