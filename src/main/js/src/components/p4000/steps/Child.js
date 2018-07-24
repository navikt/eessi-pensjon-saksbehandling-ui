import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PT from 'prop-types';
import { translate } from 'react-i18next';
import { bindActionCreators }  from 'redux';

import DatePicker from '../../../components/p4000/DatePicker';
import * as Nav from '../../../components/ui/Nav';
import Icons from '../../../components/ui/Icons';

import * as p4000Actions from '../../../actions/p4000';

const mapStateToProps = (state) => {
    return {
        events : state.p4000.events
    }
};

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, p4000Actions), dispatch)};
};

class Child extends Component {

    state = {
        type: 'child'
    }

    componentDidMount() {

        const { editFormEvent } = this.props;

        if (editFormEvent) {
            this.setState(editFormEvent);
        }
    }

    onStartDatePicked(year, month) {
        this.setState({
            startDate: {year: year, month: month}
        });
    }

    onEndDatePicked(year, month) {
        this.setState({
            endDate: {year: year, month: month}
        });
    }

    saveForm () {
        const { actions } = this.props;
        actions.pushEventToP4000Form(this.state);
    }

    render() {

        const { t } = this.props;

        return <div>
            <Nav.Row>
                <Nav.Column className='mt-4'>
                    <Icons size='3x' kind='child' className='d-inline-block'/>
                    <h1 className='d-inline-block m-0 ml-3 align-bottom'>{t('content:p4000-child')}</h1>
                </Nav.Column>
            </Nav.Row>
            <Nav.Row className='mt-4'>
                <Nav.Column>
                    <DatePicker
                        onStartDatePicked={this.onStartDatePicked.bind(this)}
                        onEndDatePicked={this.onEndDatePicked.bind(this)}
                    />
                </Nav.Column>
            </Nav.Row>
            <Nav.Row className='mt-4'>
                <Nav.Column>
                    <Nav.Input label={t('content:p4000-activity')} value={this.state.activity}
                        onChange={(e) => {this.setState({activity: e.target.value})}} />
                </Nav.Column>
            </Nav.Row>
            <Nav.Row className='mt-4'>
                <Nav.Column>
                    <Nav.Hovedknapp className='forwardButton' onClick={this.saveForm.bind(this)}>{t('ui:save')}</Nav.Hovedknapp>
                </Nav.Column>
            </Nav.Row>
        </div>
    }
}

Child.propTypes = {
    t : PT.func
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    translate()(Child)
);
