import React from 'react'
import PT from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withNamespaces } from 'react-i18next'
import * as pinfoActions from '../../../actions/pinfo'
import Email from './Email'
import Phone from './Phone'
import { Knapp } from '../../ui/Nav'
import { contactValidation } from '../../pinfo/tests'
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

class Contact extends React.Component {
  constructor (props) {
    super(props)
    this.newPhone = newPhone.bind(this)
    this.newEmail = newEmail.bind(this)
    this.displayErrorSwitch = { on: displayErrorOn.bind(this), off: displayErrorOff.bind(this) }

    // ensure that there is always at least one input field for contact information.
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
              testPhoneNumber={contactValidation.phoneNumber}
              testPhoneType={contactValidation.phoneType}
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
              testEmail={contactValidation.emailAddress}
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
  withNamespaces()(Contact)
)

Contact.propTypes = {
  locale: PT.string,
  phone: PT.object,
  email: PT.object,
  t: PT.func
}
