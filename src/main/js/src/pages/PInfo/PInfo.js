import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';
import PT from 'prop-types';
import { translate } from 'react-i18next';
import classNames from 'classnames';
import _ from 'lodash';
import moment from 'moment';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.min.css';

import Icons from '../../components/ui/Icons';
import * as Nav from '../../components/ui/Nav';
import TopContainer from '../../components/ui/TopContainer';
import ClientAlert from '../../components/ui/Alert/ClientAlert';
import CountrySelect from '../../components/ui/CountrySelect/CountrySelect';
import FileUpload from '../../components/ui/FileUpload/FileUpload';
import P4000Util from '../../components/p4000/Util';
import File from '../../components/ui/File/File';

import * as pinfoActions from '../../actions/pinfo';
import * as uiActions from '../../actions/ui';

import './PInfo.css';

const mapStateToProps = (state) => {
    return {
        locale : state.ui.locale
    }
};

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, pinfoActions, uiActions), dispatch)};
};

class PInfo extends Component {

    state = {
        isLoaded : false,
        step     : 0,
        maxstep  : 6,
        validationError: undefined
    };

    componentDidMount() {

        this.setState({
            isLoaded : true
        })
    }

    async onBackButtonClick() {

        await this.resetValidation();
        this.setState({
            step: this.state.step - 1
        });
    }

    async onForwardButtonClick() {

        let valid = await this.passesValidation();

        if (valid) {
            this.setState({
                step: this.state.step + 1
            });
        }
    }

    onSaveButtonClick() {

        console.log(this.getFormData())
    }

    async resetValidation() {

        return new Promise(async (resolve) => {
            this.setState({
                validationError: undefined
            }, () => {
                resolve();
            });
        });
    }

    hasNoValidationErrors() {
        return this.state.validationError === undefined
    }

    hasValidationErrors() {
        return !this.hasNoValidationErrors();
    }

    getFormData() {

        let data = _.clone(this.state);

        delete data.step;
        delete data.maxstep;
        delete data.validationError;
        delete data.isLoaded;

        return data;
    }

    async passesValidation() {

        const { step } = this.state;

        let validation = undefined;

        return new Promise(async (resolve) => {

            switch(step) {
            case 0:

                if (!this.state.bankName) {
                    validation = 'pinfo:validation-noBankName';
                    break;
                }
                if (!this.state.bankAddress) {
                    validation = 'pinfo:validation-noBankAddress';
                    break;
                }
                if (!this.state.bankCountry) {
                    validation = 'pinfo:validation-noBankCountry';
                    break;
                }
                if (!this.state.bankBicSwift ) {
                    validation = 'pinfo:validation-noBankBicSwift';
                    break;
                }
                if (! /[\d\w]+/.test(this.state.bankBicSwift)) {
                    validation = 'pinfo:validation-invalidBankBicSwift';
                    break;
                }
                if (!this.state.bankIban) {
                    validation = 'pinfo:validation-noBankIban';
                    break;
                }
                if (! /[\d\w]+/.test(this.state.bankIban)) {
                    validation = 'pinfo:validation-invalidBankIban';
                    break;
                }
                if (!this.state.bankCode) {
                    validation = 'pinfo:validation-noBankCode';
                    break;
                }
                break;

            case 1:

                if (!this.state.userEmail) {
                    validation = 'pinfo:validation-noUserEmail';
                    break;
                }
                if (!/\S+@\S+\.\S+/.test(this.state.userEmail)) {
                    validation = 'pinfo:validation-invalidUserEmail';
                    break;
                }
                if (!this.state.userPhone) {
                    validation = 'pinfo:validation-noUserPhone';
                    break;
                }
                break;

            case 2:

                if (!this.state.workType || !(/\d\d/.test(this.state.workType))) {
                    validation = 'pinfo:validation-noWorkType';
                    break;
                }
                if (!this.state.workStartDate) {
                    validation = 'pinfo:validation-noWorkStartDate';
                    break;
                }
                if (!this.state.workEndDate) {
                    validation = 'pinfo:validation-noWorkEndDate';
                    break;
                }
                if (!this.state.workEstimatedRetirementDate) {
                    validation = 'pinfo:validation-noWorkEstimatedRetirementDate';
                    break;
                }
                if (!this.state.workHourPerWeek) {
                    validation = 'pinfo:validation-noWorkHourPerWeek';
                    break;
                }
                if (!this.state.workIncome) {
                    validation = 'pinfo:validation-noWorkIncome';
                    break;
                }
                if (!this.state.workIncomeCurrency || !(/[A-Z]{3}/.test(this.state.workIncomeCurrency))) {
                    validation = 'pinfo:validation-noWorkIncomeCurrency';
                    break;
                }
                if (!this.state.workPaymentDate) {
                    validation = 'pinfo:validation-noWorkPaymentDate';
                    break;
                }
                if (!this.state.workPaymentFrequency || !(/\d\d/.test(this.state.workPaymentFrequency))) {
                    validation = 'pinfo:validation-noWorkPaymentFrequency';
                    break;
                }

                break;

            case 3:

                if (!this.state.attachmentTypes) {
                    validation = 'pinfo:validation-noAttachmentTypes';
                    break;
                }
                break;

            case 4:

                if (!this.state.retirementCountry) {
                    validation = 'pinfo:validation-noRetirementCountry';
                    break;
                }
                break;

            default:
                return
            }

            this.setState({
                validationError: validation
            }, () => {
                resolve(this.hasNoValidationErrors());
            });
        });
    }

