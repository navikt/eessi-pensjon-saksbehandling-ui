import React, { useState } from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import moment from 'moment'
import classNames from 'classnames'

import DatePicker from 'components/DatePicker/DatePicker'
import CountrySelect from 'components/CountrySelect/CountrySelect'
import * as CountryFilter from 'components/CountrySelect/CountryFilter'
import FocusGroup from 'components/FocusGroup/FocusGroup'
import Flag from 'components/Flag/Flag'
import FileUpload from 'components/FileUpload/FileUpload'
import { AlertStripe, Checkbox, Flatknapp, HjelpetekstAuto, Hovedknapp, Input,
  Knapp, Normaltekst, Row, Textarea, Select, Undertittel, Undertekst, UndertekstBold } from 'components/Nav'
import Icons from 'components/Icons'
import { pinfoDateToDate } from 'utils/Date'
import { periodValidation } from './Validation/singleTests'
import { periodStep } from './Validation/stepTests'

import './Period.css'

const Period = (props) => {
  const { actions, first, last, locale, mode, period, periods, setPeriod, setPeriods, t } = props
  const [localErrors, setLocalErrors] = useState({})
  const [displayError, setDisplayError] = useState(false)

  const setType = (e) => eventSetProperty('type', periodValidation.periodType, e)
  const setStartDate = (e) => dateSetProperty('startDate', periodValidation.periodStartDateOnChange, e)
  const setEndDate = (e) => dateSetProperty('endDate', periodValidation.periodEndDateOnChange, e)
  const setCountry = (e) => valueSetProperty('country', periodValidation.periodCountry, e)
  const setPlace = (e) => eventSetProperty('place', periodValidation.periodPlace, e)
  const setComment = (e) => eventSetProperty('comment', null, e)
  const setWorkActivity = (e) => eventSetProperty('workActivity', periodValidation.workActivity, e)
  const setWorkName = (e) => eventSetProperty('workName', periodValidation.workName, e)
  const setWorkPlace = (e) => eventSetProperty('workPlace', periodValidation.workPlace, e)
  const setChildFirstName = (e) => eventSetProperty('childFirstName', periodValidation.childFirstName, e)
  const setChildLastName = (e) => eventSetProperty('childLastName', periodValidation.childLastName, e)
  const setChildBirthDate = (e) => dateSetProperty('childBirthDate', periodValidation.childBirthDateOnChange, e)
  const setLearnInstitution = (e) => eventSetProperty('learnInstitution', periodValidation.learnInstitution, e)
  const setOtherType = (e) => eventSetProperty('otherType', periodValidation.otherType, e)
  const setPayingInstitution = (e) => eventSetProperty('payingInstitution', periodValidation.payingInstitution, e)
  const setAttachments = (e) => valueSetProperty('attachments', null, e)
  const blurStartDate = (e) => dateBlur('startDate', periodValidation.periodStartDateOnBlur, e)
  const blurEndDate = (e) => dateBlur('endDate', periodValidation.periodEndDateOnBlur, e)
  const blurChildBirthDate = (e) => dateBlur('childBirthDate', periodValidation.periodChildBirthDateOnBlur, e)
  const setUncertainDate = (e) => eventSetCheckbox('uncertainDate', null, e)

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

  const eventSetCheckbox = (key, validateFunction, e) => {
    valueSetProperty(key, validateFunction, !!e)
  }

  const dateBlur = (key, validateFunction) => {
    const date = period[key]
    const _localErrors = _.cloneDeep(localErrors)

    const error = validateFunction ? validateFunction(date) : undefined

    if (!error && Object.prototype.hasOwnProperty.call(_localErrors, key)) {
      delete _localErrors[key]
    }
    if (error) {
      _localErrors[key] = error
    }
    setLocalErrors(_localErrors)
  }

  const dateSetProperty = (key, validateFunction, date) => {
    const { startDate, endDate } = period
    const _localErrors = _.cloneDeep(localErrors)
    const error = validateFunction ? validateFunction(date) : undefined
    let timeSpanError

    if (key === 'startDate' && endDate) {
      timeSpanError = periodValidation.periodTimeSpan(date, endDate)
    }
    if (key === 'endDate' && startDate) {
      timeSpanError = periodValidation.periodTimeSpan(startDate, date)
    }

    if (!error && Object.prototype.hasOwnProperty.call(_localErrors, key)) {
      delete _localErrors[key]
    }
    if (!timeSpanError && Object.prototype.hasOwnProperty.call(_localErrors, 'timeSpan')) {
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
    const _localErrors = _.cloneDeep(localErrors)
    const error = validateFunction ? validateFunction(value) : undefined
    if (!error && Object.prototype.hasOwnProperty.call(_localErrors, key)) {
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

  const saveNewPeriod = () => {
    const errors = validatePeriod()
    setLocalErrors(errors)
    setDisplayError(true)

    if (hasNoErrors(errors)) {
      const newPeriods = _.clone(periods)
      const newPeriod = _.clone(period)

      // remove properties that do not belong to this type
      if (newPeriod.type !== 'work') {
        delete newPeriod.workActivity
        delete newPeriod.workName
        delete newPeriod.workPlace
      }
      if (newPeriod.type !== 'learn') {
        delete newPeriod.learnInstitution
      }
      if (newPeriod.type !== 'sick' && newPeriod.type !== 'daily') {
        delete newPeriod.payingInstitution
      }
      if (newPeriod.type !== 'other') {
        delete newPeriod.otherType
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
    const errors = validatePeriod()
    setLocalErrors(errors)
    setDisplayError(true)

    if (hasNoErrors(errors)) {
      const newPeriods = _.clone(periods)
      const newPeriod = _.clone(period)
      newPeriod.id = new Date().getTime()
      const index = _.findIndex(periods, { id: period.id })
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
    const index = _.findIndex(periods, { id: period.id })
    if (index >= 0) {
      const newPeriods = _.clone(periods)
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
              <div className='existingPeriodType d-flex align-items-center'>
                <UndertekstBold className='pr-2'>
                  {t('buc:p4000-category-' + period.type)}
                </UndertekstBold>
                <Flag label={period.country.label} country={period.country.value} size='M' />
                <Normaltekst className='pl-2'>{period.country.label}</Normaltekst>
              </div>
              <div className='existingPeriodDates d-flex align-items-center'>
                <UndertekstBold className='mr-2'>{t('buc:p4000-period') + ': '}</UndertekstBold>
                <Normaltekst>
                  {moment(pinfoDateToDate(period.startDate)).format('DD.MM.YYYY')}{' - '}
                  {period.endDate ? moment(pinfoDateToDate(period.endDate)).format('DD.MM.YYYY') : t('ui:unknown')}
                </Normaltekst>
              </div>
              {period.type === 'work'
                ? <div className='existingPeriodWorkActivity d-flex align-items-center'>
                  <UndertekstBold className='mr-2'>{t('buc:p4000-work-title') + ': '}</UndertekstBold>
                  <Normaltekst>{period.workActivity}</Normaltekst>
                </div> : null }
              {period.type === 'work' || period.type === 'home'
                ? <div className='existingPeriodPlace d-flex align-items-center'>
                  <UndertekstBold className='mr-2'>{t('buc:p4000-place') + ': '}</UndertekstBold>
                  <Normaltekst>{period.workPlace || period.place}</Normaltekst>
                </div> : null }
              {period.type === 'learn'
                ? <div className='existingPeriodLearnInstitution d-flex align-items-center'>
                  <UndertekstBold className='mr-2'>{t('buc:p4000-learn-institution') + ': '}</UndertekstBold>
                  <Normaltekst>{period.learnInstitution}</Normaltekst>
                </div> : null }
              {period.type === 'child'
                ? <div className='existingPeriodChildName d-flex align-items-center'>
                  <UndertekstBold className='mr-2'>{t('buc:p4000-childname') + ': '}</UndertekstBold>
                  <Normaltekst>{period.childLastName}{', '}{period.childFirstName}</Normaltekst>
                </div> : null }
              {period.type === 'daily' || period.type === 'sick'
                ? <div className='existingPeriodPayingInstitution d-flex align-items-center'>
                  <UndertekstBold className='mr-2'>{t('buc:p4000-paying-institution') + ': '}</UndertekstBold>
                  <Normaltekst>{period.payingInstitution}</Normaltekst>
                </div> : null }
              {period.type === 'other'
                ? <div className='existingPeriodOtherType d-flex align-items-center'>
                  <UndertekstBold className='mr-2'>{t('buc:p4000-label-other') + ': '}</UndertekstBold>
                  <Normaltekst>{period.otherType}</Normaltekst>
                </div> : null }
              {period.attachments && !_.isEmpty(period.attachments)
                ? <div className='existingPeriodAttachments align-items-center'>
                  <UndertekstBold className='mr-2'>{t('buc:p4000-attachments') + ': '}</UndertekstBold>
                  <Normaltekst>{period.attachments.map(att => att.name).join(', ')}</Normaltekst>
                </div> : null}
            </div>
          </div>
        </div>
        {mode === 'view' ? <div className='col-md-6 col-12 existingPeriodButtons'>
          <Knapp className='mr-3 existingPeriodButton change' onClick={() => setPeriod(period)}>
            {t('ui:change')}
          </Knapp>
          <Knapp className='existingPeriodButton remove' onClick={() => removePeriodRequest(period)}>
            <Icons className='mr-3' kind='bigclose' size={18} color='#0067C5' />
            {t('ui:remove')}
          </Knapp>
        </div> : null }
      </Row>

    case 'edit':
    case 'new':
      return <div className={classNames('a-buc-c-sedp4000-period', mode)}>
        {_errorMessage ? <AlertStripe
          className='a-buc-c-sedp4000-period__alert mt-4 mb-4'
          type='advarsel'>
          {t(_errorMessage)}
        </AlertStripe> : null}
        <Undertittel className='a-buc-c-sedp4000-period__title mt-5 mb-2'>{t('buc:p4000-period-' + mode)}</Undertittel>
        <Row className={mode}>
          <div className='col-sm-8'>
            <Select
              id='a-buc-c-sedp4000-period__kategori-select'
              label={<div className='a-buc-c-sedp4000-period__label'>
                <span>{t('buc:p4000-category')}</span>
                <HjelpetekstAuto id='p4000-category-select-help'>
                  {t('buc:p4000-category-help')}
                </HjelpetekstAuto>
              </div>}
              value={period.type || ''}
              onChange={setType}>
              <option value=''>{t('ui:choose')}</option>
              <option value='work'>{t('buc:p4000-category-work')}</option>
              <option value='home'>{t('buc:p4000-category-home')}</option>
              <option value='military'>{t('buc:p4000-category-military')}</option>
              <option value='learn'>{t('buc:p4000-category-learn')}</option>
              <option value='child'>{t('buc:p4000-category-child')}</option>
              <option value='voluntary'>{t('buc:p4000-category-voluntary')}</option>
              <option value='birth'>{t('buc:p4000-category-birth')}</option>
              <option value='daily'>{t('buc:p4000-category-daily')}</option>
              <option value='sick'>{t('buc:p4000-category-sick')}</option>
              <option value='other'>{t('buc:p4000-category-other')}</option>
            </Select>
          </div>
        </Row>
        { period.type ? <React.Fragment>
          {period.type === 'home'
            ? <AlertStripe
              className='a-buc-c-sedp4000-period__alert_home mt-4 mb-4'
              type='advarsel'>
              {t('buc:p4000-warning-home-period')}
            </AlertStripe>
            : null }
          <Undertittel className='a-buc-c-sedp4000-period__subtitle mt-5 mb-2'>
            {t(`buc:p4000-period-title-${period.type}`)}
          </Undertittel>
          <Normaltekst className='a-buc-c-sedp4000-period__description mb-3'>
            {t('buc:p4000-period-date-description')}
          </Normaltekst>
          <Row>
            <div className='a-buc-c-sedp4000-period__startDate col-sm-6 col-12 mb-2'>
              <label className='datepickerLabel skjemaelement__label'>
                {t('buc:p4000-period-start-date')}
              </label>
              {<FocusGroup onBlur={blurStartDate}>
                <DatePicker
                  id='a-buc-c-sedp4000-period__startdato-date'
                  labels={{ day: t('buc:p4000-period-day'), month: t('buc:p4000-period-month'), year: t('buc:p4000-period-year') }}
                  ids={{ day: 'a-buc-c-sedp4000-period__startdato-day', month: 'a-buc-c-sedp4000-period__startdato-month', year: 'a-buc-c-sedp4000-period__startdato-year' }}
                  placeholders={{ day: t('buc:p4000-period-placeholder-day'), month: t('buc:p4000-period-placeholder-month'), year: t('buc:p4000-period-placeholder-year') }}
                  className='startDate pr-2'
                  values={period.startDate}
                  onChange={setStartDate}
                  feil={localErrors.startDate || localErrors.timeSpan ? { feilmelding: t(localErrors.startDate || localErrors.timeSpan) } : undefined}
                />
              </FocusGroup>}
            </div>
            <div className='a-buc-c-sedp4000-period__endDate col-sm-6 col-12 mb-2'>
              <label className='datepickerLabel skjemaelement__label'>
                {t('buc:p4000-period-end-date')}
              </label>
              {<FocusGroup onBlur={blurEndDate}>
                <DatePicker
                  labels={{ day: t('buc:p4000-period-day'), month: t('buc:p4000-period-month'), year: t('buc:p4000-period-year') }}
                  ids={{ day: 'a-buc-c-sedp4000-period__sluttdato-day', month: 'a-buc-c-sedp4000-period__sluttdato-month', year: 'a-buc-c-sedp4000-period__sluttdato-year' }}
                  placeholders={{ day: t('buc:p4000-period-placeholder-day'), month: t('buc:p4000-period-placeholder-month'), year: t('buc:p4000-period-placeholder-year') }}
                  className='endDate pr-2'
                  values={period.endDate}
                  onChange={setEndDate}
                  feil={localErrors.endDate || localErrors.timeSpan ? { feilmelding: t(localErrors.endDate || localErrors.timeSpan) } : undefined}
                />
              </FocusGroup>}
            </div>
            <div className='a-buc-c-sedp4000-period__uncertainDate col-sm-6 col-12 mb-2'>
              <Checkbox
                id='a-buc-c-sedp4000-period__uncertainDate-checkbox-id'
                className='a-buc-c-sedp4000-period__uncertainDate-checkbox'
                label={t('buc:p4000-uncertain-date')}
                checked={period.uncertainDate}
                onChange={setUncertainDate} />
            </div>
          </Row>
          <Row>
            <div className='col-sm-8 mb-2'>
              <label className='skjemaelement__label'>
                <div className='a-buc-c-sedp4000-period__label'>
                  {t('buc:p4000-country')}
                </div>
              </label>
              <CountrySelect
                id='a-buc-c-sedp4000-period__land-select-id'
                className='a-buc-c-sedp4000-period__land-select'
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
                id='a-buc-c-sedp4000-period__arbeidgiverssted-textarea-id'
                className='a-buc-c-sedp4000-period__arbeidgiverssted-textarea skjemaelement__input'
                label={<div className='a-buc-c-sedp4000-period__label'>
                  <div className='a-buc-c-sedp4000-period__label'>
                    <UndertekstBold>{t('buc:p4000-work-place')}</UndertekstBold>
                    <HjelpetekstAuto id='p4000-work-place-help'>
                      {t('buc:p4000-work-place-help')}
                    </HjelpetekstAuto>
                  </div>
                  <Normaltekst className='optional'>{t('ui:optional')}</Normaltekst>
                </div>}
                placeholder={t('ui:writeIn')}
                value={period.workPlace || ''}
                maxLength={100}
                onChange={setWorkPlace}
                feil={localErrors.workPlace ? { feilmelding: t(localErrors.workPlace) } : null}
              />
            </div>
            <div className='col-sm-12'>
              <Input
                id='a-buc-c-sedp4000-period__yrkesaktivitet-input-id'
                className='a-buc-c-sedp4000-period__yrkesaktivitet-input'
                label={<div className='a-buc-c-sedp4000-period__label'>
                  <div className='a-buc-c-sedp4000-period__label'>
                    <UndertekstBold>{t('buc:p4000-work-activity')}</UndertekstBold>
                    <HjelpetekstAuto id='p4000-work-activity-help'>
                      {t('buc:p4000-work-activity-help')}
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
                id='a-buc-c-sedp4000-period__arbeidgiversnavn-input-id'
                className='a-buc-c-sedp4000-period__arbeidgiversnavn-input'
                label={<div className='a-buc-c-sedp4000-period__label'>
                  <UndertekstBold>{t('buc:p4000-work-name')}</UndertekstBold>
                  <Normaltekst className='optional'>{t('ui:optional')}</Normaltekst>
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
                id='a-buc-c-sedp4000-period__opplaeringsinstitusjonsnavn-input-id'
                className='a-buc-c-sedp4000-period__opplaeringsinstitusjonsnavn-input'
                label={<div className='a-buc-c-sedp4000-period__label'>
                  <div className='a-buc-c-sedp4000-period__label'>
                    <UndertekstBold>{t('buc:p4000-learn-institution')}</UndertekstBold>
                    <HjelpetekstAuto id='p4000-learn-institution-help'>
                      {t('buc:p4000-learn-institution-help')}
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
          {period.type === 'other'
            ? <Row>
              <div className='col-sm-12'>
                <Input
                  id='a-buc-c-sedp4000-period__andre-input-id'
                  className='a-buc-c-sedp4000-period__andre-input mt-2'
                  label={<div className='pinfo-label'>
                    <div className='pinfo-label'>
                      <UndertekstBold>{t('buc:p4000-category-other')}</UndertekstBold>
                    </div>
                  </div>}
                  value={period.otherType || ''}
                  placeholder={t('ui:writeIn')}
                  onChange={setOtherType}
                  feil={localErrors.otherType ? { feilmelding: t(localErrors.otherType) } : null}
                />
              </div>
            </Row> : null}
          {period.type === 'daily' || period.type === 'sick'
            ? <Row>
              <div className='col-sm-12'>
                <Input
                  id='a-buc-c-sedp4000-period__betalende-institusjon-input-id'
                  className='a-buc-c-sedp4000-period__betalende-institusjon-input mt-2'
                  label={<div className='pinfo-label'>
                    <div className='pinfo-label'>
                      <UndertekstBold>{t('buc:p4000-paying-institution-name')}</UndertekstBold>
                    </div>
                  </div>}
                  value={period.payingInstitution || ''}
                  placeholder={t('ui:writeIn')}
                  onChange={setPayingInstitution}
                  feil={localErrors.payingInstitution ? { feilmelding: t(localErrors.payingInstitution) } : null}
                />
              </div>
            </Row> : null}
          {period.type === 'child'
            ? <Row>
              <div className='col-sm-12'>
                <Undertittel className='mt-5 mb-2'>
                  {t('buc:p4000-title-child-info')}
                </Undertittel>
                <Input
                  id='a-buc-c-sedp4000-period__omsorgforbarn-etternavn-input-id'
                  className='a-buc-c-sedp4000-period__omsorgforbarn-etternavn-input'
                  label={<div className='pinfo-label'>
                    <div className='pinfo-label'>
                      <UndertekstBold>{t('buc:p4000-label-lastname')}</UndertekstBold>
                    </div>
                  </div>}
                  value={period.childLastName || ''}
                  placeholder={t('ui:writeIn')}
                  onChange={setChildLastName}
                  feil={localErrors.childLastName ? { feilmelding: t(localErrors.childLastName) } : null}
                />
              </div>
              <div className='col-sm-12'>
                <Input
                  id='a-buc-c-sedp4000-period__omsorgforbarn-fornavn-input-id'
                  className='a-buc-c-sedp4000-period__omsorgforbarn-fornavn-input'
                  label={<div className='pinfo-label'>
                    <div className='pinfo-label'>
                      <UndertekstBold>{t('buc:p4000-label-firstname')}</UndertekstBold>
                    </div>
                  </div>}
                  value={period.childFirstName || ''}
                  placeholder={t('ui:writeIn')}
                  onChange={setChildFirstName}
                  feil={localErrors.childFirstName ? { feilmelding: t(localErrors.childFirstName) } : null}
                />
              </div>
              <div className='col-sm-6 col-12 mb-2'>
                <label className='datepickerLabel skjemaelement__label'>
                  {t('buc:p4000-label-birthdate')}
                </label>
                <FocusGroup onBlur={blurChildBirthDate}>
                  <DatePicker
                    id='a-buc-c-sedp4000-period__omsorgforbarn-fodelsdato-date-id'
                    className='a-buc-c-sedp4000-period__omsorgforbarn-fodelsdato-dat pr-2'
                    labels={{ day: t('buc:p4000-period-day'), month: t('buc:p4000-period-month'), year: t('buc:p4000-period-year') }}
                    ids={{ day: 'pinfo-opphold-fodelsdato-day', month: 'pinfo-opphold-fodelsdato-month', year: 'pinfo-opphold-fodelsdato-year' }}
                    placeholders={{ day: t('buc:p4000-period-placeholder-day'), month: t('buc:p4000-period-placeholder-month'), year: t('buc:p4000-period-placeholder-year') }}

                    values={period.childBirthDate}
                    onChange={setChildBirthDate}
                    feil={localErrors.childBirthDate || localErrors.timeSpan ? { feilmelding: t(localErrors.childBirthDate || localErrors.timeSpan) } : undefined}
                  />
                </FocusGroup>
              </div>
            </Row> : null}
          {period.type === 'home' || period.type === 'work'
            ? <Row>
              <div className='col-sm-12'>
                <Textarea
                  id='a-buc-c-sedp4000-period__bosted-place-textarea-id'
                  className='a-buc-c-sedp4000-period__bosted-place-textarea skjemaelement__input'
                  label={t('buc:p4000-place')}
                  placeholder={t('ui:writeIn')}
                  value={period.place || ''}
                  maxLength={100}
                  onChange={setPlace}
                  feil={localErrors.place ? { feilmelding: t(localErrors.place) } : null}
                />
              </div>
            </Row> : null}
          <Row>
            <div className='col-sm-12'>
              <Undertittel className='mt-5 mb-2'>{t('buc:p4000-comment')}</Undertittel>
              <Textarea
                id='a-buc-c-sedp4000-period__comment-id'
                className='a-buc-c-sedp4000-period__comment skjemaelement__input'
                label={<div className='a-buc-c-sedp4000-period__label'>
                  <div className='a-buc-c-sedp4000-period__label'>
                    <UndertekstBold>{t('buc:p4000-comment')}</UndertekstBold>
                    <HjelpetekstAuto id='a-buc-c-sedp4000-period__comment-help'>
                      {t('buc:p4000-comment-help')}
                    </HjelpetekstAuto>
                  </div>
                  <Normaltekst className='optional'>{t('ui:optional')}</Normaltekst>
                </div>}
                placeholder={t('ui:writeIn')}
                value={period.comment || ''}
                onChange={setComment}
                maxLength={2300}
              />
            </div>
          </Row>
          <Row>
            <div className='col-sm-12'>
              <Undertittel className='mt-5 mb-2'>
                {t('buc:p4000-attachment-title')}
              </Undertittel>
              <Undertekst>
                {t('buc:p4000-attachment-title-help')}
              </Undertekst>
              <Normaltekst className='optional mb-1'>{t('ui:optional')}</Normaltekst>
            </div>
            <div className='col-sm-12'>
              <FileUpload
                id='a-buc-c-sedp4000-period__vedlegg-fileupload-id'
                className='a-buc-c-sedp4000-period__vedlegg-fileupload'
                acceptedMimetypes={['application/pdf', 'image/jpeg', 'image/png']}
                maxFileSize={10 * 1024 * 1024}
                maxFiles={10}
                t={t}
                files={period.attachments || []}
                onFileChange={(newFiles) => setAttachments(newFiles)}
                openModal={actions.openModal}
                closeModal={actions.closeModal} />
            </div>
          </Row>
          <Row>
            <div className='mt-4 mb-4 col-sm-12'>
              {mode === 'edit' ? <Knapp
                id='a-buc-c-sedp4000-period__edit-button-id'
                className='a-buc-c-sedp4000-period__edit-button mb-2 mr-4 w-sm-100'
                onClick={saveEditPeriod}>
                {t('buc:p4000-saveEditPeriod')}
              </Knapp> : null}
              {mode === 'new' ? <Hovedknapp
                id='a-buc-c-sedp4000-period__save-button-id'
                className='a-buc-c-sedp4000-period__save-button mb-2 mr-4 w-sm-100'
                onClick={saveNewPeriod}>
                {t('buc:p4000-saveNewPeriod')}
              </Hovedknapp> : null}
              <Flatknapp
                id='a-buc-c-sedp4000-period__cancel-button-id'
                className='a-buc-c-sedp4000-period__cancel-button mb-2 w-sm-100'
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
      </div>
    default:
      return null
  }
}

Period.propTypes = {
  actions: PT.object.isRequired,
  first: PT.bool,
  last: PT.bool,
  locale: PT.string.isRequired,
  mode: PT.string.isRequired,
  period: PT.object,
  periods: PT.array,
  setPeriod: PT.func,
  t: PT.func
}

export default Period
