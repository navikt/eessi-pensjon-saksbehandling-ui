import React from 'react'
import PT from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withNamespaces } from 'react-i18next'
import * as Nav from '../ui/Nav'
import CountrySelect from '../ui/CountrySelect/CountrySelect'
import * as pinfoActions from '../../actions/pinfo'
import { bankValidation } from './Validation/tests'

const mapStateToProps = (state) => {
  return {
    locale: state.ui.locale,
    bank: state.pinfo.bank
  }
}
const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, pinfoActions), dispatch) }
}

function eventSetProperty (key, event) {
  this.props.actions.setBank({ [key]: event.target.value })
}

function valueSetProperty (key, value) {
  this.props.actions.setBank({ [key]: value })
}

function displayErrorOff () {
  this.setState({
    displayError: false
  })
}

function displayErrorOn () {
  this.setState({
    displayError: true
  })
}

class Bank extends React.Component {
  constructor (props) {
    super(props)
    this.setBankName = eventSetProperty.bind(this, 'bankName')
    this.setBankAddress = eventSetProperty.bind(this, 'bankAddress')
    this.setBankCountry = valueSetProperty.bind(this, 'bankCountry')
    this.setBankBicSwift = eventSetProperty.bind(this, 'bankBicSwift')
    this.setBankIban = eventSetProperty.bind(this, 'bankIban')
    this.setBankCode = eventSetProperty.bind(this, 'bankCode')
    this.state = {
      displayError: true,
      error: {}
    }
    this.displayErrorSwitch = {
      on: displayErrorOn.bind(this),
      off: displayErrorOff.bind(this)
    }
  }

  validate(bank) {

    const { t } = this.props

    this.setState({
      error: {
        bankName: bankValidation.bankName(bank, t),
        bankAddress: bankValidation.bankAddress(bank, t),
        bankCountry: bankValidation.bankCountry(bank, t),
        bankBicSwift: bankValidation.bankBicSwift(bank, t),
        bankIban: bankValidation.bankIban(bank, t),
        bankCode: bankValidation.bankCode(bank, t)
      }
    })
  }

  render () {
    const { t, bank, locale } = this.props
    const { error } = this.state

    return <div>
      <h2 className='typo-undertittel ml-0 mb-4 appDescription'>{t('pinfo:bank-title')}</h2>
      <div className='mt-3'>
        <Nav.Row>
          <div className='col-md-6'>
            <Nav.Input label={t('pinfo:bank-name')} value={bank.bankName || ''}
                onChange={this.setBankName}
                feil={(this.state.displayError && error.bankName) ? { feilmelding: error.bankName } : null}
              />
          </div>
          <div className='col-md-6'>
          <label>{t('pinfo:bank-country')}</label>
          <CountrySelect locale={locale}
            value={bank.bankCountry || null}
            onSelect={this.setBankCountry}
            error={(this.state.displayError && error.bankCountry)}
            errorMessage={error.bankCountry}
          />
          </div>
        </Nav.Row>
        <Nav.Row>
          <div className='col-md-12'>
            <Nav.Textarea label={t('pinfo:bank-address')} value={bank.bankAddress || ''}
              style={{ minHeight: '100px' }}
              onChange={this.setBankAddress}
              feil={(this.state.displayError && error.bankAddress) ? { feilmelding: error.bankAddress } : null}
            />
          </div>
        </Nav.Row>
        <Nav.Row>
          <div className='col-md-6'>
            <Nav.Input label={t('pinfo:bank-bicSwift')} value={bank.bankBicSwift || ''}
              onChange={this.setBankBicSwift}
              feil={(this.state.displayError && error.bankBicSwift) ? { feilmelding: error.bankBicSwift } : null}
            />
          </div>
          <div className='col-md-6'>
            <Nav.Input label={t('pinfo:bank-iban')}
              value={bank.bankIban || ''}
              onChange={this.setBankIban}
              feil={(this.state.displayError && error.bankIban) ? { feilmelding: error.bankIban } : null}
            />
          </div>
        </Nav.Row>
        <Nav.Row>
          <div className='col-md-6'>
            <Nav.Input
              label={(t('pinfo:bank-code'))}
              value={bank.bankCode || ''}
              onChange={this.setBankCode}
              feil={(this.state.displayError && error.bankCode) ? { feilmelding: error.bankCode } : null}
            />
          </div>
        </Nav.Row>
      </div>
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
