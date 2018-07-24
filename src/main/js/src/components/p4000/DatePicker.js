import React, { Component } from 'react';
import PT from 'prop-types';
import { translate } from 'react-i18next';
import _ from 'lodash';

import YearMonthSelector from 'react-year-month-selector';
import 'react-year-month-selector/src/styles/index.css';
import './custom-datepicker.css';
import * as Nav from '../ui/Nav';

class DatePicker extends Component {

    state = {
        rangePeriod: true,
        startDate: {},
        endDate: {}
    };

    componentDidUpdate() {

        const { initialStartDate, initialEndDate } = this.props;
        if (initialStartDate && _.isEmpty(this.state.startDate)) {
            this.setState({
                startDate: initialStartDate
            });
        }
        if (initialEndDate && _.isEmpty(this.state.endDate)) {
            this.setState({
                endDate: initialEndDate
            });
        }
    }

    renderDate(date) {
        if (!date.year) {
            return '';
        }
        return date.year + '/' + date.month;
    }

    onStartDateChange(year, month) {

        let { t, onStartDatePicked } = this.props;

        this.setState({
            startDate : {year: year, month : month + 1}
        }, () => {
            if (this.state.endDate && (
                (this.state.endDate.year < this.state.startDate.year) ||
                (this.state.endDate.year === this.state.startDate.year && this.state.endDate.month < this.state.startDate.month)
            )) {
                this.setState({
                    onEndDateFail: t('ui:onEndDateFail')
                })
            } else {
                this.setState({
                    onEndDateFail: undefined
                })
            }
            onStartDatePicked(year, month + 1);
        });
    }

    onEndDateChange(year, month) {

        let { t, onEndDatePicked } = this.props;

        this.setState({
            endDate: {year: year, month : month + 1}
        }, () => {
            if (this.state.startDate && (
                (this.state.endDate.year < this.state.startDate.year) ||
                (this.state.endDate.year === this.state.startDate.year && this.state.endDate.month < this.state.startDate.month)
            )) {
                this.setState({
                    onEndDateFail: t('validation:endDateEarlierThanStartDate')
                })
            } else {
                this.setState({
                    onEndDateFail: undefined
                })
            }
            onEndDatePicked(year, month + 1);
        });
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

        let { t } = this.props;

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
                    <Nav.Input label={t('ui:startDate')} value={this.renderDate(this.state.startDate)}
                        onFocus={this.onFocus.bind(this, 'startopen')}
                        feil={this.state.onStartDateFail ? {'feilmelding' : this.state.onStartDateFail} : null}/>
                    <YearMonthSelector onChange={this.onStartDateChange.bind(this)} open={this.state.startopen}
                        onClose={this.onClose.bind(this, 'startopen')}/>
                </Nav.Column>
                {this.state.rangePeriod ? <Nav.Column>
                    <Nav.Input label={t('ui:endDate')} value={this.renderDate(this.state.endDate)}
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
    onStartDatePicked : PT.func.isRequired,
    onEndDatePicked   : PT.func.isRequired,
    initialStartDate  : PT.object,
    initialEndDate    : PT.object,
    t                 : PT.func.isRequired
};

export default translate()(DatePicker);

