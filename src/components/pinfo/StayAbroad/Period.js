import React from 'react'
import PT from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import _ from 'lodash'
import moment from 'moment'
import classNames from 'classnames'
import MD5 from 'md5.js'

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
import * as attachmentActions from '../../../actions/attachment'

import './Period.css'

const mapStateToProps = (state) => {
  return {
    locale: state.ui.locale,
    pinfo: state.pinfo,
    person: state.pinfo.person,
    username: state.app.username,
    attachments: state.attachment,
    pageErrors: state.pinfo.pageErrors,
    fileList: state.storage.fileList
  }
}
const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, storageActions, pinfoActions, uiActions, attachmentActions), dispatch) }
}

class Period extends React.Component {
  state = {
    localErrors: {},
    errorTimestamp: new Date().getTime(),
    _period: {}
  }

  constructor (props) {
    super(props)
    this.setType = this.eventSetType.bind(this, periodValidation.periodType)
    this.setStartDate = this.dateSetProperty.bind(this, 'startDate', periodValidation.periodStartDate)
    this.setEndDate = this.dateSetProperty.bind(this, 'endDate', periodValidation.periodEndDate)
    this.setCountry = this.valueSetProperty.bind(this, 'country', periodValidation.periodCountry)
    this.setInsuranceName = this.eventSetProperty.bind(this, 'insuranceName', periodValidation.insuranceName)
    this.setInsuranceType = this.eventSetProperty.bind(this, 'insuranceType', periodValidation.insuranceType)
    this.setInsuranceId = this.eventSetProperty.bind(this, 'insuranceId', null)
    this.setPlace = this.eventSetProperty.bind(this, 'place', periodValidation.periodPlace)
    this.setWorkActivity = this.eventSetProperty.bind(this, 'workActivity', periodValidation.workActivity)
    this.setWorkName = this.eventSetProperty.bind(this, 'workName', periodValidation.workName)
    this.setWorkPlace = this.eventSetProperty.bind(this, 'workPlace', periodValidation.workPlace)
    this.setChildFirstName = this.eventSetProperty.bind(this, 'childFirstName', periodValidation.childFirstName)
    this.setChildLastName = this.eventSetProperty.bind(this, 'childLastName', periodValidation.childLastName)
    this.setChildBirthDate = this.dateSetProperty.bind(this, 'childBirthDate', periodValidation.childBirthDate)
    this.setLearnInstitution = this.eventSetProperty.bind(this, 'learnInstitution', periodValidation.learnInstitution)
    this.setFatherName = this.eventSetPerson.bind(this, 'fatherName', personValidation.fatherName)
    this.setMotherName = this.eventSetPerson.bind(this, 'motherName', personValidation.motherName)
    this.setAttachments = this.setAttachments.bind(this, 'attachments', null)
  }

