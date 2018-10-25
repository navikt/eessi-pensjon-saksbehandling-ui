import React from 'react';
import uuidv4 from 'uuid/v4';
import PT from 'prop-types';
import moment from 'moment';
import ReactDatePicker from 'react-datepicker';
import classNames from 'classnames';

import CountrySelect from '../ui/CountrySelect/CountrySelect'
import {onDateChange, onChange, onSelect, onInvalid} from './shared/eventFunctions'
import * as Nav from '../ui/Nav';


const errorMessages = {
    workType: {patternMismatch: 'patternMismatch', valueMissing: 'valueMissing', typeMismatch: 'typeMismatch'},
    workStartDate: {patternMismatch: 'patternMismatch', valueMissing: 'valueMissing', typeMismatch: 'typeMismatch', customError: 'customError'},
    workEndDate: {patternMismatch: 'patternMismatch', valueMissing: 'valueMissing', typeMismatch: 'typeMismatch', customError: 'customError'},
    workEstimatedRetirementDate: {patternMismatch: 'patternMismatch', valueMissing: 'valueMissing', typeMismatch: 'typeMismatch', customError: 'customError'},
    workHourPerWeek: {patternMismatch: 'patternMismatch', valueMissing: 'valueMissing', typeMismatch: 'typeMismatch'},
    workIncome: {patternMismatch: 'patternMismatch', valueMissing: 'valueMissing', typeMismatch: 'typeMismatch'},
    workIncomeCurrency: {patternMismatch: 'patternMismatch', valueMissing: 'valueMissing', typeMismatch: 'typeMismatch'},
    workPaymentDate: {patternMismatch: 'patternMismatch', valueMissing: 'valueMissing', typeMismatch: 'typeMismatch'},
    workPaymentFrequency: {patternMismatch: 'patternMismatch', valueMissing: 'valueMissing', typeMismatch: 'typeMismatch'}
}


export class Work extends React.Component{
    constructor(props){
        super(props);
        this.onInvalid = onInvalid.bind(this, errorMessages);
        this.onChange = onChange.bind(this, errorMessages);
        this.onSelect = onSelect.bind(this, 'workIncomeCurrency');
        this.onDateChange = onDateChange;

       

        let uuid = uuidv4();
        let nameToId = Object.keys(this.props.work).reduce((acc, cur, i)=>({...acc, [cur]: uuid+'_'+i }) , {});
        let idToName = Object.keys(this.props.work).reduce((acc, cur)=>({...acc, [nameToId[cur]]: cur }) , {});
        let inputStates = Object.keys(this.props.work).reduce((acc, cur)=> ({...acc, [cur]: {
            showError: false,
            error: null,
            errorType: null,
            action: this.props.action.bind(null, cur)
        }}), {});
        this.state = {
            ref: React.createRef(),
            idToName,
            nameToId,
            inputStates,
        };
    }

