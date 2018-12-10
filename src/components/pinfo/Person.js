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
    const { actions, onPageError } = this.props
    actions.setPerson({ [key]: value })
    let error = validateFunction(value)
    this.setState({
      error: {
        ...this.state.error,
        [key]: error
      }
    })
    if (error) {
      onPageError(error)
    }
  }

  render () {
    const { pageError, t, phone, email, previousName, nameAtBirth } = this.props
    const { error } = this.state

    return <div>
      <Nav.Row>
        <Nav.Column xs='12'>
          <PsychoPanel id='pinfo-person-psycho-panel' className='mb-4'>
            <span>{t('pinfo:person-description')}</span>
          </PsychoPanel>
        </Nav.Column>
      </Nav.Row>
      <Nav.Undertittel className='ml-0 mb-4 appDescription'>{t('pinfo:person-title')}</Nav.Undertittel>
      <Nav.Row>
        <div className='col-sm-9'>
          <Nav.Input
            id='pinfo-person-lastname-input'
            type='text'
            label={t('pinfo:person-lastNameAfterBirth')}
            placeholder={t('ui:writeIn')}
            value={nameAtBirth || ''}
            onChange={this.setNameAtBirth}
            feil={error.nameAtBirth && pageError ? { feilmelding: t(error.nameAtBirth) } : null}
          />
        </div>
      </Nav.Row>
      <Nav.Row>
        <div className='col-sm-9'>
          <Nav.Input
            id='pinfo-person-name-input'
            type='text'
            label={t('pinfo:person-name')}
            placeholder={t('ui:writeIn')}
            value={previousName || ''}
            onChange={this.setPreviousName}
            feil={error.previousName && pageError ? { feilmelding: t(error.previousName) } : null}

          />
        </div>
      </Nav.Row>
      <Nav.Row>
        <div className='col-sm-4'>
          <Nav.Input
            id='pinfo-person-phonenumber-input'
            type='tel'
            label={t('pinfo:person-phoneNumber')}
            placeholder={t('ui:8numbers')}
            value={phone || ''}
            onChange={this.setPhone}
            feil={error.phone && pageError ? { feilmelding: t(error.phone) } : null}
          />
        </div>
      </Nav.Row>
      <Nav.Row>
        <div className='col-sm-6'>
          <Nav.Input
            id='pinfo-person-email-input'
            type='email'
            label={t('pinfo:person-email')}
            placeholder={t('ui:writeIn')}
            value={email || ''}
            onChange={this.setEmail}
            feil={error.email && pageError ? { feilmelding: t(error.email) } : null}
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
