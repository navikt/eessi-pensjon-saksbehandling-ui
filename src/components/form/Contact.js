import React from 'react'
import uuidv4 from 'uuid/v4'
import PT from 'prop-types'
import * as Nav from '../ui/Nav'
import { onChange, onInvalid } from './shared/eventFunctions'

const errorMessages = {
  userEmail: { patternMismatch: 'patternMismatch', valueMissing: 'valueMissing', typeMismatch: 'typeMismatch' },
  userPhone: { patternMismatch: 'patternMismatch', valueMissing: 'valueMissing' }
}

export class Contact extends React.Component {
  constructor (props) {
    super(props)

    this.onInvalid = onInvalid.bind(this, errorMessages)
    this.onChange = onChange.bind(this, errorMessages)

    let uuid = uuidv4()
    let nameToId = Object.keys(this.props.contact).reduce((acc, cur, i) => ({ ...acc, [cur]: uuid + '_' + i }), {})
    let idToName = Object.keys(this.props.contact).reduce((acc, cur) => ({ ...acc, [nameToId[cur]]: cur }), {})
    let inputStates = Object.keys(this.props.contact).reduce((acc, cur) => ({ ...acc,
      [cur]: {
        showError: false,
        error: null,
        errorType: null,
        action: this.props.action.bind(null, cur)
      } }), {})
    this.state = {
      ref: React.createRef(),
      idToName,
      nameToId,
      inputStates
    }
  }

  render () {
    const { t, contact } = this.props
    const nameToId = this.state.nameToId
    const inputStates = this.state.inputStates
    return (
      <div className='mt-3'>
        <Nav.Row>
          <div className='col-md-6'>
            <Nav.Input label={t('pinfo:form-userEmail') + ' *'} defaultValue={contact.userEmail || ''}
              onChange={this.onChange}
              required={!inputStates.userEmail.showError}
              type='email'
              onInvalid={this.onInvalid}
              id={nameToId.userEmail}
              feil={inputStates.userEmail.showError ? inputStates.userEmail.error : null}
            />

            <Nav.Input label={t('pinfo:form-userPhone') + ' *'} defaultValue={contact.userPhone || ''}
              onChange={this.onChange}
              required={!inputStates.userPhone.showError}
              type='tel'
              onInvalid={this.onInvalid}
              id={nameToId.userPhone}
              feil={inputStates.userPhone.showError ? inputStates.userPhone.error : null}
            />
          </div>
        </Nav.Row>
      </div>
    )
  }
}
Contact.propTypes = {
  contact: PT.object,
  action: PT.func,
  t: PT.func
}

export default Contact
