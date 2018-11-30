import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'

import * as Nav from '../../ui/Nav'

class Email extends React.Component {

  state = {
    addressError: undefined,
    email: undefined
  }

  onEmailChange (event) {

    let email = event.target.value

    this.setState({
      email : email
    })
  }

  addEmail () {

    const { t, emails, actions, testEmail } = this.props
    const { email } = this.state

    let addressError = testEmail(email, t)
    if (addressError) {
        this.setState({
            addressError : addressError
        })
    } else {
      if (emails.indexOf(email) < 0) {
        let newEmails = _.clone(emails)
        newEmails.push(email)
        actions.setEmails(newEmails)
        this.setState({
          email: ''
        })
      }
    }
  }

 removeEmail (email) {

   const { emails, actions } = this.props

   let index = emails.indexOf(email)

   if (index >= 0) {
     let newEmails = _.clone(emails)
     newEmails.splice(index, 1)
     actions.setEmails(newEmails)
   }
 }

  render () {
    const { value, t, displayErrorSwitch, required, displayError } = this.props
    const { email, addressError } = this.state

    return value ? <Nav.Row style={{alignItems: 'baseline', padding: '2px'}}>
      <div className='col-md-4'>
        {value}
      </div>
      <div className='col-md-4'>
        <Nav.Knapp style={{display: 'flex', alignItems: 'center'}} onClick={this.removeEmail.bind(this, value)} mini>
          <span className='mr-2' style={{fontSize: '1.5rem'}}>×</span>
          {t('ui:remove')}
        </Nav.Knapp>
      </div>
    </Nav.Row>
    : <Nav.Row style={{alignItems: 'baseline', padding: '2px'}}>
      <div className='col-md-4'>
        <Nav.Input
          onInvalid={displayErrorSwitch.on}
          required={required || false}
          label={''}
          value={email || ''}
          onChange={this.onEmailChange.bind(this)}
          type='tel'
          feil={displayError && addressError ? { feilmelding: addressError } : null}
        />
      </div>
      <div className='col-md-4'>
        <Nav.Knapp style={{display: 'flex', alignItems: 'center'}} onClick={this.addEmail.bind(this)} mini>
          <span className='mr-2' style={{fontSize: '1.5rem'}}>+</span>
          {t('ui:add')}
        </Nav.Knapp>
      </div>
    </Nav.Row>
  }
}

Email.propTypes = {
  email: PT.object,
  type: PT.string,
  t: PT.func
}

export default Email
