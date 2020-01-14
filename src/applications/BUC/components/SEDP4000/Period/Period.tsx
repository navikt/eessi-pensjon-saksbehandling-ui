import React, { useEffect, useCallback } from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import PeriodEdit from 'applications/BUC/components/SEDP4000/Period/PeriodEdit'
import PeriodView from 'applications/BUC/components/SEDP4000/Period/PeriodView'
import { periodValidation } from 'applications/BUC/components/SEDP4000/Validation/singleTests'
import { periodStep } from 'applications/BUC/components/SEDP4000/Validation/stepTests'
import {Period as IPeriod, Periods as IPeriods, PeriodDate, PeriodErrors} from 'applications/BUC/declarations/period'
import { ActionCreators, AllowedLocaleString, T } from 'types.d'
import 'applications/BUC/components/SEDP4000/Period/Period.css'

export interface PeriodProps {
  actions: ActionCreators;
  first?: boolean;
  last?: boolean;
  locale: AllowedLocaleString;
  localErrors: {[k: string] : string |undefined};
  mode: string;
  period: IPeriod;
  periods: Array<IPeriod>;
  setLocalError: (...args: any[]) => any;
  setLocalErrors: (...args: any[]) => any;
  setPeriod: (...args: any[]) => void;
  setPeriods: (...args: any[]) => void;
  t: T;
}

const Period = ({
  actions, first, last, locale, localErrors, mode, period, periods,
  setLocalError, setLocalErrors, setPeriod, setPeriods, t
}: PeriodProps): JSX.Element => {
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

  const setType = /* istanbul ignore next */ (e: React.ChangeEvent) => eventSetProperty('type', periodValidation.periodType, e)

  const setStartDate = /* istanbul ignore next */ (e: PeriodDate) => dateSetProperty('startDate', periodValidation.periodStartDateOnChange, e)
  const setEndDate = /* istanbul ignore next */ (e: PeriodDate) => dateSetProperty('endDate', periodValidation.periodEndDateOnChange, e)
  const blurStartDate = /* istanbul ignore next */ () => dateBlur('startDate', periodValidation.periodStartDateOnBlur)
  const blurEndDate = /* istanbul ignore next */ () => dateBlur('endDate', periodValidation.periodEndDateOnBlur)
  const setUncertainDate = /* istanbul ignore next */ (e: React.ChangeEvent<HTMLInputElement>) => eventSetCheckbox('uncertainDate', null, e)
  const setDateType = /* istanbul ignore next */ useCallback((e: Event) => eventSetProperty('dateType', null, e), [eventSetProperty])

  const setCountry = /* istanbul ignore next */ (e: React.ChangeEvent) => valueSetProperty('country', periodValidation.periodCountry, e)
  const setComment = /* istanbul ignore next */ (e: React.ChangeEvent) => eventSetProperty('comment', null, e)
  const setAttachments = /* istanbul ignore next */ (e: React.ChangeEvent) => valueSetProperty('attachments', null, e)

  const setWorkActivity = /* istanbul ignore next */ (e: React.ChangeEvent) => eventSetProperty('workActivity', periodValidation.workActivity, e)
  const setWorkName = /* istanbul ignore next */ (e: React.ChangeEvent) => eventSetProperty('workName', periodValidation.workName, e)
  const setWorkType = /* istanbul ignore next */ useCallback((e: Event) => eventSetProperty('workType', periodValidation.workType, e), [eventSetProperty])
  const setWorkStreet = /* istanbul ignore next */ (e: React.ChangeEvent) => eventSetProperty('workStreet', periodValidation.workStreet, e)
  const setWorkCity = /* istanbul ignore next */ (e: React.ChangeEvent) => eventSetProperty('workCity', periodValidation.workCity, e)
  const setWorkZipCode = /* istanbul ignore next */ (e: React.ChangeEvent) => eventSetProperty('workZipCode', periodValidation.workZipCode, e)
  const setWorkRegion = /* istanbul ignore next */ (e: React.ChangeEvent) => eventSetProperty('workRegion', periodValidation.workRegion, e)

  const setInsuranceId = /* istanbul ignore next */ (e: React.ChangeEvent) => eventSetProperty('insuranceId', periodValidation.insuranceId, e)

  const setChildFirstName = /* istanbul ignore next */ (e: React.ChangeEvent) => eventSetProperty('childFirstName', periodValidation.childFirstName, e)
  const setChildLastName = /* istanbul ignore next */ (e: React.ChangeEvent) => eventSetProperty('childLastName', periodValidation.childLastName, e)
  const setChildBirthDate = /* istanbul ignore next */ (e: PeriodDate) => dateSetProperty('childBirthDate', periodValidation.childBirthDateOnChange, e)
  const blurChildBirthDate = /* istanbul ignore next */ () => dateBlur('childBirthDate', periodValidation.childBirthDateOnBlur)

  const setLearnInstitution = /* istanbul ignore next */ (e: React.ChangeEvent) => eventSetProperty('learnInstitution', periodValidation.learnInstitution, e)
  const setPayingInstitution = /* istanbul ignore next */ (e: React.ChangeEvent) => eventSetProperty('payingInstitution', periodValidation.payingInstitution, e)
  const setOtherType = /* istanbul ignore next */ (e: React.ChangeEvent) => eventSetProperty('otherType', periodValidation.otherType, e)

  useEffect(() => {
    if (period.type && !period.dateType) {
      let e = new Event('change')
      Object.defineProperty(e, 'target', {value: 'both'});
      setDateType(e)
    }
    if (period.type === 'work' && !period.workType) {
      let e = new Event('change')
      Object.defineProperty(e, 'target', {value: '01'});
      setWorkType(e)
    }
  }, [period.dateType, period.type, period.workType, setDateType, setWorkType])

  const hasNoErrors = (errors: PeriodErrors) => {
    for (const key in errors) {
      if (Object.prototype.hasOwnProperty.call(errors, key) && errors[key]) {
        return false
      }
    }
    return true
  }

  const eventSetCheckbox = (key: string, validateFunction: Function | null, e: React.ChangeEvent<HTMLInputElement>) => {
    valueSetProperty(key, validateFunction, e.target!.checked)
  }

  const dateBlur = (key: string, validateFunction: Function | null) => {
    const date = period[key]
    const error = validateFunction ? validateFunction(date) : undefined
    setLocalError(key, error)
  }

  const dateSetProperty = (key: string, validateFunction: Function | null, date: PeriodDate) => {
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

  const requestEditPeriod = (period: IPeriod) => {
    setPeriod(period)
  }

  const saveEditPeriod = () => {
    const errors = validatePeriod()
    setLocalErrors(errors)

    if (hasNoErrors(errors)) {
      const newPeriods: IPeriods = _.clone(periods)
      const newPeriod: IPeriod = _.clone(period)
      // @ts-ignore
      const index: number = _.findIndex(periods, { id: period.id })
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

  const removePeriodRequest = (period: IPeriod) => {
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

  const doRemovePeriod = (period: IPeriod) => {
    // @ts-ignore
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
      return <div/>
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
