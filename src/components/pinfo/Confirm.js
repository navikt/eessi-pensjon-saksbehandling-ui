import React from 'react'
import PT from 'prop-types'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'

import Period from './StayAbroad/Period'
import PsychoPanel from '../ui/Psycho/PsychoPanel'
import * as Nav from '../ui/Nav'

const mapStateToProps = (state) => {
  return {
    locale: state.ui.locale,
    pinfo: state.pinfo,
    username: state.app.username
  }
}

class Confirm extends React.Component {
  render () {
    const { t, locale, username } = this.props
    const { stayAbroad, person, bank, comment } = this.props.pinfo

    return <React.Fragment>
      <PsychoPanel id='pinfo-confirm-psycho-panel' className='mb-4' closeButton>
        <span>{t('pinfo:confirm-psycho-description')}</span>
      </PsychoPanel>
      <Nav.Undertittel className='ml-0 mb-4 appDescription'>{t('pinfo:confirm-title')}</Nav.Undertittel>
      <div className='mt-4' id='divToPrint'>
        <Nav.Undertittel className='m-4'>{t('pinfo:person-info-title')}</Nav.Undertittel>
        <dl className='row ml-2'>
          <dt className='col-4'> {t('pinfo:person-info-currentName')} </dt>
          <dd className='col-8 text-capitalize'>
            {document.getElementById('name') ? document.getElementById('name').textContent : ''}
          </dd>
          <dt className='col-4'> {t('pinfo:person-info-fnr')} </dt>
          <dd className='col-8'> {username} </dd>
          <dt className='col-4'> {t('pinfo:person-info-lastNameAtBirth')} </dt>
          <dd className='col-8'> {person.nameAtBirth || '-'} </dd>
          <dt className='col-4'> {t('pinfo:person-info-previousName')} </dt>
          <dd className='col-8'> {person.previousName || '-'} </dd>
          {person.fatherName || person.motherName ? <React.Fragment>
            <dt className='col-4'> {t('pinfo:stayAbroad-period-fathername')} </dt>
            <dd className='col-8'> {person.fatherName || '-'} </dd>
            <dt className='col-4'> {t('pinfo:stayAbroad-period-mothername')} </dt>
            <dd className='col-8'> {person.motherName || '-'} </dd>
          </React.Fragment> : null}
          <dt className='col-4'> {t('pinfo:person-birthplace-country')} </dt>
          <dd className='col-8'>
            {person.country ? <React.Fragment>
              <img src={'../../../../../flags/' + person.country.value + '.png'}
                style={{ width: 30, height: 20, marginRight: '0.7rem' }}
                alt={person.country.label} />
              {person.country.label}
            </React.Fragment> : null}
          </dd>
          <dt className='col-4'> {t('pinfo:person-birthplace-place')} </dt>
          <dd className='col-8'> {person.city || '-'} </dd>
          <dt className='col-4'> {t('pinfo:person-birthplace-area')} </dt>
          <dd className='col-8'> {person.region || '-'} </dd>
          <dt className='col-4'> {t('pinfo:person-contact-phoneNumber')} </dt>
          <dd className='col-8'> {person.phone || '-'} </dd>
          <dt className='col-4'> {t('pinfo:person-contact-email')} </dt>
          <dd className='col-8'> {person.email || '-'} </dd>
        </dl>
        <Nav.Undertittel className='m-4'>{t('pinfo:bank-title')}</Nav.Undertittel>
        <dl className='row ml-2'>
          <dt className='col-4'> {t('pinfo:bank-name')} </dt>
          <dd className='col-8'> {bank.bankName || '-'} </dd>
          <dt className='col-4'> {t('pinfo:bank-address')} </dt>
          <dd className='col-8'><pre>{bank.bankAddress || '-'}</pre></dd>
          <dt className='col-4'> {t('pinfo:bank-country')} </dt>
          <dd className='col-8'> {bank.bankCountry ? <React.Fragment>
            <img src={'../../../../../flags/' + bank.bankCountry.value + '.png'}
              style={{ width: 30, height: 20, marginRight: '0.7rem' }}
              alt={bank.bankCountry.label} />
            {bank.bankCountry.label}
          </React.Fragment> : '-' }</dd>
          <dt className='col-4'> {t('pinfo:bank-bicSwift')} </dt>
          <dd className='col-8'> {bank.bankBicSwift || '-'} </dd>
          <dt className='col-4'>  {t('pinfo:bank-iban')} </dt>
          <dd className='col-8'>  {bank.bankIban || '-'}</dd>
        </dl>
        <Nav.Undertittel className='m-4'>{t('pinfo:stayAbroad-title')}</Nav.Undertittel>
        <div className='ml-4'>
          {stayAbroad.map((period, index) => {
            return <Period t={t}
              mode='confirm'
              first={index === 0}
              last={index === stayAbroad.length - 1}
              period={period}
              locale={locale}
              editPeriod={() => {}}
              periods={stayAbroad}
              key={period.id} />
          })}
        </div>
        <Nav.Undertittel className='m-4'>{t('pinfo:stayAbroad-comment')}</Nav.Undertittel>
        <div className='confirm-comment'>{comment || '-'}</div>
      </div>
    </React.Fragment>
  }
}

Confirm.propTypes = {
  t: PT.func.isRequired
}

export default connect(
  mapStateToProps,
  null
)(
  withTranslation()(Confirm)
)
