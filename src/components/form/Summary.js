import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import _ from 'lodash';
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

const Summary = (props) => {
    return (
        <form id='pinfo-form'><div>
          <fieldset>
            <legend>{props.t('pinfo:form-bank')}</legend>
            <dl className='row'>
              <dt className='col-sm-4'><label>{props.t('pinfo:form-bankName')}</label></dt>
              <dd className='col-sm-8'>{props.form.bankName}</dd>
              <dt className='col-sm-4'><label>{props.t('pinfo:form-bankAddress')}</label></dt>
              <dd className='col-sm-8'><pre>{props.form.bankAddress}</pre></dd>
              <dt className='col-sm-4'><label>{props.t('pinfo:form-bankCountry')}</label></dt>
              <dd className='col-sm-8'>
                <img src={'../../../../../flags/' + _.get(props, 'form.bankCountry.value', '') + '.png'}
                  style={{ width: 30, height: 20 }}
                  alt={_.get(props, 'form.bankCountry.label', '')} />&nbsp; {_.get(props, 'form.bankCountry.label', '')}
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
              <dd className='col-sm-8'>{props.form.workType ? props.t('pinfo:form-workType-option-' + props.form.workType) : null}</dd>
              <dt className='col-sm-4'><label>{props.t('pinfo:form-workStartDate')}</label></dt>
              <dd className='col-sm-8'>{props.form.workStartDate ? moment(props.form.workStartDate).format('DD MM YYYY') : null/* P4000Util.writeDate(props.form.workStartDate) */}</dd>
              <dt className='col-sm-4'><label>{props.t('pinfo:form-workEndDate')}</label></dt>
              <dd className='col-sm-8'>{props.form.workEndDate ? moment(props.form.workEndDate).format('DD MM YYYY') : null/* P4000Util.writeDate(props.form.workEndDate) */}</dd>
              <dt className='col-sm-4'><label>{props.t('pinfo:form-workEstimatedRetirementDate')}</label></dt>
              <dd className='col-sm-8'>{props.form.workEstimatedRetirementDate ? moment(props.form.workEstimatedRetirementDate).format('DD MM YYYY') : null/* P4000Util.writeDate(props.form.workEstimatedRetirementDate) */}</dd>
              <dt className='col-sm-4'><label>{props.t('pinfo:form-workHourPerWeek')}</label></dt>
              <dd className='col-sm-8'>{props.form.workHourPerWeek}</dd>
              <dt className='col-sm-4'><label>{props.t('pinfo:form-workIncome')}</label></dt>
              <dd className='col-sm-8'>{props.form.workIncome}{' '}{_.get(props, 'form.workIncomeCurrency.currency', '')}</dd>
              <dt className='col-sm-4'><label>{props.t('pinfo:form-workPaymentDate')}</label></dt>
              <dd className='col-sm-8'>{props.form.workPaymentDate ? moment(props.form.workPaymentDate).format('DD MM YYYY') : null/* P4000Util.writeDate(props.form.workPaymentDate) */}</dd>
              <dt className='col-sm-4'><label>{props.t('pinfo:form-workPaymentFrequency')}</label></dt>
              <dd className='col-sm-8'>{props.form.workPaymentFrequency ? props.t('pinfo:form-workPaymentFrequency-option-' + props.form.workPaymentFrequency) : null}</dd>
            </dl>
          </fieldset>
          <fieldset>
            <legend>{props.t('pinfo:form-attachments')}</legend>
            <dl className='row'>
              <dt className='col-sm-4'><label>{props.t('pinfo:form-attachmentTypes')}</label></dt>
              <dd className='col-sm-8'>{
                Object.entries(props.form.attachmentTypes ? props.form.attachmentTypes : {})
                  .filter(KV => KV[1])
                  .map(type => { return props.t('pinfo:form-attachmentTypes-' + type[0]) }).join(', ')
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
              <dd className='col-sm-8'><img src={'../../../../../flags/' + _.get(props, 'form.retirementCountry.value', '') + '.png'}
                style={{ width: 30, height: 20 }}
                alt={_.get(props, 'form.retirementCountry.label', '')} />&nbsp; {_.get(props, 'form.retirementCountry.label', '')}
              </dd>
            </dl>
          </fieldset>
        </div> 
        <Nav.Row className='mb-4 p-2'>
          <Nav.Knapp className='backButton mr-4 w-100' type='hoved' onClick={(e)=>{
              e.preventDefault()
              props.onSave()}}> {props.t('ui:confirmAndSend')
            }
          </Nav.Knapp>
        </Nav.Row>
        </form>
    )
}

export default connect(
    mapStateToProps,
    {}
)(Summary)