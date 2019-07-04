import _ from 'lodash'
import moment from 'moment'
import { pinfoDateToDate } from 'utils/Date'

let mandatory = function (value, error) {
  if (!value) return error
  if (Array.isArray(value) && value.length === 0) return error
  if (value === '') return error
  return undefined
}

let notMandatory = function (value) {
  return undefined
}

let mandatoryAndPatternMatch = function (value, error, pattern, patternError) {
  return !value || value === '' ? error : !pattern.test(value) ? patternError : undefined
}

let notMandatoryAndPatternMatch = function (value, pattern, patternError) {
  return value && !pattern.test(value) ? patternError : undefined
}

let withinLength = function (value, limit) {
  return value && value.length > limit ? 'pinfo:validation-wowMuchText' : undefined
}

// PERSON

let nameAtBirth = function (nameAtBirth) {
  return mandatoryAndPatternMatch(
    nameAtBirth, 'pinfo:validation-noNameAtBirth',
    /^[^\d]+$/, 'pinfo:validation-invalidName') || withinLength(nameAtBirth, 60)
}

let previousName = function (previousName) {
  return notMandatoryAndPatternMatch(
    previousName, /^[^\d]+$/,
    'pinfo:validation-invalidName') || withinLength(previousName, 60)
}

let country = function (country) {
  return mandatory(country, 'pinfo:validation-noCountry')
}

let place = function (place) {
  return mandatory(place, 'pinfo:validation-noPlace') || withinLength(place, 60)
}

let region = function (region) {
  return notMandatory(region) || withinLength(region, 60)
}

let phone = function (phone) {
  return notMandatoryAndPatternMatch(
    phone, /^[(^0-9-+\s())]+$/, 'pinfo:validation-invalidPhone')
}

