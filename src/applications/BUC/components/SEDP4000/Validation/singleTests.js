import _ from 'lodash'
import moment from 'moment'
import { pinfoDateToDate } from 'utils/Date'

const mandatory = (value, error) => {
  if (!value) return error
  if (Array.isArray(value) && value.length === 0) return error
  if (value === '') return error
  return undefined
}

const notMandatory = (value) => {
  return undefined
}

const mandatoryAndPatternMatch = (value, error, pattern, patternError) => {
  return !value || value === '' ? error : !pattern.test(value) ? patternError : undefined
}

const withinLength = (value, limit) => {
  return value && value.length > limit ? 'buc:validation-wowMuchText' : undefined
}

const noPeriods = (stayAbroad) => {
  return _.isEmpty(stayAbroad) ? 'pinfo:validation-noPeriods' : undefined
}

export const stayAbroadValidation = {
  noPeriods
}

const periodType = (type) => {
  return !type ? 'buc:validation-noPeriodType'
    : ['work', 'home', 'child', 'voluntary', 'military', 'birth', 'learn', 'daily', 'sick', 'other']
      .indexOf(type) < 0 ? 'buc:validation-invalidPeriodType' : undefined
}

const periodStartDate = (startDate) => {
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

const periodEndDate = (endDate) => {
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

const childBirthDate = (childBirthDate) => {
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

const periodStartDateOnBlur = (startDate) => {
  if (startDate && startDate.year && startDate.year.length < 4) {
    return 'buc:validation-inValidYear'
  }
  return periodStartDateOnChange(startDate)
}

const periodEndDateOnBlur = (endDate) => {
  if (endDate && endDate.year && endDate.year.length < 4) {
    return 'buc:validation-inValidYear'
  }
  return periodEndDateOnChange(endDate)
}

const childBirthDateOnBlur = (childBirthDate) => {
  if (childBirthDate && childBirthDate.year && childBirthDate.year.length < 4) {
    return 'buc:validation-inValidYear'
  }
  return childBirthDateOnChange(childBirthDate)
}

// tests if startDate is a valid date.
// The validation for whether startdate exists is another test to avoid
// Overeager validation.
const periodStartDateOnChange = (startDate) => {
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

const periodEndDateOnChange = (endDate) => {
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

const childBirthDateOnChange = (childBirthDate) => {
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

const periodTimeSpan = (startDate, endDate) => {
  if (!startDate || !endDate) { return undefined }

  if (!startDate.month || !endDate.month) { return undefined }
  if (!startDate.year || !endDate.year) { return undefined }
  // makes sure both dates have 4 digit years before verifying that they are in the correct sequence.
  if (startDate.year.length < 4 || endDate.year.length < 4) { return undefined }

  const _startDate = moment(pinfoDateToDate(startDate))
  const _endDate = moment(pinfoDateToDate(endDate))

  if (!_startDate.isValid() || !_endDate.isValid()) { return undefined }

  if (_startDate.valueOf() > _endDate.valueOf()) {
    return 'buc:validation-startAfterEnd'
  }
  return undefined
}

const insuranceName = (insuranceName) => {
  return notMandatory(insuranceName) || withinLength(insuranceName, 60)
}

const insuranceType = (insuranceType) => {
  return notMandatory(insuranceType)
}

const insuranceId = (insuranceId) => {
  return notMandatory(insuranceId) || withinLength(insuranceId, 40)
}

const periodCountry = (country) => {
  return mandatory(country, 'buc:validation-noCountry')
}

const workActivity = (workActivity) => {
  return mandatory(workActivity, 'buc:validation-noWorkActivity') || withinLength(workActivity, 60)
}

const workName = (workName) => {
  return notMandatory(workName) || withinLength(workName, 60)
}

const workStreet = (workStreet) => {
  return notMandatory(workStreet) || withinLength(workStreet, 140)
}

const workCity = (workCity) => {
  return mandatory(workCity, 'buc:validation-noWorkCity')
}

const workZipCode = (workZipCode) => {
  return notMandatory(workZipCode) || withinLength(workZipCode, 10)
}

const workRegion = (workRegion) => {
  return notMandatory(workRegion) || withinLength(workRegion, 60)
}

const workType = (workType) => {
  return mandatory(workType, 'buc:validation-noWorkType')
}

const workPlace = (workPlace) => {
  return notMandatory(workPlace) || withinLength(workPlace, 60)
}

const childFirstName = (childFirstName) => {
  return mandatoryAndPatternMatch(childFirstName, 'buc:validation-noChildFirstName',
    /^[^\d]+$/, 'buc:validation-invalidName') || withinLength(childFirstName, 60)
}

const childLastName = (childLastName) => {
  return mandatoryAndPatternMatch(childLastName, 'buc:validation-noChildLastName',
    /^[^\d]+$/, 'buc:validation-invalidName') || withinLength(childLastName, 60)
}

const learnInstitution = (learnInstitution) => {
  return mandatory(learnInstitution, 'buc:validation-noLearnInstitution') || withinLength(learnInstitution, 60)
}

const payingInstitution = (payingInstitution) => {
  return mandatory(payingInstitution, 'buc:validation-noPayingInstitution') || withinLength(payingInstitution, 60)
}

const otherType = (otherType) => {
  return mandatory(otherType, 'buc:validation-noOtherType') || withinLength(otherType, 60)
}

const comment = (comment) => {
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
