import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'

import * as Nav from '../../ui/Nav'

class Phone extends React.Component {

  state = {
    numberError: undefined,
    phone: undefined,
    email : undefined
  }

  onPhoneChange (event) {

    let phone = event.target.value

    this.setState({
      phone : phone
    })
  }

  addPhone () {

    const { t, phones, actions, testPhoneNumber } = this.props
    const { phone } = this.state

    let numberError = testPhoneNumber(phone, t)
    if (numberError) {
        this.setState({
            numberError : numberError
        })
    } else {
      if (phones.indexOf(phone) < 0) {
        let newPhones = _.clone(phones)
        newPhones.push(phone)
        actions.setPhones(newPhones)
        this.setState({
                      phone: ''
                  })
      }
    }
  }

 removePhone (phone) {

   const { phones, actions } = this.props

   let index = phones.indexOf(phone)

   if (index >= 0) {
     let newPhones = _.clone(phones)
     newPhones.splice(index, 1)
     actions.setPhones(newPhones)
   }
 }

  render () {
    const { value, t, displayErrorSwitch, required, displayError } = this.props
    const { phone, numberError } = this.state

    return value ? <Nav.Row style={{alignItems: 'baseline', padding: '2px'}}>
      <div className='col-md-4'>
        {value}
      </div>
      <div className='col-md-4'>
        <Nav.Knapp style={{display: 'flex', alignItems: 'center'}} onClick={this.removePhone.bind(this, value)} mini>
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
          value={phone || ''}
          onChange={this.onPhoneChange.bind(this)}
          type='tel'
          feil={displayError && numberError ? { feilmelding: numberError } : null}
        />
      </div>
      <div className='col-md-4'>
        <Nav.Knapp style={{display: 'flex', alignItems: 'center'}} onClick={this.addPhone.bind(this)} mini>
          <span className='mr-2' style={{fontSize: '1.5rem'}}>+</span>
          {t('ui:add')}
        </Nav.Knapp>
      </div>
    </Nav.Row>
  }
}

Phone.propTypes = {
  phone: PT.object,
  type: PT.string,
  t: PT.func
}

export default Phone
