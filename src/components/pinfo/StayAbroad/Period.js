import React from 'react'
import PT from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import _ from 'lodash'
import moment from 'moment'
import classNames from 'classnames'

import DatePicker from '../../ui/DatePicker/DatePicker'
import CountrySelect from '../../ui/CountrySelect/CountrySelect'
import * as CountryFilter from '../../ui/CountrySelect/CountryFilter'
import FileUpload from '../../ui/FileUpload/FileUpload'
import { periodValidation, personValidation } from '../Validation/singleTests'
import * as stepTests from '../Validation/stepTests'
import * as Nav from '../../ui/Nav'
import Icons from '../../ui/Icons'

import * as constants from '../../../constants/constants'
import * as uiActions from '../../../actions/ui'
import * as pinfoActions from '../../../actions/pinfo'
import * as storageActions from '../../../actions/storage'

import './Period.css'

const mapStateToProps = (state) => {
  return {
    pinfo: state.pinfo,
    person: state.pinfo.person,
    username: state.app.username
  }
}
const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, storageActions, pinfoActions, uiActions), dispatch) }
}

class Period extends React.Component {
  state = {
    localErrors: {},
    errorTimestamp: new Date().getTime(),
    _period: {}
  }

  constructor (props) {
    super(props)
    this.setType = this.eventSetProperty.bind(this, 'type', periodValidation.periodType)
    this.setStartDate = this.dateSetProperty.bind(this, 'startDate', periodValidation.startDate)
    this.setEndDate = this.dateSetProperty.bind(this, 'endDate', periodValidation.endDate)
    this.setCountry = this.valueSetProperty.bind(this, 'country', periodValidation.country)
    this.setInsuranceName = this.eventSetProperty.bind(this, 'insuranceName', periodValidation.insuranceName)
    this.setInsuranceType = this.eventSetProperty.bind(this, 'insuranceType', periodValidation.insuranceType)
    this.setInsuranceId = this.eventSetProperty.bind(this, 'insuranceId', null)
    this.setAddress = this.eventSetProperty.bind(this, 'address', periodValidation.address)
    this.setCity = this.eventSetProperty.bind(this, 'city', periodValidation.city)
    this.setRegion = this.eventSetProperty.bind(this, 'region', periodValidation.region)
    this.setWorkActivity = this.eventSetProperty.bind(this, 'workActivity', periodValidation.workActivity)
    this.setWorkName = this.eventSetProperty.bind(this, 'workName', periodValidation.workName)
    this.setWorkAddress = this.eventSetProperty.bind(this, 'workAddress', periodValidation.workAddress)
    this.setWorkCity = this.eventSetProperty.bind(this, 'workCity', periodValidation.workCity)
    this.setWorkRegion = this.eventSetProperty.bind(this, 'workRegion', periodValidation.workRegion)
    this.setChildFirstName = this.eventSetProperty.bind(this, 'childFirstName', periodValidation.childFirstName)
    this.setChildLastName = this.eventSetProperty.bind(this, 'childLastName', periodValidation.childLastName)
    this.setChildBirthDate = this.dateSetProperty.bind(this, 'childBirthDate', periodValidation.childBirthDate)
    this.setLearnInstitution = this.eventSetProperty.bind(this, 'learnInstitution', periodValidation.learnInstitution)
    this.setAttachments = this.valueSetProperty.bind(this, 'attachments', null)
    this.setFatherName = this.eventSetPerson.bind(this, 'fatherName', personValidation.fatherName)
    this.setMotherName = this.eventSetPerson.bind(this, 'motherName', personValidation.motherName)
  }

  hasSpecialCases (periods) {
    if (!periods || _.isEmpty(periods)) {
      return false
    }
    return periods.some(period => {
      return this.isASpecialCase(period)
    })
  }

  isASpecialCase (period) {
    return period.country && (period.country.value === 'ES' || period.country.value === 'FR')
  }

  eventSetPerson (key, validateFunction, e) {
    let _localErrors = _.cloneDeep(this.state.localErrors)
    let value = e.target.value
    let error = validateFunction ? validateFunction(value) : undefined
    if (!error && _localErrors.hasOwnProperty(key)) {
      delete _localErrors[key]
    }
    if (error) {
      _localErrors[key] = error
    }
    this.props.actions.setPerson({ [key]: value })
    this.setState({
      localErrors: _localErrors
    })
  }

