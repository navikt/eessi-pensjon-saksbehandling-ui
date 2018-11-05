import React from 'react'
import PT from 'prop-types'
import { connect } from 'react-redux'
import { newPhone, newEmail } from '../../../actions/pinfo'
import Email from './Email'
import Phone from './Phone'
import { Knapp } from '../../ui/Nav'

const mapStateToProps = (state) => {
  return {
    locale: state.ui.locale,
    phone: state.pinfo.form.contact.phone,
    email: state.pinfo.form.contact.email
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    newPhone: () => { dispatch(newPhone()) },
    newEmail: () => { dispatch(newEmail()) }
  }
}

function notEmpty (value) {
  return value !== null && value !== undefined && value !== ''
}

function checkAdresse (email) {
  return notEmpty(email.adresse)
}
function checkPhoneNumber (phone) {
  return notEmpty(phone.nummer)
}
function checkPhoneType (phone) {
  return notEmpty(phone.type)
}

class Contact extends React.Component {
  constructor (props) {
    super(props)
    if (Object.keys(this.props.phone).length === 0) {
      this.props.newPhone()
    }
    if (Object.keys(this.props.email).length === 0) {
      this.props.newEmail()
    }
    this.state = {
      displayErrorToggle: false
    }
  }

  displayErrorOff () {
    this.setState({
      displayErrorToggle: false
    })
  }
  displayErrorOn () {
    this.setState({
      displayErrorToggle: true
    })
  }

  render () {
    return (
      <div className='mt-3'>
        <fieldset>
          <legend>{this.props.t('pinfo:form-userPhoneLegend')}</legend>
          <Knapp htmlType='button' onClick={() => this.props.newPhone()} mini={true}>
            {this.props.t('pinfo:form-userPhoneNew')}
          </Knapp>
          {Object.keys(this.props.phone).map(e => (
            <Phone
              uuid={e}
              key={e}
              t={this.props.t}
              numberError={this.state.displayErrorToggle && !checkPhoneNumber(this.props.phone[e])}
              typeError={this.state.displayErrorToggle && !checkPhoneType(this.props.phone[e])}
              numberErrorMessage={this.props.t('pinfo:validation-noUserPhone')}
              typeErrorMessage={this.props.t('pinfo:validation-noTypePhone')}
              displayErrorOn={this.displayErrorOn.bind(this)}
              displayErrorToggle={this.state.displayErrorToggle}
            />
          ))}
        </fieldset>
        <fieldset>
          <legend>{this.props.t('pinfo:form-userEmailLegend')}</legend>
          <Knapp htmlType='button' onClick={() => this.props.newEmail()} mini={true} >
            {this.props.t('pinfo:form-userEmailNew')} 
          </Knapp>
          {Object.keys(this.props.email).map((e) => (
            <Email
              uuid={e}
              key={e}
              t={this.props.t}
              error={this.state.displayErrorToggle && !checkAdresse(this.props.email[e])}
              errorMessage={this.props.t('pinfo:validation-noUserEmail')}
              displayErrorOn={this.displayErrorOn.bind(this)}
              displayErrorToggle={this.state.displayErrorToggle}
            />
          ))}
        </fieldset>
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Contact)

Contact.propTypes = {
  locale: PT.string,
  phone: PT.object,
  email: PT.object,
  t: PT.func
}
