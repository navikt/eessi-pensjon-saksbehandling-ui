import React from 'react'
import { connect } from 'react-redux'
import { withNamespaces } from 'react-i18next'

import * as Nav from '../../ui/Nav'
import PsychoPanel from '../../../components/ui/Psycho/PsychoPanel'
import Period from '../StayAbroad/Period'

import './Receipt.css'

const mapStateToProps = (state) => {
  return {
    locale: state.ui.locale,
    pinfo: state.pinfo,
    referrer: state.app.referrer,
    status: state.status
  }
}

class Receipt extends React.Component {
  render () {
    const { t, locale } = this.props
    const { stayAbroad, person, bank } = this.props.pinfo

    return <React.Fragment>
      <div>
        <PsychoPanel>
          <p>{t('pinfo:receipt-veileder')}</p>
        </PsychoPanel>
        <Nav.Innholdstittel>{t('pinfo:receipt-title')}</Nav.Innholdstittel>

        <Nav.Undertittel>{t('pinfo:person-title')}</Nav.Undertittel>

        <dl className='row'>
          <dt className='col-6'> {t('pinfo:person-info-lastNameAtBirth')} </dt>
          <dd className='col-6'> {person.nameAtBirth || ''} </dd>
          <dt className='col-6'> {t('pinfo:person-info-previousName')} </dt>
          <dd className='col-6'> {person.previousName || ''} </dd>
          <dt className='col-6'> {t('pinfo:father-idAbroad')} </dt>
          <dd className='col-6'> {person.idAbroad ? '✓' : '✗'} </dd>
          <dt className='col-6'> {t('pinfo:person-info-fatherName')} </dt>
          <dd className='col-6'> {person.fatherName || ''} </dd>
          <dt className='col-6'> {t('pinfo:person-info-motherName')} </dt>
          <dd className='col-6'> {person.motherName || ''} </dd>
          <dt className='col-6'> {t('pinfo:person-birthplace-country')} </dt>
          <dd className='col-6'> {person.country || ''} </dd>
          <dt className='col-6'> {t('pinfo:person-birthplace-city')} </dt>
          <dd className='col-6'> {person.city || ''} </dd>
          <dt className='col-6'> {t('pinfo:person-birthplace-area')} </dt>
          <dd className='col-6'> {person.region || ''} </dd>
          <dt className='col-6'> {t('pinfo:person-contact-phoneNumber')} </dt>
          <dd className='col-6'> {person.phone || ''} </dd>
          <dt className='col-6'> {t('pinfo:person-contact-email')} </dt>
          <dd className='col-6'> {person.email || ''} </dd>
        </dl>

        <Nav.Undertittel>{t('pinfo:bank-title')}</Nav.Undertittel>

        <dl className='row'>
          <dt className='col-6'> {t('pinfo:bank-name')} </dt>
          <dd className='col-6'> {bank.bankName || ''} </dd>
          <dt className='col-6'> {t('pinfo:bank-address')} </dt>
          <dd className='col-6'><pre>{bank.bankAddress || ''}</pre></dd>
          <dt className='col-6'> {t('pinfo:bank-country')} </dt>
          <dd className='col-6'> {bank.bankCountry ? <React.Fragment>
            <img src={'../../../../../flags/' + bank.bankCountry.value + '.png'}
              style={{ width: 30, height: 20, marginRight: '1rem' }}
              alt={bank.bankCountry.label} />
            {bank.bankCountry.label}
          </React.Fragment> : '' }</dd>
          <dt className='col-6'> {t('pinfo:bank-bicSwift')} </dt>
          <dd className='col-6'> {bank.bankBicSwift || ''} </dd>
          <dt className='col-6'>  {t('pinfo:bank-iban')} </dt>
          <dd className='col-6'>  {bank.bankIban || ''}</dd>
        </dl>

        <Nav.Undertittel>{t('pinfo:stayAbroad-title')}</Nav.Undertittel>

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
