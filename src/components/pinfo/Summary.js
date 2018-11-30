import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import _ from 'lodash'
import File from '../../components/ui/File/File'
import * as Nav from '../ui/Nav'

const mapStateToProps = (state) => {
  return {
    locale: state.ui.locale,
    form: state.pinfo.form,
    referrer: state.app.referrer,
    status: state.status,
    username: state.app.username,
    file: state.storage.file
  }
}

const getPhoneType = (t, type) => {
  switch (type) {
    case 'home':
      return `(${t('pinfo:form-userPhoneTypeHome')}) `
    case 'mobile':
      return `(${t('pinfo:form-userPhoneTypeMobile')}) `
    case 'work':
      return `(${t('pinfo:form-userPhoneTypeWork')}) `
    default:
      return ''
  }
}

const getPhoneDD = (key, t, phone) => {
  let number = _.get(phone, 'number', null)
  let type = _.get(phone, 'type', null)
  if (!(number && key)) { return null }
  if (!(_.isFunction(t) && type)) { return <dd key={key} className='col-sm-12'>{`${number}`}</dd> }
  return <dd key={key} className='col-sm-12'>{`${getPhoneType(t, type)}${number}`}</dd>
}
const getEmailDD = (key, address) => {
  if (!(key && address)) { return null }
  return <dd key={key} className='col-sm-12'>{`${address}`}</dd>
}

