import React from 'react'
import PT from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { translate } from 'react-i18next'
import * as pinfoActions from '../../../actions/pinfo'
import Email from './Email'
import Phone from './Phone'
import { Knapp } from '../../ui/Nav'
import './Contact.css'

const mapStateToProps = (state) => {
  return {
    locale: state.ui.locale,
    phone: state.pinfo.form.contact.phone,
    email: state.pinfo.form.contact.email
  }
}
const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators({ ...pinfoActions }, dispatch) }
}
function newPhone () {
  this.props.actions.newPhone()
}
function newEmail () {
  this.props.actions.newEmail()
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

function testPhoneNumber (phone, t) {
  return (
    !phone.number ? t('pinfo:validation-noUserPhone')
      : !/\+?[\d]+[\d\s-]*/.test(phone.number) ? t('pinfo:validation-invalidUserPhone')
        : false
  )
}
function testPhoneType (phone, t) {
  return (
    !phone.type ? t('pinfo:validation-noTypePhone')
      : false
  )
}
function testEmail (email, t) {
  return (
    !email.address ? t('pinfo:validation-noUserEmail')
      : !/.+@.+\..+/.test(email.address) ? t('pinfo:validation-invalidUserEmail')
        : false
  )
}

function validPhone (phone, t) {
  return !(testPhoneNumber(phone, t) || testPhoneType(phone, t))
}
// Returns false if there is no errors.
export function testPhones (KV, t) {
  return Object.keys(KV).map(key => KV[key]).reduce((acc, phone) => (acc || validPhone(phone, t)), false)
    ? false
    : t('pinfo:validation-noValidPhones')
}

class Contact extends React.Component {
  constructor (props) {
    super(props)
    this.newPhone = newPhone.bind(this)
    this.newEmail = newEmail.bind(this)
    this.displayErrorSwitch = { on: displayErrorOn.bind(this), off: displayErrorOff.bind(this) }

    //ensure that there is always at least one input field for contact information.
    if (Object.keys(this.props.phone).length === 0) {
      this.newPhone()
    }
    if (Object.keys(this.props.email).length === 0) {
      this.newEmail()
    }
    this.state = {
      displayError: false
    }
  }
  render () {
    return (
      <div className='mt-3'>
        <fieldset>
          <legend>{this.props.t('pinfo:form-userPhoneLegend')}</legend>
          {Object.keys(this.props.phone).map(e => (
            <Phone
              uuid={e}
              key={e}
              numberOfSiblings={Object.keys(this.props.phone).length - 1}
              t={this.props.t}
              required={false}
              displayErrorSwitch={this.displayErrorSwitch}
              displayError={this.state.displayError}
              testPhoneNumber={testPhoneNumber}
              testPhoneType={testPhoneType}
            />
          ))}
          <div className='col-xs-12'>
            <Knapp className='new-Contact' htmlType='button' onClick={this.newPhone} mini>
              {this.props.t('pinfo:form-userPhoneNew')}
            </Knapp>
          </div>
        </fieldset>
        <fieldset>
          <legend>{this.props.t('pinfo:form-userEmailLegend')}</legend>
          {Object.keys(this.props.email).map((e) => (
            <Email
              uuid={e}
              key={e}
              numberOfSiblings={Object.keys(this.props.email).length - 1}
              t={this.props.t}
              required={false}
              displayErrorSwitch={this.displayErrorSwitch}
              displayError={this.state.displayError}
              testEmail={testEmail}
            />
          ))}
          <div className='col-xs-12'>
            <Knapp className='new-Contact' htmlType='button' onClick={this.newEmail} mini >
              {this.props.t('pinfo:form-userEmailNew')}
            </Knapp>
          </div>
        </fieldset>
      </div>
    )
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  translate()(Contact)
)

Contact.propTypes = {
  locale: PT.string,
  phone: PT.object,
  email: PT.object,
  t: PT.func
}
