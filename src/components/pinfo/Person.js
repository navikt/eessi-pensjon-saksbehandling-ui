import React from 'react'
import PT from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withNamespaces } from 'react-i18next'

import * as Nav from '../ui/Nav'
import PsychoPanel from '../ui/Psycho/PsychoPanel'
import { personValidation } from './Validation/singleTests'

import * as pinfoActions from '../../actions/pinfo'

const mapStateToProps = (state) => {
  return {
    locale: state.ui.locale,
    phone: state.pinfo.person.phone,
    email: state.pinfo.person.email,
    previousName: state.pinfo.person.previousName,
    nameAtBirth: state.pinfo.person.nameAtBirth
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
    this.setNameAtBirth = this.eventSetProperty.bind(this, 'nameAtBirth', personValidation.nameAtBirth)
    this.setPreviousName = this.eventSetProperty.bind(this, 'previousName', personValidation.previousName)
    this.setPhone = this.eventSetProperty.bind(this, 'phone', personValidation.phone)
    this.setEmail = this.eventSetProperty.bind(this, 'email', personValidation.email)
  }

  eventSetProperty (key, validateFunction, event) {
    this.valueSetProperty(key, validateFunction, event.target.value)
  }

  valueSetProperty (key, validateFunction, value) {
    const { actions } = this.props
    actions.setPerson({ [key]: value })
    this.setState({
      error: {
        ...this.state.error,
        [key]: validateFunction(value)
      }
    })
  }

  render () {
    const { pageError, t, phone, email, previousName, nameAtBirth, actions } = this.props
    const { error } = this.state

    return <div>
      <Nav.Row>
        <Nav.Column xs='12'>
          <PsychoPanel className='mb-4'>
            <p>Bork bork bork bork!</p>
          </PsychoPanel>
        </Nav.Column>
      </Nav.Row>
      <h2 className='typo-undertittel ml-0 mb-4 appDescription'>{t('pinfo:person-title')}</h2>
      <Nav.Row className='mt-3' style={{ alignItems: 'baseline', padding: '2px' }}>
        <div className='col-sm-9'>
          <Nav.Input
            label={t('pinfo:person-lastNameAfterBirth')}
            value={nameAtBirth || ''}
            onChange={this.setNameAtBirth}
            feil={error.nameAtBirth && pageError ? { feilmelding: t(error.nameAtBirth) } : null}
            type='text'
          />
        </div>
      </Nav.Row>
      <Nav.Row style={{ alignItems: 'baseline', padding: '2px' }}>
        <div className='col-sm-9'>
          <Nav.Input
            label={t('pinfo:person-name')}
            value={previousName || ''}
            onChange={this.setPreviousName}
            feil={error.previousName && pageError ? { feilmelding: t(error.previousName) } : null}
            type='text'
          />
        </div>
      </Nav.Row>
      <Nav.Row style={{ alignItems: 'baseline', padding: '2px' }}>
        <div className='col-sm-4'>
          <Nav.Input
            label={t('pinfo:person-phoneNumber')}
            value={phone || ''}
            onChange={this.setPhone}
            feil={error.phone && pageError ? { feilmelding: t(error.phone) } : null}
            type='tel'
          />
        </div>
      </Nav.Row>
      <Nav.Row style={{ alignItems: 'baseline', padding: '2px' }}>
        <div className='col-sm-6'>
          <Nav.Input
            label={t('pinfo:person-email')}
            value={email || ''}
            onChange={this.setEmail}
            feil={error.email && pageError ? { feilmelding: t(error.email) } : null}
            type='email'
          />
        </div>
      </Nav.Row>
    </div>
  }
}

Person.propTypes = {
  locale: PT.string,
  phone: PT.string,
  email: PT.string,
  previousName: PT.string,
  nameAtBirth: PT.string,
  t: PT.func
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  withNamespaces()(Person)
)
