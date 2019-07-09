import React, { useState } from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import moment from 'moment'
import classNames from 'classnames'

import DatePicker from 'components/ui/DatePicker/DatePicker'
import CountrySelect from 'components/ui/CountrySelect/CountrySelect'
import * as CountryFilter from 'components/ui/CountrySelect/CountryFilter'
import FocusGroup from 'components/ui/FocusGroup'
import Flag from 'components/ui/Flag/Flag'
import FileUpload from 'components/ui/FileUpload/FileUpload'
import { AlertStripe, EtikettBase, Flatknapp, HjelpetekstAuto, Hovedknapp,
Input, Knapp, Normaltekst, Row, Textarea, Select, Undertittel, Undertekst } from 'components/ui/Nav'
import Icons from 'components/ui/Icons'
import { pinfoDateToDate } from 'utils/Date'
import { periodValidation } from './Validation/singleTests'
import { periodStep } from './Validation/stepTests'

import './Period.css'

const Period = (props) => {
  const { actions, first, last, locale, mode, period, periods, setPeriod, setPeriods, t } = props

  const [ localErrors, setLocalErrors ] = useState({})
  const [ displayError, setDisplayError ] = useState(false)

  const setType = (e) => eventSetProperty('type', periodValidation.periodType, e)
  const setStartDate = (e) => dateSetProperty('startDate', periodValidation.periodStartDateOnChange, e)
  const setEndDate = (e) => dateSetProperty('endDate', periodValidation.periodEndDateOnChange, e)
  const setCountry = (e) => valueSetProperty('country', periodValidation.periodCountry, e)
  const setInsuranceName = (e) => eventSetProperty('insuranceName', periodValidation.insuranceName, e)
  const setInsuranceType = (e) => eventSetProperty('insuranceType', periodValidation.insuranceType, e)
  const setInsuranceId = (e) => eventSetProperty('insuranceId', null, e)
  const setPlace = (e) => eventSetProperty('place', periodValidation.periodPlace, e)
  const setWorkActivity = (e) => eventSetProperty('workActivity', periodValidation.workActivity, e)
  const setWorkName = (e) => eventSetProperty('workName', periodValidation.workName, e)
  const setWorkPlace = (e) => eventSetProperty('workPlace', periodValidation.workPlace, e)
  const setLearnInstitution = (e) => eventSetProperty('learnInstitution', periodValidation.learnInstitution, e)
  const setAttachments = (e) => valueSetProperty('attachments', null, e)
  const blurStartDate = (e) => dateBlur('startDate', periodValidation.periodStartDateOnBlur, e)
  const blurEndDate = (e) => dateBlur('endDate', periodValidation.periodEndDateOnBlur, e)

  const hasNoErrors = (errors) => {
    for (var key in errors) {
      if (errors[key]) {
        return false
      }
    }
    return true
  }

  const eventSetProperty = (key, validateFunction, e) => {
    valueSetProperty(key, validateFunction, e.target.value)
  }

  const dateBlur = (key, validateFunction) => {
    const date = period[key]
    let _localErrors = _.cloneDeep(localErrors)


    let error = validateFunction ? validateFunction(date) : undefined

    if (!error && _localErrors.hasOwnProperty(key)) {
      delete _localErrors[key]
    }
    if (error) {
      _localErrors[key] = error
    }
    setLocalErrors(_localErrors)
  }

  const dateSetProperty = (key, validateFunction, date) => {
    const { startDate, endDate } = period
    let _localErrors = _.cloneDeep(localErrors)
    let error = validateFunction ? validateFunction(date) : undefined
    let timeSpanError

    if (key === 'startDate' && endDate) {
      timeSpanError = periodValidation.periodTimeSpan(date, endDate)
    }
    if (key === 'endDate' && startDate) {
      timeSpanError = periodValidation.periodTimeSpan(startDate, date)
    }

    if (!error && _localErrors.hasOwnProperty(key)) {
      delete _localErrors[key]
    }
    if (!timeSpanError && _localErrors.hasOwnProperty('timeSpan')) {
      delete _localErrors.timeSpan
    }

    if (error) {
      _localErrors[key] = error
    }
    if (timeSpanError) {
      _localErrors.timeSpan = timeSpanError
    }

    setPeriod({
      ...period,
      [key]: date
    })
    setLocalErrors(_localErrors)
  }

  const valueSetProperty = (key, validateFunction, value) => {
    let _localErrors = _.cloneDeep(localErrors)
    let error = validateFunction ? validateFunction(value) : undefined
    if (!error && _localErrors.hasOwnProperty(key)) {
      delete _localErrors[key]
    }
    if (error) {
      _localErrors[key] = error
    }

    setPeriod({
      ...period,
      [key]: value
    })
    setLocalErrors(_localErrors)
  }

  const validatePeriod = () => {
    return periodStep(period)
  }

  const addInsuranceId = (insuranceId) => {
    valueSetProperty('insuranceId', null, insuranceId)
  }

  const addInsuranceName = (insuranceName) => {
    valueSetProperty('insuranceName', null, insuranceName)
  }

  const saveNewPeriod = () => {
    let errors = validatePeriod()
    setLocalErrors(errors)
    setDisplayError(true)

    if (hasNoErrors(errors)) {
      let newPeriods = _.clone(periods)
      let newPeriod = _.clone(period)

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
      setPeriods(newPeriods)
      setPeriod({})
      setDisplayError(false)
      window.scrollTo(0, 0)
    }
  }

  const saveEditPeriod = () => {

    let errors = validatePeriod()
    setLocalErrors(errors)
    setDisplayError(true)

    if (hasNoErrors(errors)) {
      let newPeriods = _.clone(periods)
      let newPeriod = _.clone(period)
      newPeriod.id = new Date().getTime()
      let index = _.findIndex(periods, { id: period.id })
      if (index >= 0) {
        newPeriods.splice(index, 1)
        newPeriods.push(newPeriod)
        setPeriods(newPeriods)
        setPeriod({})
        setDisplayError(false)
      }
      window.scrollTo(0, 0)
    }
  }

  const doCancelPeriod = () => {

    setLocalErrors({})
    setPeriod({})
    actions.closeModal()
    window.scrollTo(0, 0)
  }

  const removePeriodRequest = (period) => {
    actions.openModal({
      modalTitle: t('buc:p4000-deletePeriod'),
      modalText: t('buc:p4000-areYouSureDeletePeriod'),
      modalButtons: [{
        main: true,
        text: t('ui:yes') + ', ' + t('ui:delete').toLowerCase(),
        onClick: () => doRemovePeriod(period)
      }, {
        text: t('ui:no') + ', ' + t('ui:cancel').toLowerCase(),
        onClick: () => actions.closeModal()
      }]
    })
  }

  const cancelPeriodRequest = () => {
    actions.openModal({
      modalTitle: t('buc:p4000-cancelPeriod'),
      modalText: t('buc:p4000-areYouSureCancelPeriod'),
      modalButtons: [{
        main: true,
        text: t('ui:yes') + ', ' + t('ui:cancel').toLowerCase(),
        onClick: () => doCancelPeriod()
      }, {
        text: t('ui:no').toLowerCase(),
        onClick: () => actions.closeModal()
      }]
    })
  }

  const doRemovePeriod = (period) => {
    let index = _.findIndex(periods, { id: period.id })
    if (index >= 0) {
      let newPeriods = _.clone(periods)
      newPeriods.splice(index, 1)
      setPeriods(newPeriods)
    }
    actions.closeModal()
  }

  const errorMessage = () => {
    if (!displayError) {
      return undefined
    }
    for (var key in localErrors) {
      if (localErrors[key]) {
        return localErrors[key]
      }
    }
    return undefined
  }

  const renderTagsForInsuranceName = () => {
    return periods.map(period => {
      return period.insuranceName
    }).filter((insuranceName, index, self) => {
      return insuranceName && period.insuranceName !== insuranceName &&
        self.indexOf(insuranceName) === index
    }).map(insuranceName => {
      return <EtikettBase
        key={insuranceName} className='mr-3 mb-2' type='fokus'
        onClick={() => addInsuranceName(insuranceName)}>
        <b>{insuranceName}</b>
      </EtikettBase>
    })
  }

  const renderTagsForInsuranceId = () => {
    return periods.map(period => {
      return period.insuranceId
    }).filter((insuranceId, index, self) => {
      return insuranceId && period.insuranceId !== insuranceId &&
      self.indexOf(insuranceId) === index
    }).map(insuranceId => {
      return <EtikettBase
        key={insuranceId} className='mr-3 mb-2' type='fokus'
        onClick={() => addInsuranceId(insuranceId)}>
        <b>{insuranceId}</b>
      </EtikettBase>
    })
  }

  const _errorMessage = errorMessage()

  switch (mode) {
    case 'view':
    case 'confirm':
      return <Row className={classNames('a-buc-c-sedp4000-period', mode)}>
        <div className={classNames('col-12', { 'col-md-6': mode === 'view' })}>
          <div id={period.id} className='existingPeriod'>
            <div className='icon mr-3 ml-3'>
              <div className={classNames('topHalf', { line: !first })} />
              <div className={classNames('bottomHalf', { line: !last })} />
              <Icons className='iconsvg' kind={'nav-' + period.type} size={32} />
            </div>
            <div className='pb-2 existingPeriodDescription'>
              <div className='d-flex'>
                <Flag label={period.country.label} country={period.country.value} size='M' />
                <span className='bold pl-2 existingPeriodType'>{t('buc:p4000-category-' + period.type)}</span>
              </div>
              <span className='existingPeriodDates'>
                <span className='bold'>{t('buc:p4000-period')}</span>{': '}
                {moment(pinfoDateToDate(period.startDate)).format('DD.MM.YYYY')}{' - '}
                {period.endDate ? moment(pinfoDateToDate(period.endDate)).format('DD.MM.YYYY') : t('ui:unknown')}
              </span>
              <br />
              <React.Fragment>
                <span className='bold'>{t('buc:p4000-place')}</span>{': '}
                {period.place}
                <br />
              </React.Fragment>
              {period.type === 'work' ? <React.Fragment>
                <span className='bold'>{t('buc:p4000-work-title')}</span>{': '}
                {period.workActivity}
                <br />
              </React.Fragment> : null }
              {period.type === 'learn' ? <React.Fragment>
                <span className='bold'>{t('buc:p4000-learn-institution')}</span>{': '}
                {period.learnInstitution}
                <br />
              </React.Fragment> : null }
              {period.attachments && !_.isEmpty(period.attachments) ? <span className='existingPeriodAttachments'>
                <span className='bold'>{t('buc:p4000-attachments')}</span>{': '}
                {period.attachments.map(att => { return att.name }).join(', ')}
              </span> : null}
            </div>
          </div>
        </div>
        {mode === 'view' ? <div className='col-md-6 col-12 existingPeriodButtons'>
          <Knapp className='mr-3 existingPeriodButton' onClick={() => setPeriod(period)}>
            {t('ui:change')}
          </Knapp>
          <Knapp className='existingPeriodButton' onClick={() => removePeriodRequest(period)}>
            <Icons className='mr-3' kind='bigclose' size={18} color='#0067C5' />
            {t('ui:remove')}
          </Knapp>
        </div> : null }
      </Row>

    case 'edit':
    case 'new':
      return <React.Fragment>
        {_errorMessage ? <AlertStripe className='mt-4 mb-4' type='advarsel'>{t(_errorMessage)}</AlertStripe> : null}
        <Undertittel className='mt-5 mb-2'>{t('buc:p4000-period-' + mode)}</Undertittel>
        <Row className={mode}>
          <div className='col-sm-8'>
            <Select
              id='pinfo-opphold-kategori-select'
              label={<div className='pinfo-label'>
                <div className='pinfo-label'>
                  <span>{t('buc:p4000-category')}</span>
                  <HjelpetekstAuto id='p4000-category-select-help'>
                    {t('buc:p4000-category-help')}
                  </HjelpetekstAuto>
                </div>
              </div>}
              value={period.type || ''}
              onChange={setType}>
              <option value=''>{t('ui:choose')}</option>
              <option value='work'>{t('buc:p4000-category-work')}</option>
              <option value='home'>{t('buc:p4000-category-home')}</option>
              <option value='military'>{t('buc:p4000-category-military')}</option>
              <option value='learn'>{t('buc:p4000-category-learn')}</option>
            </Select>
          </div>
        </Row>
        { period.type ? <React.Fragment>
          {period.type === 'home' ? <AlertStripe className='mt-4 mb-4' type='advarsel'>{t('buc:p4000-warning-home-period')}</AlertStripe> : null}
          <Undertittel className='mt-5 mb-2'>{t(`buc:p4000-period-title-${period.type}`)}</Undertittel>
          <Normaltekst className='mb-3'>{t('buc:p4000-period-date-description')}</Normaltekst>
          <Row>
            <div className='col-sm-6 col-12 mb-2'>
              <label className='datepickerLabel skjemaelement__label'>{t('buc:p4000-period-start-date')}</label>
              {<FocusGroup onBlur={blurStartDate}>
                <DatePicker
                  id='pinfo-opphold-startdato-date'
                  labels={{ day: t('buc:p4000-period-day'), month: t('buc:p4000-period-month'), year: t('buc:p4000-period-year') }}
                  ids={{ day: 'pinfo-opphold-startdato-day', month: 'pinfo-opphold-startdato-month', year: 'pinfo-opphold-startdato-year' }}
                  placeholders={{ day: t('buc:p4000-period-placeholder-day'), month: t('buc:p4000-period-placeholder-month'), year: t('buc:p4000-period-placeholder-year') }}
                  className='startDate pr-2'
                  values={period.startDate}
                  onChange={setStartDate}
                  feil={localErrors.startDate || localErrors.timeSpan ? { feilmelding: t(localErrors.startDate || localErrors.timeSpan) } : undefined}
                />
              </FocusGroup>}
            </div>
            <div className='col-sm-6 col-12 mb-2'>
              <label className='datepickerLabel skjemaelement__label'>{t('buc:p4000-period-end-date')}</label>
              {<FocusGroup onBlur={blurEndDate}>
                <DatePicker
                  labels={{ day: t('buc:p4000-period-day'), month: t('buc:p4000-period-month'), year: t('buc:p4000-period-year') }}
                  ids={{ day: 'pinfo-opphold-sluttdato-day', month: 'pinfo-opphold-sluttdato-month', year: 'pinfo-opphold-sluttdato-year' }}
                  placeholders={{ day: t('buc:p4000-period-placeholder-day'), month: t('buc:p4000-period-placeholder-month'), year: t('buc:p4000-period-placeholder-year') }}
                  className='endDate pr-2'
                  values={period.endDate}
                  onChange={setEndDate}
                  feil={localErrors.endDate || localErrors.timeSpan ? { feilmelding: t(localErrors.endDate || localErrors.timeSpan) } : undefined}
                />
              </FocusGroup>}
            </div>
          </Row>
          <Row>
            <div className='col-sm-8 mb-2'>
              <label className='skjemaelement__label'>
                <div className='pinfo-label'>{t('buc:p4000-country')}</div>
              </label>
              <CountrySelect
                id='pinfo-opphold-land'
                locale={locale}
                includeList={CountryFilter.EEA}
                value={period.country || null}
                onSelect={setCountry}
                error={localErrors.country}
                errorMessage={t(localErrors.country)}
              />
            </div>
          </Row>
          {period.type === 'work' ? <Row>
            <div className='col-sm-12'>
              <Textarea
                id='pinfo-opphold-arbeidgiverssted-textarea'
                label={<div className='pinfo-label'>
                  <div className='pinfo-label'>
                    <span>{t('buc:p4000-work-place')}</span>
                    <HjelpetekstAuto id='p4000-work-place-help'>
                      <span>{t('buc:p4000-work-place-help')}</span>
                    </HjelpetekstAuto>
                  </div>
                  <span className='optional'>{t('ui:optional')}</span>
                </div>}
                placeholder={t('ui:writeIn')}
                value={period.workPlace || ''}
                style={{ minHeight: '100px' }}
                maxLength={100}
                onChange={setWorkPlace}
                feil={localErrors.workPlace ? { feilmelding: t(localErrors.workPlace) } : null}
              />
            </div>
            <div className='col-sm-12'>
              <Input
                id='pinfo-opphold-yrkesaktivitet-input'
                label={<div className='pinfo-label'>
                  <div className='pinfo-label'>
                    <span>{t('buc:p4000-work-activity')}</span>
                    <HjelpetekstAuto id='p4000-work-activity-help'>
                      <span>{t('buc:p4000-work-activity-help')}</span>
                    </HjelpetekstAuto>
                  </div>
                </div>}
                placeholder={t('ui:writeIn')}
                value={period.workActivity || ''}
                onChange={setWorkActivity}
                feil={localErrors.workActivity ? { feilmelding: t(localErrors.workActivity) } : null}
              />
            </div>
            <div className='col-sm-12'>
              <Input
                id='pinfo-opphold-arbeidgiversnavn-input'
                label={<div className='pinfo-label'>
                  <span>{t('buc:p4000-work-name')}</span>
                  <span className='optional'>{t('ui:optional')}</span>
                </div>}
                placeholder={t('ui:writeIn')}
                value={period.workName || ''}
                onChange={setWorkName}
                feil={localErrors.workName ? { feilmelding: t(localErrors.workName) } : null}
              />
            </div>
          </Row> : null}
          {period.type === 'learn' ? <Row>
            <div className='col-sm-12'>
              <Input
                id='pinfo-opphold-opplaeringsinstitusjonsnavn-input'
                label={<div className='pinfo-label'>
                  <div className='pinfo-label'>
                    <span>{t('buc:p4000-learn-institution')}</span>
                    <HjelpetekstAuto id='p4000-learn-institution-help'>
                      <span>{t('buc:p4000-learn-institution-help')}</span>
                    </HjelpetekstAuto>
                  </div>
                </div>}
                value={period.learnInstitution || ''}
                placeholder={t('ui:writeIn')}
                onChange={setLearnInstitution}
                  feil={localErrors.learnInstitution ? { feilmelding: t(localErrors.learnInstitution) } : null}
              />
            </div>
          </Row> : null}
          {period.type !== 'home' ? <Row>
            <div className='col-sm-12'>
              <Undertittel className='mt-5 mb-2'>{t('buc:p4000-home-title')}</Undertittel>
            </div>
            <div className='col-sm-12'>
              <Textarea
                id='pinfo-opphold-bosted-place-textarea'
                label={<div className='pinfo-label'>
                  <span>{t('buc:p4000-place-and-country')}</span>
                </div>}
                placeholder={t('ui:writeIn')}
                value={period.place || ''}
                style={{ minHeight: '100px' }}
                maxLength={100}
                onChange={setPlace}
                feil={localErrors.place ? { feilmelding: t(localErrors.place) } : null}
              />
            </div>
          </Row> : <Row>
            <div className='col-sm-12'>
              <Textarea
                id='pinfo-opphold-bosted-place-textarea'
                label={t('buc:p4000-place')}
                placeholder={t('ui:writeIn')}
                value={period.place || ''}
                style={{ minHeight: '100px' }}
                maxLength={100}
                onChange={setPlace}
                feil={localErrors.place ? { feilmelding: t(localErrors.place) } : null}
              />
            </div>
          </Row>}
          <Undertittel className='mt-5 mb-2'>{t('buc:p4000-insurance-title')}</Undertittel>
          <Row>
            <div className='col-sm-12'>
              <Input
                id='pinfo-opphold-trygdeordning-navn'
                label={<div className='pinfo-label'>
                  <div className='pinfo-label'>
                    <span>{t('buc:p4000-insurance-name')}</span>
                    <HjelpetekstAuto id='p4000-insurance-name-help'>
                      {t('buc:p4000-insurance-name-help')}
                    </HjelpetekstAuto>
                  </div>
                  <span className='optional'>{t('ui:optional')}</span>
                </div>}
                placeholder={t('ui:writeIn')}
                value={period.insuranceName || ''}
                onChange={setInsuranceName}
                feil={localErrors.insuranceName ? { feilmelding: t(localErrors.insuranceName) } : null}
              />
              <div className='id-suggestions'>
                {renderTagsForInsuranceName()}
              </div>
            </div>
            <div className='col-sm-12'>
              <Input
                id='pinfo-opphold-trygdeordning-id'
                label={<div className='pinfo-label'>
                  <div className='pinfo-label'>
                    <span>{t('buc:p4000-insurance-id')}</span>
                    <HjelpetekstAuto id='p4000-insurance-id-help'>
                      {t('buc:p4000-insurance-id-help')}
                    </HjelpetekstAuto>
                  </div>
                  <span className='optional'>{t('ui:optional')}</span>
                </div>}
                placeholder={t('ui:writeIn')}
                value={period.insuranceId || ''}
               onChange={setInsuranceId}
                feil={localErrors.insuranceId ? { feilmelding: t(localErrors.insuranceId) } : null}
              />
              <div className='id-suggestions'>
                {renderTagsForInsuranceId()}
              </div>
            </div>
            <div className='col-sm-12'>
              <Select
                id='pinfo-opphold-trygdeordning-type'
                label={<div className='pinfo-label'>
                  <div className='pinfo-label'>
                    <span>{t('buc:p4000-insurance-type')}</span>
                    <HjelpetekstAuto id='p4000-insurance-type-help'>
                      {t('buc:p4000-insurance-type-help')}
                    </HjelpetekstAuto>
                  </div>
                  <span className='optional'>{t('ui:optional')}</span>
                </div>}
                value={period.insuranceType || ''}
                onChange={setInsuranceType}
                feil={localErrors.insuranceType ? { feilmelding: t(localErrors.insuranceType) } : null}>
                <option value=''>{t('ui:choose')}</option>
                <option value={t('buc:p4000-insurance-type-01')}>{t('buc:p4000-insurance-type-01')}</option>
                <option value={t('buc:p4000-insurance-type-02')}>{t('buc:p4000-insurance-type-02')}</option>
                <option value={t('buc:p4000-insurance-type-03')}>{t('buc:p4000-insurance-type-03')}</option>
                <option value={t('buc:p4000-insurance-type-04')}>{t('buc:p4000-insurance-type-04')}</option>
              </Select>
            </div>
          </Row>
          <Row>
            <div className='col-sm-12'>
              <Undertittel className='mt-5 mb-2'>{t('buc:p4000-attachment-title')}</Undertittel>
              <Undertekst>{t('buc:p4000-attachment-title-help')}</Undertekst>
              <span className='optional mb-1'>{t('ui:optional')}</span>
            </div>
            <div className='col-sm-12'>
              <FileUpload
                id={'pinfo-opphold-vedlegg-fileupload-' + period.id}
                fileUploadDroppableId={'pinfo-opphold-vedlegg-fileupload-' + period.id}
                acceptedMimetypes={['application/pdf', 'image/jpeg', 'image/png']}
                maxFileSize={10 * 1024 * 1024}
                maxFiles={10}
                t={t}
                files={period.attachments || []}
                onFileChange={() => setAttachments(period)} />
            </div>
          </Row>
          <Row>
            <div className='mt-4 mb-4 col-sm-12'>
              {mode === 'edit' ? <Knapp
                id='pinfo-opphold-endre-button'
                className='editPeriodButton mb-2 mr-4 w-sm-100'
                onClick={saveEditPeriod}>
                {t('buc:p4000-saveEditPeriod')}
              </Knapp> : null}
              {mode === 'new' ? <Hovedknapp
                id='pinfo-opphold-lagre-button'
                className='addPeriodButton mb-2 mr-4 w-sm-100'
                onClick={saveNewPeriod}>
                {t('buc:p4000-saveNewPeriod')}
              </Hovedknapp> : null}
              <Flatknapp
                id='pinfo-opphold-avbryt-button'
                className='cancelPeriodButton mb-2 w-sm-100'
                onClick={cancelPeriodRequest}>
                {t('buc:p4000-cancelPeriod')}
              </Flatknapp>
            </div>
          </Row>
        </React.Fragment> : null}
        { !period.type && _.isEmpty(periods) ? <AlertStripe
          className='mt-4 mb-4' type='advarsel'>
          {t('buc:p4000-warning-one-period')}
        </AlertStripe>
          : null}
        {_errorMessage ? <AlertStripe className='mt-4 mb-4' type='advarsel'>{t(_errorMessage)}</AlertStripe> : null}
      </React.Fragment>
    default:
      return null
  }
}

Period.propTypes = {
  period: PT.object,
  periods: PT.array,
  actions: PT.object.isRequired,
  t: PT.func
}

export default Period
