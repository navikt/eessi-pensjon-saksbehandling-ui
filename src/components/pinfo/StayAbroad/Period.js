import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import moment from 'moment'
import classNames from 'classnames'

import ReactDatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.min.css'

import CountrySelect from '../../ui/CountrySelect/CountrySelect'
import FileUpload from '../../ui/FileUpload/FileUpload'

import { stayAbroadValidation } from '../Validation/singleTests'
import * as Nav from '../../ui/Nav'
import Icons from '../../ui/Icons'

import './Period.css'

class Period extends React.Component {
  state = {
    error: {},
    _period: {}
  }

  constructor (props) {
    super(props)
    this.setType = this.eventSetProperty.bind(this, 'type', null)
    this.setStartDate = this.dateSetProperty.bind(this, 'startDate', null)
    this.setEndDate = this.dateSetProperty.bind(this, 'endDate', null)
    this.setCountry = this.valueSetProperty.bind(this, 'country', null)
    this.setWorkActivity = this.eventSetProperty.bind(this, 'workActivity', null)
    this.setWorkId = this.eventSetProperty.bind(this, 'workId', null)
    this.setWorkName = this.eventSetProperty.bind(this, 'workName', null)
    this.setWorkAddress = this.eventSetProperty.bind(this, 'workAddress', null)
    this.setWorkCity = this.eventSetProperty.bind(this, 'workCity', null)
    this.setWorkRegion = this.eventSetProperty.bind(this, 'workRegion', null)
    this.setChildFirstName = this.eventSetProperty.bind(this, 'childFirstName', null)
    this.setChildLastName = this.eventSetProperty.bind(this, 'childLastName', null)
    this.setChildBirthDate = this.dateSetProperty.bind(this, 'childBirthDate', null)
    this.setLearnInstitution = this.eventSetProperty.bind(this, 'learnInstitution', null)
    this.setAttachments = this.valueSetProperty.bind(this, 'attachments', null)
  }

  eventSetProperty (key, validateFunction, event) {
    this.valueSetProperty(key, validateFunction, event.target.value)
  }

  dateSetProperty (key, validateFunction, date) {
    this.valueSetProperty(key, validateFunction, date ? date.valueOf() : null)
  }

