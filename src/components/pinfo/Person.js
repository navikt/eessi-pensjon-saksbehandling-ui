import React from 'react'
import PT from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withTranslation } from 'react-i18next'
import _ from 'lodash'

import * as Nav from '../ui/Nav'
import CountrySelect from '../ui/CountrySelect/CountrySelect'

import { personValidation } from './Validation/singleTests'
import * as pinfoActions from '../../actions/pinfo'

const mapStateToProps = (state) => {
  return {
    locale: state.ui.locale,
    person: state.pinfo.person,
    pageErrors: state.pinfo.pageErrors,
    errorTimestamp: state.pinfo.errorTimestamp
  }
}
const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, pinfoActions), dispatch) }
}

class Person extends React.Component {
  state = {
    localErrors: {},
    errorTimestamp: new Date().getTime()
  }

  static getDerivedStateFromProps (newProps, oldState) {
    if (newProps.errorTimestamp > oldState.errorTimestamp) {
      return {
        localErrors: newProps.pageErrors,
        errorTimestamp: newProps.errorTimestamp
      }
    }
    return null
  }

  constructor (props) {
    super(props)
    this.setNameAtBirth = this.eventSetProperty.bind(this, 'nameAtBirth', personValidation.nameAtBirth)
    this.setPreviousName = this.eventSetProperty.bind(this, 'previousName', personValidation.previousName)
    this.setCountry = this.valueSetProperty.bind(this, 'country', personValidation.country)
    this.setPlace = this.eventSetProperty.bind(this, 'place', personValidation.place)
    this.setRegion = this.eventSetProperty.bind(this, 'region', personValidation.region)
    this.setPhone = this.eventSetProperty.bind(this, 'phone', personValidation.phone)
    this.setEmail = this.eventSetProperty.bind(this, 'email', null)
    this.setEmailAndValidate = this.eventSetProperty.bind(this, 'email', personValidation.email)
  }

  checkboxSetProperty (key, validateFunction, event) {
    this.valueSetProperty(key, validateFunction, event.target.checked)
  }

  eventSetProperty (key, validateFunction, event) {
    this.valueSetProperty(key, validateFunction, event.target.value)
  }

  valueSetProperty (key, validateFunction, value) {
    const { actions } = this.props

    let _localErrors = _.cloneDeep(this.state.localErrors)

    actions.setPerson({ [key]: value })
    let error = validateFunction ? validateFunction(value) : undefined

    if (!error && _localErrors.hasOwnProperty(key)) {
      delete _localErrors[key]
    }
    if (error) {
      _localErrors[key] = error
    }

    this.setState({
      localErrors: _localErrors
    })
  }

