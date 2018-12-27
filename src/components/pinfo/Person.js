import React from 'react'
import PT from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withNamespaces } from 'react-i18next'
import _ from 'lodash'

import * as Nav from '../ui/Nav'
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
    this.setPreviousName = this.eventSetProperty.bind(this, 'previousName', null)
    this.setCountry = this.valueSetProperty.bind(this, 'country', personValidation.country)
    this.setCity = this.eventSetProperty.bind(this, 'city', personValidation.city)
    this.setRegion = this.eventSetProperty.bind(this, 'region', personValidation.region)
    this.setPhone = this.eventSetProperty.bind(this, 'phone', personValidation.phone)
    this.setEmail = this.eventSetProperty.bind(this, 'email', null)
    this.setEmailAndValidate = this.eventSetProperty.bind(this, 'email', personValidation.email)
    this.setMotherName = this.eventSetProperty.bind(this, 'motherName', personValidation.motherName)
    this.setFatherName = this.eventSetProperty.bind(this, 'fatherName', personValidation.fatherName)
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

    return <div>
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
            feil={localErrors.nameAtBirth ? { feilmelding: t(localErrors.nameAtBirth) } : null}
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
            feil={localErrors.previousName ? { feilmelding: t(localErrors.previousName) } : null}
          />
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
              <Nav.Input
                id='pinfo-opphold-farsnavn-input'
                type='text'
                label={t('pinfo:stayAbroad-period-fathername')}
                placeholder={t('ui:writeIn')}
                value={person.fatherName || ''}
                onChange={this.setFatherName}
                feil={localErrors.fatherName ? { feilmelding: t(localErrors.fatherName) } : null}
              />
            </div>
          </Nav.Row>
          <Nav.Row>
            <div className='col-sm-9 mt-3'>
              <div className='float-right'>
                <Nav.HjelpetekstBase id='pinfo-stayAbroad-insurance-help'>
                  <span>{t('pinfo:stayAbroad-spain-france-warning-2')}</span>
                </Nav.HjelpetekstBase>
              </div>
              <Nav.Input
                id='pinfo-opphold-morsnavn-input'
                type='text'
                label={t('pinfo:stayAbroad-period-mothername')}
                placeholder={t('ui:writeIn')}
                value={person.motherName || ''}
                onChange={this.setMotherName}
                feil={localErrors.motherName ? { feilmelding: t(localErrors.motherName) } : null}
              />
            </div>
          </Nav.Row>
        </React.Fragment>
        : null
      }

      <Nav.Undertittel className='ml-0 mb-4 appDescription'>{t('pinfo:person-birthplace-title')}</Nav.Undertittel>
      <Nav.Row>
        <div className='col-md-6 mb-4'>
          <label className='skjemaelement__label'>{t('pinfo:person-birthplace-country')}</label>
          <CountrySelect
            id='pinfo-person-land-select'
            locale={locale}
            value={person.country || null}
            onSelect={this.setCountry}
            error={localErrors.country}
            errorMessage={t(localErrors.country)}
          />
        </div>
      </Nav.Row>
      <Nav.Row>
        <div className='col-sm-9'>
          <Nav.Input
            id='pinfo-person-by-input'
            type='text'
            label={t('pinfo:person-birthplace-place')}
            placeholder={t('ui:writeIn')}
            value={person.city || ''}
            onChange={this.setCity}
            feil={localErrors.city ? { feilmelding: t(localErrors.city) } : null}
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
            feil={localErrors.region ? { feilmelding: t(localErrors.region) } : null}
          />
        </div>
      </Nav.Row>
      <Nav.Undertittel className='ml-0 mb-4 appDescription'>{t('pinfo:person-contact-title')}</Nav.Undertittel>
      <Nav.Row>
        <div className='col-sm-4'>
          <Nav.Input
            id='pinfo-person-telefonnummer-input'
            type='tel'
            label={t('pinfo:person-contact-phoneNumber')}
            placeholder={t('ui:writeIn')}
            value={person.phone || ''}
            onChange={this.setPhone}
            feil={localErrors.phone ? { feilmelding: t(localErrors.phone) } : null}
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
            onBlur={this.setEmailAndValidate}
            feil={localErrors.email ? { feilmelding: t(localErrors.email) } : null}
          />
        </div>
      </Nav.Row>
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
  withNamespaces()(Person)
)