  eventSetProperty (key, validateFunction, event) {
    this.valueSetProperty(key, validateFunction, event.target.value)
  }

  dateSetProperty (key, validateFunction, date) {
    this.valueSetProperty(key, validateFunction, date ? date.valueOf() : null)
  }

  valueSetProperty (key, validateFunction, value) {
    const { actions } = this.props

    let _localErrors = _.cloneDeep(this.state.localErrors)

    let error = validateFunction ? validateFunction(value) : undefined

    if (!error && _localErrors.hasOwnProperty(key)) {
      delete _localErrors[key]
    }
    if (error) {
      _localErrors[key] = error
    }

    if (key === 'type' && value) {
      actions.setMainButtonsVisibility(false)
    }
    this.setState({
      _period: {
        ...this.state._period,
        [key]: value
      },
      localErrors: _localErrors
    })
  }

  static getDerivedStateFromProps (newProps, oldState) {
    if (newProps.mode === 'edit' &&
      (_.isEmpty(oldState._period) || oldState._period.id !== newProps.period.id)) {
      return {
        _period: newProps.period
      }
    }
    return null
  }

  validatePeriod () {
    const { pinfo } = this.props
    const { _period } = this.state

    return stepTests.periodStep(_period, pinfo.person)
  }

  addPeriod () {
    const { periods, actions, pinfo, username } = this.props
    const { _period } = this.state

    let errors = this.validatePeriod()
    this.setState({
      localErrors: errors,
      errorTimestamp: new Date().getTime()
    })

    if (_.isEmpty(errors)) {
      let newPeriods = _.clone(periods)
      let newPeriod = _.clone(_period)
      newPeriod.id = new Date().getTime()
      newPeriods.push(newPeriod)
      actions.setStayAbroad(newPeriods)
      this.setState({
        _period: {}
      })
      let _pinfo = _.cloneDeep(pinfo)
      _pinfo.stayAbroad = newPeriods

      actions.setMainButtonsVisibility(true)
      actions.postStorageFile(username, constants.PINFO, constants.PINFO_FILE, JSON.stringify(_pinfo), { successAlert: false })
    }
  }

  requestEditPeriod (period) {
    const { editPeriod, actions } = this.props
    editPeriod(period)
    actions.setMainButtonsVisibility(false)
  }

  saveEditPeriod () {
    const { periods, editPeriod, actions, pinfo, username } = this.props
    const { _period } = this.state

    let errors = this.validatePeriod()
    this.setState({
      localErrors: errors,
      errorTimestamp: new Date().getTime()
    })

    if (_.isEmpty(errors)) {
      let newPeriods = _.clone(periods)
      let newPeriod = _.clone(_period)

      newPeriod.id = new Date().getTime()

      let index = _.findIndex(periods, { id: _period.id })

      if (index >= 0) {
        newPeriods.splice(index, 1)
        newPeriods.push(newPeriod)
        if (!this.hasSpecialCases(newPeriods)) {
          actions.setPerson({
            fatherName: '',
            motherName: ''
          })
        }
        actions.setStayAbroad(newPeriods)
        this.setState({
          _period: {}
        })
        editPeriod({})
        actions.setMainButtonsVisibility(true)
        let _pinfo = _.cloneDeep(pinfo)
        _pinfo.stayAbroad = newPeriods
        actions.postStorageFile(username, constants.PINFO, constants.PINFO_FILE, JSON.stringify(_pinfo), { successAlert: false })
      }
    }
  }

  cancelPeriod () {
    const { periods, editPeriod, actions } = this.props

    this.setState({
      localErrors: {},
      _period: {},
      errorTimestamp: new Date().getTime()
    })
    editPeriod({})
    if (!this.hasSpecialCases(periods)) {
      actions.setPerson({
        fatherName: '',
        motherName: ''
      })
    }
    actions.setMainButtonsVisibility(true)
  }

  closeModal () {
    const { actions } = this.props
    actions.closeModal()
  }

  removePeriodRequest (period) {
    const { t, actions } = this.props

    actions.openModal({
      modalTitle: t('pinfo:alert-deletePeriod'),
      modalText: t('pinfo:alert-areYouSureDeletePeriod'),
      modalButtons: [{
        main: true,
        text: t('ui:yes') + ', ' + t('ui:delete').toLowerCase(),
        onClick: this.doRemovePeriod.bind(this, period)
      }, {
        text: t('ui:no') + ', ' + t('ui:cancel').toLowerCase(),
        onClick: this.closeModal.bind(this)
      }]
    })
  }

