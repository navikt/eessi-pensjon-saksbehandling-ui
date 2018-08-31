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

import * as pselvActions from '../../actions/pselv';
import * as uiActions from '../../actions/ui';

import './PSelv.css';

const mapStateToProps = (state) => {
    return {
        locale : state.ui.locale,
        step   : state.pselv.step
    }
};

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, pselvActions, uiActions), dispatch)};
};

class PSelv extends Component {

    state = {
        isLoaded : false,
        validationError: undefined
    };

    componentDidMount() {

        this.setState({
            isLoaded : true
        })
    }

    async onBackButtonClick() {

        const { actions } = this.props;

        await this.resetValidation();
        actions.stepBack();
    }

    goToP4000() {

        const { actions, history } = this.props;

        actions.closeModal();
        history.push('/react/p4000');
    }

    goToPInfo() {

        const { actions, history } = this.props;

        actions.closeModal();
        history.push('/react/pinfo');
    }

    closeModal() {

        const { actions } = this.props;

        actions.closeModal();
    }

    async onForwardButtonClick() {

        const { t, history, actions, step } = this.props;

        let valid = await this.passesValidation();

        if (valid) {

            if (step === 0 && this.state.livedOrWorkedOutsideNorway === true) {
                actions.openModal({
                    modalTitle: t('leavingpage'),
                    modalText: t('you will leave this page and continue on p4000'),
                    modalButtons: [{
                        main: true,
                        text: t('ui:yes') + ', ' + t('ui:continue'),
                        onClick: this.goToP4000.bind(this)
                    },{
                        text: t('ui:no') + ', ' + t('ui:cancel'),
                        onClick: this.closeModal.bind(this)
                    }]
                })
            } else if (step === 3) {
                 actions.openModal({
                    modalTitle: t('leavingpage'),
                    modalText: t('you will leave this page and continue on pinfo'),
                    modalButtons: [{
                        main: true,
                        text: t('ui:yes') + ', ' + t('ui:continue'),
                        onClick: this.goToPInfo.bind(this)
                    },{
                        text: t('ui:no') + ', ' + t('ui:cancel'),
                        onClick: this.closeModal.bind(this)
                    }]
                })
            } else {

                actions.stepForward();
            }
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

        delete data.validationError;
        delete data.isLoaded;

        return data;
    }

    async passesValidation() {

        let validation = undefined;

        return new Promise(async (resolve) => {

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
                    infoValidationError : 'pselv:validation-invalidDate'
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

        if (e.target) {
            value = e.target.value;
        } else {
            value = e;
        }

        this.setState({
            [key] : value
        });
    }

    render() {

        const { t, locale, history, step } = this.props;

        if (!this.state.isLoaded) {
            return null;
        }

        return <TopContainer className='pSelv topContainer'>
            <Nav.Row className='mb-4'>
                <Nav.Column>
                    <h1 className='mt-4 ml-3 mb-3 appTitle'>
                        <Icons title={t('ui:back')} className='mr-3' style={{cursor: 'pointer'}} kind='caretLeft' onClick={() => history.push('/')}/>
                        {t('pselv:app-title')}
                    </h1>
                    <h4 className='appDescription mb-4'>{t('pselv:form-step' + step)}</h4>
                    <ClientAlert className='mb-4'/>
                    <Nav.Stegindikator
                        aktivtSteg={step}
                        visLabel={true}
                        onBeforeChange={() => {return false}}
                        autoResponsiv={true}
                        steg={[
                            {label: t('pselv:form-step0')},
                            {label: t('pselv:form-step1')},
                            {label: t('pselv:form-step2')},
                            {label: t('pselv:form-step3')},
                            {label: t('pselv:form-step4')},
                            {label: t('pselv:form-step5')},
                            {label: t('pselv:form-step6')}
                        ]}/>
                </Nav.Column>
            </Nav.Row>
            <div className={classNames('fieldset','p-4','mb-4','ml-3','mr-3', {
                validationFail : this ? this.hasValidationErrors() : false
            })}>
                <Nav.HjelpetekstBase>{t('pselv:help-step' + step )}</Nav.HjelpetekstBase>
                {this.hasValidationErrors() ? <Nav.AlertStripe className='mb-3' type='advarsel'>{t(this.state.validationError)}</Nav.AlertStripe> : null}
                {step === 0 ? <div className='mt-3'>
                    <Nav.Row>
                        <div className='col'>
                            <div className='mb-4'>
                                <h4>{t('pselv:form-step0-title')}</h4>
                                <div>{t('pselv:form-step0-description')}</div>
                            </div>
                            <div>
                                <label>{t('pselv:form-step0-radio-label')}</label>
                            </div>
                            <Nav.Radio className='d-inline-block mr-4' label={t('yes')}
                                checked={this.state.livedOrWorkedOutsideNorway === true}
                                name='livedOrWorkedOutsideNorway'
                                onChange={this.setValue.bind(this, 'livedOrWorkedOutsideNorway', true)}/>
                            <Nav.Radio className='d-inline-block' label={t('no')}
                                checked={this.state.livedOrWorkedOutsideNorway === false}
                                name='livedOrWorkedOutsideNorway'
                                onChange={this.setValue.bind(this, 'livedOrWorkedOutsideNorway', false)}/>
                        </div>
                    </Nav.Row>
                </div> : null }
                {step === 1 ? <div className='mt-3'>
                    <Nav.Row>
                        <div className='col-md-6'>
                            <label>{t('pselv:form-step1-startPensionDate')+ ' *'}</label>
                            <ReactDatePicker selected={this.state.startPensionDate ? moment(this.state.startPensionDate) : undefined}
                                dateFormat='DD.MM.YYYY'
                                placeholderText={t('ui:dateFormat')}
                                showYearDropdown
                                showMonthDropdown
                                dropdownMode='select'
                                locale={locale}
                                onMonthChange={this.onDateChange.bind(this, 'startPensionDate')}
                                onYearChange={this.onDateChange.bind(this, 'startPensionDate')}
                                onBlur={this.onDateBlur.bind(this, 'startPensionDate')}
                                onChange={this.onDateChange.bind(this, 'startPensionDate')}/>
                        </div>
                        <div className='col-md-6'>
                            <Nav.Select label={t('pselv:form-step1-grade') + ' *'} value={this.state.grade || ''}
                                onChange={this.setValue.bind(this, 'grade')}>
                                <option value=''>{'--'}</option>
                                <option value='100%'>{'100 %'}</option>
                                <option value='90%'>{'90 %'}</option>
                                <option value='80%'>{'80 %'}</option>
                                <option value='70%'>{'70 %'}</option>
                                <option value='60%'>{'60 %'}</option>
                                <option value='50%'>{'50 %'}</option>
                            </Nav.Select>
                        </div>
                    </Nav.Row>
                    <Nav.Row>
                        <div className='col'>
                            <label>{t('pselv:form-step1-afp')}</label>
                            <Nav.Radio label={t('yes')}
                                checked={this.state.afp === true}
                                name='afp'
                                onChange={this.setValue.bind(this, 'afp', true)}/>
                            <Nav.Radio label={t('no')}
                                checked={this.state.afp === false}
                                name='afp'
                                onChange={this.setValue.bind(this, 'afp', false)}/>
                        </div>

                    </Nav.Row>
                </div> : null }
                {step === 2 ? <div className='mt-3'>
                    <Nav.Row>
                        <div className='col-md-6'>
                            <Nav.Input label={t('ui:name') + ' *'} value={this.state.name || ''}
                                onChange={this.setValue.bind(this, 'name')}/>
                        </div>
                        <div className='col-md-6'>
                            <Nav.Input label={t('ui:idNumber') + ' *'} value={this.state.idNumber || ''}
                                onChange={this.setValue.bind(this, 'idNumber')}/>
                        </div>
                    </Nav.Row>
                    <Nav.Row>
                        <div className='col'>
                            <Nav.Textarea label={t('ui:address') + ' *'} value={this.state.address || ''}
                                style={{minHeight:'150px'}}
                                onChange={this.setValue.bind(this, 'address')}/>
                        </div>
                    </Nav.Row>
                    <Nav.Row>
                        <div className='col-md-4'>
                            <label>{t('pselv:form-step2-citizenship')}</label>
                            <Nav.Radio label={t('ui:norway')}
                                checked={this.state.citizenshipNorway === true}
                                name='citizenshipNorway'
                                onChange={this.setValue.bind(this, 'citizenshipNorway', true)}/>
                            <Nav.Radio label={t('ui:other')}
                                checked={this.state.citizenshipNorway === false}
                                name='citizenshipNorway'
                                onChange={this.setValue.bind(this, 'citizenshipNorway', false)}/>
                        </div>
                        <div className='col-md-4'>
                            { this.state.citizenshipNorway === false ?  <div>
                                <label>{t('pselv:form-step2-selectCountry') + ' *'}</label>
                                <CountrySelect className='countrySelect' locale={locale} value={this.state.citizenshipCountry || {}}
                                    onSelect={this.setValue.bind(this, 'citizenshipCountry')}/>
                            </div> : null }
                        </div>
                        <div className='col-md-4'>
                            { this.state.citizenshipNorway === false ?  <div>
                                <label>{t('pselv:form-step2-refugee')}</label>
                                <Nav.Radio label={t('ui:yes')}
                                    checked={this.state.refugee === true}
                                    name='refugee'
                                    onChange={this.setValue.bind(this, 'refugee', true)}/>
                                <Nav.Radio label={t('ui:no')}
                                    checked={this.state.refugee === false}
                                    name='refugee'
                                    onChange={this.setValue.bind(this, 'refugee', false)}/>
                            </div>
                                : null }
                        </div>
                    </Nav.Row>
                    <Nav.Row>
                        <div className='col-md-6'>
                            <Nav.Input label={t('pselv:form-step2-bankAccount')} value={this.state.bankAccount || ''}
                                disabled={!this.state.citizenshipNorway}
                                onChange={this.setValue.bind(this, 'bankAccount')}/>
                        </div>
                        <div className='col-md-6'>
                            <Nav.Select label={t('pselv:form-step2-language')} value={this.state.language || ''}
                                onChange={this.setValue.bind(this, 'language')}>
                                <option value=''>{'--'}</option>
                                <option value='nb'>{'Norsk Bokmål'}</option>
                                <option value='nn'>{'Nynorsk'}</option>
                                <option value='en'>{'English'}</option>
                            </Nav.Select>
                        </div>
                    </Nav.Row>
                    <h6>{t('pselv:form-step2-phonePreferences')}</h6>
                    <Nav.Row>
                        <div className='col-md-4'>
                            <Nav.Input label={t('pselv:form-step2-phone-mobile')} value={this.state.phonemobile || ''}
                                onChange={this.setValue.bind(this, 'phonemobile')}/>
                        </div>
                        <div className='col-md-4'>
                            <Nav.Input label={t('pselv:form-step2-phone-home')} value={this.state.phonehome || ''}
                                onChange={this.setValue.bind(this, 'phonehome')}/>
                        </div>
                        <div className='col-md-4'>
                            <Nav.Input label={t('pselv:form-step2-phone-work')} value={this.state.phonework || ''}
                                onChange={this.setValue.bind(this, 'phonework')}/>
                        </div>
                    </Nav.Row>
                </div> : null }

                { step === 3 ? <div className='mt-3'>
                      <h4>{t('pselv:form-step3-title')}</h4>
                      <h6>{t('pselv:form-step3-description')}</h6>
                      <div><a href='#'>{t('pselv:form-step3-sed-anchor-text')}</a></div>
                      <Nav.Row>
                            <Nav.Column>
                                <h4>{t('pselv:form-step3-civilstatus-title')}</h4>
                                <Nav.Select label={t('pselv:form-step3-civilstatus')} value={this.state.civilstatus || ''}
                                    onChange={this.setValue.bind(this, 'civilstatus')}>
                                    <option value=''>{'--'}</option>
                                    <option value='single'>{'Single'}</option>
                                    <option value='samboer'>{'Samboer'}</option>
                                    <option value='married'>{'Married'}</option>
                                    <option value='divorced'>{'Divorced'}</option>
                                    <option value='widow'>{'Widow'}</option>
                                </Nav.Select>
                                 <div>{t('pselv:form-step3-civilstatus-description')}</div>
                            </Nav.Column>
                       </Nav.Row>
                      {this.state.civilstatus === 'widow' ? <Nav.Row>
                           <Nav.Column>
                                <h4>{t('pselv:form-step3-deceased-title')}</h4>
                                <Nav.Input label={t('pselv:form-step3-deceased-name')} value={this.state.deceasedName || ''}
                                    onChange={this.setValue.bind(this, 'deceasedName')}/>
                                <Nav.Input label={t('pselv:form-step3-deceased-id')} value={this.state.deceasedId || ''}
                                    onChange={this.setValue.bind(this, 'deceasedId')}/>
                           </Nav.Column>
                       </Nav.Row> : null
                      }
                        {this.state.civilstatus === 'samboer' ? <Nav.Row>
                              <Nav.Column>
                                   <h4>{t('pselv:form-step3-samboer-title')}</h4>
                                   <Nav.Checkbox label={t('pselv:form-step3-samboer-label')} value={this.state.samboer || ''}
                                       onChange={this.setValue.bind(this, 'samboer')}/>

                              </Nav.Column>
                          </Nav.Row> : null
                        }
                    </div> : null
                }
            </div>
            <Nav.Row className='mb-4 p-2'>
                <Nav.Column>
                    {step !== 0 ? <Nav.Knapp className='backButton mr-4 w-100' type='standard' onClick={this.onBackButtonClick.bind(this)}>{t('ui:back')}</Nav.Knapp> : null}
                </Nav.Column>
                <Nav.Column>
                    {step !== 5 ?
                        <Nav.Hovedknapp className='forwardButton w-100' onClick={this.onForwardButtonClick.bind(this)}>{t('ui:forward')}</Nav.Hovedknapp>
                        : <Nav.Hovedknapp className='sendButton w-100' onClick={this.onSaveButtonClick.bind(this)}>{t('ui:save')}</Nav.Hovedknapp> }
                </Nav.Column>
            </Nav.Row>
        </TopContainer>
    }
}

PSelv.propTypes = {
    history : PT.object,
    t       : PT.func,
    locale  : PT.string,
    step    : PT.number.isRequired
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    translate()(PSelv)
);
