import React from 'react'
import PT from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withNamespaces } from 'react-i18next'

import * as Nav from '../ui/Nav'
import CountrySelect from '../ui/CountrySelect/CountrySelect'

import * as pinfoActions from '../../actions/pinfo'
import { bankValidation } from './Validation/singleTests'

const mapStateToProps = (state) => {
  return {
    locale: state.ui.locale,
    bank: state.pinfo.bank
  }
}
const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, pinfoActions), dispatch) }
}

class Bank extends React.Component {
  state = {
    error: {}
  }

  constructor (props) {
    super(props)
    this.setBankName = this.eventSetProperty.bind(this, 'bankName', bankValidation.bankName)
    this.setBankAddress = this.eventSetProperty.bind(this, 'bankAddress', bankValidation.bankAddress)
    this.setBankCountry = this.valueSetProperty.bind(this, 'bankCountry', bankValidation.bankCountry)
    this.setBankBicSwift = this.eventSetProperty.bind(this, 'bankBicSwift', bankValidation.bankBicSwift)
    this.setBankIban = this.eventSetProperty.bind(this, 'bankIban', bankValidation.bankIban)
  }

  eventSetProperty (key, validateFunction, event) {
    this.valueSetProperty(key, validateFunction, event.target.value)
  }

  valueSetProperty (key, validateFunction, value) {
    const { actions } = this.props
    actions.setBank({ [key]: value })
    let error = validateFunction(value)
    this.setState({
      error: {
        ...this.state.error,
        [key]: error
      }
    })
  }

  render () {
    const { pageErrors, t, bank, locale } = this.props
    const { error } = this.state

    return <div>
      <Nav.Undertittel className='ml-0 mb-4 appDescription'>{t('pinfo:bank-title')}</Nav.Undertittel>

      <Nav.Row>
        <div className='col-md-6'>
          <Nav.Input
            id='pinfo-bank-name-input'
            type='text'
            label={t('pinfo:bank-name')}
            placeholder={t('ui:writeIn')}
            value={bank.bankName || ''}
            onChange={this.setBankName}
            feil={error.bankName && pageErrors ? { feilmelding: t(error.bankName) } : null}
          />
        </div>
        <div className='col-md-6 mb-3'>
          <label className='skjemaelement__label'>{t('pinfo:bank-country')}</label>
          <CountrySelect
            id='pinfo-bank-country-select'
            locale={locale}
            value={bank.bankCountry || null}
            onSelect={this.setBankCountry}
            error={error.bankCountry && pageErrors}
            errorMessage={error.bankCountry}
          />
        </div>
      </Nav.Row>
      <Nav.Row>
        <div className='col-md-6'>
          <Nav.Input
            id='pinfo-bank-bicswift-input'
            label={t('pinfo:bank-bicSwift')}
            placeholder={t('ui:writeIn')}
            value={bank.bankBicSwift || ''}
            onChange={this.setBankBicSwift}
            feil={error.bankBicSwift && pageErrors ? { feilmelding: t(error.bankBicSwift) } : null}
          />
        </div>
        <div className='col-md-6'>
          <Nav.Input
            id='pinfo-bank-iban-input'
            label={t('pinfo:bank-iban')}
            placeholder={t('ui:writeIn')}
            value={bank.bankIban || ''}
            onChange={this.setBankIban}
            feil={error.bankIban && pageErrors ? { feilmelding: t(error.bankIban) } : null}
          />
        </div>
      </Nav.Row>
      <Nav.Row>
        <div className='col-md-12'>
          <Nav.Textarea
            id='pinfo-bank-address-textarea'
            label={t('pinfo:bank-address')}
            placeholder={t('ui:writeIn')}
            value={bank.bankAddress || ''}
            style={{ minHeight: '100px' }}
            maxLength={100}
            onChange={this.setBankAddress}
            feil={error.bankAddress && pageErrors ? { feilmelding: t(error.bankAddress) } : null}
          />
        </div>
      </Nav.Row>
    </div>
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  withNamespaces()(Bank)
)
Bank.propTypes = {
  bank: PT.object,
  action: PT.func,
  t: PT.func,
  locale: PT.string
}
