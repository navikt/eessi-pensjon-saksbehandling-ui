import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'

import ReactDatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.min.css'

import CountrySelect from '../../ui/CountrySelect/CountrySelect'
import FileUpload from '../../ui/FileUpload/FileUpload'

import { stayAbroadValidation } from '../Validation/singleTests'
import * as Nav from '../../ui/Nav'

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
    if (_.isEmpty(oldState._period) && newProps.mode === 'edit') {
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
      period: {}
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

    let index = _.find(periods, { id: _period.id })

    if (index >= 0) {
      newPeriods.splice(index, 1)
      newPeriods.push(newPeriod)
      setStayAbroad(newPeriods)
      this.setState({
        error: {},
        period: {}
      })
    }
  }

  removePeriod (period) {
    const { periods, setStayAbroad } = this.props

    let index = _.find(periods, { id: period.id })

    if (index >= 0) {
      let newPeriods = _.clone(periods)
      newPeriods.splice(index, 1)
      setStayAbroad(newPeriods)
    }
  }

  render () {
    const { value, t, mode, period, editPeriod, locale } = this.props
    const { error, _period } = this.state

    switch (mode) {
      case 'view':
        return <Nav.Row style={{ alignItems: 'baseline', padding: '2px' }}>
          <div className='col-md-4'>
            {period.id}
          </div>
          <div className='col-md-4'>
            <Nav.Knapp style={{ display: 'flex', alignItems: 'center' }} onClick={this.requestEditPeriod.bind(this, period)} mini>
              {t('ui:edit')}
            </Nav.Knapp>
            <Nav.Knapp style={{ display: 'flex', alignItems: 'center' }} onClick={this.removePeriod.bind(this, period)} mini>
              <span className='mr-2' style={{ fontSize: '1.5rem' }}>×</span>
              {t('ui:remove')}
            </Nav.Knapp>
          </div>
        </Nav.Row>

      case 'edit':
      case 'new':
        return <React.Fragment>
          <Nav.Row style={{ alignItems: 'baseline', padding: '2px' }}>
            <div className='col-md-4'>
              <Nav.Select label={t('pinfo:stayAbroad-category')}
                value={_period.type || ''}
                onChange={this.setType}>
                <option value=''>{t('ui:choose')}</option>
                <option value='work'>{t('pinfo:stayAbroad-category-work')}</option>
                <option value='home'>{t('pinfo:stayAbroad-category-home')}</option>
                <option value='child'>{t('pinfo:stayAbroad-category-child')}</option>
                <option value='voluntary'>{t('pinfo:stayAbroad-category-voluntary')}</option>
                <option value='military'>{t('pinfo:stayAbroad-category-military')}</option>
                <option value='child'>{t('pinfo:stayAbroad-category-child')}</option>
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
               <h3 className='mt-3 mb-3 typo-undertittel'>{t('pinfo:stayAbroad-period-title')}</h3>
            </div>
            <div className='col-md-4'>
              <label className='mr-3'>{t('pinfo:stayAbroad-period-start-date')}</label>
              <br/>
              <ReactDatePicker selected={_period.startDate}
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
              <br/>
              <ReactDatePicker selected={_period.endDate}
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
              <CountrySelect locale={locale}
                value={_period.country || null}
                onSelect={this.setCountry}
                error={error.country}
                errorMessage={error.country}
              />
            </div>
          </Nav.Row>
          {_period.type === 'work' ? <Nav.Row>
            <div className='col-md-12'>
              <h3 className='mt-4 mb-4 typo-undertittel'>{t('pinfo:stayAbroad-work-title')}</h3>
            </div>
            <div className='col-md-4'>
              <Nav.Input label={t('pinfo:stayAbroad-work-activity')} value={_period.workActivity || ''}
                onChange={this.setWorkActivity}
                feil={error.workActivity ? { feilmelding: t(error.workActivity) } : null}
              />
            </div>
            <div className='col-md-6'>
              <Nav.Input label={t('pinfo:stayAbroad-work-id')} value={_period.workId || ''}
                onChange={this.setWorkId}
                feil={error.workId ? { feilmelding: t(error.workId) } : null}
              />
            </div>
            <div className='col-md-4'>
              <Nav.Input label={t('pinfo:stayAbroad-work-name')} value={_period.workName || ''}
                 onChange={this.setWorkName}
                 feil={error.workName ? { feilmelding: t(error.workName) } : null}
               />
            </div>
            <div className='col-md-6'>
              <Nav.Input label={t('pinfo:stayAbroad-work-address')} value={_period.workAddress || ''}
                 onChange={this.setWorkAddress}
                 feil={error.workAddress ? { feilmelding: t(error.workAddress) } : null}
               />
            </div>
            <div className='col-md-4'>
              <Nav.Input label={t('pinfo:stayAbroad-work-city')} value={_period.workCity || ''}
                onChange={this.setWorkCity}
                feil={error.workCity ? { feilmelding: t(error.workCity) } : null}
              />
            </div>
            <div className='col-md-6'>
              <Nav.Input label={t('pinfo:stayAbroad-work-region')} value={_period.workRegion || ''}
                onChange={this.setWorkRegion}
                feil={error.workRegion ? { feilmelding: t(error.workRegion) } : null}
              />
            </div>
          </Nav.Row> : null}
          {_period.type === 'child' ? <Nav.Row>
            <div className='col-md-12'>
              <h3 className='mt-4 mb-4 typo-undertittel'>{t('pinfo:stayAbroad-child-title')}</h3>
            </div>
            <div className='col-md-4'>
              <Nav.Input label={t('pinfo:stayAbroad-child-firstname')} value={_period.childFirstName || ''}
                onChange={this.setChildFirstName}
                feil={error.childFirstName ? { feilmelding: t(error.childFirstName) } : null}
               />
            </div>
            <div className='col-md-6'>
              <Nav.Input label={t('pinfo:stayAbroad-child-lastname')} value={_period.childLastName || ''}
                onChange={this.setChildLastName}
                feil={error.childLastName ? { feilmelding: t(error.childLastName) } : null}
              />
            </div>
            <div className='col-md-4'>
              <label>{t('pinfo:stayAbroad-child-birthdate')}</label>
              <br/>
              <ReactDatePicker selected={_period.childBirthDate}
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
          </Nav.Row>  : null}
          {_period.type === 'learn' ? <Nav.Row>
            <div className='col-md-12'>
              <h3 className='mt-4 mb-4 typo-undertittel'>{t('pinfo:stayAbroad-learn-title')}</h3>
            </div>
            <div className='col-md-6'>
              <Nav.Input label={t('pinfo:stayAbroad-learn-institution')} value={_period.learnInstitution || ''}
                onChange={this.setLearnInstitution}
                feil={error.learnInstitution ? { feilmelding: t(error.learnInstitution) } : null}
              />
            </div>
          </Nav.Row> : null}
          <Nav.Row>
            <div className='col-md-12'>
              <h3 className='mt-4 mb-4 typo-undertittel'>{t('pinfo:stayAbroad-attachment-title')}</h3>
            </div>
            <div className='col-md-12'>
              <FileUpload t={t} ref={f => { this.fileUpload = f }} fileUploadDroppableId={'fileUpload'} className='fileUpload'
                files={_period.attachments || []}
                onFileChange={this.setAttachments} />
            </div>
          </Nav.Row>
          <Nav.Row>
            <div className='mt-4 mb-4 col-md-12'>
              <Nav.Knapp style={{ display: 'flex', alignItems: 'center' }} onClick={this.addPeriod.bind(this)} mini>
                {t('ui:savePeriod')}
              </Nav.Knapp>
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
