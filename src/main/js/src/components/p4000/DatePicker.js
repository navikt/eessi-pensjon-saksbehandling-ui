import React, { Component } from 'react';
import PT from 'prop-types';
import { translate } from 'react-i18next';

import YearMonthSelector from 'react-year-month-selector';
import 'react-year-month-selector/src/styles/index.css';
import './custom-datepicker.css';
import * as Nav from '../ui/Nav';

class DatePicker extends Component {

    state = {
        rangePeriod: true
    };

    onStartDateChange(year, month) {

        let { t, onStartDatePicked } = this.props;
        let fixedMonth = month + 1;
        this.setState({
            startYear : year,
            startMonth: fixedMonth,
            onStartDate: year + '/' + fixedMonth
        }, () => {
            if (this.state.endYear < this.state.startYear ||
             (this.state.endYear === this.startYear && this.state.endMonth < this.state.startMonth)) {
                 this.setState({
                      onEndDateFail: t('ui:onEndDateFail')
                 })
             } else {
                  this.setState({
                      onEndDateFail: undefined
                  })
             }
             onStartDatePicked(year, fixedMonth);
        });
    }

    onEndDateChange(year, month) {

        let { t, onEndDatePicked } = this.props;
        let fixedMonth = month + 1;
        this.setState({
            endYear : year,
            endMonth: fixedMonth,
            onEndDate: year + '/' + fixedMonth
        }, () => {
           if (this.state.endYear < this.state.startYear ||
            (this.state.endYear === this.startYear && this.state.endMonth < this.state.startMonth)) {
                this.setState({
                     onEndDateFail: t('validation:endDateEarlierThanStartDate')
                })
            } else {
                 this.setState({
                     onEndDateFail: undefined
                 })
            }
            onEndDatePicked(year, fixedMonth);
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

        let { t, onStartDatePicked, onEndDatePicked } = this.props;

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
                <Nav.Input label={t('ui:startDate')} value={this.state.onStartDate}
                onFocus={this.onFocus.bind(this, 'startopen')}
                feil={this.state.onStartDateFail ? {'feilmelding' : this.state.onStartDateFail} : null}/>
                <YearMonthSelector onChange={this.onStartDateChange.bind(this)} open={this.state.startopen}
                onClose={this.onClose.bind(this, 'startopen')}/>
            </Nav.Column>
            {this.state.rangePeriod ? <Nav.Column>
                    <Nav.Input label={t('ui:endDate')} value={this.state.onEndDate}
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
    t                 : PT.func.isRequired
};

export default translate()(DatePicker);

