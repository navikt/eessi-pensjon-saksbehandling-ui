import { Period, PeriodDate } from 'declarations/period'
import _ from 'lodash'
import moment from 'moment'
import P4000Payload from '../P4000Payload'

const mandatory: Function = (value:any, error: string): string | undefined => {
  if (!value) return error
  if (Array.isArray(value) && value.length === 0) return error
  if (value === '') return error
  return undefined
}

const notMandatory: Function = (): undefined => {
  return undefined
}

const mandatoryAndPatternMatch: Function = (value: any, error: string, pattern: RegExp, patternError: string): string | undefined => {
  return !value || value === '' ? error : !pattern.test(value) ? patternError : undefined
}

const withinLength: Function = (value: string, limit: number): string | undefined => {
  return value && value.length > limit ? 'buc:validation-wowMuchText' : undefined
}

const noPeriods: Function = (stayAbroad: Array<Period>): string | undefined => {
  return _.isEmpty(stayAbroad) ? 'pinfo:validation-noPeriods' : undefined
}

export const stayAbroadValidation = {
  noPeriods
}

const periodType: Function = (type: string): string | undefined => {
  return !type ? 'buc:validation-noPeriodType'
    : ['work', 'home', 'child', 'voluntary', 'military', 'birth', 'learn', 'daily', 'sick', 'other']
      .indexOf(type) < 0 ? 'buc:validation-invalidPeriodType' : undefined
}

const periodStartDate: Function = (startDate: PeriodDate): string | undefined => {
  if (!startDate || _.isEmpty(startDate)) {
    return 'buc:validation-noStartDate'
  }
  if (!startDate.year) {
    return 'buc:validation-noYear'
  }
  if (!startDate.month) {
    return 'buc:validation-noMonth'
  }
  return periodStartDateOnBlur(startDate)
}

const periodEndDate: Function = (endDate: PeriodDate): string | undefined => {
  if (!endDate || _.isEmpty(endDate)) {
    return 'buc:validation-noEndDate'
  }
  if (!endDate.year) {
    return 'buc:validation-noYear'
  }
  if (!endDate.month) {
    return 'buc:validation-noMonth'
  }
  return periodEndDateOnBlur(endDate)
}

const childBirthDate: Function = (childBirthDate: PeriodDate): string | undefined => {
  if (!childBirthDate || _.isEmpty(childBirthDate)) {
    return 'buc:validation-noChildBirthDate'
  }
  if (!childBirthDate.year) {
    return 'buc:validation-noYear'
  }
  if (!childBirthDate.month) {
    return 'buc:validation-noMonth'
  }
  return childBirthDateOnBlur(childBirthDate)
}

const periodStartDateOnBlur: Function = (startDate: PeriodDate): string | undefined => {
  if (startDate && startDate.year && startDate.year.length < 4) {
    return 'buc:validation-inValidYear'
  }
  return periodStartDateOnChange(startDate)
}

const periodEndDateOnBlur = (endDate: PeriodDate): string | undefined => {
  if (endDate && endDate.year && endDate.year.length < 4) {
    return 'buc:validation-inValidYear'
  }
  return periodEndDateOnChange(endDate)
}

const childBirthDateOnBlur = (childBirthDate: PeriodDate): string | undefined => {
  if (childBirthDate && childBirthDate.year && childBirthDate.year.length < 4) {
    return 'buc:validation-inValidYear'
  }
  return childBirthDateOnChange(childBirthDate)
}

// tests if startDate is a valid date.
// The validation for whether startdate exists is another test to avoid
// Overeager validation.
const periodStartDateOnChange: Function = (startDate: PeriodDate): string | undefined => {
  if (!startDate || !startDate.month || !startDate.year) {
    return undefined
  }

  const monthInteger = parseInt(startDate.month, 10) - 1
  const startMoment = moment([startDate.year, monthInteger, (startDate.day || 1)])

  if (!startMoment.isValid()) {
    return 'buc:validation-invalidStartDate'
  }
  if (startMoment.toDate().getTime() > new Date().getTime()) {
    return 'buc:validation-futureDate'
  }
  return undefined
}

const periodEndDateOnChange: Function = (endDate: PeriodDate): string | undefined => {
  if (!endDate || !endDate.month || !endDate.year) {
    return undefined
  }

  const monthInteger = parseInt(endDate.month, 10) - 1
  const endMoment = moment([endDate.year, monthInteger, (endDate.day || 1)])

  if (!endMoment.isValid()) {
    return 'buc:validation-invalidEndDate'
  }
  if (endMoment.toDate().getTime() > new Date().getTime()) {
    return 'buc:validation-futureDate'
  }
  return undefined
}

