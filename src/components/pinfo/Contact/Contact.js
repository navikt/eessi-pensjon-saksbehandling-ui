import React from 'react'
import PT from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withNamespaces } from 'react-i18next'

import Email from './Email'
import Phone from './Phone'

import * as pinfoActions from '../../../actions/pinfo'
import { contactValidation } from '../Validation/tests'

const mapStateToProps = (state) => {
  return {
    locale: state.ui.locale,
    phones: state.pinfo.form.contact.phones,
    emails: state.pinfo.form.contact.emails
  }
}
const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, pinfoActions), dispatch) }
}

class Contact extends React.Component {

  state = {
    displayError: true
  }

  constructor (props) {
    super(props)

    this.displayErrorSwitch = {
      on: this.displayErrorOn.bind(this),
      off: this.displayErrorOff.bind(this)
    }
  }

  displayErrorOff () {
    this.setState({
      displayError: false
    })
  }

  displayErrorOn () {
    this.setState({
      displayError: true
    })
  }

  render () {

    const { t, phones, emails, actions } = this.props

    return <div>
      <h2 className='typo-undertittel ml-0 mb-4 appDescription'>{t('pinfo:contact-title')}</h2>
      <h3 className='typo-normal'>{t('pinfo:contact-phoneNumber')}</h3>
      {phones.map(phone => {
        return <Phone t={t} phones={phones}
          actions={actions}
          key={phone} value={phone}/>
      })}
      <Phone t={t} phones={phones}
        required={false}
        actions={actions}
        displayErrorSwitch={this.displayErrorSwitch}
        displayError={this.state.displayError}
        testPhoneNumber={contactValidation.phoneHasError}
      />
      <h3 className='typo-normal'>{t('pinfo:contact-email')}</h3>
      {emails.map(email => {
        return <Email t={t} emails={emails}
          actions={actions}
          key={email} value={email}/>
      })}
      <Email t={t} emails={emails}
        actions={actions}
        required={false}
        displayErrorSwitch={this.displayErrorSwitch}
        displayError={this.state.displayError}
        testEmail={contactValidation.emailAddress}
      />
    </div>
  }
}

Contact.propTypes = {
  locale: PT.string,
  phone: PT.object,
  email: PT.object,
  t: PT.func
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  withNamespaces()(Contact)
)

