import React, { Component } from 'react';
import PT from 'prop-types';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';
import classNames from 'classnames';
import ReactDatePicker from 'react-date-picker';

import Validation from './Validation';
import * as Nav from '../ui/Nav';
import * as p4000Actions from '../../actions/p4000';

import './custom-datepicker.css';

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
        rangeType: 'both',
        validationError: undefined
    };

    componentDidMount() {

        this.props.provideController({
            hasNoValidationErrors : this.hasNoValidationErrors.bind(this),
            passesValidation      : this.passesValidation.bind(this),
            resetValidation       : this.resetValidation.bind(this)
        });
    }

    componentWillUnmount() {

        this.props.provideController(null)
    }

    hasNoValidationErrors() {

        return this.state.validationError === undefined;
    }

    async resetValidation() {

        return new Promise(async (resolve, reject) => {

            try {
                this.setState({
                    validationError: undefined
                }, () => {
                    // after setting up state, use it to see the validation state
                    resolve();
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    async passesValidation() {

        const { event } = this.props;

        return new Promise((resolve, reject) => {

            try {
                this.setState({
                    validationError : Validation.validateDatePicker(this.state.rangeType, event)
                }, () => {
                    // after setting up state, use it to see the validation state
                    resolve(this.hasNoValidationErrors());
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    handlePeriodChange(e) {

        let { event, actions } = this.props;
        let rangeType = e.target.value;

        this.setState({
            rangeType: rangeType
        }, () => {
            if (rangeType === 'onlyEndDate' && event.startDate) {
                actions.setEventProperty('startDate', undefined);
            }
            if (rangeType === 'onlyStartDate' && event.endDate) {
                actions.setEventProperty('endDate', undefined);
            }
        });
    }

    onStartDateChange(date) {

        let { event, actions } = this.props;
        let validationError = undefined;

        if (this.state.rangeType === 'both') {
            if (event.endDate && event.endDate < date) {
                validationError = 'p4000:validation-endDateEarlierThanStartDate';
            }
        }
        if (date > new Date()) {
            validationError = 'p4000:validation-startDateCantBeInFuture';
        }

        this.setState({
            validationError : validationError
        }, () => {
            actions.setEventProperty('startDate', date);
        });
    }

    onEndDateChange(date) {

        let { event, actions } = this.props;
        let validationError = undefined;

        if (this.state.rangeType === 'both') {
            if (event.startDate && event.startDate > date) {
                validationError = 'p4000:validation-endDateEarlierThanStartDate';
            }
        }
        if (date > new Date()) {
            validationError = 'p4000:validation-endDateCantBeInFuture';
        }

        this.setState({
            validationError : validationError
        }, () => {
            actions.setEventProperty('endDate', date);
        });
    }

    handleUncertainDateChange(e) {

        let { actions } = this.props;
        actions.setEventProperty('uncertainDate', e.target.value);
    }

    render () {

        let { t, event } = this.props;

        return <div className={classNames('div-datePicker', 'p-2')}>
            {!this.hasNoValidationErrors() ? <Nav.AlertStripe className='mb-3' type='advarsel'>{t(this.state.validationError)}</Nav.AlertStripe> : null}
            <Nav.Row className='row-datePicker-toggleButton no-gutters mb-3'>
                <Nav.Column className='text-center'>
                    <Nav.ToggleGruppe name='datePickerType' style={{display: 'inline-flex'}} onChange={this.handlePeriodChange.bind(this)}>
                        <Nav.ToggleKnapp value='both' defaultChecked={true} key='1'>{t('ui:rangePeriod')}</Nav.ToggleKnapp>
                        <Nav.ToggleKnapp value='onlyStartDate' defaultChecked={false} key='2'>{t('ui:onlyStartDate')}</Nav.ToggleKnapp>
                        <Nav.ToggleKnapp value='onlyEndDate' defaultChecked={false} key='3'>{t('ui:onlyEndDate')}</Nav.ToggleKnapp>
                    </Nav.ToggleGruppe>
                    <Nav.Checkbox className='d-inline-flex ml-4' label={t('p4000:uncertainDate')}
                        checked={event.uncertainDate}
                        onChange={this.handleUncertainDateChange.bind(this)}/>
                </Nav.Column>
            </Nav.Row>
            <Nav.Row className='row-datepickers no-gutters'>
                <Nav.Column className='text-center'>
                    <ReactDatePicker value={event.startDate} disabled={this.state.rangeType === 'onlyEndDate'}
                        locale='no-NB'
                        onChange={this.onStartDateChange.bind(this)}/>
                    <div>{this.state.onStartDateFail}</div>
                </Nav.Column>
                <Nav.Column className='text-center'>
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
    t                 : PT.func.isRequired,
    event             : PT.object.isRequired,
    actions           : PT.object.isRequired,
    provideController : PT.func.isRequired
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    translate()(DatePicker)
);
