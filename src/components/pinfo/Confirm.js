import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { withNamespaces } from 'react-i18next'

import File from '../../components/ui/File/File'
import * as Nav from '../ui/Nav'

const mapStateToProps = (state) => {
  return {
    locale: state.ui.locale,
    pinfo: state.pinfo,
    referrer: state.app.referrer,
    status: state.status,
    username: state.app.username,
    file: state.storage.file
  }
}

class Confirm extends React.Component {
  render () {
    const { t } = this.props
    const { person, bank, work, attachments, pension, onSave } = this.props.pinfo

    return <React.Fragment>
      <div>
        <fieldset>
          <legend>{t('pinfo:person-title')}</legend>
          <div className='col-xs-12'>
            <dl className='row'>
              <dt className='col-sm-4'><label>{t('pinfo:person-phoneNumber')}</label></dt>
              <div className='col-sm-8'>
                {person.phones.join(', ')}
              </div>
              <dt className='col-sm-4'><label>{t('pinfo:person-email')}</label></dt>
              <div className='col-sm-8'>
                {person.emails.join(', ')}
              </div>
            </dl>
          </div>
        </fieldset>
        <fieldset>
          <legend>{t('pinfo:bank-title')}</legend>
          <div className='col-xs-12'>
            <dl className='row'>
              <dt className='col-sm-4'><label>{t('pinfo:bank-name')}</label></dt>
              <dd className='col-sm-8'>{bank.bankName}</dd>
              <dt className='col-sm-4'><label>{t('pinfo:bank-address')}</label></dt>
              <dd className='col-sm-8'><pre>{bank.bankAddress}</pre></dd>
              <dt className='col-sm-4'><label>{t('pinfo:bank-country')}</label></dt>
              <dd className='col-sm-8'>
                <img src={'../../../../../flags/' + bank.bankCountry.value + '.png'}
                  style={{ width: 30, height: 20 }}
                  alt={bank.bankCountry.label} />&nbsp; {bank.bankCountry.label}/>
              </dd>
              <dt className='col-sm-4'><label>{t('pinfo:bank-bicSwift')}</label></dt>
              <dd className='col-sm-8'>{bank.bankBicSwift}</dd>
              <dt className='col-sm-4'><label>{t('pinfo:bank-iban')}</label></dt>
              <dd className='col-sm-8'>{bank.bankIban}</dd>
              <dt className='col-sm-4'><label>{t('pinfo:bank-code')}</label></dt>
              <dd className='col-sm-8'>{bank.bankCode}</dd>
            </dl>
          </div>
        </fieldset>
        <fieldset>
          <legend>{t('pinfo:work-title')}</legend>
          <div className='col-xs-12'>
            <dl className='row'>
              <dt className='col-sm-4'><label>{t('pinfo:work-type')}</label></dt>
              <dd className='col-sm-8'>{work.workType ? t('pinfo:work-type-option-' + work.workType) : null}</dd>
              <dt className='col-sm-4'><label>{t('pinfo:work-start-date')}</label></dt>
              <dd className='col-sm-8'>{work.workStartDate ? moment(work.workStartDate).format('DD MM YYYY') : null}</dd>
              <dt className='col-sm-4'><label>{t('pinfo:work-end-date')}</label></dt>
              <dd className='col-sm-8'>{work.workEndDate ? moment(work.workEndDate).format('DD MM YYYY') : null}</dd>
              <dt className='col-sm-4'><label>{t('pinfo:work-estimated-retirement-date')}</label></dt>
              <dd className='col-sm-8'>{work.workEstimatedRetirementDate ? moment(work.workEstimatedRetirementDate).format('DD MM YYYY') : null}</dd>
              <dt className='col-sm-4'><label>{t('pinfo:work-hour-per-week')}</label></dt>
              <dd className='col-sm-8'>{work.workHourPerWeek}</dd>
              <dt className='col-sm-4'><label>{t('pinfo:work-income')}</label></dt>
              <dd className='col-sm-8'>{work.workIncome}{' '}{work.workIncomeCurrency.currency}</dd>
              <dt className='col-sm-4'><label>{t('pinfo:work-payment-date')}</label></dt>
              <dd className='col-sm-8'>{work.workPaymentDate ? moment(work.workPaymentDate).format('DD MM YYYY') : null}</dd>
              <dt className='col-sm-4'><label>{t('pinfo:work-payment-frequency')}</label></dt>
              <dd className='col-sm-8'>{work.workPaymentFrequency ? t('pinfo:work-payment-frequency-option-' + work.workPaymentFrequency) : null}</dd>
            </dl>
          </div>
        </fieldset>
        <fieldset>
          <legend>{t('pinfo:attachments-title')}</legend>
          <div className='col-xs-12'>
            <dl className='row'>
              <dt className='col-sm-4'><label>{t('pinfo:attachment-types')}</label></dt>
              <dd className='col-sm-8'>{
                Object.entries(attachments.attachmentTypes ? attachments.attachmentTypes : {})
                  .filter(KV => KV[1])
                  .map(type => { return t('pinfo:attachments-types-' + type[0]) }).join(', ')
              }</dd>
              <dt className='col-sm-4'><label>{t('pinfo:attachments')}</label></dt>
              <dd className='col-sm-8'>{
                attachments.attachments ? attachments.attachments.map((file, i) => {
                  return <File className='mr-2' key={i} file={file} deleteLink={false} downloadLink={false} />
                }) : null }
              </dd>
            </dl>
          </div>
        </fieldset>
        <fieldset>
          <legend>{t('pinfo:pension-title')}</legend>
          <div className='col-xs-12'>
            <dl className='row'>
              <dt className='col-sm-4'><label>{t('pinfo:pension-country')}</label></dt>
              <dd className='col-sm-8'><img src={'../../../../../flags/' + pension.retirementCountry.value + '.png'}
                style={{ width: 30, height: 20 }}
                alt={pension.retirementCountry.label} />&nbsp; {pension.retirementCountry.label}
              </dd>
            </dl>
          </div>
        </fieldset>
      </div>
      <Nav.Row className='mb-4 p-2'>
        <Nav.Knapp className='backButton m-3' type='hoved' onClick={(e) => { e.preventDefault(); onSave() }}>
          {t('ui:confirmAndSend')}
        </Nav.Knapp>
      </Nav.Row>
    </React.Fragment>
  }
}

export default connect(
  mapStateToProps
)(withNamespaces(Confirm))
