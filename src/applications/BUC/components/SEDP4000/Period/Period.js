import React, { useEffect, useCallback } from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import PeriodEdit from 'applications/BUC/components/SEDP4000/Period/PeriodEdit'
import PeriodView from 'applications/BUC/components/SEDP4000/Period/PeriodView'
import { periodValidation } from 'applications/BUC/components/SEDP4000/Validation/singleTests'
import { periodStep } from 'applications/BUC/components/SEDP4000/Validation/stepTests'

import 'applications/BUC/components/SEDP4000/Period/Period.css'

const Period = ({
  actions, first, last, locale, localErrors, mode, period, periods,
  setLocalError, setLocalErrors, setPeriod, setPeriods, t
}) => {
  const valueSetProperty = useCallback((key, validateFunction, value) => {
    const error = validateFunction ? validateFunction(value) : undefined
    setPeriod({
      ...period,
      [key]: value
    })
    setLocalError(key, error)
  }, [period, setLocalError, setPeriod])

  const eventSetProperty = useCallback((key, validateFunction, e) => {
    valueSetProperty(key, validateFunction, e.target.value)
  }, [valueSetProperty])

  const setType = /* istanbul ignore next */ (e) => eventSetProperty('type', periodValidation.periodType, e)

  const setStartDate = /* istanbul ignore next */ (e) => dateSetProperty('startDate', periodValidation.periodStartDateOnChange, e)
  const setEndDate = /* istanbul ignore next */ (e) => dateSetProperty('endDate', periodValidation.periodEndDateOnChange, e)
  const blurStartDate = /* istanbul ignore next */ (e) => dateBlur('startDate', periodValidation.periodStartDateOnBlur, e)
  const blurEndDate = /* istanbul ignore next */ (e) => dateBlur('endDate', periodValidation.periodEndDateOnBlur, e)
  const setUncertainDate = /* istanbul ignore next */ (e) => eventSetCheckbox('uncertainDate', null, e)
  const setDateType = /* istanbul ignore next */ (e) => eventSetProperty('dateType', null, e)

  const setCountry = /* istanbul ignore next */ (e) => valueSetProperty('country', periodValidation.periodCountry, e)
  const setComment = /* istanbul ignore next */ (e) => eventSetProperty('comment', null, e)
  const setAttachments = /* istanbul ignore next */ (e) => valueSetProperty('attachments', null, e)

  const setWorkActivity = /* istanbul ignore next */ (e) => eventSetProperty('workActivity', periodValidation.workActivity, e)
  const setWorkName = /* istanbul ignore next */ (e) => eventSetProperty('workName', periodValidation.workName, e)
  const setWorkType = /* istanbul ignore next */ (e) => eventSetProperty('workType', periodValidation.workType, e)
  const setWorkStreet = /* istanbul ignore next */ (e) => eventSetProperty('workStreet', periodValidation.workStreet, e)
  const setWorkCity = /* istanbul ignore next */ (e) => eventSetProperty('workCity', periodValidation.workCity, e)
  const setWorkZipCode = /* istanbul ignore next */ (e) => eventSetProperty('workZipCode', periodValidation.workZipCode, e)
  const setWorkRegion = /* istanbul ignore next */ (e) => eventSetProperty('workRegion', periodValidation.workRegion, e)

  const setInsuranceId = /* istanbul ignore next */ (e) => eventSetProperty('insuranceId', periodValidation.insuranceId, e)

  const setChildFirstName = /* istanbul ignore next */ (e) => eventSetProperty('childFirstName', periodValidation.childFirstName, e)
  const setChildLastName = /* istanbul ignore next */ (e) => eventSetProperty('childLastName', periodValidation.childLastName, e)
  const setChildBirthDate = /* istanbul ignore next */ (e) => dateSetProperty('childBirthDate', periodValidation.childBirthDateOnChange, e)
  const blurChildBirthDate = /* istanbul ignore next */ (e) => dateBlur('childBirthDate', periodValidation.childBirthDateOnBlur, e)

  const setLearnInstitution = /* istanbul ignore next */ (e) => eventSetProperty('learnInstitution', periodValidation.learnInstitution, e)
  const setPayingInstitution = /* istanbul ignore next */ (e) => eventSetProperty('payingInstitution', periodValidation.payingInstitution, e)
  const setOtherType = /* istanbul ignore next */ (e) => eventSetProperty('otherType', periodValidation.otherType, e)

  useEffect(() => {
    if (period.type && !period.dateType) {
      setDateType({ target: { value: 'both' } })
    }
    if (period.type === 'work' && !period.workType) {
      setWorkType({ target: { value: '01' } })
    }
  }, [period.dateType, period.type, period.workType, setDateType, setWorkType])

  const hasNoErrors = (errors) => {
    for (const key in errors) {
      if (Object.prototype.hasOwnProperty.call(errors, key) && errors[key]) {
        return false
      }
    }
    return true
  }

  const eventSetCheckbox = (key, validateFunction, e) => {
    valueSetProperty(key, validateFunction, e.target.checked)
  }

  const dateBlur = (key, validateFunction) => {
    const date = period[key]
    const error = validateFunction ? validateFunction(date) : undefined
    setLocalError(key, error)
  }

  const dateSetProperty = (key, validateFunction, date) => {
    const { startDate, endDate } = period
    const error = validateFunction ? validateFunction(date) : undefined
    let timeSpanError

    if (key === 'startDate' && endDate) {
      timeSpanError = periodValidation.periodTimeSpan(date, endDate)
    }
    if (key === 'endDate' && startDate) {
      timeSpanError = periodValidation.periodTimeSpan(startDate, date)
    }
    setPeriod({
      ...period,
      [key]: date
    })
    setLocalError(key, error)
    setLocalError('timeSpan', timeSpanError)
  }

  const validatePeriod = () => {
    return periodStep(period)
  }

  const saveNewPeriod = () => {
    const errors = validatePeriod()
    setLocalErrors(errors)
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

      newPeriods.push(newPeriod)
      newPeriods.forEach((period, i) => (period.id = i))
      setPeriods(newPeriods)
      setPeriod({})
      setLocalErrors({})
      window.scrollTo(0, 0)
    }
  }

  const requestEditPeriod = (period) => {
    setPeriod(period)
  }

  const saveEditPeriod = () => {
    const errors = validatePeriod()
    setLocalErrors(errors)

    if (hasNoErrors(errors)) {
      const newPeriods = _.clone(periods)
      const newPeriod = _.clone(period)
      const index = _.findIndex(periods, { id: period.id })
      if (index >= 0) {
        newPeriods[index] = newPeriod
        setPeriods(newPeriods)
        setPeriod({})
        setLocalErrors({})
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

  switch (mode) {
    case 'view':
    case 'confirm':
      return (
        <PeriodView
          first={first}
          last={last}
          localErrors={{}}
          mode={mode}
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
          actions={actions}
          blurChildBirthDate={blurChildBirthDate}
          blurEndDate={blurEndDate}
          blurStartDate={blurStartDate}
          cancelPeriodRequest={cancelPeriodRequest}
          locale={locale}
          localErrors={localErrors}
          mode={mode}
          period={period}
          periods={periods}
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
  localErrors: PT.object.isRequired,
  mode: PT.string.isRequired,
  period: PT.object,
  periods: PT.array,
  setLocalErrors: PT.func,
  setLocalError: PT.func,
  setPeriod: PT.func,
  setPeriods: PT.func,
  t: PT.func.isRequired
}

export default Period
