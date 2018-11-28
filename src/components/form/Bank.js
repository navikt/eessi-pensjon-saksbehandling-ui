import React from 'react'
import PT from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withNamespaces } from 'react-i18next'
import * as Nav from '../ui/Nav'
import CountrySelect from '../ui/CountrySelect/CountrySelect'
import * as pinfoActions from '../../actions/pinfo'
import { bankValidation } from '../pinfo/tests'

const mapStateToProps = (state) => {
  return {
    locale: state.ui.locale,
    bank: state.pinfo.form.bank
  }
}
const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators({ ...pinfoActions }, dispatch) }
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
      displayError: false
    }
    this.displayErrorSwitch = { on: displayErrorOn.bind(this), off: displayErrorOff.bind(this) }
  }
  render () {
    const { t, bank, locale } = this.props
    const error = {
      bankName: bankValidation.bankName(bank, t),
      bankAddress: bankValidation.bankAddress(bank, t),
      bankCountry: bankValidation.bankCountry(bank, t),
      bankBicSwift: bankValidation.bankBicSwift(bank, t),
      bankIban: bankValidation.bankIban(bank, t),
      bankCode: bankValidation.bankCode(bank, t)
    }
    return (
      <div>
        <h2>{t('pinfo:form-bank')}</h2>
        <div className='mt-3'>
            <Nav.Row>
              <div className='col-md-6'>
                <Nav.Input label={t('pinfo:form-bankName') + ' *'} value={bank.bankName || ''}
                  onChange={this.setBankName}
                  feil={(this.state.displayError && error.bankName) ? { feilmelding: error.bankName } : null}
                />

              </div>
              <div className='col-md-6'>
                <Nav.Textarea label={t('pinfo:form-bankAddress') + ' *'} value={bank.bankAddress || ''}
                  style={{ minHeight: '200px' }}
                  onChange={this.setBankAddress}
                  feil={(this.state.displayError && error.bankAddress) ? { feilmelding: error.bankAddress } : null}
                />

              </div>
            </Nav.Row>
            <Nav.Row>
              <div className='col-md-6'>
                <div className='mb-3' >
                  <label>{t('pinfo:form-bankCountry') + ' *'}</label>
                  <div>
                    <CountrySelect locale={locale}
                      value={bank.bankCountry || null}
                      onSelect={this.setBankCountry}
                      error={(this.state.displayError && error.bankCountry)}
                      errorMessage={error.bankCountry}
                    />
                  </div>
                </div>
              </div>
              <div className='col-md-6'>
                <Nav.Input label={t('pinfo:form-bankBicSwift') + ' *'} value={bank.bankBicSwift || ''}
                  onChange={this.setBankBicSwift}
                  feil={(this.state.displayError && error.bankBicSwift) ? { feilmelding: error.bankBicSwift } : null}
                />
              </div>
            </Nav.Row>
            <Nav.Row>
              <div className='col-md-6'>
                <Nav.Input label={t('pinfo:form-bankIban') + ' *'}
                  value={bank.bankIban || ''}
                  onChange={this.setBankIban}
                  feil={(this.state.displayError && error.bankIban) ? { feilmelding: error.bankIban } : null}
                />
              </div>
              <div className='col-md-6'>
                <Nav.Input
                  label={(t('pinfo:form-bankCode') + ' *')}
                  value={bank.bankCode || ''}
                  onChange={this.setBankCode}
                  feil={(this.state.displayError && error.bankCode) ? { feilmelding: error.bankCode } : null}
                />
              </div>
            </Nav.Row>
        </div>
      </div>
    )
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