  hasNoErrors (errors) {
    for (var key in errors) {
      if (errors[key]) {
        return false
      }
    }
    return true
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

  setAttachments (key, validateFunction, newFiles) {
    const { attachments, actions } = this.props
    let hashedFiles = newFiles.map(file => {
      let hash = new MD5().update(file.content.base64).digest('hex')
      if (!attachments[hash]) {
        actions.addFileToState({ key: hash, file: file })
      }
      return { ...file, content: { md5: hash } }
    })
    this.valueSetProperty(key, validateFunction, hashedFiles)
  }

  eventSetType (validateFunction, e) {
    const { actions, pageErrors } = this.props
    // clean up the onePeriod error message, as the user is trying to fix it
    if (pageErrors && pageErrors.onePeriod) {
      let _pageErrors = _.cloneDeep(pageErrors)
      delete _pageErrors.onePeriod
      actions.setPageErrors(_pageErrors)
    }
    this.eventSetProperty('type', periodValidation.periodType, e)
  }

  eventSetPerson (key, validateFunction, e) {
    const { actions } = this.props
    let _localErrors = _.cloneDeep(this.state.localErrors)
    let value = e.target.value
    let error = validateFunction ? validateFunction(value) : undefined
    if (!error && _localErrors.hasOwnProperty(key)) {
      delete _localErrors[key]
    }
    if (error) {
      _localErrors[key] = error
    }
    actions.setPerson({ [key]: value })
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

  addId (id) {
    this.valueSetProperty('insuranceId', null, id)
  }

  saveNewPeriod () {
    const { periods, actions, pinfo, username } = this.props
    const { _period } = this.state

    let errors = this.validatePeriod()
    this.setState({
      localErrors: errors,
      errorTimestamp: new Date().getTime()
    })

    if (this.hasNoErrors(errors)) {
      let newPeriods = _.clone(periods)
      let newPeriod = _.clone(_period)

      // remove properties that do not belong to this type
      switch (newPeriod) {
        case 'work':
          delete newPeriod.learnInstitution
          break
        case 'learn':
          delete newPeriod.workActivity
          delete newPeriod.workName
          delete newPeriod.workPlace
          break
        default:
          break
      }

      newPeriod.id = new Date().getTime()
      newPeriods.push(newPeriod)
      actions.setStayAbroad(newPeriods)
      this.setState({
        _period: {}
      })
      let _pinfo = _.cloneDeep(pinfo)
      _pinfo.stayAbroad = newPeriods

      actions.setMainButtonsVisibility(true)
      actions.setStepError(undefined)
      actions.postStorageFileWithNoNotification(username, constants.PINFO, constants.PINFO_FILE, JSON.stringify(_pinfo))
      actions.syncLocalStateWithStorage()
      window.scrollTo(0, 0)
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

    if (this.hasNoErrors(errors)) {
      let newPeriods = _.clone(periods)
      let newPeriod = _.clone(_period)

      newPeriod.id = new Date().getTime()

      let index = _.findIndex(periods, { id: _period.id })

      if (index >= 0) {
        newPeriods.splice(index, 1)
        newPeriods.push(newPeriod)
        if (!this.hasSpecialCases(newPeriods)) {
          actions.setPerson({
            fatherName: undefined,
            motherName: undefined
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
        actions.postStorageFileWithNoNotification(username, constants.PINFO, constants.PINFO_FILE, JSON.stringify(_pinfo))
        actions.syncLocalStateWithStorage()
      }
      window.scrollTo(0, 0)
    }
  }

  doCancelPeriod () {
    const { periods, editPeriod, actions } = this.props

    this.setState({
      localErrors: {},
      _period: {},
      errorTimestamp: new Date().getTime()
    })
    editPeriod({})
    if (!this.hasSpecialCases(periods)) {
      actions.setPerson({
        fatherName: undefined,
        motherName: undefined
      })
    }
    actions.setMainButtonsVisibility(true)
    actions.closeModal()
    window.scrollTo(0, 0)
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

  cancelPeriodRequest () {
    const { t, actions } = this.props

    actions.openModal({
      modalTitle: t('pinfo:alert-cancelPeriod'),
      modalText: t('pinfo:alert-areYouSureCancelPeriod'),
      modalButtons: [{
        main: true,
        text: t('ui:yes') + ', ' + t('ui:continue').toLowerCase(),
        onClick: this.doCancelPeriod.bind(this)
      }, {
        text: t('ui:no').toLowerCase(),
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
          fatherName: undefined,
          motherName: undefined
        })
      }
      actions.setStayAbroad(newPeriods)
      let _pinfo = _.cloneDeep(pinfo)
      _pinfo.stayAbroad = newPeriods
      actions.postStorageFileWithNoNotification(username, constants.PINFO, constants.PINFO_FILE, JSON.stringify(_pinfo))
      actions.syncLocalStateWithStorage()
    }
    actions.closeModal()
  }

  errorMessage () {
    const { localErrors } = this.state
    for (var key in localErrors) {
      if (localErrors[key]) {
        return localErrors[key]
      }
    }
    return undefined
  }

  getPeriodAttachments (period) {
    let { attachments } = this.props
    if (!period.attachments) {
      return []
    }
    return period.attachments.map(element => (
      attachments[element.content.md5]
    )).filter(element => element)
  }

  render () {
    const { t, mode, period, periods, locale, first, last, person, showButtons } = this.props
    const { localErrors, _period } = this.state

    let errorMessage = this.errorMessage()

    switch (mode) {
      case 'view':
      case 'confirm':
        return <Nav.Row className={classNames('c-pinfo-stayabroad-period', mode)}>
          <div className={classNames({ 'col-md-6': mode === 'view', 'col-md-12': mode === 'confirm'})}>
            <div id={period.id} className='existingPeriod'>
              <div className='icon mr-3 ml-3'>
                <div className={classNames('topHalf', { line: !first })} />
                <div className={classNames('bottomHalf', { line: !last })} />
                <Icons className='iconsvg' kind={'nav-' + period.type} />
              </div>
              <div className='pt-2 pb-2 existingPeriodDescription'>
                <span className='bold existingPeriodType'>{t('pinfo:stayAbroad-category-' + period.type)}</span>
                <span>
                  <img className='flagImg ml-2' src={'../../../../../flags/' + period.country.value + '.png'}
                    alt={period.country.label} />
                </span>
                <br />
                <span className='existingPeriodDates'>
                  <span className='bold'>{t('pinfo:stayAbroad-period')}</span>{': '}
                  {moment(period.startDate).format('DD.MM.YYYY')}{' - '}
                  {period.endDate ? moment(period.endDate).format('DD.MM.YYYY') : t('ui:unknown')}
                </span>
                <br />
                <React.Fragment>
                  <span className='bold'>{t('pinfo:stayAbroad-place')}</span>{': '}
                  {period.place}
                  <br />
                </React.Fragment>
                {period.type === 'work' ? <React.Fragment>
                  <span className='bold'>{t('pinfo:stayAbroad-work-title')}</span>{': '}
                  {period.workActivity}
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
          {showButtons !== false && mode === 'view' ? <div className='col-md-6 existingPeriodButtons'>
            <Nav.Knapp className='mr-3 existingPeriodButton' onClick={this.requestEditPeriod.bind(this, period)}>
              {t('ui:change')}
            </Nav.Knapp>
            <Nav.Knapp className='existingPeriodButton' onClick={this.removePeriodRequest.bind(this, period)}>
              <span className='mr-2' style={{ fontSize: '1.5rem' }}>×</span>
              {t('ui:remove')}
            </Nav.Knapp>
          </div> : null }
        </Nav.Row>

      case 'edit':
      case 'new':
        return <React.Fragment>
          {errorMessage ? <Nav.AlertStripe className='mt-4 mb-4' type='advarsel'>{t(errorMessage)}</Nav.AlertStripe> : null}
          <Nav.Undertittel className='mt-4 mb-4'>{t('pinfo:stayAbroad-period-' + mode)}</Nav.Undertittel>

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
            {_period.type === 'home' ? <Nav.AlertStripe className='mt-4 mb-4' type='info'>{t('pinfo:warning-home-period')}</Nav.AlertStripe> : null}

            <Nav.Row>
              <div className='col-md-12'>
                <Nav.Undertittel className='mt-4 mb-4'>{t(`pinfo:stayAbroad-period-title-${_period.type}`)}</Nav.Undertittel>
                <Nav.Normaltekst className='mb-4'>{t('pinfo:stayAbroad-period-date-description')}</Nav.Normaltekst>
              </div>
              <div className='col-md-6'>
                <label className='mr-3 skjemaelement__label'>{t('pinfo:stayAbroad-period-start-date') + ' *'}</label>
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
                <label className='skjemaelement__label'>{t('pinfo:stayAbroad-period-end-date') + ' *'}</label>
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
              <div className='col-md-12 mt-3 mb-3'>
                <label className='skjemaelement__label'>{t('pinfo:stayAbroad-country') + ' *'}</label>
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
            </Nav.Row>

            {this.isASpecialCase(_period) ? <Nav.Row>
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
            </Nav.Row> : null}

            {_period.type === 'work' ? <Nav.Row>
              <div className='col-md-12 col-xs-12'>
                <Nav.Textarea
                  id='pinfo-opphold-arbeidgiverssted-textarea'
                  label={t('pinfo:stayAbroad-work-place')}
                  placeholder={t('ui:writeIn')}
                  value={_period.workPlace || ''}
                  style={{ minHeight: '100px' }}
                  maxLength={100}
                  onChange={this.setWorkPlace}
                  feil={localErrors.workPlace ? { feilmelding: t(localErrors.workPlace) } : null}
                />
              </div>
              <div className='col-md-12 col-xs-12'>
                <Nav.Input
                  id='pinfo-opphold-yrkesaktivitet-input'
                  label={t('pinfo:stayAbroad-work-activity') + ' *'}
                  placeholder={t('ui:writeIn')}
                  value={_period.workActivity || ''}
                  onChange={this.setWorkActivity}
                  feil={localErrors.workActivity ? { feilmelding: t(localErrors.workActivity) } : null}
                />
              </div>
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
            </Nav.Row> : null}

            {_period.type === 'learn' ? <Nav.Row>
              <div className='col-md-12'>
                <Nav.Input
                  id='pinfo-opphold-opplaeringsinstitusjonsnavn-input'
                  label={t('pinfo:stayAbroad-learn-institution') + ' *'}
                  value={_period.learnInstitution || ''}
                  placeholder={t('ui:writeIn')}
                  onChange={this.setLearnInstitution}
                  feil={localErrors.learnInstitution ? { feilmelding: t(localErrors.learnInstitution) } : null}
                />
              </div>
            </Nav.Row> : null}

            {_period.type !== 'home' ? <Nav.Row>
              <div className='col-md-12'>
                <Nav.Undertittel className='mt-4 mb-4'>{t('pinfo:stayAbroad-home-title')}</Nav.Undertittel>
              </div>
              <div className='col-md-12'>
                <Nav.Textarea
                  id='pinfo-opphold-bosted-place-textarea'
                  label={t('pinfo:stayAbroad-place-and-country') + ' *'}
                  placeholder={t('ui:writeIn')}
                  value={_period.place || ''}
                  style={{ minHeight: '100px' }}
                  maxLength={100}
                  onChange={this.setPlace}
                  feil={localErrors.place ? { feilmelding: t(localErrors.place) } : null}
                />
              </div>
            </Nav.Row> : <Nav.Row>
              <div className='col-md-12'>
                <Nav.Textarea
                  id='pinfo-opphold-bosted-place-textarea'
                  label={t('pinfo:stayAbroad-place') + ' *'}
                  placeholder={t('ui:writeIn')}
                  value={_period.place || ''}
                  style={{ minHeight: '100px' }}
                  maxLength={100}
                  onChange={this.setPlace}
                  feil={localErrors.place ? { feilmelding: t(localErrors.place) } : null}
                />
              </div>
            </Nav.Row>}

            <Nav.Row>
              <div className='col-md-12 d-flex align-items-center'>
                <Nav.Undertittel className='mt-4 mb-4'>{t('pinfo:stayAbroad-insurance-title')}</Nav.Undertittel>
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
                <Nav.Input
                  id='pinfo-opphold-trygdeordning-id'
                  label={t('pinfo:stayAbroad-insurance-id')}
                  placeholder={t('ui:writeIn')}
                  value={_period.insuranceId || ''}
                  onChange={this.setInsuranceId}
                  feil={localErrors.insuranceId ? { feilmelding: t(localErrors.insuranceId) } : null}
                />
                <div className='id-suggestions mb-4'>
                  {periods.map(period => {
                    return period.insuranceId
                  }).filter((id, index, self) => {
                    return id && _period.insuranceId !== id && self.indexOf(id) === index
                  }).map(id => {
                    return <Nav.EtikettBase key={id} className='mr-3' type='fokus' onClick={this.addId.bind(this, id)}><b>{id}</b></Nav.EtikettBase>
                  })}
                </div>
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
                  <option value={t('pinfo:stayAbroad-insurance-type-04')}>{t('pinfo:stayAbroad-insurance-type-04')}</option>
                </Nav.Select>
              </div>
            </Nav.Row>

            <Nav.Row>
              <div className='col-md-12'>
                <Nav.Undertittel className='mt-4 mb-4'>{t('pinfo:stayAbroad-attachment-title')}</Nav.Undertittel>
              </div>
              <div className='col-md-12'>
                <FileUpload
                  id={'pinfo-opphold-vedlegg-fileupload-' + period.id}
                  accept={['application/pdf', 'image/jpeg', 'image/png']}
                  className='fileUpload'
                  t={t}
                  ref={f => { this.fileUpload = f }}
                  fileUploadDroppableId={'fileUpload'}
                  files={this.getPeriodAttachments(_period)}
                  onFileChange={this.setAttachments} />
              </div>
            </Nav.Row>

            <Nav.Row>
              <div className='mt-4 mb-4 col-md-12'>
                {'* ' + t('mandatoryField')}
              </div>
            </Nav.Row>

            <Nav.Row>
              <div className='mt-4 mb-4 col-md-12'>
                {mode === 'edit' ? <Nav.Knapp
                  id='pinfo-opphold-endre-button'
                  className='editPeriodButton mb-2 mr-4'
                  onClick={this.saveEditPeriod.bind(this)}>
                  {t('pinfo:form-saveEditPeriod')}
                </Nav.Knapp> : null}
                {mode === 'new' ? <Nav.Hovedknapp
                  id='pinfo-opphold-lagre-button'
                  className='addPeriodButton mb-2 mr-4'
                  onClick={this.saveNewPeriod.bind(this)}>
                  {t('pinfo:form-saveNewPeriod')}
                </Nav.Hovedknapp> : null}
                <Nav.KnappBase
                  id='pinfo-opphold-avbryt-button'
                  className='cancelPeriodButton mb-2'
                  onClick={this.cancelPeriodRequest.bind(this)}>
                  {t('pinfo:form-cancelPeriod')}
                </Nav.KnappBase>
              </div>
            </Nav.Row>

          </React.Fragment> : null}
          {errorMessage ? <Nav.AlertStripe className='mt-4 mb-4' type='advarsel'>{t(errorMessage)}</Nav.AlertStripe> : null}
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
  showButtons: PT.bool,
  t: PT.func
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Period)
