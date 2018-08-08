import React, { Component } from 'react';
import PT from 'prop-types';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';
import classNames from 'classnames';
import moment from 'moment';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.min.css';

import * as p4000Actions from '../../../actions/p4000';

import FileUpload from '../../ui/FileUpload/FileUpload';
import CountrySelect from '../CountrySelect/CountrySelect';
import DatePicker from '../DatePicker/DatePicker';
import Validation from '../Validation';
import * as Nav from '../../ui/Nav';
import Icons from '../../ui/Icons';

const mapStateToProps = (state) => {
    return {
        event    : state.p4000.event,
        editMode : state.p4000.editMode,
        locale   : state.ui.locale
    };
};

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, p4000Actions), dispatch)};
};

class Child extends Component {

    state = {}

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

    hasNoInfoErrors() {
        return this.state.infoValidationError === undefined
    }

    hasNoOtherErrors() {
        return this.state.otherValidationError === undefined
    }

    hasNoValidationErrors() {
        return this.hasNoInfoErrors() && this.hasNoOtherErrors() &&
            this.datepicker ? this.datepicker.hasNoValidationErrors() : undefined;
    }

    async resetValidation() {

        return new Promise(async (resolve, reject) => {

            try {
                if (this.datepicker) {
                    await this.datepicker.resetValidation();
                }
                this.setState({
                    infoValidationError: undefined,
                    otherValidationError: undefined
                }, () => {
                    resolve();
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    async passesValidation() {

        const { event } = this.props;

        return new Promise(async (resolve, reject) => {

            try {
                if (this.datepicker) {
                    await this.datepicker.passesValidation();
                }

                this.setState({
                    infoValidationError : Validation.validateChildInfo(event),
                    otherValidationError : Validation.validateOther(event)
                }, () => {
                    // after setting up state, use it to see the validation state
                    resolve(this.hasNoValidationErrors());
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    handleFileChange(files) {

        const { actions } =  this.props;
        actions.setEventProperty('files', files);
    }

    onBirthDateBlur(e) {

        const { event, actions } = this.props;
        let date = e.target.value;

        if (! /\d\d\.\d\d\.\d\d\d\d/.test(date)) {

            if (!event.birthDate || date !== event.birthDate)  {

                this.setState({
                    infoValidationError : 'p4000:validation-invalidDate'
                },  () => {
                    actions.setEventProperty('birthDate', undefined);
                });
            }
        } else {
            let birthDate = moment(date, 'DD.MM.YYYY').toDate();
            if (!event.birthDate || birthDate.getTime() !== event.birthDate.getTime())  {
                this.onBirthDateHandle(birthDate);
            }
        }
    }

    onBirthDateChange(moment) {

        const { event } = this.props;

        let date = moment.toDate();
        if (!event.birthDate || date.getTime() !== event.birthDate.getTime())  {
            this.onBirthDateHandle(date);
        }
    }

    onBirthDateHandle(date) {

        let { actions } = this.props;
        let infoValidationError = undefined;

        if (date > new Date()) {
            infoValidationError = 'p4000:validation-birthDateInfuture';
        }

        this.setState({
            infoValidationError : infoValidationError
        }, () => {
            actions.setEventProperty('birthDate', date);
        });
    }

    render() {

        const { t, event, locale, editMode, actions, type } = this.props;

        return <Nav.Panel className='p-0'>
            <Nav.Row className='eventTitle mb-4'>
                <Nav.Column>
                    <Icons size='3x' kind={type} className='d-inline-block'/>
                    <h1 className='d-inline-block m-0 ml-3 align-bottom'>{ !editMode ? t('ui:new') : t('ui:edit')} {t('p4000:' + type + '-title')}</h1>
                </Nav.Column>
            </Nav.Row>
            <Nav.Row className='eventDescription mb-4 p-4 fieldset'>
                <Nav.Column>
                    <Nav.Ikon className='float-left mr-4' kind='info-sirkel' />
                    <Nav.Tekstomrade>{t('p4000:' + type + '-description')}</Nav.Tekstomrade>
                </Nav.Column>
            </Nav.Row>
            <Nav.Row className={classNames('eventDates','mb-4','p-4','fieldset', {
                validationFail : this.datepicker ? !this.datepicker.hasNoValidationErrors() : false
            })}>
                <Nav.Column>
                    <Nav.HjelpetekstBase>{t('p4000:help-' + type + '-dates')}</Nav.HjelpetekstBase>
                    <h2 className='mb-3'>{t('p4000:' + type + '-fieldset-1-dates-title')}</h2>
                    <DatePicker provideController={(datepicker) => this.datepicker = datepicker}/>
                </Nav.Column>
            </Nav.Row>
            <Nav.Row className={classNames('eventInfo','mb-4','p-4','fieldset', {
                validationFail : this ? !this.hasNoInfoErrors() : false
            })}>
                <Nav.Column>
                    {!this.hasNoInfoErrors() ? <Nav.AlertStripe className='mb-3' type='advarsel'>{t(this.state.infoValidationError)}</Nav.AlertStripe> : null}
                    <Nav.HjelpetekstBase>{t('p4000:help-' + type + '-info')}</Nav.HjelpetekstBase>
                    <h2 className='mb-3'>{t('p4000:' + type + '-fieldset-2-info-title')}</h2>

                    <Nav.Input label={t('p4000:' + type + '-fieldset-2_1-lastname')} value={event.lastname}
                        onChange={(e) => {actions.setEventProperty('lastname', e.target.value)}} />

                    <Nav.Input label={t('p4000:' + type + '-fieldset-2_2-firstname')} value={event.firstname}
                        onChange={(e) => {actions.setEventProperty('firstname', e.target.value)}} />

                    <div>
                        <label>{t('p4000:' + type + '-fieldset-2_3-birthdate')}</label>
                    </div>
                    <div>
                        <ReactDatePicker selected={event.birthDate ? moment(event.birthDate) : undefined}
                            dateFormat='DD.MM.YYYY'
                            placeholderText={t('ui:dateFormat')}
                            showYearDropdown
                            showMonthDropdown
                            dropdownMode='select'
                            locale={locale}
                            onBlur={this.onBirthDateBlur.bind(this)}
                            onChange={this.onBirthDateChange.bind(this)}/>
                    </div>
                </Nav.Column>
            </Nav.Row>
            <Nav.Row className={classNames('eventOther','mb-4','p-4','fieldset', {
                validationFail : this ? ! this.hasNoOtherErrors() : false
            })}>
                <Nav.Column>
                    <h2 className='mb-3'>{t('p4000:' + type + '-fieldset-3-other-title')}</h2>
                    {!this.hasNoOtherErrors() ? <Nav.AlertStripe className='mb-3' type='advarsel'>{t(this.state.otherValidationError)}</Nav.AlertStripe> : null}
                    <div className='mb-3'>
                        <div>
                            <label>{t('ui:country') + ' *'}</label>
                        </div>
                        <CountrySelect locale={locale} value={event.country || {}} multi={false}
                            flagImagePath='../../../flags/'
                            onSelect={(e) => {actions.setEventProperty('country', e)}}/>
                    </div>
                    <Nav.Textarea style={{minHeight:'200px'}} label={t('p4000:' + type + '-fieldset-3_1-other')} value={event.other || ''}
                        onChange={(e) => {actions.setEventProperty('other', e.target.value)}} />
                </Nav.Column>
            </Nav.Row>
            <Nav.Row className={classNames('eventFileUpload','mb-4','p-4','fieldset')}>
                <Nav.Column>
                    <h2 className='mb-3'>{t('ui:fileUpload')}</h2>
                    <FileUpload files={event.files} onFileChange={this.handleFileChange.bind(this)}/>
                </Nav.Column>
            </Nav.Row>
        </Nav.Panel>
    }
}

Child.propTypes = {
    t                 : PT.func.isRequired,
    event             : PT.object.isRequired,
    type              : PT.string.isRequired,
    editMode          : PT.bool.isRequired,
    actions           : PT.object.isRequired,
    provideController : PT.func.isRequired,
    locale            : PT.string.isRequired
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    translate()(Child)
);
