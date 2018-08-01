import React, { Component } from 'react';
import PT from 'prop-types';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';
import classNames from 'classnames';
import ReactDatePicker from 'react-date-picker';

import Validation from '../Validation';
import * as Nav from '../../ui/Nav';
import * as p4000Actions from '../../../actions/p4000';

import './DatePicker.css';

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
        dateType: 'both',
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
                    validationError : Validation.validateDatePicker(this.state.dateType, event)
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
        let dateType = e.target.value;

        this.setState({
            dateType: dateType
        }, () => {
            actions.setEventProperty('dateType', dateType);
            if (dateType !== 'both' && event.endDate) {
                actions.setEventProperty('endDate', undefined);
            }
        });
    }

    onStartDateChange(date) {

        let { event, actions } = this.props;
        let validationError = undefined;

        if (this.state.dateType === 'both') {
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
            actions.setEventProperty('dateType', this.state.dateType);
            actions.setEventProperty('startDate', date);
        });
    }

    onEndDateChange(date) {

        let { event, actions } = this.props;
        let validationError = undefined;

        if (this.state.dateType === 'both') {
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
            actions.setEventProperty('dateType', this.state.dateType);
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
            <Nav.Row className='row-datePicker-toggleButton no-gutters'>
                <Nav.Column className='text-center mb-4'>
                    <Nav.ToggleGruppe name='datePickerType' style={{display: 'inline-flex'}} onChange={this.handlePeriodChange.bind(this)}>
                        <Nav.ToggleKnapp value='both' defaultChecked={true} key='1'>{t('p4000:rangePeriod')}</Nav.ToggleKnapp>
                        <Nav.ToggleKnapp value='onlyStartDate01' defaultChecked={false} key='2'>{t('p4000:onlyStartDate01')}</Nav.ToggleKnapp>
                        <Nav.ToggleKnapp value='onlyStartDate98' defaultChecked={false} key='3'>{t('p4000:onlyStartDate98')}</Nav.ToggleKnapp>
                    </Nav.ToggleGruppe>
                    <Nav.Checkbox className='d-inline-flex ml-4 mt-3' label={t('p4000:uncertainDate')}
                        checked={event.uncertainDate}
                        onChange={this.handleUncertainDateChange.bind(this)}/>
                </Nav.Column>
            </Nav.Row>
            <Nav.Row className='row-datepickers no-gutters'>
                <Nav.Column className='text-center'>
                    <label className='mr-3'>{t('ui:startDate') + ' *'}</label>
                    <ReactDatePicker value={event.startDate}
                        locale='no-NB'
                        onChange={this.onStartDateChange.bind(this)}/>
                    <div>{this.state.onStartDateFail}</div>
                </Nav.Column>
                <Nav.Column className='text-center'>
                    <label className='mr-3'>{t('ui:endDate')}</label>
                    <ReactDatePicker value={event.endDate} disabled={this.state.dateType !== 'both'}
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
