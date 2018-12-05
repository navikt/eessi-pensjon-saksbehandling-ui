import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'

import { contactValidation } from '../Validation/singleTests'
import * as Nav from '../../ui/Nav'

class Phone extends React.Component {
  state = {
    error: undefined,
    phone: undefined
  }

  onPhoneChange (event) {
    let phone = event.target.value
    this.setState({
      error: undefined,
      phone: phone
    })
  }

  addPhone () {
    const { phones, setPhones } = this.props
    const { phone } = this.state

    let error = contactValidation.phoneNumber(phone)
    if (error) {
      return this.setState({
        error: error
      })
    }

    if (phones.indexOf(phone) < 0) {
      let newPhones = _.clone(phones)
      newPhones.push(phone)
      setPhones(newPhones)
      this.setState({
        error: undefined,
        phone: ''
      })
    }
  }

  removePhone (phone) {
    const { phones, setPhones } = this.props

    let index = phones.indexOf(phone)

    if (index >= 0) {
      let newPhones = _.clone(phones)
      newPhones.splice(index, 1)
      setPhones(newPhones)
    }
  }

  render () {
    const { value, t, required } = this.props
    const { phone, error } = this.state

    return value ? <Nav.Row style={{ alignItems: 'baseline', padding: '2px' }}>
      <div className='col-md-4'>
        {value}
      </div>
      <div className='col-md-4'>
        <Nav.Knapp style={{ display: 'flex', alignItems: 'center' }} onClick={this.removePhone.bind(this, value)} mini>
          <span className='mr-2' style={{ fontSize: '1.5rem' }}>×</span>
          {t('ui:remove')}
        </Nav.Knapp>
      </div>
    </Nav.Row>
      : <Nav.Row style={{ alignItems: 'baseline', padding: '2px' }}>
        <div className='col-md-4'>
          <Nav.Input
            required={required || false}
            label={''}
            value={phone || ''}
            onChange={this.onPhoneChange.bind(this)}
            type='tel'
            feil={error ? { feilmelding: t(error) } : null}
          />
        </div>
        <div className='col-md-4'>
          <Nav.Knapp style={{ display: 'flex', alignItems: 'center' }} onClick={this.addPhone.bind(this)} mini>
            <span className='mr-2' style={{ fontSize: '1.5rem' }}>+</span>
            {t('ui:add')}
          </Nav.Knapp>
        </div>
      </Nav.Row>
  }
}

Phone.propTypes = {
  phone: PT.object,
  phones: PT.array,
  setPhones: PT.func.isRequired,
  t: PT.func
}

export default Phone
