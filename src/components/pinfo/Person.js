import React from 'react'
import PT from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withNamespaces } from 'react-i18next'

import * as Nav from '../ui/Nav'
import PsychoPanel from '../ui/Psycho/PsychoPanel'
import CountrySelect from '../ui/CountrySelect/CountrySelect'

import { personValidation } from './Validation/singleTests'
import * as pinfoActions from '../../actions/pinfo'

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
    this.setNameAtBirth = this.eventSetProperty.bind(this, 'nameAtBirth', personValidation.nameAtBirth)
    this.setPreviousName = this.eventSetProperty.bind(this, 'previousName', personValidation.previousName)
    this.setFatherName = this.eventSetProperty.bind(this, 'fatherName', personValidation.fatherName)
    this.setMotherName = this.eventSetProperty.bind(this, 'motherName', personValidation.motherName)
    this.setIdAbroad = this.checkboxSetProperty.bind(this, 'idAbroad', null)
    this.setId = this.eventSetProperty.bind(this, 'id', personValidation.id)
    this.setCountry = this.valueSetProperty.bind(this, 'country', personValidation.country)
    this.setCity = this.eventSetProperty.bind(this, 'city', personValidation.city)
    this.setRegion = this.eventSetProperty.bind(this, 'region', personValidation.region)
    this.setPhone = this.eventSetProperty.bind(this, 'phone', personValidation.phone)
    this.setEmail = this.eventSetProperty.bind(this, 'email', personValidation.email)
  }

  checkboxSetProperty (key, validateFunction, event) {
    this.valueSetProperty(key, validateFunction, event.target.checked)
  }

  eventSetProperty (key, validateFunction, event) {
    this.valueSetProperty(key, validateFunction, event.target.value)
  }

  valueSetProperty (key, validateFunction, value) {
    const { actions, onPageError } = this.props
    actions.setPerson({ [key]: value })
    let error = validateFunction ? validateFunction(value) : ''
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
    const { pageError, t, person, locale } = this.props
    const { error } = this.state

    return <div>
      <Nav.Row>
        <Nav.Column xs='12'>
          <PsychoPanel id='pinfo-person-psycho-panel' className='mb-4' closeButton>
            <span>{t('pinfo:psycho-description')}</span>
          </PsychoPanel>
        </Nav.Column>
      </Nav.Row>
      <Nav.Undertittel className='ml-0 mb-4 appDescription'>{t('pinfo:person-info-title')}</Nav.Undertittel>
      <Nav.Row>
        <div className='col-sm-9'>
          <Nav.Input
            id='pinfo-person-etternavn-input'
            type='text'
            label={t('pinfo:person-info-lastNameAtBirth')}
            placeholder={t('ui:writeIn')}
            value={person.nameAtBirth || ''}
            onChange={this.setNameAtBirth}
            feil={error.nameAtBirth && pageError ? { feilmelding: t(error.nameAtBirth) } : null}
          />
        </div>
      </Nav.Row>
      <Nav.Row>
        <div className='col-sm-9'>
          <Nav.Input
            id='pinfo-person-tidligerenavn-input'
            type='text'
            label={t('pinfo:person-info-previousName')}
            placeholder={t('ui:writeIn')}
            value={person.previousName || ''}
            onChange={this.setPreviousName}
            feil={error.previousName && pageError ? { feilmelding: t(error.previousName) } : null}
          />
        </div>
      </Nav.Row>
      <Nav.Checkbox
        id='pinfo-person-utenlandskpersonnummer-checkbox'
        label={t('pinfo:person-info-idAbroad')}
        checked={person.idAbroad}
        name='setIdAbroad'
        onChange={this.setIdAbroad} />
      {person.idAbroad ? <React.Fragment>
        <Nav.Row>
          <div className='col-md-12'>
            <Nav.Input
              id='pinfo-person-utenlandskpersonnummer-input'
              type='text'
              label=''
              placeholder={t('ui:writeIn')}
              value={person.id || ''}
              onChange={this.setId}
              feil={error.id && pageError ? { feilmelding: t(error.id) } : null}
            />
          </div>
        </Nav.Row>
      </React.Fragment>
      : <React.Fragment>
      <Nav.Row>
        <div className='col-sm-9'>
          <Nav.Input
            id='pinfo-person-farsnavn-input'
            type='text'
            label={t('pinfo:person-info-fathername')}
            placeholder={t('ui:writeIn')}
            value={person.fatherName || ''}
            onChange={this.setFatherName}
            feil={error.fatherName && pageError ? { feilmelding: t(error.fatherName) } : null}
          />
        </div>
      </Nav.Row>
      <Nav.Row>
        <div className='col-sm-9'>
          <Nav.Input
            id='pinfo-person-morsnavn-input'
            type='text'
            label={t('pinfo:person-info-mothername')}
            placeholder={t('ui:writeIn')}
            value={person.motherName || ''}
            onChange={this.setMotherName}
            feil={error.motherName && pageError ? { feilmelding: t(error.motherName) } : null}
          />
        </div>
      </Nav.Row>
      <Nav.Undertittel className='ml-0 mb-4 appDescription'>{t('pinfo:person-birthplace-title')}</Nav.Undertittel>
      <Nav.Row>
        <div className='col-md-6 mb-4'>
          <label className='skjemaelement__label'>{t('pinfo:person-birthplace-country')}</label>
          <CountrySelect
            id='pinfo-person-land-select'
            locale={locale}
            value={person.country || null}
            onSelect={this.setCountry}
            error={error.country && pageError}
            errorMessage={error.country}
          />
        </div>
      </Nav.Row>
      <Nav.Row>
        <div className='col-sm-9'>
          <Nav.Input
            id='pinfo-person-by-input'
            type='text'
            label={t('pinfo:person-birthplace-city')}
            placeholder={t('ui:writeIn')}
            value={person.city || ''}
            onChange={this.setCity}
            feil={error.city && pageError ? { feilmelding: t(error.city) } : null}

          />
        </div>
      </Nav.Row>
      <Nav.Row>
        <div className='col-sm-9'>
          <Nav.Input
            id='pinfo-person-region-input'
            type='text'
            label={t('pinfo:person-birthplace-area')}
            placeholder={t('pinfo:person-birthplace-area-placeholder')}
            value={person.region || ''}
            onChange={this.setRegion}
            feil={error.region && pageError ? { feilmelding: t(error.region) } : null}
          />
        </div>
      </Nav.Row>
      </React.Fragment>}
      <Nav.Undertittel className='ml-0 mb-4 appDescription'>{t('pinfo:person-contact-title')}</Nav.Undertittel>
      <Nav.Row>
        <div className='col-sm-4'>
          <Nav.Input
            id='pinfo-person-telefonnummer-input'
            type='tel'
            label={t('pinfo:person-contact-phoneNumber')}
            placeholder={t('ui:8numbers')}
            value={person.phone || ''}
            onChange={this.setPhone}
            feil={error.phone && pageError ? { feilmelding: t(error.phone) } : null}
          />
        </div>
      </Nav.Row>
      <Nav.Row>
        <div className='col-sm-6'>
          <Nav.Input
            id='pinfo-person-epost-input'
            type='email'
            label={t('pinfo:person-contact-email')}
            placeholder={t('ui:writeIn')}
            value={person.email || ''}
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
