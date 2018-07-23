import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PT from 'prop-types';
import { translate } from 'react-i18next';
import { bindActionCreators }  from 'redux';

import * as Nav from '../../../components/ui/Nav';
import TimelineComponent from '../../../components/p4000/Timeline';

import * as p4000Actions from '../../../actions/p4000';

const mapStateToProps = (state) => {
    return {
        form : state.p4000.form
    }
};

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, p4000Actions), dispatch)};
};

class Timeline extends Component {

    render() {

        const { t } = this.props;

        return <Nav.Row style={{backgroundColor: 'whitesmoke'}}>
            <Nav.Column>
                <TimelineComponent/>
            </Nav.Column>
        </Nav.Row>
    }
}

Timeline.propTypes = {
    t : PT.func
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    translate()(Timeline)
);