const Summary = (props) => {
  const bank = _.get(props.form, 'bank', {})
  const phone = _.get(props.form, 'contact.phone', {})
  const email = _.get(props.form, 'contact.email', {})
  const workIncome = _.get(props.form, 'workIncome', {})
  const attachments = _.get(props.form, 'attachments', {})
  const pension = _.get(props.form, 'pension', {})
  return (
    <form id='pinfo-form'>
      <div>
        <fieldset>
          <legend>{props.t('pinfo:form-bank')}</legend>
          <div className='col-xs-12'>
            <dl className='row'>
              <dt className='col-sm-4'><label>{props.t('pinfo:form-bankName')}</label></dt>
              <dd className='col-sm-8'>{bank.bankName}</dd>
              <dt className='col-sm-4'><label>{props.t('pinfo:form-bankAddress')}</label></dt>
              <dd className='col-sm-8'><pre>{bank.bankAddress}</pre></dd>
              <dt className='col-sm-4'><label>{props.t('pinfo:form-bankCountry')}</label></dt>
              <dd className='col-sm-8'>
                <img src={'../../../../../flags/' + _.get(bank, 'bankCountry.value', '') + '.png'}
                  style={{ width: 30, height: 20 }}
                  alt={_.get(bank, 'bankCountry.label', '')} />&nbsp; {_.get(bank, 'bankCountry.label', '')}
              </dd>
              <dt className='col-sm-4'><label>{props.t('pinfo:form-bankBicSwift')}</label></dt>
              <dd className='col-sm-8'>{bank.bankBicSwift}</dd>
              <dt className='col-sm-4'><label>{props.t('pinfo:form-bankIban')}</label></dt>
              <dd className='col-sm-8'>{bank.bankIban}</dd>
              <dt className='col-sm-4'><label>{props.t('pinfo:form-bankCode')}</label></dt>
              <dd className='col-sm-8'>{bank.bankCode}</dd>
            </dl>
          </div>
        </fieldset>
        <fieldset>
          <legend>{props.t('pinfo:form-user')}</legend>
          <div className='col-xs-12'>
            <dl className='row'>
              <dt className='col-sm-4'><label>{props.t('pinfo:form-userPhone')}</label></dt>
              <div className='col-sm-8'>
                { Object.keys(phone).map(key => getPhoneDD(key, props.t, phone[key])) }
              </div>
              <dt className='col-sm-4'><label>{props.t('pinfo:form-userEmail')}</label></dt>
              <div className='col-sm-8'>
                {Object.keys(email).map(key => getEmailDD(key, email[key].address))}
              </div>
            </dl>
          </div>
        </fieldset>
        <fieldset>
          <legend>{props.t('pinfo:form-work')}</legend>
          <div className='col-xs-12'>
            <dl className='row'>
              <dt className='col-sm-4'><label>{props.t('pinfo:form-workType')}</label></dt>
              <dd className='col-sm-8'>{workIncome.workType ? props.t('pinfo:form-workType-option-' + workIncome.workType) : null}</dd>
              <dt className='col-sm-4'><label>{props.t('pinfo:form-workStartDate')}</label></dt>
              <dd className='col-sm-8'>{workIncome.workStartDate ? moment(workIncome.workStartDate).format('DD MM YYYY') : null/* P4000Util.writeDate(props.form.workStartDate) */}</dd>
              <dt className='col-sm-4'><label>{props.t('pinfo:form-workEndDate')}</label></dt>
              <dd className='col-sm-8'>{workIncome.workEndDate ? moment(workIncome.workEndDate).format('DD MM YYYY') : null/* P4000Util.writeDate(props.form.workEndDate) */}</dd>
              <dt className='col-sm-4'><label>{props.t('pinfo:form-workEstimatedRetirementDate')}</label></dt>
              <dd className='col-sm-8'>{workIncome.workEstimatedRetirementDate ? moment(workIncome.workEstimatedRetirementDate).format('DD MM YYYY') : null/* P4000Util.writeDate(props.form.workEstimatedRetirementDate) */}</dd>
              <dt className='col-sm-4'><label>{props.t('pinfo:form-workHourPerWeek')}</label></dt>
              <dd className='col-sm-8'>{workIncome.workHourPerWeek}</dd>
              <dt className='col-sm-4'><label>{props.t('pinfo:form-workIncome')}</label></dt>
              <dd className='col-sm-8'>{workIncome.workIncome}{' '}{_.get(props, 'form.workIncome.workIncomeCurrency.currency', '')}</dd>
              <dt className='col-sm-4'><label>{props.t('pinfo:form-workPaymentDate')}</label></dt>
              <dd className='col-sm-8'>{workIncome.workPaymentDate ? moment(workIncome.workPaymentDate).format('DD MM YYYY') : null/* P4000Util.writeDate(props.form.workPaymentDate) */}</dd>
              <dt className='col-sm-4'><label>{props.t('pinfo:form-workPaymentFrequency')}</label></dt>
              <dd className='col-sm-8'>{workIncome.workPaymentFrequency ? props.t('pinfo:form-workPaymentFrequency-option-' + workIncome.workPaymentFrequency) : null}</dd>
            </dl>
          </div>
        </fieldset>
        <fieldset>
          <legend>{props.t('pinfo:form-attachments')}</legend>
          <div className='col-xs-12'>
            <dl className='row'>
              <dt className='col-sm-4'><label>{props.t('pinfo:form-attachmentTypes')}</label></dt>
              <dd className='col-sm-8'>{
                Object.entries(attachments.attachmentTypes ? attachments.attachmentTypes : {})
                  .filter(KV => KV[1])
                  .map(type => { return props.t('pinfo:form-attachmentTypes-' + type[0]) }).join(', ')
              }</dd>
              <dt className='col-sm-4'><label>{props.t('pinfo:form-attachments')}</label></dt>
              <dd className='col-sm-8'>{
                attachments.attachments ? attachments.attachments.map((file, i) => {
                  return <File className='mr-2' key={i} file={file} deleteLink={false} downloadLink={false} />
                }) : null }
              </dd>
            </dl>
          </div>
        </fieldset>
        <fieldset>
          <legend>{props.t('pinfo:form-retirement')}</legend>
          <div className='col-xs-12'>
            <dl className='row'>
              <dt className='col-sm-4'><label>{props.t('pinfo:form-retirementCountry')}</label></dt>
              <dd className='col-sm-8'><img src={'../../../../../flags/' + _.get(pension, 'retirementCountry.value', '') + '.png'}
                style={{ width: 30, height: 20 }}
                alt={_.get(pension, 'retirementCountry.label', '')} />&nbsp; {_.get(pension, 'retirementCountry.label', '')}
              </dd>
            </dl>
          </div>
        </fieldset>
      </div>
      <Nav.Row className='mb-4 p-2'>
        <Nav.Knapp className='backButton m-3' type='hoved' onClick={(e) => { e.preventDefault(); props.onSave() }}>
          {props.t('ui:confirmAndSend')}
        </Nav.Knapp>
      </Nav.Row>
    </form>
  )
}

export default connect(
  mapStateToProps,
  {}
)(Summary)