  render () {
    const { t, person, locale, mode } = this.props
    const { localErrors } = this.state
    const mandatory = mode !== 'view' ? ' *' : ''

    return <div className='c-pinfo-person'>
      <Nav.Undertittel className='ml-0 mb-4 appDescription'>{t('pinfo:person-info-title')}</Nav.Undertittel>
      <Nav.Row>
        <div className='col-sm-9'>
          {mode === 'view' ? <div id='pinfo-person-etternavn-label'>
            <label className='skjemaelement__label'>{t('pinfo:person-info-lastNameAtBirth')}</label>
            <p>{person.nameAtBirth}</p>
          </div> : <Nav.Input
            id='pinfo-person-etternavn-input'
            type='text'
            label={t('pinfo:person-info-lastNameAtBirth') + mandatory}
            placeholder={t('ui:writeIn')}
            value={person.nameAtBirth || ''}
            onChange={this.setNameAtBirth}
            feil={localErrors.nameAtBirth ? { feilmelding: t(localErrors.nameAtBirth) } : null}
          />}
        </div>
      </Nav.Row>
      <Nav.Row>
        <div className='col-sm-9'>
          {mode === 'view' ? <div id='pinfo-person-tidligerenavn-label'>
            <label className='skjemaelement__label'>{t('pinfo:person-info-previousName')}</label>
            <p>{person.previousName}</p>
          </div> : <Nav.Input
            id='pinfo-person-tidligerenavn-input'
            type='text'
            label={t('pinfo:person-info-previousName')}
            placeholder={t('ui:writeIn')}
            value={person.previousName || ''}
            onChange={this.setPreviousName}
            feil={localErrors.previousName ? { feilmelding: t(localErrors.previousName) } : null}
          />}
        </div>
      </Nav.Row>
      {mode === 'view' && (person.fatherName || person.motherName)
        ? <React.Fragment>
          <Nav.Row>
            <div className='col-sm-9 mt-3'>
              <div className='float-right'>
                <Nav.HjelpetekstBase id='pinfo-stayAbroad-insurance-help'>
                  <span>{t('pinfo:stayAbroad-spain-france-warning-2')}</span>
                </Nav.HjelpetekstBase>
              </div>
              <div id='pinfo-opphold-farsnavn-label'>
                <label className='skjemaelement__label'>{t('pinfo:stayAbroad-period-fathername')}</label>
                <p>{person.fatherName}</p>
              </div>
            </div>
          </Nav.Row>
          <Nav.Row>
            <div className='col-sm-9 mt-3'>
              <div className='float-right'>
                <Nav.HjelpetekstBase id='pinfo-stayAbroad-insurance-help'>
                  <span>{t('pinfo:stayAbroad-spain-france-warning-2')}</span>
                </Nav.HjelpetekstBase>
              </div>
              <div id='pinfo-opphold-morsnavn-label'>
                <label className='skjemaelement__label'>{t('pinfo:stayAbroad-period-mothername')}</label>
                <p>{person.motherName}</p>
              </div>
            </div>
          </Nav.Row>
        </React.Fragment> : null}
      <Nav.Undertittel className='ml-0 mt-4 mb-4 appDescription'>{t('pinfo:person-birthplace-title')}</Nav.Undertittel>
      <Nav.Row>
        <div className='col-md-6 mb-4'>
          <label className='skjemaelement__label'>
            {t('pinfo:person-birthplace-country') + mandatory}
          </label>
          {mode === 'view' ? <div id='pinfo-person-land-label'>
            <img className='flagImg' src={'../../../../../flags/' + person.country.value + '.png'}
              alt={person.country.label} />
            {person.country.label}
          </div> : <CountrySelect
            id='pinfo-person-land-select'
            locale={locale}
            value={person.country || null}
            onSelect={this.setCountry}
            error={localErrors.country}
            errorMessage={t(localErrors.country)}
          />}
        </div>
      </Nav.Row>
      <Nav.Row>
        <div className='col-sm-9'>
          {mode === 'view' ? <div id='pinfo-person-sted-label'>
            <label className='skjemaelement__label'>{t('pinfo:person-birthplace-place')}</label>
            <p>{person.place}</p>
          </div> : <Nav.Input
            id='pinfo-person-sted-input'
            type='text'
            label={t('pinfo:person-birthplace-place') + mandatory}
            placeholder={t('ui:writeIn')}
            value={person.place || ''}
            onChange={this.setPlace}
            feil={localErrors.place ? { feilmelding: t(localErrors.place) } : null}
          />}
        </div>
      </Nav.Row>
      <Nav.Row>
        <div className='col-sm-9'>
          {mode === 'view' ? <div id='pinfo-person-region-label'>
            <label className='skjemaelement__label'>{t('pinfo:person-birthplace-area')}</label>
            <p>{person.region}</p>
          </div> : <Nav.Input
            id='pinfo-person-region-input'
            type='text'
            label={t('pinfo:person-birthplace-area')}
            placeholder={t('pinfo:person-birthplace-area-placeholder')}
            value={person.region || ''}
            onChange={this.setRegion}
            feil={localErrors.region ? { feilmelding: t(localErrors.region) } : null}
          />}
        </div>
      </Nav.Row>
      <Nav.Undertittel className='ml-0 mt-4 mb-4 appDescription'>{t('pinfo:person-contact-title')}</Nav.Undertittel>
      <Nav.Row>
        <div className='col-sm-4'>
          {mode === 'view' ? <div id='pinfo-person-telefonnummer-label'>
            <label className='skjemaelement__label'>{t('pinfo:person-contact-phoneNumber')}</label>
            <p>{person.phone}</p>
          </div> : <Nav.Input
            id='pinfo-person-telefonnummer-input'
            type='tel'
            label={t('pinfo:person-contact-phoneNumber')}
            placeholder={t('ui:writeIn')}
            value={person.phone || ''}
            onChange={this.setPhone}
            feil={localErrors.phone ? { feilmelding: t(localErrors.phone) } : null}
          />}
        </div>
      </Nav.Row>
      <Nav.Row>
        <div className='col-sm-6'>
          {mode === 'view' ? <div id='pinfo-person-epost-label'>
            <label className='skjemaelement__label'>{t('pinfo:person-contact-email')}</label>
            <p>{person.email}</p>
          </div> : <Nav.Input
            id='pinfo-person-epost-input'
            type='email'
            label={t('pinfo:person-contact-email')}
            placeholder={t('ui:writeIn')}
            value={person.email || ''}
            onChange={this.setEmail}
            onBlur={this.setEmailAndValidate}
            feil={localErrors.email ? { feilmelding: t(localErrors.email) } : null}
          />}
        </div>
      </Nav.Row>
      {mode === 'view' ? null : <Nav.Row>
        <div className='col-sm-6'>
          {'* ' + t('mandatoryField')}
        </div>
      </Nav.Row>}
    </div>
  }
}

Person.propTypes = {
  locale: PT.string,
  person: PT.object,
  pageErrors: PT.object,
  t: PT.func
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  withTranslation()(Person)
)
