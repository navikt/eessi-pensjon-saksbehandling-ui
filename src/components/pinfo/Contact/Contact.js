import React from 'react'
import PT from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withNamespaces } from 'react-i18next'

import Email from './Email'
import Phone from './Phone'

import * as pinfoActions from '../../../actions/pinfo'

const mapStateToProps = (state) => {
  return {
    locale: state.ui.locale,
    phones: state.pinfo.contact.phones,
    emails: state.pinfo.contact.emails
  }
}
const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, pinfoActions), dispatch) }
}

class Contact extends React.Component {
  state = {
    error: undefined
  }

  render () {
    const { t, phones, emails, actions } = this.props

    return <div>
      <h2 className='typo-undertittel ml-0 mb-4 appDescription'>{t('pinfo:contact-title')}</h2>
      <h3 className='typo-normal'>{t('pinfo:contact-phoneNumber')}</h3>
      {phones.map(phone => {
        return <Phone t={t} phones={phones}
          setPhones={actions.setPhones}
          key={phone} value={phone} />
      })}
      <Phone t={t} phones={phones}
        required={false}
        setPhones={actions.setPhones}
      />
      <h3 className='typo-normal'>{t('pinfo:contact-email')}</h3>
      {emails.map(email => {
        return <Email t={t} emails={emails}
          setEmails={actions.setEmails}
          key={email} value={email} />
      })}
      <Email t={t} emails={emails}
        setEmails={actions.setEmails}
        required={false}
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