    onDateBlur(key, e) {

        let date = e.target.value;

        if (! /\d\d\.\d\d\.\d\d\d\d/.test(date)) {

            if (!this.state[key] || date !== this.state[key])  {

                this.setState({
                    [key] : undefined,
                    infoValidationError : 'pinfo:validation-invalidDate'
                });
            }
        } else {
            let thisDate = moment(date, 'DD.MM.YYYY').toDate();
            if (!this.state[key] || thisDate.getTime() !== this.state[key].getTime())  {
                this.onDateHandle(key, thisDate);
            }
        }
    }

    onDateChange(key, moment) {

        let date = moment.toDate();
        if (!this.state[key] || date.getTime() !== this.state[key].getTime())  {
            this.onDateHandle(key, date);
        }
    }

    onDateHandle(key, date) {

        this.setState({
            [key] : date
        });
    }

    setValue(key, e) {

        let value;

        if (key === 'bankCountry' || key === 'retirementCountry' || key === 'attachments') {
            value = e;
        } else if (key === 'workIncomeCurrency') {
            value = e.currency;
        } else if (key === 'attachmentTypes') {

            value = this.state[key] || [];
            let id = e.target.getAttribute('id');
            let index = value.indexOf(id);
            if (e.target.checked) {
                if (index === -1) {
                    value.push(id);
                }
            } else {
                if (index !== -1) {
                    value.splice(index, 1);
                }
            }
        } else {
            value = e.target.value;
        }
        this.setState({
            [key] : value
        });
    }

