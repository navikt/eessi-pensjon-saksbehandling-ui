import React from 'react'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { bindActionCreators } from 'redux'
import saveAs from 'file-saver'

import * as Nav from '../../ui/Nav'
import PsychoPanel from '../../../components/ui/Psycho/PsychoPanel'
import PdfUtils from '../../../components/ui/Export/PdfUtils'
import Period from '../StayAbroad/Period'

import * as navLogo from '../../../resources/images/nav-logo-red.png'
import * as pinfoActions from '../../../actions/pinfo'
import './Receipt.css'

const mapStateToProps = (state) => {
  return {
    locale: state.ui.locale,
    pinfo: state.pinfo,
    receipt: state.pinfo.receipt,
    username: state.app.username,
    isGeneratingReceipt: state.loading.isGeneratingReceipt
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, pinfoActions), dispatch) }
}

class Receipt extends React.Component {
  state = {
    downloaded: false
  }

  componentDidUpdate () {
    const { receipt } = this.props
    const { downloaded } = this.state
    if (receipt && !downloaded) {
      this.setState({
        downloaded: true
      })
      this.onDownloadRequest()
    }
  }

  generateReceiptRequest () {
    const { actions, receipt } = this.props
    const { downloaded } = this.state

    if (downloaded && receipt) {
      this.onDownloadRequest()
    } else {
      actions.generateReceipt()
    }
  }

  onDownloadRequest () {
    const { receipt } = this.props
    var blob = new Blob([PdfUtils.base64toData(receipt.content.base64)], { type: receipt.type })
    saveAs(blob, receipt.name)
  }

  render () {
    const { t, locale, username, isGeneratingReceipt } = this.props
    const { stayAbroad, person, bank, comment } = this.props.pinfo
    const { isReady } = this.state

    return <div className='c-pinfo-receipt'>
      <PsychoPanel closeButton>
        <p>{t('pinfo:receipt-veileder')}</p>
      </PsychoPanel>
      <div className='mt-4' id='divToPrint'>
        <header className='mb-4'>
          <img alt='logo' src={navLogo} />
          <div className='dots' />
        </header>
        <Nav.Innholdstittel className='m-4'>{t('pinfo:receipt-title')}</Nav.Innholdstittel>
        <Nav.Undertittel className='m-4'>{t('pinfo:person-info-title')}</Nav.Undertittel>
        <dl className='row ml-2'>
          <dt className='col-4'> {t('pinfo:person-info-currentName')} </dt>
          <dd className='col-8 text-capitalize'>
            {document.getElementById('name') ? document.getElementById('name').textContent : ''}
          </dd>
          <dt className='col-4'> {t('pinfo:person-info-fnr')} </dt>
          <dd className='col-8'> {username} </dd>
          <dt className='col-4'> {t('pinfo:person-info-lastNameAtBirth')} </dt>
          <dd className='col-8'> {person.nameAtBirth || ''} </dd>
          <dt className='col-4'> {t('pinfo:person-info-previousName')} </dt>
          <dd className='col-8'> {person.previousName || ''} </dd>
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
          <dd className='col-8'> {person.city || ''} </dd>
          <dt className='col-4'> {t('pinfo:person-birthplace-area')} </dt>
          <dd className='col-8'> {person.region || ''} </dd>
          <dt className='col-4'> {t('pinfo:person-contact-phoneNumber')} </dt>
          <dd className='col-8'> {person.phone || ''} </dd>
          <dt className='col-4'> {t('pinfo:person-contact-email')} </dt>
          <dd className='col-8'> {person.email || ''} </dd>
        </dl>
        <Nav.Undertittel className='m-4'>{t('pinfo:bank-title')}</Nav.Undertittel>
        <dl className='row ml-2'>
          <dt className='col-4'> {t('pinfo:bank-name')} </dt>
          <dd className='col-8'> {bank.bankName || ''} </dd>
          <dt className='col-4'> {t('pinfo:bank-address')} </dt>
          <dd className='col-8'><pre>{bank.bankAddress || ''}</pre></dd>
          <dt className='col-4'> {t('pinfo:bank-country')} </dt>
          <dd className='col-8'> {bank.bankCountry ? <React.Fragment>
            <img src={'../../../../../flags/' + bank.bankCountry.value + '.png'}
              style={{ width: 30, height: 20, marginRight: '0.7rem' }}
              alt={bank.bankCountry.label} />
            {bank.bankCountry.label}
          </React.Fragment> : '' }</dd>
          <dt className='col-4'> {t('pinfo:bank-bicSwift')} </dt>
          <dd className='col-8'> {bank.bankBicSwift || ''} </dd>
          <dt className='col-4'>  {t('pinfo:bank-iban')} </dt>
          <dd className='col-8'>  {bank.bankIban || ''}</dd>
        </dl>
        <Nav.Undertittel className='m-4'>{t('pinfo:stayAbroad-title')}</Nav.Undertittel>
        <div className='ml-4'>
          {stayAbroad.map((period, index) => {
            return <Period t={t}
              mode='receipt'
              first={index === 0}
              last={index === stayAbroad.length - 1}
              period={period}
              locale={locale}
              periods={stayAbroad}
              key={period.id} />
          })}
        </div>
        <Nav.Undertittel className='m-4'>{t('pinfo:stayAbroad-comment')}</Nav.Undertittel>
        <div className='receipt-comment'>{comment}</div>
      </div>
      <Nav.Knapp
        id='pinfo-receipt-generate-button'
        className='generateButton m-4'
        disabled={isGeneratingReceipt}
        spinner={isGeneratingReceipt}
        onClick={this.generateReceiptRequest.bind(this)}>
        {isGeneratingReceipt ? t('ui:generating') : t('ui:getReceipt')}
      </Nav.Knapp>
    </div>
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  withTranslation()(Receipt)
)
