import React from 'react'
import PT from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators }from 'redux'
import { withTranslation } from 'react-i18next'

import Period from './StayAbroad/Period'
import PsychoPanel from '../ui/Psycho/PsychoPanel'
import * as Nav from '../ui/Nav'

import * as pinfoActions from '../../actions/pinfo'

const mapStateToProps = (state) => {
  return {
    locale: state.ui.locale,
    pinfo: state.pinfo,
    username: state.app.username,
    comment: state.pinfo.comment
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, pinfoActions), dispatch) }
}

class Confirm extends React.Component {
  setComment (e) {
    const { actions } = this.props
    actions.setComment(e.target.value)
  }

  render () {
    const { t, locale, username, comment } = this.props
    const { stayAbroad, person, bank } = this.props.pinfo

    return <React.Fragment>
      <Nav.Undertittel className='mb-3 appDescription'>{t('pinfo:confirm-title')}</Nav.Undertittel>
      <PsychoPanel id='pinfo-confirm-psycho-panel' className='mb-4' closeButton>
        <span>{t('pinfo:confirm-psycho-description')}</span>
      </PsychoPanel>
      <div id='divToPrint'>
        <Nav.Undertittel className='mt-5 mb-2'>{t('pinfo:person-info-title')}</Nav.Undertittel>
        <dl className='row'>
          <dt className='col-sm-4 col-6'> {t('pinfo:person-info-fnr')} </dt>
          <dd className='col-sm-8 col-6'> {username} </dd>
          <dt className='col-sm-4 col-6'> {t('pinfo:person-info-lastNameAtBirth')} </dt>
          <dd className='col-sm-8 col-6'> {person.nameAtBirth || '-'} </dd>
          <dt className='col-sm-4 col-6'> {t('pinfo:person-info-previousName')} </dt>
          <dd className='col-sm-8 col-6'> {person.previousName || '-'} </dd>
          {person.fatherName || person.motherName ? <React.Fragment>
            <dt className='col-sm-4 col-6'> {t('pinfo:stayAbroad-period-fathername')} </dt>
            <dd className='col-sm-8 col-6'> {person.fatherName || '-'} </dd>
            <dt className='col-sm-4 col-6'> {t('pinfo:stayAbroad-period-mothername')} </dt>
            <dd className='col-sm-8 col-6'> {person.motherName || '-'} </dd>
          </React.Fragment> : null}
          <dt className='col-sm-4 col-6'> {t('pinfo:person-birthplace-country')} </dt>
          <dd className='col-sm-8 col-6'>
            {person.country ? <React.Fragment>
              <img className='flagImg' src={'../../../../../flags/' + person.country.value + '.png'}
                alt={person.country.label} />
              {person.country.label}
            </React.Fragment> : null}
          </dd>
          <dt className='col-sm-4 col-6'> {t('pinfo:person-birthplace-place')} </dt>
          <dd className='col-sm-8 col-6'> {person.place || '-'} </dd>
          <dt className='col-sm-4 col-6'> {t('pinfo:person-birthplace-area')} </dt>
          <dd className='col-sm-8 col-6'> {person.region || '-'} </dd>
          <dt className='col-sm-4 col-6'> {t('pinfo:person-contact-phoneNumber')} </dt>
          <dd className='col-sm-8 col-6'> {person.phone || '-'} </dd>
          <dt className='col-sm-4 col-6'> {t('pinfo:person-contact-email')} </dt>
          <dd className='col-sm-8 col-6'> {person.email || '-'} </dd>
        </dl>
        <Nav.Undertittel className='mt-5 mb-2'>{t('pinfo:bank-title')}</Nav.Undertittel>
        <dl className='row'>
          <dt className='col-sm-4 col-6'> {t('pinfo:bank-name')} </dt>
          <dd className='col-sm-8 col-6'> {bank.bankName || '-'} </dd>
          <dt className='col-sm-4 col-6'> {t('pinfo:bank-address')} </dt>
          <dd className='col-sm-8 col-6'><pre>{bank.bankAddress || '-'}</pre></dd>
          <dt className='col-sm-4 col-6'> {t('pinfo:bank-country')} </dt>
          <dd className='col-sm-8 col-6'> {bank.bankCountry ? <React.Fragment>
            <img className='flagImg' src={'../../../../../flags/' + bank.bankCountry.value + '.png'}
              alt={bank.bankCountry.label} />
            {bank.bankCountry.label}
          </React.Fragment> : '-' }</dd>
          <dt className='col-sm-4 col-6'> {t('pinfo:bank-bicSwift')} </dt>
          <dd className='col-sm-8 col-6'> {bank.bankBicSwift || '-'} </dd>
          <dt className='col-sm-4 col-6'> {t('pinfo:bank-iban')} </dt>
          <dd className='col-sm-8 col-6'> {bank.bankIban || '-'}</dd>
        </dl>
        <Nav.Undertittel className='mt-5 mb-2'>{t('pinfo:stayAbroad-title')}</Nav.Undertittel>
        <div>
          {stayAbroad.map((period, index) => {
            return <Period t={t}
              mode='confirm'
              first={index === 0}
              last={index === stayAbroad.length - 1}
              period={period}
              locale={locale}
              editPeriod={() => {}}
              periods={stayAbroad}
              key={period.id}
            />
          })}
        </div>
        <Nav.Undertittel className='mt-5 mb-2'>{t('pinfo:stayAbroad-comment')}</Nav.Undertittel>
        <Nav.Textarea id='pinfo-comment'
          label={<div className='pinfo-label'>
            <div className='pinfo-label'>
              <span>{t('pinfo:stayAbroad-comment')}</span>
              <Nav.HjelpetekstAuto id='pinfo-stayAbroad-comment-help'>
                {t('pinfo:stayAbroad-comment-help')}
              </Nav.HjelpetekstAuto>
            </div>
            <span className='optional'>{t('ui:optional')}</span>
          </div>}
          placeholder={t('ui:writeIn')}
          value={comment || ''}
          style={{ minHeight: '100px' }}
          onChange={this.setComment.bind(this)}
          maxLength={2300}
        />
      </div>
    </React.Fragment>
  }
}

Confirm.propTypes = {
  t: PT.func.isRequired
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  withTranslation()(Confirm)
)
