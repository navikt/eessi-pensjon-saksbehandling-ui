import React from 'react'
import PT from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withNamespaces } from 'react-i18next'

import VeilederPanel from '../../ui/Panel/VeilederPanel'
import Name from './Name'
import Email from './Email'
import Phone from './Phone'
import * as Nav from '../../ui/Nav'

import { personValidation } from '../Validation/singleTests'
import * as pinfoActions from '../../../actions/pinfo'

const mapStateToProps = (state) => {
  return {
    locale: state.ui.locale,
    person: state.pinfo.person
  }
}
const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, pinfoActions), dispatch) }
}

class Person extends React.Component {
  state = {
    error: {}
  }

  constructor (props) {
    super(props)
    this.setLastNameAfterBirth = this.eventSetProperty.bind(this, 'lastNameAfterBirth', personValidation.personName)
  }

  eventSetProperty (key, validateFunction, event) {
    this.valueSetProperty(key, validateFunction, event.target.value)
  }

  valueSetProperty (key, validateFunction, value) {
    const { actions } = this.props
    actions.setLastNameAfterBirth(value)
    this.setState({
      error: {
        ...this.state.error,
        [key]: validateFunction(value)
      }
    })
  }

  render () {
    const { t, person, actions } = this.props
    const { error } = this.state

    return <div>
      <VeilederPanel>
        {t('pinfo:person-description')}
      </VeilederPanel>
      <h2 className='typo-undertittel mt-4 ml-0 mb-4 appDescription'>{t('pinfo:person-title')}</h2>
      <div className='row'>
        <div className='col-md-6'>
          <h3 className='typo-normal'>{t('pinfo:person-lastNameAfterBirth')}</h3>
          <Nav.Input label='' placeholder={t('ui:write')} value={person.lastNameAfterBirth || ''}
            onChange={this.setLastNameAfterBirth}
            feil={error.lastNameAfterBirth ? { feilmelding: t(error.lastNameAfterBirth) } : null}
          />
        </div>
      </div>
      <div className='row'>
        <div className='col-md-6'>
          <h3 className='typo-normal'>{t('pinfo:person-name')}</h3>
          {person.names.map(name => {
            return <Name t={t} names={person.names}
              setNames={actions.setNames}
              key={name} value={name} />
          })}
          <Name t={t} names={person.names}
            required={false}
            setNames={actions.setNames}
          />
        </div>
      </div>
      <div className='row'>
        <div className='col-md-10'>
          <h3 className='typo-normal'>{t('pinfo:person-phoneNumber')}</h3>
          {person.phones.map(phone => {
            return <Phone t={t} phones={person.phones}
              setPhones={actions.setPhones}
              key={phone} value={phone} />
          })}
          <Phone t={t} phones={person.phones}
            required={false}
            setPhones={actions.setPhones}
          />
        </div>
      </div>
      <div className='row'>
        <div className='col-md-8'>
          <h3 className='typo-normal'>{t('pinfo:person-email')}</h3>
          {person.emails.map(email => {
            return <Email t={t} emails={person.emails}
              setEmails={actions.setEmails}
              key={email} value={email} />
          })}
          <Email t={t} emails={person.emails}
            setEmails={actions.setEmails}
            required={false}
          />
        </div>
      </div>

    </div>
  }
}

Person.propTypes = {
  locale: PT.string,
  phone: PT.object,
  email: PT.object,
  t: PT.func
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  withNamespaces()(Person)
)
