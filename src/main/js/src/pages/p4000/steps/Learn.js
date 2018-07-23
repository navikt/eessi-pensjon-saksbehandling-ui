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

class Learn extends Component {

    render() {

        const { t } = this.props;

        return <Nav.Row className='mt-4 text-left'>
            <Nav.Column>
                Learn
            </Nav.Column>
        </Nav.Row>
    }
}

Learn.propTypes = {
    t        : PT.func
};

export default connect(
    mapStateToProps,
    {}
)(
    translate()(Learn)
);
