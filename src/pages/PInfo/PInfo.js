import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';
import PT from 'prop-types';
import { translate } from 'react-i18next';
import classNames from 'classnames';
import moment from 'moment';
import lifecycle from 'react-pure-lifecycle';

import 'react-datepicker/dist/react-datepicker.min.css';

import * as Nav from '../../components/ui/Nav';
import TopContainer from '../../components/ui/TopContainer/TopContainer';
import ClientAlert from '../../components/ui/Alert/ClientAlert';
import File from '../../components/ui/File/File';
import FrontPageDrawer from '../../components/drawer/FrontPage';

import * as UrlValidator from '../../utils/UrlValidator';
import * as routes from '../../constants/routes';
import * as pinfoActions from '../../actions/pinfo';
import * as uiActions from '../../actions/ui';
import * as appActions from '../../actions/app';
import Bank from '../../components/form/Bank';
import Contact from '../../components/form/Contact';
import Work from '../../components/form/Work';
import PdfUploadComponent from '../../components/form/PdfUploadComponent';
import Pension from '../../components/form/Pension';

import './PInfo.css';

const mapStateToProps = (state) => {
    return {
        locale   : state.ui.locale,
        form     : state.pinfo.form,
        referrer : state.app.referrer,
        status   : state.status
    }
};

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, pinfoActions, uiActions, appActions), dispatch)};
};

const componentDidMount = (props) => {

    let referrer = new URLSearchParams(props.location.search).get('referrer')
    if (referrer) {
        props.actions.setReferrer(referrer);
    }
    props.actions.addToBreadcrumbs({
        url  : routes.PINFO,
        ns   : 'pinfo',
        label: 'pinfo:app-title'
    });
}

const onBackButtonClick = async (props) => (
    props.actions.setEventProperty( {step: props.form.step - 1, displayError: false} )
);

const onBackToReferrerButtonClick = async (props) => (
    UrlValidator.validateReferrer(props.referrer) ?
        props.actions.deleteLastBreadcrumb() && props.history.push(routes.ROOT + props.referrer) :
        null
);

const onSaveButtonClick = (props) => (
    props.history.push(routes.PSELV + '?referrer=pinfo')
);

/*
if 'e' is an actual event, store e.target.value under [key]
else if 'e' is an instance of moment (ie. a datetime object) store e as date format string under [key].
else store the raw value of e under [key]
*/
const setValue = (props, key, e) =>{
    if(e){
        if(!e.target){
            if(e instanceof moment){
                props.actions.setEventProperty({[key] : e.toDate() })
            }else{
                props.actions.setEventProperty( {[key]: e} )
            }
        }else{
            props.actions.setEventProperty( {[key]: e.target.value });
        }
    }else{
        props.actions.setEventProperty( {[key]: null });
    }
}

function isValid (e) {
    e.preventDefault();
    let validity = e.target.form.checkValidity();//reportValidity();
    console.log(validity);
    return validity;
}

