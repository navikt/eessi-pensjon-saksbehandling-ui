import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PT from 'prop-types';
import { translate } from 'react-i18next';

import DatePicker from '../../../components/p4000/DatePicker';

import * as Nav from '../../../components/ui/Nav'

const mapStateToProps = (state) => {
    return {
    }
};

class Work extends Component {

    onDatePicked(year, month) {

        console.log(year + ' ' + month);
    }

    render() {

        const { t } = this.props;

        return <Nav.Row className='mt-4 text-left'>
            <Nav.Column>
                <DatePicker onDatePicked={this.onDatePicked.bind(this)}/>
            </Nav.Column>
        </Nav.Row>
    }
}

Work.propTypes = {
    t        : PT.func
};

export default connect(
    mapStateToProps,
    {}
)(
    translate()(Work)
);
