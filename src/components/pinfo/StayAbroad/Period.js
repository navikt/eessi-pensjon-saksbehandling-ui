import React from 'react'
import PT from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import _ from 'lodash'
import moment from 'moment'
import classNames from 'classnames'

import ReactDatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.min.css'

import CountrySelect from '../../ui/CountrySelect/CountrySelect'
import FileUpload from '../../ui/FileUpload/FileUpload'

import { periodValidation } from '../Validation/singleTests'
import * as stepTests from '../Validation/stepTests'

import * as Nav from '../../ui/Nav'
import Icons from '../../ui/Icons'

import * as uiActions from '../../../actions/ui'
import * as pinfoActions from '../../../actions/pinfo'

import './Period.css'

const mapStateToProps = (state) => {
  return {
  }
}
const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, pinfoActions, uiActions), dispatch) }
}

class Period extends React.Component {
  state = {
    _error: undefined,
    error: {},
    _period: {}
  }

  constructor (props) {
    super(props)
    this.setType = this.eventSetProperty.bind(this, 'type', periodValidation.periodType)
    this.setStartDate = this.dateSetProperty.bind(this, 'startDate', periodValidation.startDate)
    this.setEndDate = this.dateSetProperty.bind(this, 'endDate', periodValidation.endDate)
    this.setCountry = this.valueSetProperty.bind(this, 'country', null)
    this.setWorkActivity = this.eventSetProperty.bind(this, 'workActivity', periodValidation.workActivity)
    this.setWorkId = this.eventSetProperty.bind(this, 'workId', periodValidation.workId)
    this.setWorkName = this.eventSetProperty.bind(this, 'workName', periodValidation.workName)
    this.setWorkAddress = this.eventSetProperty.bind(this, 'workAddress', periodValidation.workAddress)
    this.setWorkCity = this.eventSetProperty.bind(this, 'workCity', periodValidation.workCity)
    this.setWorkRegion = this.eventSetProperty.bind(this, 'workRegion', periodValidation.workRegion)
    this.setChildFirstName = this.eventSetProperty.bind(this, 'childFirstName', periodValidation.childFirstName)
    this.setChildLastName = this.eventSetProperty.bind(this, 'childLastName', periodValidation.childLastName)
    this.setChildBirthDate = this.dateSetProperty.bind(this, 'childBirthDate', periodValidation.childBirthDate)
    this.setLearnInstitution = this.eventSetProperty.bind(this, 'learnInstitution', periodValidation.learnInstitution)
    this.setAttachments = this.valueSetProperty.bind(this, 'attachments', null)
  }

  eventSetProperty (key, validateFunction, event) {
    this.valueSetProperty(key, validateFunction, event.target.value)
  }

  dateSetProperty (key, validateFunction, date) {
    this.valueSetProperty(key, validateFunction, date ? date.valueOf() : null)
  }

