import React from 'react'
import PT from 'prop-types'
import { connect } from 'react-redux'
import { newPhone, newEmail } from '../../../actions/pinfo'
import Email from './Email'
import Phone from './Phone'

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
        <input type='button' value='new Phone' onClick={() => this.props.newPhone()} />
        <input type='button' value='new Email' onClick={() => this.props.newEmail()} />
        <fieldset>
          <legend>{this.props.t('Phone numbers')}</legend>
          {Object.keys(this.props.phone).map(e => (
            <Phone
              uuid={e}
              key={e}
              t={this.props.t}
              numberError={this.state.displayErrorToggle && !checkPhoneNumber(this.props.phone[e])}
              typeError={this.state.displayErrorToggle && !checkPhoneType(this.props.phone[e])}
              numberErrorMessage='beep bop'
              typeErrorMessage='foo bar'
              displayErrorOn={this.displayErrorOn.bind(this)}
              displayErrorToggle={this.state.displayErrorToggle}
            />
          ))}
        </fieldset>
        <fieldset>
          <legend>{this.props.t('Email Adresses')}</legend>
          {Object.keys(this.props.email).map((e) => (
            <Email
              uuid={e}
              key={e}
              t={this.props.t}
              error={this.state.displayErrorToggle && !checkAdresse(this.props.email[e])}
              errorMessage='Fibbidy fob'
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
