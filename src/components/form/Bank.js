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
    return (
      <fieldset>
        <legend>{t('pinfo:form-bank')}</legend>
        <div className='mt-3'>
          <div className='col-xs-12'>
            <Nav.Row>
              <div className='col-md-6'>
                <Nav.Input label={t('pinfo:form-bankName') + ' *'} value={bank.bankName || ''}
                  onChange={this.setBankName} 
                  feil={(this.state.displayError && bankValidation.bankName(bank, t)) ? { feilmelding: bankValidation.bankName(bank, t)} : null}
                />

              </div>
              <div className='col-md-6'>
                <Nav.Textarea label={t('pinfo:form-bankAddress') + ' *'} value={bank.bankAddress || ''}
                  style={{ minHeight: '200px' }}
                  onChange={this.setBankAddress}
                  feil={(this.state.displayError && bankValidation.bankAddress(bank, t)) ? { feilmelding: bankValidation.bankAddress(bank, t)} : null}
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
                      error={(this.state.displayError && bankValidation.bankCountry(bank, t))}
                      errorMessage={bankValidation.bankCountry(bank, t)}
                    />
                  </div>
                </div>
              </div>
              <div className='col-md-6'>
                <Nav.Input label={t('pinfo:form-bankBicSwift') + ' *'} value={bank.bankBicSwift || ''}
                  onChange={this.setBankBicSwift}
                  feil={(this.state.displayError && bankValidation.bankBicSwift(bank, t)) ? { feilmelding: bankValidation.bankBicSwift(bank, t)} : null}
                />
              </div>
            </Nav.Row>
            <Nav.Row>
              <div className='col-md-6'>
                <Nav.Input label={t('pinfo:form-bankIban') + ' *'}
                  value={bank.bankIban || ''}
                  onChange={this.setBankIban}
                  feil={(this.state.displayError && bankValidation.bankIban(bank, t)) ? { feilmelding: bankValidation.bankIban(bank, t)} : null}
                />
              </div>
              <div className='col-md-6'>
                <Nav.Input
                  label={(t('pinfo:form-bankCode') + ' *')}
                  value={bank.bankCode || ''}
                  onChange={this.setBankCode}
                  feil={(this.state.displayError && bankValidation.bankCode(bank, t)) ? { feilmelding: bankValidation.bankCode(bank, t)} : null}
                />
              </div>
            </Nav.Row>
          </div>
        </div>
      </fieldset>
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
