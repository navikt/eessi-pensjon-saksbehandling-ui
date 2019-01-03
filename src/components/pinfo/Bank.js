import React from 'react'
import PT from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withNamespaces } from 'react-i18next'
import _ from 'lodash'

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
    localErrors: {},
    errorTimestamp: new Date().getTime()
  }

  static getDerivedStateFromProps (newProps, oldState) {
    if (newProps.errorTimestamp > oldState.errorTimestamp) {
      return {
        localErrors: newProps.pageErrors,
        errorTimestamp: newProps.errorTimestamp
      }
    }
    return null
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

    let _localErrors = _.cloneDeep(this.state.localErrors)

    actions.setBank({ [key]: value })
    let error = validateFunction ? validateFunction(value) : undefined

    if (!error && _localErrors.hasOwnProperty(key)) {
      delete _localErrors[key]
    }
    if (error) {
      _localErrors[key] = error
    }

    this.setState({
      localErrors: _localErrors
    })
  }

  render () {
    const { t, bank, locale, disableHelpText } = this.props
    const { localErrors } = this.state

    return <div className='c-pinfo-bank'>
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
            feil={localErrors.bankName ? { feilmelding: t(localErrors.bankName) } : null}
          />
        </div>
        <div className='col-md-6 mb-3'>
          <label className='skjemaelement__label'>{t('pinfo:bank-country')}</label>
          <CountrySelect
            placeholder={t('ui:writeIn')}
            id='pinfo-bank-country-select'
            locale={locale}
            value={bank.bankCountry || null}
            onSelect={this.setBankCountry}
            error={localErrors.bankCountry}
            errorMessage={t(localErrors.bankCountry)}
          />
        </div>
      </Nav.Row>
      <Nav.Row>
        <div className='col-md-6'>
          <Nav.Input
            id='pinfo-bank-iban-input'
            label={t('pinfo:bank-iban')}
            placeholder={t('ui:writeIn')}
            value={bank.bankIban || ''}
            onChange={this.setBankIban}
            feil={localErrors.bankIban ? { feilmelding: t(localErrors.bankIban) } : null}
          />

        </div>
        <div className='col-md-6 d-flex align-items-center'>
          {disableHelpText ? null
            : <Nav.HjelpetekstBase id='pinfo-bank-iban-input-help'>
                {t('pinfo:bank-iban-help')}
              </Nav.HjelpetekstBase>
          }
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
            feil={localErrors.bankBicSwift ? { feilmelding: t(localErrors.bankBicSwift) } : null}
          />
        </div>
        <div className='col-md-6 d-flex align-items-center'>
          {disableHelpText ? null
            : <Nav.HjelpetekstBase id='pinfo-bank-bicswift-input-help'>
              {t('pinfo:bank-bicSwift-help')}
            </Nav.HjelpetekstBase>
          }
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
            feil={localErrors.bankAddress ? { feilmelding: t(localErrors.bankAddress) } : null}
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
