import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { withNamespaces } from 'react-i18next'

import File from '../../components/ui/File/File'
import * as Nav from '../ui/Nav'
import PsychoPanel from '../../components/ui/Psycho/PsychoPanel'
import Period from './StayAbroad/Period'

import './Receipt.css'

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

class Receipt extends React.Component {
  render () {
    const { t, locale } = this.props
    const { stayAbroad, person, bank, work, attachments, pension, onSave } = this.props.pinfo

    return <React.Fragment>
      <div>
        <PsychoPanel>
          <p>{t('pinfo:receipt-veileder')}</p>
        </PsychoPanel>
        <h2 className='typo-Innholdstittel'>{t('pinfo:form-step4')}</h2>

        <h3>{t('pinfo:person-title')}</h3>

        <dl className='row'>
          <dt className='col-6'>
            {t('pinfo:person-lastNameAfterBirth')}
          </dt>
          <dd className='col-6'>
            {person.nameAtBirth || ''}
          </dd>
          <dt className='col-6'>
            {t('pinfo:person-name')}
          </dt>
          <dd className='col-6'>
            {person.previousName || ''}
          </dd>
          <dt className='col-6'>
            {t('pinfo:person-phoneNumber')}
          </dt>
          <dd className='col-6'>
            {person.phone || ''}
          </dd>
          <dt className='col-6'>
            {t('pinfo:person-email')}
          </dt>
          <dd className='col-6'>
            {person.email || ''}
          </dd>
        </dl>

        <h3>{t('pinfo:bank-title')}</h3>

        <dl className='row'>
          <dt className='col-6'>
            {t('pinfo:bank-name')}
          </dt>
          <dd className='col-6'>
            {bank.bankName || ''}
          </dd>
          <dt className='col-6'>
            {t('pinfo:bank-country')}
          </dt>
          <dd className='col-6'>
            {bank.bankCountry
              ? <React.Fragment>
                <img src={'../../../../../flags/' + bank.bankCountry.value + '.png'}
                  style={{ width: 30, height: 20 }}
                  alt={bank.bankCountry.label} />
                {bank.bankCountry.label}
              </React.Fragment> : '' }
          </dd>
          <dt className='col-6'>
            {t('pinfo:bank-bicSwift')}
          </dt>
          <dd className='col-6'>
            {bank.bankBicSwift || ''}
          </dd>
          <dt className='col-6'>
            {t('pinfo:bank-iban')}
          </dt>
          <dd className='col-6'>
            {bank.bankIban || ''}
          </dd>

        </dl>
        <h3>{t('pinfo:stayAbroad-title')}</h3>
        {stayAbroad.map((period, index) => {
          return <Period t={t}
            mode='view'
            period={period}
            locale={locale}
            periods={stayAbroad}
            key={period.id} />
        })}
      </div>
    </React.Fragment>
  }
}

export default connect(
  mapStateToProps
)(
  withNamespaces()(Receipt)
)