  valueSetProperty (key, validateFunction, value) {
    this.setState({
      _period: {
        ...this.state._period,
        [key]: value
      },
      error: {
        ...this.state.error,
        [key]: validateFunction ? validateFunction(value) : ''
      }
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

  addPeriod () {
    const { periods, setStayAbroad } = this.props
    const { _period } = this.state

    let newPeriods = _.clone(periods)
    let newPeriod = _.clone(_period)

    newPeriod.id = new Date().getTime()
    newPeriods.push(newPeriod)
    setStayAbroad(newPeriods)
    this.setState({
      error: {},
      _period: {}
    })
  }

  requestEditPeriod (period) {
    const { editPeriod } = this.props

    editPeriod(period)
  }

  saveEditPeriod () {
    const { periods, setStayAbroad } = this.props
    const { _period } = this.state

    let newPeriods = _.clone(periods)
    let newPeriod = _.clone(_period)
    newPeriod.id = new Date().getTime()

    let index = _.findIndex(periods, { id: _period.id })

    if (index >= 0) {
      newPeriods.splice(index, 1)
      newPeriods.push(newPeriod)
      setStayAbroad(newPeriods)
      this.setState({
        error: {},
        _period: {}
      })
    }
  }

  removePeriod (period) {
    const { periods, setStayAbroad } = this.props

    let index = _.findIndex(periods, { id: period.id })

    if (index >= 0) {
      let newPeriods = _.clone(periods)
      newPeriods.splice(index, 1)
      setStayAbroad(newPeriods)
    }
  }

  render () {
    const { value, t, mode, period, editPeriod, locale, current } = this.props
    const { error, _period } = this.state

    switch (mode) {
      case 'view':
        return <Nav.Row className={classNames('c-pinfo-stayabroad-period', mode, { 'current': current })}>
          <div className='col-md-6'>
            <div id={period.id} className='existingPeriod'>
              <div className='icon mr-4'>
                <Icons kind={'nav-' + period.type} />
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
            <Nav.Knapp className='existingPeriodButton' onClick={this.removePeriod.bind(this, period)} mini>
              <span className='mr-2' style={{ fontSize: '1.5rem' }}>×</span>
              {t('ui:remove')}
            </Nav.Knapp>
          </div>
        </Nav.Row>

      case 'edit':
      case 'new':
        return <React.Fragment>
          <Nav.Row className={classNames('c-pinfo-stayabroad-period', mode)}>
            <div className='col-md-4'>
              <Nav.Select
                id='pinfo-stayabroad-category-select'
                label={t('pinfo:stayAbroad-category')}
                value={_period.type || ''}
                onChange={this.setType}>
                <option value=''>{t('ui:choose')}</option>
                <option value='work'>{t('pinfo:stayAbroad-category-work')}</option>
                <option value='home'>{t('pinfo:stayAbroad-category-home')}</option>
                {/*<option value='child'>{t('pinfo:stayAbroad-category-child')}</option>*/}
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
                  id='pinfo-stayabroad-startdate-date'
                  selected={_period.startDate}
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
                  id='pinfo-stayabroad-enddate-date'
                  selected={_period.endDate}
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
                  id='pinfo-stayabroad-country-select'
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
                  id='pinfo-stayabroad-workactivity-input'
                  label={t('pinfo:stayAbroad-work-activity')}
                  placeholder={t('ui:writeIn')}
                  value={_period.workActivity || ''}
                  onChange={this.setWorkActivity}
                  feil={error.workActivity ? { feilmelding: t(error.workActivity) } : null}
                />
              </div>
              <div className='col-md-6'>
                <Nav.Input
                  id='pinfo-stayabroad-workid-input'
                  label={t('pinfo:stayAbroad-work-id')}
                  value={_period.workId || ''}
                  placeholder={t('ui:writeIn')}
                  onChange={this.setWorkId}
                  feil={error.workId ? { feilmelding: t(error.workId) } : null}
                />
              </div>
              <div className='col-md-4'>
                <Nav.Input
                  id='pinfo-stayabroad-workname-input'
                  label={t('pinfo:stayAbroad-work-name')}
                  placeholder={t('ui:writeIn')}
                  value={_period.workName || ''}
                  onChange={this.setWorkName}
                  feil={error.workName ? { feilmelding: t(error.workName) } : null}
                />
              </div>
              <div className='col-md-6'>
                <Nav.Input
                  id='pinfo-stayabroad-workaddress-input'
                  label={t('pinfo:stayAbroad-work-address')}
                  value={_period.workAddress || ''}
                  placeholder={t('ui:writeIn')}
                  onChange={this.setWorkAddress}
                  feil={error.workAddress ? { feilmelding: t(error.workAddress) } : null}
                />
              </div>
              <div className='col-md-4'>
                <Nav.Input
                  id='pinfo-stayabroad-workcity-input'
                  label={t('pinfo:stayAbroad-work-city')}
                  value={_period.workCity || ''}
                  placeholder={t('ui:writeIn')}
                  onChange={this.setWorkCity}
                  feil={error.workCity ? { feilmelding: t(error.workCity) } : null}
                />
              </div>
              <div className='col-md-6'>
                <Nav.Input
                  id='pinfo-stayabroad-workregion-input'
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
                  id='pinfo-stayabroad-childfirstname-input'
                  label={t('pinfo:stayAbroad-child-firstname')}
                  placeholder={t('ui:writeIn')}
                  value={_period.childFirstName || ''}
                  onChange={this.setChildFirstName}
                  feil={error.childFirstName ? { feilmelding: t(error.childFirstName) } : null}
                />
              </div>
              <div className='col-md-6'>
                <Nav.Input
                  id='pinfo-stayabroad-childlastname-input'
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
                  id='pinfo-stayabroad-childbirthdate-date'
                  selected={_period.childBirthDate}
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
                  id='pinfo-stayabroad-institution-input'
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
                  id='pinfo-stayabroad-attachments-fileupload'
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
                  id='pinfo-stayabroad-edit-button'
                  className='editPeriodButton'
                  onClick={this.saveEditPeriod.bind(this)}>
                  {t('ui:changePeriod')}
                </Nav.Knapp> : null}
                {mode === 'new' ? <Nav.Knapp
                  id='pinfo-stayabroad-add-button'
                  className='addPeriodButton'
                  onClick={this.addPeriod.bind(this)}>
                  {t('ui:savePeriod')}
                </Nav.Knapp> : null}
              </div>
            </Nav.Row>
          </React.Fragment> : null}
        </React.Fragment>
    }
  }
}

Period.propTypes = {
  period: PT.object,
  periods: PT.array,
  setStayAbroad: PT.func.isRequired,
  editPeriod: PT.func.isRequired,
  t: PT.func
}

export default Period
