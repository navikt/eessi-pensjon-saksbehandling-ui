import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'

import * as Nav from '../../ui/Nav'
import { personValidation } from '../Validation/singleTests'

class Email extends React.Component {
  state = {
    error: undefined,
    email: undefined
  }

  onEmailChange (event) {
    let email = event.target.value

    this.setState({
      error: undefined,
      email: email
    })
  }

  addEmail () {
    const { emails, setEmails } = this.props
    const { email } = this.state

    let error = personValidation.emailAddress(email)
    if (error) {
      return this.setState({
        error: error
      })
    }

    if (emails.indexOf(email) < 0) {
      let newEmails = _.clone(emails)
      newEmails.push(email)
      setEmails(newEmails)
      this.setState({
        error: undefined,
        email: ''
      })
    }
  }

  removeEmail (email) {
    const { emails, setEmails } = this.props

    let index = emails.indexOf(email)

    if (index >= 0) {
      let newEmails = _.clone(emails)
      newEmails.splice(index, 1)
      setEmails(newEmails)
    }
  }

  render () {
    const { value, t, required } = this.props
    const { email, error } = this.state

    return value ? <Nav.Row style={{ alignItems: 'baseline', padding: '2px' }}>
      <div className='col-md-4'>
        {value}
      </div>
      <div className='col-md-4'>
        <Nav.Knapp style={{ display: 'flex', alignItems: 'center' }} onClick={this.removeEmail.bind(this, value)} mini>
          <span className='mr-2' style={{ fontSize: '1.5rem' }}>×</span>
          {t('ui:remove')}
        </Nav.Knapp>
      </div>
    </Nav.Row>
      : <Nav.Row style={{ alignItems: 'baseline', padding: '2px' }}>
        <div className='col-md-4'>
          <Nav.Input
            required={required || false}
            placeholder={t('ui:write')}
            label={''}
            value={email || ''}
            onChange={this.onEmailChange.bind(this)}
            type='tel'
            feil={error ? { feilmelding: t(error) } : null}
          />
        </div>
        <div className='col-md-4'>
          <Nav.Knapp style={{ display: 'flex', alignItems: 'center' }} onClick={this.addEmail.bind(this)} mini>
            <span className='mr-2' style={{ fontSize: '1.5rem' }}>+</span>
            {t('ui:add')}
          </Nav.Knapp>
        </div>
      </Nav.Row>
  }
}

Email.propTypes = {
  email: PT.object,
  emails: PT.array,
  setEmails: PT.func.isRequired,
  t: PT.func
}

export default Email
