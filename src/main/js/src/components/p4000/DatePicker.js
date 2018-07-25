import React, { Component } from 'react';
import PT from 'prop-types';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';

import * as p4000Actions from '../../actions/p4000';

import YearMonthSelector from 'react-year-month-selector';
import 'react-year-month-selector/src/styles/index.css';
import './custom-datepicker.css';
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
        if (!date || !date.year) {
            return '';
        }
        return date.year + '/' + date.month;
    }

    onStartDateChange(year, month) {

        let { t, event, actions } = this.props;

        if (event.endDate && (
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
        }
        actions.setEventProperty('startDate', {year: year, month: month});
    }

    onEndDateChange(year, month) {

        let { t, event, actions } = this.props;

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
        }
        actions.setEventProperty('endDate', {year: year, month: month});
    }

    onFocus (input) {

        this.setState({[input]: true});
    }

    onClose(input) {

        this.setState({[input]: false});
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
                    <Nav.Input label={t('ui:startDate')} value={this.renderDate(event.startDate)}
                        onFocus={this.onFocus.bind(this, 'startopen')}
                        feil={this.state.onStartDateFail ? {'feilmelding' : this.state.onStartDateFail} : null}/>
                    <YearMonthSelector onChange={this.onStartDateChange.bind(this)} open={this.state.startopen}
                        onClose={this.onClose.bind(this, 'startopen')}/>
                </Nav.Column>
                {this.state.rangePeriod ? <Nav.Column>
                    <Nav.Input label={t('ui:endDate')} value={this.renderDate(event.endDate)}
                        onFocus={this.onFocus.bind(this, 'endopen')}
                        feil={this.state.onEndDateFail ? {'feilmelding' : this.state.onEndDateFail} : null}/>
                    <YearMonthSelector onChange={this.onEndDateChange.bind(this)} open={this.state.endopen}
                        onClose={this.onClose.bind(this, 'endopen')}/>
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

