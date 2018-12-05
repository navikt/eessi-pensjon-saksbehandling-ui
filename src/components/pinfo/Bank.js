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
    this.setState({
      error: {
        ...this.state.error,
        [key]: validateFunction(value)
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
              feil={error.bankName ? { feilmelding: t(error.bankName) } : null}
            />
          </div>
          <div className='col-md-6'>
            <label>{t('pinfo:bank-country')}</label>
            <CountrySelect locale={locale}
              value={bank.bankCountry || null}
              onSelect={this.setBankCountry}
              error={error.bankCountry}
              errorMessage={error.bankCountry}
            />
          </div>
        </Nav.Row>
        <Nav.Row>
          <div className='col-md-12'>
            <Nav.Textarea label={t('pinfo:bank-address')} value={bank.bankAddress || ''}
              style={{ minHeight: '100px' }}
              onChange={this.setBankAddress}
              feil={error.bankAddress ? { feilmelding: t(error.bankAddress) } : null}
            />
          </div>
        </Nav.Row>
        <Nav.Row>
          <div className='col-md-6'>
            <Nav.Input label={t('pinfo:bank-bicSwift')} value={bank.bankBicSwift || ''}
              onChange={this.setBankBicSwift}
              feil={error.bankBicSwift ? { feilmelding: t(error.bankBicSwift) } : null}
            />
          </div>
          <div className='col-md-6'>
            <Nav.Input label={t('pinfo:bank-iban')}
              value={bank.bankIban || ''}
              onChange={this.setBankIban}
              feil={error.bankIban ? { feilmelding: t(error.bankIban) } : null}
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
