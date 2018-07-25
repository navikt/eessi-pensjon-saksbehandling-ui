import React, { Component } from 'react';
import PT from 'prop-types';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';

import * as p4000Actions from '../../actions/p4000';

import ReactDatePicker from 'react-date-picker';
import * as Nav from '../ui/Nav';


const mapStateToProps = (state) => {
    return {
        event : state.p4000.event
    }
};

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, p4000Actions), dispatch)};
};

class DatePicker extends Component {

    state = {
        rangePeriod: true
    };

    renderDate(date) {
        if (!date ) {
            return '';
        }
        return date;
    }

    onStartDateChange(date) {

        let { t, event, actions } = this.props;

       /* if (event.endDate && (
            (event.endDate.year < year) ||
                (event.endDate.year === year && event.endDate.month < month)
        )) {
            this.setState({
                onEndDateFail: t('ui:onEndDateFail')
            })
        } else {
            this.setState({
                onEndDateFail: undefined
            })
        }*/
        actions.setEventProperty('startDate', date);
    }

    onEndDateChange(date) {

        let { t, event, actions } = this.props;
        /*
        if (event.startDate && (
            (year < event.startDate.year) ||
             (year === event.startDate.year && month < event.startDate.month)
        )) {
            this.setState({
                onEndDateFail: t('validation:endDateEarlierThanStartDate')
            })
        } else {
            this.setState({
                onEndDateFail: undefined
            })
        }*/
        actions.setEventProperty('endDate', date);
    }

    setRangePeriod() {
        this.setState({
            rangePeriod: true
        })
    }

    setOpenPeriod() {
        this.setState({
            rangePeriod: false
        })
    }

    render () {

        let { t, event } = this.props;

        return <div>
            <Nav.Row>
                <Nav.Column>
                    <Nav.Radio label={t('ui:rangePeriod')} name='period' checked={this.state.rangePeriod === true}
                        onChange={this.setRangePeriod.bind(this)}/>
                    <Nav.Radio label={t('ui:openPeriod')} name='period' checked={this.state.rangePeriod === false}
                        onChange={this.setOpenPeriod.bind(this)}/>
                </Nav.Column>
            </Nav.Row>
            <Nav.Row>
                <Nav.Column>
                    <ReactDatePicker value={event.startDate}
                        locale='no-NB'
                        onChange={this.onStartDateChange.bind(this)}/>
                    <div>{this.state.onStartDateFail}</div>
                </Nav.Column>
                {this.state.rangePeriod ? <Nav.Column>
                    <ReactDatePicker value={event.endDate}
                         locale='no-NB'
                         onChange={this.onEndDateChange.bind(this)}/>
                    <div>{this.state.onEndDateFail}</div>
                </Nav.Column> : null}
            </Nav.Row>
        </div>
    }
}

DatePicker.propTypes = {
    t       : PT.func.isRequired,
    event   : PT.object.isRequired,
    actions : PT.object.isRequired
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    translate()(DatePicker)
);