const PInfo = (props) => (
    <TopContainer className='p-pInfo'
        history={props.history} location={props.location}
        sideContent={<FrontPageDrawer t={props.t} status={props.status}/>}>
        <Nav.Row className='mb-4'>
            <Nav.Column>
                <h1 className='appTitle'>{props.t('pinfo:app-title')}</h1>
                <h4 className='appDescription mb-4'>{props.t('pinfo:form-step' + props.form.step)}</h4>
                <ClientAlert className='mb-4'/>
                <Nav.Stegindikator
                    aktivtSteg={props.form.step}
                    visLabel={true}
                    onBeforeChange={() => {return false}}
                    autoResponsiv={true}
                    steg={[
                        {label: props.t('pinfo:form-step0')},
                        {label: props.t('pinfo:form-step1')},
                        {label: props.t('pinfo:form-step2')},
                        {label: props.t('pinfo:form-step3')},
                        {label: props.t('pinfo:form-step4')},
                        {label: props.t('pinfo:form-step5')},
                        {label: props.t('pinfo:form-step6')}
                    ]}/>
            </Nav.Column>
        </Nav.Row>
        <div className={classNames('fieldset','mb-4')}>
            <Nav.HjelpetekstBase>{props.t('pinfo:help-step' + props.form.step )}</Nav.HjelpetekstBase>

            {props.form.step === 0 ?
                <form id='pinfo-form'>
                    <Bank
                        t={props.t}
                        bank={{
                            bankName: props.form.bankName,
                            bankAddress: props.form.bankAddress,
                            bankCountry: props.form.bankCountry,
                            bankBicSwift: props.form.bankBicSwift,
                            bankIban: props.form.bankIban,
                            bankCode: props.form.bankCode
                        }}
                        action={setValue.bind(null, props)}
                        locale={props.locale}
                        showError='true'
                    />
                </form>
                : null}
            {props.form.step === 1 ?
                <form id='pinfo-form'>
                    <Contact
                        t={props.t}
                        contact={{
                            userEmail: props.form.userEmail,
                            userPhone: props.form.userPhone,
                        }}
                        action={setValue.bind(null, props)}
                    />
                </ form>:
                null
            }
            {props.form.step === 2 ?
                <form id='pinfo-form'>
                    <Work
                        t={props.t}
                        work={{
                            workType: props.form.workType,
                            workStartDate: props.form.workStartDate,
                            workEndDate: props.form.workEndDate,
                            workEstimatedRetirementDate: props.form.workEstimatedRetirementDate,
                            workHourPerWeek: props.form.workHourPerWeek,
                            workIncome: props.form.workIncome,
                            workIncomeCurrency: props.form.workIncomeCurrency,
                            workPaymentDate: props.form.workPaymentDate,
                            workPaymentFrequency: props.form.workPaymentFrequency
                        }}
                        action={setValue.bind(null, props)}
                        locale={props.locale}
                        showError='true'
                    />
                </ form>:
                null
            }

            {props.form.step === 3 ? <form id='pinfo-form'><div>
                <PdfUploadComponent t={props.t} form={props.form}
                    checkboxes={[
                        {'label' : props.t('pinfo:form-attachmentTypes-01'), 'value' : '01', 'id' : '01', 'inputProps' : {'defaultChecked' : (props.form.attachmentTypes? props.form.attachmentTypes['01']: false) }},
                        {'label' : props.t('pinfo:form-attachmentTypes-02'), 'value' : '02', 'id' : '02', 'inputProps' : {'defaultChecked' : (props.form.attachmentTypes? props.form.attachmentTypes['02']: false) }},
                        {'label' : props.t('pinfo:form-attachmentTypes-03'), 'value' : '03', 'id' : '03', 'inputProps' : {'defaultChecked' : (props.form.attachmentTypes? props.form.attachmentTypes['03']: false) }},
                        {'label' : props.t('pinfo:form-attachmentTypes-04'), 'value' : '04', 'id' : '04', 'inputProps' : {'defaultChecked' : (props.form.attachmentTypes? props.form.attachmentTypes['04']: false) }}
                    ]}
                    files= {props.form.attachments || []}
                    checkboxAction = {setValue.bind(null, props, 'attachmentTypes')}
                    fileUploadAction = {setValue.bind(null, props, 'attachments')}
                />
            </div></ form>: null}

            {props.form.step === 4 ? <form id='pinfo-form'><div className='mb-3'>
                <Pension
                    t={props.t}
                    pension={{
                        retirementCountry: props.form.retirementCountry,
                    }}
                    action={setValue.bind(null, props)}
                    locale={props.locale}
                />
            </div> </ form>: null}

            {props.form.step === 5 ? <form id='pinfo-form'><div>
                <fieldset>
                    <legend>{props.t('pinfo:form-bank')}</legend>
                    <dl className='row'>
                        <dt className='col-sm-4'><label>{props.t('pinfo:form-bankName')}</label></dt>
                        <dd className='col-sm-8'>{props.form.bankName}</dd>
                        <dt className='col-sm-4'><label>{props.t('pinfo:form-bankAddress')}</label></dt>
                        <dd className='col-sm-8'><pre>{props.form.bankAddress}</pre></dd>
                        <dt className='col-sm-4'><label>{props.t('pinfo:form-bankCountry')}</label></dt>
                        <dd className='col-sm-8'>
                            <img src={'../../../../../flags/' + props.form.bankCountry.value + '.png'}
                                style={{width: 30, height: 20}}
                                alt={props.form.bankCountry.label}/>&nbsp; {props.form.bankCountry.label}
                        </dd>
                        <dt className='col-sm-4'><label>{props.t('pinfo:form-bankBicSwift')}</label></dt>
                        <dd className='col-sm-8'>{props.form.bankBicSwift}</dd>
                        <dt className='col-sm-4'><label>{props.t('pinfo:form-bankIban')}</label></dt>
                        <dd className='col-sm-8'>{props.form.bankIban}</dd>
                        <dt className='col-sm-4'><label>{props.t('pinfo:form-bankCode')}</label></dt>
                        <dd className='col-sm-8'>{props.form.bankCode}</dd>
                    </dl>
                </fieldset>
                <fieldset>
                    <legend>{props.t('pinfo:form-user')}</legend>
                    <dl className='row'>
                        <dt className='col-sm-4'><label>{props.t('pinfo:form-userEmail')}</label></dt>
                        <dd className='col-sm-8'>{props.form.userEmail}</dd>
                        <dt className='col-sm-4'><label>{props.t('pinfo:form-userPhone')}</label></dt>
                        <dd className='col-sm-8'>{props.form.userPhone}</dd>
                    </dl>
                </fieldset>
                <fieldset>
                    <legend>{props.t('pinfo:form-work')}</legend>
                    <dl className='row'>
                        <dt className='col-sm-4'><label>{props.t('pinfo:form-workType')}</label></dt>
                        <dd className='col-sm-8'>{props.t('pinfo:form-workType-option-' + props.form.workType)}</dd>
                        <dt className='col-sm-4'><label>{props.t('pinfo:form-workStartDate')}</label></dt>
                        <dd className='col-sm-8'>{moment(props.form.workStartDate).format('DD MM YYYY')/*P4000Util.writeDate(props.form.workStartDate)*/}</dd>
                        <dt className='col-sm-4'><label>{props.t('pinfo:form-workEndDate')}</label></dt>
                        <dd className='col-sm-8'>{moment(props.form.workEndDate).format('DD MM YYYY')/*P4000Util.writeDate(props.form.workEndDate)*/}</dd>
                        <dt className='col-sm-4'><label>{props.t('pinfo:form-workEstimatedRetirementDate')}</label></dt>
                        <dd className='col-sm-8'>{moment(props.form.workEstimatedRetirementDate).format('DD MM YYYY')/*P4000Util.writeDate(props.form.workEstimatedRetirementDate)*/}</dd>
                        <dt className='col-sm-4'><label>{props.t('pinfo:form-workHourPerWeek')}</label></dt>
                        <dd className='col-sm-8'>{props.form.workHourPerWeek}</dd>
                        <dt className='col-sm-4'><label>{props.t('pinfo:form-workIncome')}</label></dt>
                        <dd className='col-sm-8'>{props.form.workIncome}{' '}{props.form.workIncomeCurrency.currency}</dd>
                        <dt className='col-sm-4'><label>{props.t('pinfo:form-workPaymentDate')}</label></dt>
                        <dd className='col-sm-8'>{moment(props.form.workPaymentDate).format('DD MM YYYY')/*P4000Util.writeDate(props.form.workPaymentDate)*/}</dd>
                        <dt className='col-sm-4'><label>{props.t('pinfo:form-workPaymentFrequency')}</label></dt>
                        <dd className='col-sm-8'>{props.t('pinfo:form-workPaymentFrequency-option-' + props.form.workPaymentFrequency)}</dd>
                    </dl>
                </fieldset>
                <fieldset>
                    <legend>{props.t('pinfo:form-attachments')}</legend>
                    <dl className='row'>
                        <dt className='col-sm-4'><label>{props.t('pinfo:form-attachmentTypes')}</label></dt>
                        <dd className='col-sm-8'>{
                            Object.entries(props.form.attachmentTypes? props.form.attachmentTypes: {})
                                .filter(KV => KV[1])
                                .map(type => {return props.t('pinfo:form-attachmentTypes-' + type[0])}).join(', ')
                        }</dd>
                        <dt className='col-sm-4'><label>{props.t('pinfo:form-attachments')}</label></dt>
                        <dd className='col-sm-8'>{
                            props.form.attachments ? props.form.attachments.map((file, i) => {
                                return <File className='mr-2' key={i} file={file} deleteLink={false} downloadLink={false} />
                            }) : null }
                        </dd>
                    </dl>
                </fieldset>
                <fieldset>
                    <legend>{props.t('pinfo:form-retirement')}</legend>
                    <dl className='row'>
                        <dt className='col-sm-4'><label>{props.t('pinfo:form-retirementCountry')}</label></dt>
                        <dd className='col-sm-8'><img src={'../../../../../flags/' + props.form.retirementCountry.value + '.png'}
                            style={{width: 30, height: 20}}
                            alt={props.form.retirementCountry.label}/>&nbsp; {props.form.retirementCountry.label}
                        </dd>
                    </dl>
                </fieldset>
            </div> </ form>: null}
        </div>

        <Nav.Row className='mb-4 p-2'>
            <Nav.Column>
                {props.form.step !== 0 ? <Nav.Knapp className='backButton mr-4 w-100' type='standard' onClick={onBackButtonClick.bind(null, props)}>{props.t('ui:back')}</Nav.Knapp> :
                    props.referrer ? <Nav.Knapp className='backButton mr-4 w-100' type='standard' onClick={onBackToReferrerButtonClick.bind(this, props)}>{props.t('ui:backTo') + ' ' + props.t('ui:' + props.referrer)}</Nav.Knapp>
                        : null }
            </Nav.Column>
            <Nav.Column>
                {props.form.step !== 5 ?
                    <Nav.Hovedknapp className='forwardButton w-100' onClick={e => (isValid(e)? props.actions.setEventProperty( {step: props.form.step + 1}): null)} form="pinfo-form">{props.t('ui:forward')}</Nav.Hovedknapp>
                    : <Nav.Hovedknapp className='sendButton w-100' onClick={onSaveButtonClick.bind(null, props)}>{props.t('ui:save')}</Nav.Hovedknapp> }
            </Nav.Column>
        </Nav.Row>

    </TopContainer>

);

PInfo.propTypes = {
    history : PT.object,
    t       : PT.func,
    locale  : PT.string,
    form    : PT.object,
    referrer: PT.string,
    actions : PT.object,
    location: PT.object.isRequired,
    status  : PT.object
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    translate()(
        lifecycle({
            componentDidMount
        })(PInfo)
    )
);