const childBirthDateOnChange: Function = (childBirthDate: PeriodDate): string | undefined => {
  if (!childBirthDate || !childBirthDate.month || !childBirthDate.year) {
    return undefined
  }

  const monthInteger = parseInt(childBirthDate.month, 10) - 1
  const childBirthDateMoment = moment([childBirthDate.year, monthInteger, (childBirthDate.day || 1)])

  if (!childBirthDateMoment.isValid()) {
    return 'buc:validation-invalidChildBirthDate'
  }
  if (childBirthDateMoment.toDate().getTime() > new Date().getTime()) {
    return 'buc:validation-futureDate'
  }
  return undefined
}

const periodTimeSpan: Function = (startDate: PeriodDate, endDate: PeriodDate): string | undefined => {
  if (!startDate || !endDate) { return undefined }

  if (!startDate.month || !endDate.month) { return undefined }
  if (!startDate.year || !endDate.year) { return undefined }
  // makes sure both dates have 4 digit years before verifying that they are in the correct sequence.
  if (startDate.year.length < 4 || endDate.year.length < 4) { return undefined }

  const _startDate = P4000Payload.pinfoDateToDate(startDate)
  const _endDate = P4000Payload.pinfoDateToDate(endDate)

  if (!_startDate || !_endDate) { return undefined }

  if (moment(_startDate).valueOf() > moment(_endDate).valueOf()) {
    return 'buc:validation-startAfterEnd'
  }
  return undefined
}

const insuranceName: Function = (insuranceName: string): string | undefined => {
  return notMandatory(insuranceName) || withinLength(insuranceName, 60)
}

const insuranceType: Function = (insuranceType: string): string | undefined => {
  return notMandatory(insuranceType)
}

const insuranceId: Function = (insuranceId: string): string | undefined => {
  return notMandatory(insuranceId) || withinLength(insuranceId, 40)
}

const periodCountry: Function = (country: string): string | undefined => {
  return mandatory(country, 'buc:validation-noCountry')
}

const workActivity: Function = (workActivity: string): string | undefined => {
  return mandatory(workActivity, 'buc:validation-noWorkActivity') || withinLength(workActivity, 60)
}

const workName: Function = (workName: string): string | undefined => {
  return notMandatory(workName) || withinLength(workName, 60)
}

const workStreet: Function = (workStreet: string): string | undefined => {
  return notMandatory(workStreet) || withinLength(workStreet, 140)
}

const workCity: Function = (workCity: string): string | undefined => {
  return mandatory(workCity, 'buc:validation-noWorkCity')
}

const workZipCode: Function = (workZipCode: string): string | undefined => {
  return notMandatory(workZipCode) || withinLength(workZipCode, 10)
}

const workRegion: Function = (workRegion: string): string | undefined => {
  return notMandatory(workRegion) || withinLength(workRegion, 60)
}

const workType: Function = (workType: string): string | undefined => {
  return mandatory(workType, 'buc:validation-noWorkType')
}

const workPlace: Function = (workPlace: string): string | undefined => {
  return notMandatory(workPlace) || withinLength(workPlace, 60)
}

const childFirstName: Function = (childFirstName: string): string | undefined => {
  return mandatoryAndPatternMatch(childFirstName, 'buc:validation-noChildFirstName',
    /^[^\d]+$/, 'buc:validation-invalidName') || withinLength(childFirstName, 60)
}

const childLastName: Function = (childLastName: string): string | undefined => {
  return mandatoryAndPatternMatch(childLastName, 'buc:validation-noChildLastName',
    /^[^\d]+$/, 'buc:validation-invalidName') || withinLength(childLastName, 60)
}

const learnInstitution: Function = (learnInstitution: string): string | undefined => {
  return mandatory(learnInstitution, 'buc:validation-noLearnInstitution') || withinLength(learnInstitution, 60)
}

const payingInstitution: Function = (payingInstitution: string): string | undefined => {
  return mandatory(payingInstitution, 'buc:validation-noPayingInstitution') || withinLength(payingInstitution, 60)
}

const otherType: Function = (otherType: string): string | undefined => {
  return mandatory(otherType, 'buc:validation-noOtherType') || withinLength(otherType, 60)
}

const comment: Function = (comment: string): string | undefined => {
  return notMandatory(comment) || withinLength(comment, 500)
}

// PERIOD

export const periodValidation = {
  periodType,
  periodStartDate,
  periodEndDate,
  childBirthDate,
  periodStartDateOnBlur,
  periodEndDateOnBlur,
  childBirthDateOnBlur,
  periodStartDateOnChange,
  periodEndDateOnChange,
  childBirthDateOnChange,
  periodTimeSpan,
  periodCountry,
  insuranceName,
  insuranceType,
  insuranceId,
  workActivity,
  workName,
  workType,
  workStreet,
  workCity,
  workZipCode,
  workRegion,
  workPlace,
  childFirstName,
  childLastName,
  learnInstitution,
  payingInstitution,
  otherType,
  comment
}
