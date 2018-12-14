import React from 'react'
import { connect } from 'react-redux'
import { withNamespaces } from 'react-i18next'

import * as navLogo from '../../../resources/images/nav-logo-red.png'

import * as Nav from '../../ui/Nav'
import PsychoPanel from '../../../components/ui/Psycho/PsychoPanel'
import PdfUtils from '../../../components/ui/Export/PdfUtils'
import Period from '../StayAbroad/Period'

import './Receipt.css'

const mapStateToProps = (state) => {
  return {
    locale: state.ui.locale,
    pinfo: state.pinfo
  }
}

class Receipt extends React.Component {
  state = {
    generatingPDF: false
  }

  async onReceiptRequest () {
    this.setState({
      generatingPDF: true
    })

    try {
      let newPdf = await PdfUtils.createPdf({
        nodeId: 'divToPrint'
      })

      this.downloadLink.setAttribute('href',
        'data:application/octet-stream;base64,' + encodeURIComponent(newPdf.content.base64)
      )
      this.downloadLink.click()
    } catch (e) {
      console.log('Failure to generate PDF', e)
    }
    this.setState({
      generatingPDF: false
    })
  }

  render () {
    const { t, locale } = this.props
    const { stayAbroad, person, bank } = this.props.pinfo
    const { generatingPDF } = this.state

    return <div className='c-pinfo-receipt'>
      <PsychoPanel closeButton>
        <p>{t('pinfo:receipt-veileder')}</p>
      </PsychoPanel>
      <div id='divToPrint'>
        <header className='mb-4'>
          <img alt='logo' src={navLogo} />
          <div className='dots' />
        </header>
        <Nav.Innholdstittel className='m-4'>{t('pinfo:receipt-title')}</Nav.Innholdstittel>
        <Nav.Undertittel className='m-4'>{t('pinfo:person-info-title')}</Nav.Undertittel>
        <dl className='row ml-2'>
          <dt className='col-4'> {t('pinfo:person-info-lastNameAtBirth')} </dt>
          <dd className='col-8'> {person.nameAtBirth || ''} </dd>
          <dt className='col-4'> {t('pinfo:person-info-previousName')} </dt>
          <dd className='col-8'> {person.previousName || ''} </dd>
          <dt className='col-4'> {t('pinfo:person-info-idAbroad')} </dt>
          <dd className='col-8'> {person.idAbroad ? '✓' : '✗'} </dd>
          <dt className='col-4'> {t('pinfo:person-info-fathername')} </dt>
          <dd className='col-8'> {person.fatherName || ''} </dd>
          <dt className='col-4'> {t('pinfo:person-info-mothername')} </dt>
          <dd className='col-8'> {person.motherName || ''} </dd>
          <dt className='col-4'> {t('pinfo:person-birthplace-country')} </dt>
          <dd className='col-8'>
            {person.country ? <React.Fragment>
              <img src={'../../../../../flags/' + person.country.value + '.png'}
                style={{ width: 30, height: 20, marginRight: '1rem' }}
                alt={person.country.label} />
              {person.country.label}
            </React.Fragment> : null}
          </dd>
          <dt className='col-4'> {t('pinfo:person-birthplace-city')} </dt>
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
              style={{ width: 30, height: 20, marginRight: '1rem' }}
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
              mode='detail'
              first={index === 0}
              last={index === stayAbroad.length - 1}
              period={period}
              locale={locale}
              periods={stayAbroad}
              key={period.id} />
          })}
        </div>
        <a className='hiddenLink' ref={item => { this.downloadLink = item }}
          onClick={(e) => e.stopPropagation()} title={t('ui:download')}
          href='#download'
          download={'kvittering.pdf'}>{t('ui:download')}</a>
        <Nav.Knapp
          id='pinfo-receipt-generate-button'
          className='generateButton m-4'
          disabled={generatingPDF}
          spinner={generatingPDF}
          onClick={this.onReceiptRequest.bind(this)}>
          {generatingPDF ? t('ui:generating') : t('ui:getReceipt')}
        </Nav.Knapp>
      </div>
    </div>
  }
}

export default connect(
  mapStateToProps
)(
  withNamespaces()(Receipt)
)
