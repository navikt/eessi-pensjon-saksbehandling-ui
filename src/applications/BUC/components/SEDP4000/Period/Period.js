import React, { useState, useEffect } from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import { periodValidation } from 'applications/BUC/components/SEDP4000/Validation/singleTests'
import { periodStep } from 'applications/BUC/components/SEDP4000/Validation/stepTests'

import 'applications/BUC/components/SEDP4000/Period/Period.css'
import PeriodView from 'applications/BUC/components/SEDP4000/Period/PeriodView'
import PeriodEdit from 'applications/BUC/components/SEDP4000/Period/PeriodEdit'

const Period = (props) => {
  const { actions, first, last, locale, mode, period, periods, setPeriod, setPeriods, t } = props
  const [localErrors, setLocalErrors] = useState({})
  const [displayError, setDisplayError] = useState(false)

  const setType = (e) => eventSetProperty('type', periodValidation.periodType, e)

  const setStartDate = (e) => dateSetProperty('startDate', periodValidation.periodStartDateOnChange, e)
  const setEndDate = (e) => dateSetProperty('endDate', periodValidation.periodEndDateOnChange, e)
  const blurStartDate = (e) => dateBlur('startDate', periodValidation.periodStartDateOnBlur, e)
  const blurEndDate = (e) => dateBlur('endDate', periodValidation.periodEndDateOnBlur, e)
  const setUncertainDate = (e) => eventSetCheckbox('uncertainDate', null, e)
  const setDateType = (e) => eventSetProperty('dateType', null, e)

  const setCountry = (e) => valueSetProperty('country', periodValidation.periodCountry, e)
  const setComment = (e) => eventSetProperty('comment', null, e)
  const setAttachments = (e) => valueSetProperty('attachments', null, e)

  const setWorkActivity = (e) => eventSetProperty('workActivity', periodValidation.workActivity, e)
  const setWorkName = (e) => eventSetProperty('workName', periodValidation.workName, e)
  const setWorkType = (e) => eventSetProperty('workType', periodValidation.workType, e)
  const setWorkStreet = (e) => eventSetProperty('workStreet', periodValidation.workStreet, e)
  const setWorkCity = (e) => eventSetProperty('workCity', periodValidation.workCity, e)
  const setWorkZipCode = (e) => eventSetProperty('workZipCode', periodValidation.workZipCode, e)
  const setWorkRegion = (e) => eventSetProperty('workRegion', periodValidation.workRegion, e)

  const setInsuranceId = (e) => eventSetProperty('insuranceId', periodValidation.insuranceId, e)

  const setChildFirstName = (e) => eventSetProperty('childFirstName', periodValidation.childFirstName, e)
  const setChildLastName = (e) => eventSetProperty('childLastName', periodValidation.childLastName, e)
  const setChildBirthDate = (e) => dateSetProperty('childBirthDate', periodValidation.childBirthDateOnChange, e)
  const blurChildBirthDate = (e) => dateBlur('childBirthDate', periodValidation.periodChildBirthDateOnBlur, e)

  const setLearnInstitution = (e) => eventSetProperty('learnInstitution', periodValidation.learnInstitution, e)
  const setPayingInstitution = (e) => eventSetProperty('payingInstitution', periodValidation.payingInstitution, e)
  const setOtherType = (e) => eventSetProperty('otherType', periodValidation.otherType, e)

  useEffect(() => {
    if (period.type && !period.dateType) {
      setDateType({ target: { value: 'both' } })
    }
    if (period.type === 'work' && !period.workType) {
      setWorkType({ target: { value: '01' } })
    }
  }, [period.dateType, period.type, period.workType, setWorkType])

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
        delete newPeriod.workType
        delete newPeriod.workCity
        delete newPeriod.workRegion
        delete newPeriod.workZipCode
        delete newPeriod.workStreet
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
      if (newPeriod.type !== 'child') {
        delete newPeriod.childFirstName
        delete newPeriod.childLastName
        delete newPeriod.childBirthDate
      }

      newPeriod.id = new Date().getTime()
      newPeriods.push(newPeriod)
      setPeriods(newPeriods)
      setPeriod({})
      setDisplayError(false)

      window.scrollTo(0, 0)
    }
  }

  const requestEditPeriod = (period) => {
    setPeriod(period)
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
      modalTitle: t('buc:p4000-alert-deletePeriod-title'),
      modalText: t('buc:p4000-alert-deletePeriod-description'),
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
      modalTitle: t('buc:p4000-alert-cancelPeriod-title'),
      modalText: t('buc:p4000-alert-cancelPeriod-description'),
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
      return (
        <PeriodView
          mode={mode}
          first={first}
          last={last}
          period={period}
          removePeriodRequest={removePeriodRequest}
          requestEditPeriod={requestEditPeriod}
          t={t}
        />
      )
    case 'edit':
    case 'new':
      return (
        <PeriodEdit
          period={period}
          periods={periods}
          actions={actions}
          blurChildBirthDate={blurChildBirthDate}
          blurEndDate={blurEndDate}
          blurStartDate={blurStartDate}
          cancelPeriodRequest={cancelPeriodRequest}
          errorMessage={_errorMessage}
          locale={locale}
          localErrors={localErrors}
          mode={mode}
          saveEditPeriod={saveEditPeriod}
          saveNewPeriod={saveNewPeriod}
          setAttachments={setAttachments}
          setChildBirthDate={setChildBirthDate}
          setChildFirstName={setChildFirstName}
          setChildLastName={setChildLastName}
          setComment={setComment}
          setCountry={setCountry}
          setDateType={setDateType}
          setEndDate={setEndDate}
          setInsuranceId={setInsuranceId}
          setLearnInstitution={setLearnInstitution}
          setOtherType={setOtherType}
          setPayingInstitution={setPayingInstitution}
          setStartDate={setStartDate}
          setType={setType}
          setUncertainDate={setUncertainDate}
          setWorkActivity={setWorkActivity}
          setWorkCity={setWorkCity}
          setWorkName={setWorkName}
          setWorkRegion={setWorkRegion}
          setWorkStreet={setWorkStreet}
          setWorkType={setWorkType}
          setWorkZipCode={setWorkZipCode}
          t={t}
        />
      )
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