    render() {

        const { t, locale, history } = this.props;
        const { step } = this.state;

        if (!this.state.isLoaded) {
            return null;
        }

        return <TopContainer className='pInfo topContainer'>
            <Nav.Row className='mb-4'>
                <Nav.Column>
                    <h1 className='mt-4 ml-3 mb-3 appTitle'>
                        <Icons title={t('ui:back')} className='mr-3' style={{cursor: 'pointer'}} kind='caretLeft' onClick={() => history.push('/')}/>
                        {t('pinfo:app-title')}
                    </h1>
                    <h4 className='appDescription mb-4'>{t('pinfo:form-step' + step)}</h4>
                    <ClientAlert className='mb-4'/>
                    <Nav.Stegindikator
                        aktivtSteg={step}
                        visLabel={true}
                        onBeforeChange={() => {return false}}
                        autoResponsiv={true}
                        steg={[
                            {label: t('pinfo:form-step0')},
                            {label: t('pinfo:form-step1')},
                            {label: t('pinfo:form-step2')},
                            {label: t('pinfo:form-step3')},
                            {label: t('pinfo:form-step4')},
                            {label: t('pinfo:form-step5')},
                            {label: t('pinfo:form-step6')}
                        ]}/>
                </Nav.Column>
            </Nav.Row>
            <div className={classNames('fieldset','p-4','mb-4','ml-3','mr-3', {
                validationFail : this ? this.hasValidationErrors() : false
            })}>
                <Nav.HjelpetekstBase>{t('pinfo:help-step' + step )}</Nav.HjelpetekstBase>
                {this.hasValidationErrors() ? <Nav.AlertStripe className='mb-3' type='advarsel'>{t(this.state.validationError)}</Nav.AlertStripe> : null}

                {step === 0 ? <div className='mt-3'>
                    <Nav.Row>
                        <div className='col-md-6'>
                            <Nav.Input label={t('pinfo:form-bankName') + ' *'} value={this.state.bankName || ''}
                                onChange={this.setValue.bind(this, 'bankName')}/>

                            <Nav.Textarea label={t('pinfo:form-bankAddress') + ' *'} value={this.state.bankAddress || ''}
                                style={{minHeight:'200px'}}
                                onChange={this.setValue.bind(this, 'bankAddress')}/>
                        </div>
                    </Nav.Row>
                    <Nav.Row>
                        <div className='col-md-6'>
                            <div className='mb-3'>
                                <label>{t('pinfo:form-bankCountry') + ' *'}</label>
                                <CountrySelect locale={locale} value={this.state.bankCountry || {}}
                                    onSelect={this.setValue.bind(this, 'bankCountry')}/>
                            </div>
                        </div>
                        <div className='col-md-6'>
                            <Nav.Input label={t('pinfo:form-bankBicSwift') + ' *'} value={this.state.bankBicSwift || ''}
                                onChange={this.setValue.bind(this, 'bankBicSwift')}/>
                        </div>
                    </Nav.Row>
                    <Nav.Row>
                        <div className='col-md-6'>
                            <Nav.Input label={t('pinfo:form-bankIban') + ' *'} value={this.state.bankIban || ''}
                                onChange={this.setValue.bind(this, 'bankIban')}/>
                        </div>
                        <div className='col-md-6'>
                            <Nav.Input label={t('pinfo:form-bankCode') + ' *'} value={this.state.bankCode || ''}
                                onChange={this.setValue.bind(this, 'bankCode')}/>
                        </div>
                    </Nav.Row>
                </div> : null}

                {this.state.step === 1 ? <div className='mt-3'>

                    <Nav.Row>
                        <div className='col-md-6'>
                            <Nav.Input label={t('pinfo:form-userEmail') + ' *'} value={this.state.userEmail || ''}
                                onChange={this.setValue.bind(this, 'userEmail')}/>

                            <Nav.Input label={t('pinfo:form-userPhone') + ' *'} value={this.state.userPhone || ''}
                                onChange={this.setValue.bind(this, 'userPhone')}/>
                        </div>
                    </Nav.Row>
                </div> : null}

                {this.state.step === 2 ? <div className='mt-3'>

                    <Nav.Row>
                        <div className='col-md-6'>
                            <Nav.Select label={t('pinfo:form-workType') + ' *'} value={this.state.workType || ''}
                                onChange={this.setValue.bind(this, 'workType')}>
                                <option value='--'>{t('pinfo:form-workType-select-option')}</option>
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
                    <div>
                        <label>{t('pinfo:form-workStartDate')+ ' *'}</label>
                        <ReactDatePicker selected={this.state.workStartDate ? moment(this.state.workStartDate) : undefined}
                            dateFormat='DD.MM.YYYY'
                            placeholderText={t('ui:dateFormat')}
                            showYearDropdown
                            showMonthDropdown
                            dropdownMode='select'
                            locale={locale}
                            onMonthChange={this.onDateChange.bind(this, 'workStartDate')}
                            onYearChange={this.onDateChange.bind(this, 'workStartDate')}
                            onBlur={this.onDateBlur.bind(this, 'workStartDate')}
                            onChange={this.onDateChange.bind(this, 'workStartDate')}/>
                    </div>

                    <div>
                        <label>{t('pinfo:form-workEndDate')+ ' *'}</label>
                        <ReactDatePicker selected={this.state.workEndDate ? moment(this.state.workEndDate) : undefined}
                            dateFormat='DD.MM.YYYY'
                            placeholderText={t('ui:dateFormat')}
                            showYearDropdown
                            showMonthDropdown
                            dropdownMode='select'
                            locale={locale}
                            onMonthChange={this.onDateChange.bind(this, 'workEndDate')}
                            onYearChange={this.onDateChange.bind(this, 'workEndDate')}
                            onBlur={this.onDateBlur.bind(this, 'workEndDate')}
                            onChange={this.onDateChange.bind(this, 'workEndDate')}/>
                    </div>

                    <div>
                        <label>{t('pinfo:form-workEstimatedRetirementDate')+ ' *'}</label>
                        <ReactDatePicker selected={this.state.workEstimatedRetirementDate ? moment(this.state.workEstimatedRetirementDate) : undefined}
                            dateFormat='DD.MM.YYYY'
                            placeholderText={t('ui:dateFormat')}
                            showYearDropdown
                            showMonthDropdown
                            dropdownMode='select'
                            locale={locale}
                            onMonthChange={this.onDateChange.bind(this, 'workEstimatedRetirementDate')}
                            onYearChange={this.onDateChange.bind(this, 'workEstimatedRetirementDate')}
                            onBlur={this.onDateBlur.bind(this, 'workEstimatedRetirementDate')}
                            onChange={this.onDateChange.bind(this, 'workEstimatedRetirementDate')}/>
                    </div>

                    <Nav.Row>
                        <div className='col-md-6'>
                            <Nav.Input label={t('pinfo:form-workHourPerWeek') + ' *'} value={this.state.workHourPerWeek || ''}
                                onChange={this.setValue.bind(this, 'workHourPerWeek')}/>

                        </div>
                    </Nav.Row>

                    <Nav.Row>
                        <div className='col-md-6'>
                            <Nav.Input label={t('pinfo:form-workIncome') + ' *'} value={this.state.workIncome || ''}
                                onChange={this.setValue.bind(this, 'workIncome')}/>
                        </div>
                        <div className='col-md-6'>
                            <label>{t('pinfo:form-workIncomeCurrency') + ' *'}</label>
                            <CountrySelect locale={locale} type={'currency'}
                                value={this.state.workIncomeCurrency || {}}
                                onSelect={this.setValue.bind(this, 'workIncomeCurrency')}/>
                        </div>
                    </Nav.Row>
                    <div>
                        <label>{t('pinfo:form-workPaymentDate')+ ' *'}</label>
                        <ReactDatePicker selected={this.state.workPaymentDate ? moment(this.state.workPaymentDate) : undefined}
                            dateFormat='DD.MM.YYYY'
                            placeholderText={t('ui:dateFormat')}
                            showYearDropdown
                            showMonthDropdown
                            dropdownMode='select'
                            locale={locale}
                            onMonthChange={this.onDateChange.bind(this, 'workPaymentDate')}
                            onYearChange={this.onDateChange.bind(this, 'workPaymentDate')}
                            onBlur={this.onDateBlur.bind(this, 'workPaymentDate')}
                            onChange={this.onDateChange.bind(this, 'workPaymentDate')}/>
                    </div>

                    <Nav.Row>
                        <div className='col-md-6'>
                            <Nav.Select label={t('pinfo:form-workPaymentFrequency') + ' *'} value={this.state.workPaymentFrequency || ''}
                                onChange={this.setValue.bind(this, 'workPaymentFrequency')}>
                                <option value='--'>{t('pinfo:form-workPaymentFrequency-choose-option')}</option>
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
                </div> : null}

                {this.state.step === 3 ? <div>
                    <Nav.Row>
                        <div className='col-md-6'>
                            <Nav.CheckboksPanelGruppe legend={t('pinfo:form-attachmentTypes')}
                                checkboxes={[
                                    {'label' : t('pinfo:form-attachmentTypes-01'), 'value' : '01', 'id' : '01'},
                                    {'label' : t('pinfo:form-attachmentTypes-02'), 'value' : '02', 'id' : '02'},
                                    {'label' : t('pinfo:form-attachmentTypes-03'), 'value' : '03', 'id' : '03'},
                                    {'label' : t('pinfo:form-attachmentTypes-04'), 'value' : '04', 'id' : '04'}
                                ]}
                                onChange={this.setValue.bind(this, 'attachmentTypes')} />
                        </div>
                    </Nav.Row>
                    <FileUpload files={this.state.attachments || []}
                        onFileChange={this.setValue.bind(this, 'attachments')}/>
                </div> : null}

                {this.state.step === 4 ? <div className='mb-3'>
                    <Nav.Row>
                        <div className='col-md-6'>
                            <label>{t('pinfo:form-retirementCountry') + ' *'}</label>
                            <CountrySelect locale={locale} value={this.state.retirementCountry || {}}
                                onSelect={this.setValue.bind(this, 'retirementCountry')}/>
                        </div>
                    </Nav.Row>
                </div> : null}

                {this.state.step === 5 ? <div>
                    <fieldset>
                        <legend>{t('pinfo:form-bank')}</legend>
                        <dl className='row'>
                            <dt className='col-sm-4'><label>{t('pinfo:form-bankName')}</label></dt>
                            <dd className='col-sm-8'>{this.state.bankName}</dd>
                            <dt className='col-sm-4'><label>{t('pinfo:form-bankAddress')}</label></dt>
                            <dd className='col-sm-8'><pre>{this.state.bankAddress}</pre></dd>
                            <dt className='col-sm-4'><label>{t('pinfo:form-bankCountry')}</label></dt>
                            <dd className='col-sm-8'>
                                <img src={'../../../../../flags/' + this.state.bankCountry.value + '.png'}
                                    style={{width: 30, height: 20}}
                                    alt={this.state.bankCountry.label}/>&nbsp; {this.state.bankCountry.label}
                            </dd>
                            <dt className='col-sm-4'><label>{t('pinfo:form-bankBicSwift')}</label></dt>
                            <dd className='col-sm-8'>{this.state.bankBicSwift}</dd>
                            <dt className='col-sm-4'><label>{t('pinfo:form-bankIban')}</label></dt>
                            <dd className='col-sm-8'>{this.state.bankIban}</dd>
                            <dt className='col-sm-4'><label>{t('pinfo:form-bankCode')}</label></dt>
                            <dd className='col-sm-8'>{this.state.bankCode}</dd>
                        </dl>
                    </fieldset>
                    <fieldset>
                        <legend>{t('pinfo:form-user')}</legend>
                        <dl className='row'>
                            <dt className='col-sm-4'><label>{t('pinfo:form-userEmail')}</label></dt>
                            <dd className='col-sm-8'>{this.state.userEmail}</dd>
                            <dt className='col-sm-4'><label>{t('pinfo:form-userPhone')}</label></dt>
                            <dd className='col-sm-8'>{this.state.userPhone}</dd>
                        </dl>
                    </fieldset>
                    <fieldset>
                        <legend>{t('pinfo:form-work')}</legend>
                        <dl className='row'>
                            <dt className='col-sm-4'><label>{t('pinfo:form-workType')}</label></dt>
                            <dd className='col-sm-8'>{t('pinfo:form-workType-option-' + this.state.workType)}</dd>
                            <dt className='col-sm-4'><label>{t('pinfo:form-workStartDate')}</label></dt>
                            <dd className='col-sm-8'>{P4000Util.writeDate(this.state.workStartDate)}</dd>
                            <dt className='col-sm-4'><label>{t('pinfo:form-workEndDate')}</label></dt>
                            <dd className='col-sm-8'>{P4000Util.writeDate(this.state.workEndDate)}</dd>
                            <dt className='col-sm-4'><label>{t('pinfo:form-workEstimatedRetirementDate')}</label></dt>
                            <dd className='col-sm-8'>{P4000Util.writeDate(this.state.workEstimatedRetirementDate)}</dd>
                            <dt className='col-sm-4'><label>{t('pinfo:form-workHourPerWeek')}</label></dt>
                            <dd className='col-sm-8'>{this.state.workHourPerWeek}</dd>
                            <dt className='col-sm-4'><label>{t('pinfo:form-workIncome')}</label></dt>
                            <dd className='col-sm-8'>{this.state.workIncome}{' '}{this.state.workIncomeCurrency}</dd>
                            <dt className='col-sm-4'><label>{t('pinfo:form-workPaymentDate')}</label></dt>
                            <dd className='col-sm-8'>{P4000Util.writeDate(this.state.workPaymentDate)}</dd>
                            <dt className='col-sm-4'><label>{t('pinfo:form-workPaymentFrequency')}</label></dt>
                            <dd className='col-sm-8'>{t('pinfo:form-workPaymentFrequency-option-' + this.state.workPaymentFrequency)}</dd>
                        </dl>
                    </fieldset>
                    <fieldset>
                        <legend>{t('pinfo:form-attachments')}</legend>
                        <dl className='row'>
                            <dt className='col-sm-4'><label>{t('pinfo:form-attachmentTypes')}</label></dt>
                            <dd className='col-sm-8'>{this.state.attachmentTypes.map(type => {return t('pinfo:form-attachmentTypes-' + type)}).join(', ')}</dd>
                            <dt className='col-sm-4'><label>{t('pinfo:form-attachments')}</label></dt>
                            <dd className='col-sm-8'>{
                                this.state.attachments ? this.state.attachments.map((file, i) => {
                                    return <File className='mr-2' key={i} file={file} deleteLink={false} downloadLink={false} />
                                }) : null }
                            </dd>
                        </dl>
                    </fieldset>
                    <fieldset>
                        <legend>{t('pinfo:form-retirement')}</legend>
                        <dl className='row'>
                            <dt className='col-sm-4'><label>{t('pinfo:form-retirementCountry')}</label></dt>
                            <dd className='col-sm-8'><img src={'../../../../../flags/' + this.state.retirementCountry.value + '.png'}
                                style={{width: 30, height: 20}}
                                alt={this.state.retirementCountry.label}/>&nbsp; {this.state.retirementCountry.label}
                            </dd>
                        </dl>
                    </fieldset>
                </div> : null}
            </div>

            <Nav.Row className='mb-4 p-2'>
                <Nav.Column>
                    {this.state.step !== 0 ? <Nav.Knapp className='backButton mr-4 w-100' type='standard' onClick={this.onBackButtonClick.bind(this)}>{t('ui:back')}</Nav.Knapp> : null}
                </Nav.Column>
                <Nav.Column>
                    {this.state.step !== 5 ?
                        <Nav.Hovedknapp className='forwardButton w-100' onClick={this.onForwardButtonClick.bind(this)}>{t('ui:forward')}</Nav.Hovedknapp>
                        : <Nav.Hovedknapp className='sendButton w-100' onClick={this.onSaveButtonClick.bind(this)}>{t('ui:save')}</Nav.Hovedknapp> }
                </Nav.Column>
            </Nav.Row>
        </TopContainer>
    }
}

PInfo.propTypes = {
    history : PT.object,
    t       : PT.func,
    locale  : PT.string
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    translate()(PInfo)
);