    render(){
        const {t, work} = this.props;
        const nameToId = this.state.nameToId;
        const inputStates = this.state.inputStates; 
        return(
            <div className='mt-3'>
                <Nav.Row className='mb-4'>
                    <div className='col-md-6'>

                        <Nav.Select
                            label={t('pinfo:form-workType') + ' *'}
                            defaultValue={work.workType || ''}
                            onChange={this.onChange}
                            required={!inputStates.workType.showError}
                            id={nameToId['workType']}
                            onInvalid={this.onInvalid}
                            feil={inputStates.workType.error}                         
                        >
                            <option value=''>{t('pinfo:form-workType-select-option')}</option>
                            <option value='01'>{t('pinfo:form-workType-option-01')}</option>
                            <option value='02'>{t('pinfo:form-workType-option-02')}</option>
                            <option value='03'>{t('pinfo:form-workType-option-03')}</option>
                            <option value='04'>{t('pinfo:form-workType-option-04')}</option>
                            <option value='05'>{t('pinfo:form-workType-option-05')}</option>
                            <option value='06'>{t('pinfo:form-workType-option-06')}</option>
                            <option value='07'>{t('pinfo:form-workType-option-07')}</option>
                            <option value='08'>{t('pinfo:form-workType-option-08')}</option>
                        </Nav.Select>
                    </div>
                </Nav.Row>
                <Nav.Row className='mb-4'>
                    <div className='col-md-4'>
                        <label>{t('pinfo:form-workStartDate')+ ' *'}</label>
                        <ReactDatePicker
                            className={
                                classNames(
                                    'skjemaelement__input input--fullbredde',
                                    {'skjemaelement__input--harFeil': inputStates.workStartDate.showError}
                                )
                            }
                            selected={work.workStartDate ? moment(work.workStartDate) : undefined}
                            dateFormat='DD.MM.YYYY'
                            placeholderText={t('ui:dateFormat')}
                            showYearDropdown
                            showMonthDropdown
                            dropdownMode='select'
                            locale={this.props.locale}
                            onMonthChange={this.onDateChange.bind(this, 'workStartDate')}
                            onYearChange={this.onDateChange.bind(this, 'workStartDate')}
                            onChange={this.onDateChange.bind(this, 'workStartDate')}
                            required={!inputStates.workStartDate.showError}
                            id={nameToId['workStartDate']}
                            customInput={
                                inputStates.workStartDate.showError?
                                    <input onInvalid={this.onInvalid} />:
                                    <input onInvalid={this.onInvalid} pattern="\d\d\.\d\d\.\d\d\d\d" />
                            }
                        />
                        {inputStates.workStartDate.showError?
                            <div role="alert" aria-live="assertive">
                                <div className="skjemaelement__feilmelding">{inputStates.workStartDate.error.feilmelding}</div>
                            </div>: null 
                        }
                    </div>
                    <div className='col-md-4'>
                        <label>{t('pinfo:form-workEndDate')+ ' *'}</label>
                        <ReactDatePicker
                            className={
                                classNames(
                                    'skjemaelement__input input--fullbredde',
                                    {'skjemaelement__input--harFeil': inputStates.workEndDate.showError}
                                )
                            }                        
                            selected={work.workEndDate ? moment(work.workEndDate) : undefined}
                            dateFormat='DD.MM.YYYY'
                            placeholderText={t('ui:dateFormat')}
                            showYearDropdown
                            showMonthDropdown
                            dropdownMode='select'
                            locale={this.props.locale}
                            onMonthChange={this.onDateChange.bind(this, 'workEndDate')}
                            onYearChange={this.onDateChange.bind(this, 'workEndDate')}
                            onChange={this.onDateChange.bind(this, 'workEndDate')}
                            required={!inputStates.workEndDate.showError}
                            id={nameToId['workEndDate']}
                            customInput={inputStates.workEndDate.showError?
                                <input onInvalid={this.onInvalid} />:
                                <input onInvalid={this.onInvalid} pattern="\d\d\.\d\d\.\d\d\d\d" />
                            }
                        />
                        {inputStates.workEndDate.showError?
                            <div role="alert" aria-live="assertive">
                                <div className="skjemaelement__feilmelding">{inputStates.workEndDate.error.feilmelding}</div>
                            </div>: null 
                        }
                    </div>
                    <div className='col-md-4'>
                        <label>{t('pinfo:form-workEstimatedRetirementDate')+ ' *'}</label>
                        <ReactDatePicker
                            className={
                                classNames(
                                    'skjemaelement__input input--fullbredde',
                                    {'skjemaelement__input--harFeil': inputStates.workEstimatedRetirementDate.showError}
                                )
                            }
                            selected={work.workEstimatedRetirementDate ? moment(work.workEstimatedRetirementDate) : undefined}
                            dateFormat='DD.MM.YYYY'
                            placeholderText={t('ui:dateFormat')}
                            showYearDropdown
                            showMonthDropdown
                            dropdownMode='select'
                            locale={this.props.locale}
                            onMonthChange={this.onDateChange.bind(this, 'workEstimatedRetirementDate')}
                            onYearChange={this.onDateChange.bind(this, 'workEstimatedRetirementDate')}
                            onChange={this.onDateChange.bind(this, 'workEstimatedRetirementDate')}
                            required={!inputStates.workEstimatedRetirementDate.showError}
                            id={nameToId['workEstimatedRetirementDate']}
                            customInput={inputStates.workEstimatedRetirementDate.showError?
                                <input onInvalid={this.onInvalid} />:
                                <input onInvalid={this.onInvalid} pattern="\d\d\.\d\d\.\d\d\d\d" />
                            }
                        />
                        {inputStates.workEstimatedRetirementDate.showError?
                            <div role="alert" aria-live="assertive">
                                <div className="skjemaelement__feilmelding">{inputStates.workEstimatedRetirementDate.error.feilmelding}</div>
                            </div>: null 
                        }
                    </div>
                </Nav.Row>
                <Nav.Row className='mb-4'>
                    <div className='col-md-6'>
                        <Nav.Input label={t('pinfo:form-workHourPerWeek') + ' *'} value={work.workHourPerWeek || ''}
                            onChange={this.onChange}
                            required={!inputStates.workHourPerWeek.showError}
                            id={nameToId['workHourPerWeek']}
                            onInvalid={this.onInvalid}
                            feil={inputStates.workHourPerWeek.error}
                        />

                    </div>
                </Nav.Row>
                <Nav.Row className='mb-4'>
                    <div className='col-md-6'>
                        <Nav.Input label={t('pinfo:form-workIncome') + ' *'} value={work.workIncome || ''}
                            onChange={this.onChange}
                            required={!inputStates.workIncome.showError}
                            onInvalid={this.onInvalid}
                            id={nameToId['workIncome']}
                            feil={inputStates.workIncome.error}
                        />
                    </div>
                    <div className='col-md-6'>
                        <label>{t('pinfo:form-workIncomeCurrency') + ' *'}</label>
                        <CountrySelect locale={this.props.locale} type={'currency'}
                            value={work.workIncomeCurrency || null}
                            onSelect={this.onSelect}
                            customInputProps={{
                                required: work.workIncomeCurrency || inputStates.workIncomeCurrency.showError? false: true,
                                onInvalid: this.onInvalid,
                                id: nameToId['workIncomeCurrency']
                            }}
                            error={inputStates.workIncomeCurrency.showError}
                            errorMessage={
                                inputStates.workIncomeCurrency.error?
                                    inputStates.workIncomeCurrency.error.feilmelding:
                                    null
                            }
                        />

                    </div>
                </Nav.Row>
                <Nav.Row className='mb-4'>
                    <div className='col-md-6'>
                        <label>{t('pinfo:form-workPaymentDate')+ ' *'}</label>
                        <ReactDatePicker
                            className={
                                classNames(
                                    'skjemaelement__input input--fullbredde',
                                    {'skjemaelement__input--harFeil': inputStates.workPaymentDate.showError}
                                )
                            }
                            selected={work.workPaymentDate ? moment(work.workPaymentDate) : undefined}
                            dateFormat='DD.MM.YYYY'
                            placeholderText={t('ui:dateFormat')}
                            showYearDropdown
                            showMonthDropdown
                            dropdownMode='select'
                            locale={this.props.locale}
                            onMonthChange={this.onDateChange.bind(this, 'workPaymentDate')}
                            onYearChange={this.onDateChange.bind(this, 'workPaymentDate')}
                            onChange={this.onDateChange.bind(this, 'workPaymentDate')}
                            required={!inputStates.workPaymentDate.showError}
                            style={{'background-color': 'red'}}
                            id={nameToId['workPaymentDate']}
                            customInput={inputStates.workPaymentDate.showError?
                                <input onInvalid={this.onInvalid} />:
                                <input onInvalid={this.onInvalid} pattern="\d\d\.\d\d\.\d\d\d\d" />
                            }
                        />
                        {inputStates.workPaymentDate.showError?
                            <div role="alert" aria-live="assertive">
                                <div className="skjemaelement__feilmelding">{inputStates.workPaymentDate.error.feilmelding}</div>
                            </div>: null 
                        }
                    </div>
                    <div className='col-md-6'>
                        <Nav.Select label={t('pinfo:form-workPaymentFrequency') + ' *'} value={work.workPaymentFrequency || ''}
                            onChange={this.onChange}
                            required={!inputStates.workPaymentFrequency.showError}
                            id={nameToId['workPaymentFrequency']}
                            onInvalid={this.onInvalid}
                            feil={inputStates.workPaymentFrequency.error}
                        >
                            <option value=''>{t('pinfo:form-workPaymentFrequency-choose-option')}</option>
                            <option value='01'>{t('pinfo:form-workPaymentFrequency-option-01')}</option>
                            <option value='02'>{t('pinfo:form-workPaymentFrequency-option-02')}</option>
                            <option value='03'>{t('pinfo:form-workPaymentFrequency-option-03')}</option>
                            <option value='04'>{t('pinfo:form-workPaymentFrequency-option-04')}</option>
                            <option value='05'>{t('pinfo:form-workPaymentFrequency-option-05')}</option>
                            <option value='06'>{t('pinfo:form-workPaymentFrequency-option-06')}</option>
                            <option value='99'>{t('pinfo:form-workPaymentFrequency-option-99')}</option>
                        </Nav.Select>
                    </div>
                </Nav.Row>
            </div>
        );
    }
}
Work.propTypes = {
    work    : PT.object,
    action  : PT.func,
    t       : PT.func,
    locale  : PT.string
};


export default Work;
