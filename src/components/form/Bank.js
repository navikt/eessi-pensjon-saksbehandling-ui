import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import { connect } from 'react-redux'
import * as Nav from '../ui/Nav'
import CountrySelect from '../ui/CountrySelect/CountrySelect'
import { setEventProperty } from '../../actions/pinfo'

const mapStateToProps = (state) => {
  return {
    locale: state.ui.locale,
    bank: _.pick(state.pinfo.form,
      [
        'bankName',
        'bankAddress',
        'bankCountry',
        'bankBicSwift',
        'bankIban',
        'bankCode'
      ]
    )
  }
}
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setEventProperty: (key, payload) => { dispatch(setEventProperty({ [key]: payload })) },
    setEventPropertyEvent: (key, event) => { dispatch(setEventProperty({ [key]: event.target.value })) }
  }
}
class Bank extends React.Component {
  constructor (props) {
    super(props)
    this.setBankName = this.props.setEventPropertyEvent.bind(null, 'bankName')
    this.setBankAddress = this.props.setEventPropertyEvent.bind(null, 'bankAddress')
    this.setBankCountry = this.props.setEventProperty.bind(null, 'bankCountry')
    this.setBankBicSwift = this.props.setEventPropertyEvent.bind(null, 'bankBicSwift')
    this.setBankIban = this.props.setEventPropertyEvent.bind(null, 'bankIban')
    this.setBankCode = this.props.setEventPropertyEvent.bind(null, 'bankCode')
  }
  render () {
    const { t, bank, locale } = this.props
    return (
      <div className='mt-3'>
        <Nav.Row>
          <div className='col-md-6'>
            <Nav.Input label={t('pinfo:form-bankName') + ' *'} value={bank.bankName || ''}
              onChange={this.setBankName}
            />

          </div>
          <div className='col-md-6'>
            <Nav.Textarea label={t('pinfo:form-bankAddress') + ' *'} value={bank.bankAddress || ''}
              style={{ minHeight: '200px' }}
              onChange={this.setBankAddress}
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
                />
              </div>
            </div>
          </div>
          <div className='col-md-6'>
            <Nav.Input label={t('pinfo:form-bankBicSwift') + ' *'} value={bank.bankBicSwift || ''}
              onChange={this.setBankBicSwift}
            />
          </div>
        </Nav.Row>
        <Nav.Row>
          <div className='col-md-6'>
            <Nav.Input label={t('pinfo:form-bankIban') + ' *'}
              value={bank.bankIban || ''}
              onChange={this.setBankIban}
            />
          </div>
          <div className='col-md-6'>
            <Nav.Input
              label={(t('pinfo:form-bankCode') + ' *')}
              value={bank.bankCode || ''}
              onChange={this.setBankCode}
            />
          </div>
        </Nav.Row>
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Bank)

Bank.propTypes = {
  bank: PT.object,
  action: PT.func,
  t: PT.func,
  locale: PT.string
}
