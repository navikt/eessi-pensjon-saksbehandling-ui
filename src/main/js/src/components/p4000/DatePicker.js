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
        rangeType: 'both'
    };

    handlePeriodChange(e) {
          this.setState({
              rangeType: e.target.value
          });
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

    render () {

        let { t, event } = this.props;

        return <div className='div-datePicker p-2'>
            <Nav.Row className='row-datePicker-toggleButton no-gutters mb-3'>
                <Nav.Column>
                    <Nav.ToggleGruppe onChange={this.handlePeriodChange.bind(this)}>
                        <Nav.ToggleKnapp value='both' defaultChecked={true} key='1'>{t('ui:rangePeriod')}</Nav.ToggleKnapp>
                        <Nav.ToggleKnapp value='onlyStartDate' defaultChecked={false} key='2'>{t('ui:onlyStartDate')}</Nav.ToggleKnapp>
                        <Nav.ToggleKnapp value='onlyEndDate' defaultChecked={false} key='3'>{t('ui:onlyEndDate')}</Nav.ToggleKnapp>
                    </Nav.ToggleGruppe>
                </Nav.Column>
            </Nav.Row>
            <Nav.Row className='row-datepickers no-gutters'>
                <Nav.Column className='col-3'>
                    <ReactDatePicker value={event.startDate} disabled={this.state.rangeType === 'onlyEndDate'}
                        locale='no-NB'
                        onChange={this.onStartDateChange.bind(this)}/>
                    <div>{this.state.onStartDateFail}</div>
                </Nav.Column>
                <Nav.Column className='col-3'>
                    <ReactDatePicker value={event.endDate} disabled={this.state.rangeType === 'onlyStartDate'}
                         locale='no-NB'
                         onChange={this.onEndDateChange.bind(this)}/>
                    <div>{this.state.onEndDateFail}</div>
                </Nav.Column>
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