  valueSetProperty (key, validateFunction, value) {
    const { onPageError } = this.props
    let error = validateFunction ? validateFunction(value) : ''

    this.setState({
      _period: {
        ...this.state._period,
        [key]: value
      },
      error: {
        ...this.state.error,
        [key]: error
      },
      _error : error
    })

    if (error) {
      onPageError(error)
    }
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

  validatePeriod() {
    const { _period } = this.state

    return stepTests.periodStep(_period)
  }

  addPeriod () {
    const { periods, actions, onPageError } = this.props
    const { _period } = this.state

    let validateError = this.validatePeriod()
    if (validateError) {
       onPageError(validateError)

       return this.setState({
         _error : validateError
       })
    }

    let newPeriods = _.clone(periods)
    let newPeriod = _.clone(_period)

    newPeriod.id = new Date().getTime()
    newPeriods.push(newPeriod)
    actions.setStayAbroad(newPeriods)
    this.setState({
      _error : undefined,
      error: {},
      _period: {}
    })
  }

  requestEditPeriod (period) {
    const { editPeriod } = this.props
    editPeriod(period)
  }

  saveEditPeriod () {
    const { periods, editPeriod, actions, onPageError } = this.props
    const { _period } = this.state

    let validateError = this.validatePeriod()
    if (validateError) {
        onPageError(validateError)
        return this.setState({
            _error : validateError
        })
    }

    let newPeriods = _.clone(periods)
    let newPeriod = _.clone(_period)
    newPeriod.id = new Date().getTime()

    let index = _.findIndex(periods, { id: _period.id })

    if (index >= 0) {
      newPeriods.splice(index, 1)
      newPeriods.push(newPeriod)
      actions.setStayAbroad(newPeriods)
      this.setState({
        error: {},
        _period: {}
      })
      editPeriod({})
    }
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

  doRemovePeriod(period) {

    const { periods, actions } = this.props

    let index = _.findIndex(periods, { id: period.id })

    if (index >= 0) {
      let newPeriods = _.clone(periods)
      newPeriods.splice(index, 1)
      actions.setStayAbroad(newPeriods)
    }
    actions.closeModal()
  }

  render () {
    const { t, mode, period, locale, current, first, last } = this.props
    const { error, _period } = this.state

    switch (mode) {
      case 'view':
        return <Nav.Row className={classNames('c-pinfo-stayabroad-period', mode, { 'current': current })}>
          <div className='col-md-6'>
            <div id={period.id} className='existingPeriod'>
              <div className='icon mr-4'>
                <div className={classNames('topHalf', { line: !first })} />
                <div className={classNames('bottomHalf', { line: !last })} />
                <Icons className='iconsvg' kind={'nav-' + period.type} />
              </div>
              <div className='pt-2 pb-2 existingPeriodDescription'>
                <span className='bold existingPeriodType'>{t('pinfo:stayAbroad-category-' + period.type)}</span>
                <br />
                <span className='existingPeriodDates'>{t('pinfo:stayAbroad-period')}{': '}
                  {moment(period.startDate).format('DD.MM.YYYY')}{' - '}
                  {period.endDate ? moment(period.endDate).format('DD.MM.YYYY') : t('ui:unknown')}
                </span>
                <br />
                {period.attachments && !_.isEmpty(period.attachments) ? <span className='existingPeriodAttachments'>
                  {t('pinfo:stayAbroad-attachments')}{': '}
                  {period.attachments.map(att => { return att.name }).join(', ')}
                </span> : null}
              </div>
            </div>
          </div>
          <div className='col-md-4 existingPeriodButtons'>
            <Nav.Knapp className='mr-3 existingPeriodButton' onClick={this.requestEditPeriod.bind(this, period)}>
              {t('ui:change')}
            </Nav.Knapp>
            <Nav.Knapp className='existingPeriodButton' onClick={this.removePeriodRequest.bind(this, period)} mini>
              <span className='mr-2' style={{ fontSize: '1.5rem' }}>×</span>
              {t('ui:remove')}
            </Nav.Knapp>
          </div>
        </Nav.Row>

      case 'edit':
      case 'new':
        return <React.Fragment>
          <Nav.Row className={classNames('c-pinfo-opphold-period', mode)}>
            <div className='col-md-4'>
              <Nav.Select
                id='pinfo-opphold-kategori-select'
                label={t('pinfo:stayAbroad-category')}
                value={_period.type || ''}
                onChange={this.setType}>
                <option value=''>{t('ui:choose')}</option>
                <option value='work'>{t('pinfo:stayAbroad-category-work')}</option>
                <option value='home'>{t('pinfo:stayAbroad-category-home')}</option>
                {/* <option value='child'>{t('pinfo:stayAbroad-category-child')}</option> */}
                <option value='voluntary'>{t('pinfo:stayAbroad-category-voluntary')}</option>
                <option value='military'>{t('pinfo:stayAbroad-category-military')}</option>
                <option value='birth'>{t('pinfo:stayAbroad-category-birth')}</option>
                <option value='learn'>{t('pinfo:stayAbroad-category-learn')}</option>
                <option value='daily'>{t('pinfo:stayAbroad-category-daily')}</option>
                <option value='sick'>{t('pinfo:stayAbroad-category-sick')}</option>
                <option value='other'>{t('pinfo:stayAbroad-category-other')}</option>
              </Nav.Select>
            </div>
          </Nav.Row>
          { _period.type ? <React.Fragment>
            <Nav.Row>
              <div className='col-md-12'>
                <Nav.Undertittel className='mt-3 mb-3'>{t('pinfo:stayAbroad-period-title')}</Nav.Undertittel>
              </div>
              <div className='col-md-4'>
                <label className='mr-3'>{t('pinfo:stayAbroad-period-start-date')}</label>
                <br />
                <ReactDatePicker
                  id='pinfo-opphold-startdato-date'
                  selected={_period.startDate ? new Date(_period.startDate) : null}
                  className='startDate'
                  dateFormat='dd.MM.yyyy'
                  placeholderText={t('ui:dateFormat')}
                  showYearDropdown
                  showMonthDropdown
                  dropdownMode='select'
                  locale={locale}
                  onChange={this.setStartDate} />
                <div>{error.startDateFail}</div>
              </div>
              <div className='col-md-4'>
                <label>{t('pinfo:stayAbroad-period-end-date')}</label>
                <br />
                <ReactDatePicker
                  id='pinfo-opphold-sluttdato-date'
                  selected={_period.endDate ? new Date(_period.endDate) : null}
                  className='endDate'
                  dateFormat='dd.MM.yyyy'
                  placeholderText={t('ui:dateFormat')}
                  showYearDropdown
                  showMonthDropdown
                  dropdownMode='select'
                  locale={locale}
                  onChange={this.setEndDate} />
                <div>{error.endDateFail}</div>
              </div>
            </Nav.Row>
            <Nav.Row>
              <div className='mt-3 col-md-6'>
                <label>{t('pinfo:stayAbroad-country')}</label>
                <CountrySelect
                  id='pinfo-opphold-land-select'
                  locale={locale}
                  value={_period.country || null}
                  onSelect={this.setCountry}
                  error={error.country}
                  errorMessage={error.country}
                />
              </div>
            </Nav.Row>
            {_period.type === 'work' ? <Nav.Row>
              <div className='col-md-12'>
                <Nav.Undertittel className='mt-4 mb-4'>{t('pinfo:stayAbroad-work-title')}</Nav.Undertittel>
              </div>
              <div className='col-md-4'>
                <Nav.Input
                  id='pinfo-opphold-yrkesaktivitet-input'
                  label={t('pinfo:stayAbroad-work-activity')}
                  placeholder={t('ui:writeIn')}
                  value={_period.workActivity || ''}
                  onChange={this.setWorkActivity}
                  feil={error.workActivity ? { feilmelding: t(error.workActivity) } : null}
                />
              </div>
              <div className='col-md-6'>
                <Nav.Input
                  id='pinfo-opphold-yrkesforsikringid-input'
                  label={t('pinfo:stayAbroad-work-id')}
                  value={_period.workId || ''}
                  placeholder={t('ui:writeIn')}
                  onChange={this.setWorkId}
                  feil={error.workId ? { feilmelding: t(error.workId) } : null}
                />
              </div>
              <div className='col-md-4'>
                <Nav.Input
                  id='pinfo-opphold-arbeidgiversnavn-input'
                  label={t('pinfo:stayAbroad-work-name')}
                  placeholder={t('ui:writeIn')}
                  value={_period.workName || ''}
                  onChange={this.setWorkName}
                  feil={error.workName ? { feilmelding: t(error.workName) } : null}
                />
              </div>
              <div className='col-md-6'>
                <Nav.Input
                  id='pinfo-opphold-arbeidgiversaddress-input'
                  label={t('pinfo:stayAbroad-work-address')}
                  value={_period.workAddress || ''}
                  placeholder={t('ui:writeIn')}
                  onChange={this.setWorkAddress}
                  feil={error.workAddress ? { feilmelding: t(error.workAddress) } : null}
                />
              </div>
              <div className='col-md-4'>
                <Nav.Input
                  id='pinfo-opphold-arbeidgiversby-input'
                  label={t('pinfo:stayAbroad-work-city')}
                  value={_period.workCity || ''}
                  placeholder={t('ui:writeIn')}
                  onChange={this.setWorkCity}
                  feil={error.workCity ? { feilmelding: t(error.workCity) } : null}
                />
              </div>
              <div className='col-md-6'>
                <Nav.Input
                  id='pinfo-opphold-arbeidgiversregion-input'
                  label={t('pinfo:stayAbroad-work-region')}
                  value={_period.workRegion || ''}
                  placeholder={t('ui:writeIn')}
                  onChange={this.setWorkRegion}
                  feil={error.workRegion ? { feilmelding: t(error.workRegion) } : null}
                />
              </div>
            </Nav.Row> : null}
            {_period.type === 'child' ? <Nav.Row>
              <div className='col-md-12'>
                <Nav.Undertittel className='mt-4 mb-4'>{t('pinfo:stayAbroad-child-title')}</Nav.Undertittel>
              </div>
              <div className='col-md-4'>
                <Nav.Input
                  id='pinfo-opphold-barnasfornavn-input'
                  label={t('pinfo:stayAbroad-child-firstname')}
                  placeholder={t('ui:writeIn')}
                  value={_period.childFirstName || ''}
                  onChange={this.setChildFirstName}
                  feil={error.childFirstName ? { feilmelding: t(error.childFirstName) } : null}
                />
              </div>
              <div className='col-md-6'>
                <Nav.Input
                  id='pinfo-opphold-barnasetternavn-input'
                  label={t('pinfo:stayAbroad-child-lastname')}
                  value={_period.childLastName || ''}
                  placeholder={t('ui:writeIn')}
                  onChange={this.setChildLastName}
                  feil={error.childLastName ? { feilmelding: t(error.childLastName) } : null}
                />
              </div>
              <div className='col-md-4'>
                <label>{t('pinfo:stayAbroad-child-birthdate')}</label>
                <br />
                <ReactDatePicker
                  id='pinfo-opphold-barnasfodselsdato-date'
                  selected={_period.childBirthDate ? new Date(_period.childBirthDate) : null}
                  className='childBirthDate'
                  dateFormat='dd.MM.yyyy'
                  placeholderText={t('ui:dateFormat')}
                  showYearDropdown
                  showMonthDropdown
                  dropdownMode='select'
                  locale={locale}
                  onChange={this.setChildBirthDate} />
                <div>{error.childBirthDate}</div>
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
                  feil={error.learnInstitution ? { feilmelding: t(error.learnInstitution) } : null}
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
                  {t('ui:savePeriod')}
                </Nav.Knapp> : null}
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
  t: PT.func
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Period)
