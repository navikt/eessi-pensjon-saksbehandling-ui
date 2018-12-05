import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'

import { personValidation } from '../Validation/singleTests'
import * as Nav from '../../ui/Nav'

class Name extends React.Component {
  state = {
    error: undefined,
    name: undefined
  }

  onNameChange (event) {
    let name = event.target.value
    this.setState({
      error: undefined,
      name: name
    })
  }

  addName () {
    const { names, setNames } = this.props
    const { name } = this.state

    let error = personValidation.personName(name)
    if (error) {
      return this.setState({
        error: error
      })
    }

    if (names.indexOf(name) < 0) {
      let newNames = _.clone(names)
      newNames.push(name)
      setNames(newNames)
      this.setState({
        error: undefined,
        name: ''
      })
    }
  }

  removeName (name) {
    const { names, setNames } = this.props

    let index = names.indexOf(name)

    if (index >= 0) {
      let newNames = _.clone(names)
      newNames.splice(index, 1)
      setNames(newNames)
    }
  }

  render () {
    const { value, t, required } = this.props
    const { name, error } = this.state

    return value ? <Nav.Row style={{ alignItems: 'baseline', padding: '2px' }}>
      <div className='col-md-4'>
        {value}
      </div>
      <div className='col-md-4'>
        <Nav.Knapp style={{ display: 'flex', alignItems: 'center' }} onClick={this.removeName.bind(this, value)} mini>
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
            value={name || ''}
            onChange={this.onNameChange.bind(this)}
            type='tel'
            feil={error ? { feilmelding: t(error) } : null}
          />
        </div>
        <div className='col-md-4'>
          <Nav.Knapp style={{ display: 'flex', alignItems: 'center' }} onClick={this.addName.bind(this)} mini>
            <span className='mr-2' style={{ fontSize: '1.5rem' }}>+</span>
            {t('ui:add')}
          </Nav.Knapp>
        </div>
      </Nav.Row>
  }
}

Name.propTypes = {
  name: PT.object,
  names: PT.array,
  setNames: PT.func.isRequired,
  t: PT.func
}

export default Name