let email = function (email) {
  return notMandatoryAndPatternMatch(
    email, /^(([^<>()[\].,;:\s@"]+(.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+.)+[^<>()[\].,;:\s@"]{2,})$/, 'pinfo:validation-invalidEmail')
}

let fatherName = function (fatherName) {
  return mandatory(fatherName, 'pinfo:validation-noFatherName') || withinLength(fatherName, 70)
}

let motherName = function (motherName) {
  return mandatory(motherName, 'pinfo:validation-noMotherName') || withinLength(motherName, 70)
}

export const personValidation = {
  nameAtBirth,
  phone,
  email,
  previousName,
  country,
  place,
  region,
  fatherName,
  motherName
}

// BANK

let bankName = function (bankName) {
  return mandatory(bankName, 'pinfo:validation-noBankName') || withinLength(bankName, 60)
}

let bankAddress = function (bankAddress) {
  return mandatory(bankAddress, 'pinfo:validation-noBankAddress') || withinLength(bankAddress, 140)
}

let bankCountry = function (bankCountry) {
  return mandatory(bankCountry, 'pinfo:validation-noBankCountry')
}

let bankBicSwift = function (bankBicSwift) {
  return mandatoryAndPatternMatch(bankBicSwift, 'pinfo:validation-noBankBicSwift',
    /[\d\w]+/, 'pinfo:validation-invalidBankBicSwift') || withinLength(bankBicSwift, 30)
}

let bankIban = function (bankIban) {
  return mandatoryAndPatternMatch(bankIban, 'pinfo:validation-noBankIban',
    /[\d\w]+/, 'pinfo:validation-invalidBankIban') || withinLength(bankIban, 30)
}

export const bankValidation = {
  bankName,
  bankAddress,
  bankCountry,
  bankBicSwift,
  bankIban
}

// STAY ABROAD

export const stayAbroadValidation = {}

let periodType = function (type) {
  return !type ? 'pinfo:validation-noPeriodType'
    : ['work', 'home', 'child', 'voluntary', 'military', 'birth', 'learn', 'daily', 'sick', 'other']
      .indexOf(type) < 0 ? 'pinfo:validation-invalidPeriodType' : undefined
}

let periodStartDate = function (startDate) {
  if (!startDate || _.isEmpty(startDate)) {
    return 'pinfo:validation-noStartDate'
  }
  if (!startDate.year) {
    return 'pinfo:validation-noYear'
  }
  if (!startDate.month) {
    return 'pinfo:validation-noMonth'
  }
  return periodStartDateOnBlur(startDate)
}

let periodEndDate = function (endDate) {
  if (!endDate || _.isEmpty(endDate)) {
    return 'pinfo:validation-noEndDate'
  }
  if (!endDate.year) {
    return 'pinfo:validation-noYear'
  }
  if (!endDate.month) {
    return 'pinfo:validation-noMonth'
  }
  return periodEndDateOnBlur(endDate)
}

let periodStartDateOnBlur = function (startDate) {
  if (startDate && startDate.year && startDate.year.length < 4) {
    return 'pinfo:validation-inValidYear'
  }
  return periodStartDateOnChange(startDate)
}

let periodEndDateOnBlur = function (endDate) {
  if (endDate && endDate.year && endDate.year.length < 4) {
    return 'pinfo:validation-inValidYear'
  }
  return periodEndDateOnChange(endDate)
}

// tests if startDate is a valid date.
// The validation for whether startdate exists is another test to avoid
// Overeager validation.
let periodStartDateOnChange = function (startDate) {
  if (!startDate || !startDate.month || !startDate.year) {
    return undefined
  }

  const monthInteger = parseInt(startDate.month, 10) - 1
  const startMoment = moment([startDate.year, monthInteger, (startDate.day || 1)])

  if (!startMoment.isValid()) {
    return 'pinfo:validation-invalidStartDate'
  }
  if (startMoment.toDate().getTime() > new Date().getTime()) {
    return 'pinfo:validation-futureDate'
  }
  return undefined
}

let periodEndDateOnChange = function (endDate) {
  if (!endDate || !endDate.month || !endDate.year) {
    return undefined
  }

  const monthInteger = parseInt(endDate.month, 10) - 1
  const endMoment = moment([endDate.year, monthInteger, (endDate.day || 1)])

  if (!endMoment.isValid()) {
    return 'pinfo:validation-invalidEndDate'
  }
  if (endMoment.toDate().getTime() > new Date().getTime()) {
    return 'pinfo:validation-futureDate'
  }
  return undefined
}

let periodTimeSpan = function (startDate, endDate) {
  if (!startDate || !endDate) { return undefined }

  if (!startDate.month || !endDate.month) { return undefined }
  if (!startDate.year || !endDate.year) { return undefined }
  // makes sure both dates have 4 digit years before verifying that they are in the correct sequence.
  if (startDate.year.length < 4 || endDate.year.length < 4) { return undefined }

  const _startDate = moment(pinfoDateToDate(startDate))
  const _endDate = moment(pinfoDateToDate(endDate))

  if (!_startDate.isValid() || !_endDate.isValid()) { return undefined }

  if (_startDate.valueOf() > _endDate.valueOf()) {
    return 'pinfo:validation-startAfterEnd'
  }
  return undefined
}

let insuranceName = function (insuranceName) {
  return notMandatory(insuranceName) || withinLength(insuranceName, 60)
}

let insuranceType = function (insuranceType) {
  return notMandatory(insuranceType)
}

let insuranceId = function (insuranceId) {
  return notMandatory(insuranceId) || withinLength(insuranceId, 40)
}

let periodCountry = function (country) {
  return mandatory(country, 'pinfo:validation-noCountry')
}

let periodPlace = function (place) {
  return mandatory(place, 'pinfo:validation-noPlace') || withinLength(place, 60)
}

let workActivity = function (workActivity) {
  return mandatory(workActivity, 'pinfo:validation-noWorkActivity') || withinLength(workActivity, 60)
}

let workName = function (workName) {
  return notMandatory(workName) || withinLength(workName, 60)
}

let workPlace = function (workPlace) {
  return notMandatory(workPlace) || withinLength(workPlace, 60)
}

let childFirstName = function (childFirstName) {
  return mandatoryAndPatternMatch(childFirstName, 'pinfo:validation-noChildFirstName',
    /^[^\d]+$/, 'pinfo:validation-invalidName') || withinLength(childFirstName, 60)
}

let childLastName = function (childLastName) {
  return mandatoryAndPatternMatch(childLastName, 'pinfo:validation-noChildLastName',
    /^[^\d]+$/, 'pinfo:validation-invalidName') || withinLength(childLastName, 60)
}

let childBirthDate = function (childBirthDate) {
  return !childBirthDate ? 'pinfo:validation-noChildBirthDate'
    : (childBirthDate < new Date().getTime()) ? 'pinfo:validation-invalidChildBirthDate' : undefined
}

let learnInstitution = function (learnInstitution) {
  return mandatory(learnInstitution, 'pinfo:validation-noLearnInstitution') || withinLength(learnInstitution, 60)
}

// PERIOD

export const periodValidation = {
  periodType,
  periodStartDate,
  periodEndDate,
  periodStartDateOnBlur,
  periodEndDateOnBlur,
  periodStartDateOnChange,
  periodEndDateOnChange,
  periodTimeSpan,
  periodCountry,
  periodPlace,
  insuranceName,
  insuranceType,
  insuranceId,
  workActivity,
  workName,
  workPlace,
  childFirstName,
  childLastName,
  childBirthDate,
  learnInstitution
}