  doRemovePeriod (period) {
    const { periods, actions, pinfo, username } = this.props

    let index = _.findIndex(periods, { id: period.id })

    if (index >= 0) {
      let newPeriods = _.clone(periods)
      newPeriods.splice(index, 1)
      if (!this.hasSpecialCases(newPeriods)) {
        actions.setPerson({
          fatherName: '',
          motherName: ''
        })
      }
      actions.setStayAbroad(newPeriods)
      let _pinfo = _.cloneDeep(pinfo)
      _pinfo.stayAbroad = newPeriods
      actions.postStorageFile(username, constants.PINFO, constants.PINFO_FILE, JSON.stringify(_pinfo), { successAlert: false })
    }
    actions.closeModal()
  }

  errorMessage () {
    const { localErrors } = this.state
    let errorValues = _.values(localErrors)
    return !_.isEmpty(errorValues) ? errorValues[0] : undefined
  }

  render () {
    const { t, mode, period, locale, current, first, last, person, showButtons } = this.props
    const { localErrors, _period } = this.state

    let errorMessage = this.errorMessage()

    switch (mode) {
      case 'view':
        return <Nav.Row className={classNames('c-pinfo-stayabroad-period', mode)}>
          <div className={classNames('col-md-8', { 'current': current })}>
            <div id={period.id} className='existingPeriod'>
              <div className='icon mr-4'>
                <div className={classNames('topHalf', { line: !first })} />
                <div className={classNames('bottomHalf', { line: !last })} />
                <Icons className='iconsvg' kind={'nav-' + period.type} />
              </div>
              <div className='pt-2 pb-2 existingPeriodDescription'>
                <span className='bold existingPeriodType'>{t('pinfo:stayAbroad-category-' + period.type)}</span>
                <span>
                  <img src={'../../../../../flags/' + period.country.value + '.png'}
                    style={{ width: 20, height: 15, marginLeft: '0.7rem' }}
                    alt={period.country.label} />
                </span>
                <br />
                <span className='existingPeriodDates'>
                  <span className='bold'>{t('pinfo:stayAbroad-period')}</span>{': '}
                  {moment(period.startDate).format('DD.MM.YYYY')}{' - '}
                  {period.endDate ? moment(period.endDate).format('DD.MM.YYYY') : t('ui:unknown')}
                </span>
                <br />
                {period.type === 'work' ? <React.Fragment>
                  <span className='bold'>{t('pinfo:stayAbroad-work-name')}</span>{': '}
                  {period.workName}
                  <br />
                </React.Fragment> : null }
                {period.type === 'home' || period.type === 'military' ? <React.Fragment>
                  <span className='bold'>{t('pinfo:stayAbroad-address')}</span>{': '}
                  {period.address}
                  <br />
                </React.Fragment> : null }
                {period.type === 'learn' ? <React.Fragment>
                  <span className='bold'>{t('pinfo:stayAbroad-learn-institution')}</span>{': '}
                  {period.learnInstitution}
                  <br />
                </React.Fragment> : null }
                {period.attachments && !_.isEmpty(period.attachments) ? <span className='existingPeriodAttachments'>
                  <span className='bold'>{t('pinfo:stayAbroad-attachments')}</span>{': '}
                  {period.attachments.map(att => { return att.name }).join(', ')}
                </span> : null}
              </div>
            </div>
          </div>
          {showButtons !== false ? <div className='col-md-4 existingPeriodButtons'>
            <Nav.Knapp className='mr-3 existingPeriodButton' onClick={this.requestEditPeriod.bind(this, period)}>
              {t('ui:change')}
            </Nav.Knapp>
            <Nav.Knapp className='existingPeriodButton' onClick={this.removePeriodRequest.bind(this, period)}>
              <span className='mr-2' style={{ fontSize: '1.5rem' }}>×</span>
              {t('ui:remove')}
            </Nav.Knapp>
          </div> : null }
        </Nav.Row>

      case 'detail':
        return <Nav.Row className={classNames('c-pinfo-stayabroad-period', mode, { 'current': current })}>
          <div className='col-md-12'>
            <div id={period.id} className='existingPeriod'>
              <div className='icon mr-4'>
                <div className={classNames('topHalf', { line: !first })} />
                <div className={classNames('bottomHalf', { line: !last })} />
                <Icons className='iconsvg' kind={'nav-' + period.type} />
              </div>
              <div className='pt-2 pb-2 existingPeriodDescription'>
                <span className='bold existingPeriodType'>{t('pinfo:stayAbroad-category-' + period.type)}</span>
                <br />
                <span className='existingPeriodDates'>
                  <span className='bold'>{t('pinfo:stayAbroad-period')}</span>{': '}
                  {moment(period.startDate).format('DD.MM.YYYY')}{' - '}
                  {period.endDate ? moment(period.endDate).format('DD.MM.YYYY') : t('ui:unknown')}
                </span>
                <br />

                <span>
                  <span className='bold'>{t('pinfo:stayAbroad-country')}</span>{': '}
                  <img src={'../../../../../flags/' + period.country.value + '.png'}
                    style={{ width: 30, height: 20, marginRight: '1rem' }}
                    alt={period.country.label} />
                  {period.country.label}
                </span>
                <br />

                <span>
                  <span className='bold'>{t('pinfo:stayAbroad-insurance-title')}</span>{': '}
                  {period.insuranceId}{' - '}{period.insuranceName}{' - '}{period.insuranceType}
                </span>
                <br />

                <span>
                  <span className='bold'>{t('pinfo:stayAbroad-home-title')}</span>{': '}
                  {period.address}<br />
                  {period.city}{' - '}{period.region}
                </span>
                <br />

                {period.type === 'work' ? <React.Fragment>
                  <span className='bold'>{t('pinfo:stayAbroad-work-activity')}</span>{': '}
                  {period.workActivity}
                  <br />
                  <span className='bold'>{t('pinfo:stayAbroad-work-name')}</span>{': '}
                  {period.workName}
                  <br />
                  <span className='bold'>{t('pinfo:stayAbroad-work-address')}</span>{': '}
                  {period.workAddress}{' - '}{period.workCity}{' - '}{period.workRegion}
                  <br />
                </React.Fragment> : null }

                {period.type === 'learn' ? <React.Fragment>
                  <span className='bold'>{t('pinfo:stayAbroad-learn-institution')}</span>{': '}
                  {period.learnInstitution}
                  <br />
                </React.Fragment> : null }
                {period.attachments && !_.isEmpty(period.attachments) ? <span className='existingPeriodAttachments'>
                  <span className='bold'>{t('pinfo:stayAbroad-attachments')}</span>{': '}
                  {period.attachments.map(att => { return att.name }).join(', ')}
                </span> : null}
              </div>
            </div>
          </div>
        </Nav.Row>

      case 'edit':
      case 'new':
        return <React.Fragment>
          {errorMessage ? <Nav.AlertStripe className='mt-3 mb-3' type='advarsel'>{t(errorMessage)}</Nav.AlertStripe> : null}
          <Nav.Row className={classNames('c-pinfo-opphold-period', 'mt-4', mode)}>
            <div className='col-md-6'>
              <Nav.Select
                id='pinfo-opphold-kategori-select'
                label={t('pinfo:stayAbroad-category')}
                value={_period.type || ''}
                onChange={this.setType}>
                <option value=''>{t('ui:choose')}</option>
                <option value='work'>{t('pinfo:stayAbroad-category-work')}</option>
                <option value='home'>{t('pinfo:stayAbroad-category-home')}</option>
                {/* <option value='child'>{t('pinfo:stayAbroad-category-child')}</option> */}
                {/* <option value='voluntary'>{t('pinfo:stayAbroad-category-voluntary')}</option> */}
                <option value='military'>{t('pinfo:stayAbroad-category-military')}</option>
                {/* <option value='birth'>{t('pinfo:stayAbroad-category-birth')}</option> */}
                <option value='learn'>{t('pinfo:stayAbroad-category-learn')}</option>
                {/* <option value='daily'>{t('pinfo:stayAbroad-category-daily')}</option> */}
                {/* <option value='sick'>{t('pinfo:stayAbroad-category-sick')}</option> */}
                {/* <option value='other'>{t('pinfo:stayAbroad-category-other')}</option> */}
              </Nav.Select>
            </div>
          </Nav.Row>
          { _period.type ? <React.Fragment>
            <Nav.Row>
              <div className='col-md-12'>
                <Nav.Undertittel className='mt-3 mb-3'>{t(`pinfo:stayAbroad-period-title-${_period.type}`)}</Nav.Undertittel>
              </div>
              <div className='col-md-6'>
                <label className='mr-3'>{t('pinfo:stayAbroad-period-start-date')}</label>
                <br />
                <DatePicker
                  id='pinfo-opphold-startdato-date'
                  selected={_period.startDate ? new Date(_period.startDate) : null}
                  className='startDate'
                  locale={locale}
                  placeholder={t('ui:dateFormat')}
                  onChange={this.setStartDate}
                  error={localErrors.startDate}
                  errorMessage={t(localErrors.startDate)} />
              </div>
              <div className='col-md-6'>
                <label>{t('pinfo:stayAbroad-period-end-date')}</label>
                <br />
                <DatePicker
                  id='pinfo-opphold-sluttdato-date'
                  selected={_period.endDate ? new Date(_period.endDate) : null}
                  className='endDate'
                  locale={locale}
                  placeholder={t('ui:dateFormat')}
                  onChange={this.setEndDate}
                  error={localErrors.endDate}
                  errorMessage={t(localErrors.endDate)} />
              </div>
            </Nav.Row>
            <Nav.Row>
              <div className='mt-3 col-md-12'>
                <label>{t('pinfo:stayAbroad-country')}</label>
                <CountrySelect
                  id='pinfo-opphold-land-select'
                  locale={locale}
                  includeList={CountryFilter.EEA}
                  value={_period.country || null}
                  onSelect={this.setCountry}
                  error={localErrors.country}
                  errorMessage={t(localErrors.country)}
                />
              </div>

              {this.isASpecialCase(_period) ? <React.Fragment>

                <div className='col-md-12 mt-3'>
                  <div className='float-right'>
                    <Nav.HjelpetekstBase id='pinfo-stayAbroad-insurance-help'>
                      <span>{t('pinfo:stayAbroad-spain-france-warning', { country: _period.country.label })}</span>
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
                <div className='col-md-12 mt-3'>
                  <div className='float-right'>
                    <Nav.HjelpetekstBase id='pinfo-stayAbroad-insurance-help'>
                      <span>{t('pinfo:stayAbroad-spain-france-warning', { country: _period.country.label })}</span>
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
              </React.Fragment> : null }
              <div className='col-md-12 d-flex align-items-center'>
                <Nav.Undertittel className='mt-3 mb-3'>{t('pinfo:stayAbroad-insurance-title')}</Nav.Undertittel>
                {mode !== 'view' ? <Nav.HjelpetekstBase id='pinfo-stayAbroad-insurance-help'>
                  {t('pinfo:stayAbroad-insurance-title-help')}
                </Nav.HjelpetekstBase> : null}
              </div>
              <div className='col-md-12'>
                <Nav.Input
                  id='pinfo-opphold-trygdeordning-navn'
                  label={t('pinfo:stayAbroad-insurance-name')}
                  placeholder={t('ui:writeIn')}
                  value={_period.insuranceName || ''}
                  onChange={this.setInsuranceName}
                  feil={localErrors.insuranceName ? { feilmelding: t(localErrors.insuranceName) } : null}
                />
              </div>
              <div className='col-md-12'>
                <Nav.Select
                  id='pinfo-opphold-trygdeordning-type'
                  label={t('pinfo:stayAbroad-insurance-type')}
                  value={_period.insuranceType || ''}
                  onChange={this.setInsuranceType}
                  feil={localErrors.insuranceType ? { feilmelding: t(localErrors.insuranceType) } : null}>
                  <option value=''>{t('ui:choose')}</option>
                  <option value={t('pinfo:stayAbroad-insurance-type-01')}>{t('pinfo:stayAbroad-insurance-type-01')}</option>
                  <option value={t('pinfo:stayAbroad-insurance-type-02')}>{t('pinfo:stayAbroad-insurance-type-02')}</option>
                  <option value={t('pinfo:stayAbroad-insurance-type-03')}>{t('pinfo:stayAbroad-insurance-type-03')}</option>
                </Nav.Select>
              </div>
              <div className='col-md-12'>
                <Nav.Input
                  id='pinfo-opphold-trygdeordning-id'
                  label={t('pinfo:stayAbroad-insurance-id')}
                  placeholder={t('ui:writeIn')}
                  value={_period.insuranceId || ''}
                  onChange={this.setInsuranceId}
                  feil={localErrors.insuranceId ? { feilmelding: t(localErrors.insuranceId) } : null}
                />
              </div>
              <div className='col-md-12'>
                <Nav.Undertittel className='mt-3 mb-3'>{t('pinfo:stayAbroad-home-title')}</Nav.Undertittel>
              </div>
              <div className='col-md-12'>
                <Nav.Textarea
                  id='pinfo-opphold-bosted-address-textarea'
                  label={t('pinfo:stayAbroad-address')}
                  placeholder={t('ui:writeIn')}
                  value={_period.address || ''}
                  style={{ minHeight: '100px' }}
                  maxLength={100}
                  onChange={this.setAddress}
                  feil={localErrors.address ? { feilmelding: t(localErrors.address) } : null}

                />
              </div>
              <div className='col-md-6'>
                <Nav.Input
                  id='pinfo-opphold-bosted-by-input'
                  label={t('pinfo:stayAbroad-city')}
                  value={_period.city || ''}
                  placeholder={t('ui:writeIn')}
                  onChange={this.setCity}
                  feil={localErrors.city ? { feilmelding: t(localErrors.city) } : null}
                />
              </div>
              <div className='col-md-6'>
                <Nav.Input
                  id='pinfo-opphold-bosted-region-input'
                  label={t('pinfo:stayAbroad-region')}
                  value={_period.region || ''}
                  placeholder={t('ui:writeIn')}
                  onChange={this.setRegion}
                  feil={localErrors.region ? { feilmelding: t(localErrors.region) } : null}
                />
              </div>

            </Nav.Row>
            {_period.type === 'work' ? <React.Fragment>
              <Nav.Row>
                <div className='col-md-12'>
                  <Nav.Undertittel className='mt-4 mb-4'>{t('pinfo:stayAbroad-work-title')}</Nav.Undertittel>
                </div>
              </Nav.Row>
              <Nav.Row>
                <div className='col-md-12 col-xs-12'>
                  <Nav.Input
                    id='pinfo-opphold-yrkesaktivitet-input'
                    label={t('pinfo:stayAbroad-work-activity')}
                    placeholder={t('ui:writeIn')}
                    value={_period.workActivity || ''}
                    onChange={this.setWorkActivity}
                    feil={localErrors.workActivity ? { feilmelding: t(localErrors.workActivity) } : null}
                  />
                </div>
              </Nav.Row>
              <Nav.Row>
                <div className='col-md-12 col-xs-12'>
                  <Nav.Input
                    id='pinfo-opphold-arbeidgiversnavn-input'
                    label={t('pinfo:stayAbroad-work-name')}
                    placeholder={t('ui:writeIn')}
                    value={_period.workName || ''}
                    onChange={this.setWorkName}
                    feil={localErrors.workName ? { feilmelding: t(localErrors.workName) } : null}
                  />
                </div>
              </Nav.Row>
              <Nav.Row >
                <div className='col-md-12 col-xs-12'>
                  <Nav.Input
                    id='pinfo-opphold-arbeidgiversaddress-input'
                    label={t('pinfo:stayAbroad-work-address')}
                    value={_period.workAddress || ''}
                    placeholder={t('ui:writeIn')}
                    onChange={this.setWorkAddress}
                    feil={localErrors.workAddress ? { feilmelding: t(localErrors.workAddress) } : null}
                  />
                </div>
              </Nav.Row>
              <Nav.Row>
                <div className='col-md-6'>
                  <Nav.Input
                    id='pinfo-opphold-arbeidgiversby-input'
                    label={t('pinfo:stayAbroad-work-city')}
                    value={_period.workCity || ''}
                    placeholder={t('ui:writeIn')}
                    onChange={this.setWorkCity}
                    feil={localErrors.workCity ? { feilmelding: t(localErrors.workCity) } : null}
                  />
                </div>
                <div className='col-md-6'>
                  <Nav.Input
                    id='pinfo-opphold-arbeidgiversregion-input'
                    label={t('pinfo:stayAbroad-work-region')}
                    value={_period.workRegion || ''}
                    placeholder={t('ui:writeIn')}
                    onChange={this.setWorkRegion}
                    feil={localErrors.workRegion ? { feilmelding: t(localErrors.workRegion) } : null}
                  />
                </div>
              </Nav.Row>
            </React.Fragment> : null}
            {_period.type === 'child' ? <Nav.Row>
              <div className='col-md-12'>
                <Nav.Undertittel className='mt-4 mb-4'>{t('pinfo:stayAbroad-child-title')}</Nav.Undertittel>
              </div>
              <div className='col-md-6'>
                <Nav.Input
                  id='pinfo-opphold-barnasfornavn-input'
                  label={t('pinfo:stayAbroad-child-firstname')}
                  placeholder={t('ui:writeIn')}
                  value={_period.childFirstName || ''}
                  onChange={this.setChildFirstName}
                  feil={localErrors.childFirstName ? { feilmelding: t(localErrors.childFirstName) } : null}
                />
              </div>
              <div className='col-md-6'>
                <Nav.Input
                  id='pinfo-opphold-barnasetternavn-input'
                  label={t('pinfo:stayAbroad-child-lastname')}
                  value={_period.childLastName || ''}
                  placeholder={t('ui:writeIn')}
                  onChange={this.setChildLastName}
                  feil={localErrors.childLastName ? { feilmelding: t(localErrors.childLastName) } : null}
                />
              </div>
              <div className='col-md-6'>
                <label>{t('pinfo:stayAbroad-child-birthdate')}</label>
                <br />
                <DatePicker
                  id='pinfo-opphold-barnasfodselsdato-date'
                  selected={_period.childBirthDate ? new Date(_period.childBirthDate) : null}
                  className='childBirthDate'
                  locale={locale}
                  placeholder={t('ui:dateFormat')}
                  onChange={this.setChildBirthDate}
                  error={localErrors.childBirthDate}
                  errorMessage={t(localErrors.childBirthDate)} />
              </div>
            </Nav.Row> : null}
            {_period.type === 'learn' ? <Nav.Row>
              <div className='col-md-12'>
                <Nav.Undertittel className='mt-4 mb-4'>{t('pinfo:stayAbroad-learn-title')}</Nav.Undertittel>
              </div>
              <div className='col-md-6'>
                <Nav.Input
                  id='pinfo-opphold-opplaeringsinstitusjonsnavn-input'
                  label={t('pinfo:stayAbroad-learn-institution')}
                  value={_period.learnInstitution || ''}
                  placeholder={t('ui:writeIn')}
                  onChange={this.setLearnInstitution}
                  feil={localErrors.learnInstitution ? { feilmelding: t(localErrors.learnInstitution) } : null}
                />
              </div>
            </Nav.Row> : null}
            <Nav.Row>
              <div className='col-md-12'>
                <Nav.Undertittel className='mt-4 mb-4'>{t('pinfo:stayAbroad-attachment-title')}</Nav.Undertittel>
              </div>
              <div className='col-md-12'>
                <FileUpload
                  id='pinfo-opphold-vedlegg-fileupload'
                  className='fileUpload'
                  t={t}
                  ref={f => { this.fileUpload = f }}
                  fileUploadDroppableId={'fileUpload'}
                  files={_period.attachments || []}
                  onFileChange={this.setAttachments} />
              </div>
            </Nav.Row>
            <Nav.Row>
              <div className='mt-4 mb-4 col-md-12'>
                {mode === 'edit' ? <Nav.Knapp
                  id='pinfo-opphold-endre-button'
                  className='editPeriodButton'
                  onClick={this.saveEditPeriod.bind(this)}>
                  {t('ui:changePeriod')}
                </Nav.Knapp> : null}
                {mode === 'new' ? <Nav.Knapp
                  id='pinfo-opphold-leggtil-button'
                  className='addPeriodButton'
                  onClick={this.addPeriod.bind(this)}>
                  <span className='mr-2'>+</span>
                  {t('ui:addPeriod')}
                </Nav.Knapp> : null}
                <Nav.Knapp
                  id='pinfo-opphold-avbryt-button'
                  className='ml-4 cancelPeriodButton'
                  onClick={this.cancelPeriod.bind(this)}>
                  {t('ui:cancel-period')}
                </Nav.Knapp>
              </div>
            </Nav.Row>
          </React.Fragment> : null}
        </React.Fragment>
      default:
        return null
    }
  }
}

Period.propTypes = {
  period: PT.object,
  periods: PT.array,
  actions: PT.object.isRequired,
  editPeriod: PT.func.isRequired,
  showButtons: PT.boolean,
  t: PT.func
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Period)
