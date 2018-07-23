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

class Voluntary extends Component {

    render() {

        const { t } = this.props;

        return <Nav.Row className='mt-4 text-left'>
            <Nav.Column>
                Voluntary
            </Nav.Column>
        </Nav.Row>
    }
}

Voluntary.propTypes = {
    t        : PT.func
};

export default connect(
    mapStateToProps,
    {}
)(
    translate()(Voluntary)
);
