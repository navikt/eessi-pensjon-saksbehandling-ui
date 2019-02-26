import _ from 'lodash'
import moment from 'moment'
import { pinfoDateToDate } from '../../../utils/Date'

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

// PERSON

let nameAtBirth = function (nameAtBirth) {
  return mandatoryAndPatternMatch(
    nameAtBirth, 'pinfo:validation-noNameAtBirth',
    /^[^\d]+$/, 'pinfo:validation-invalidName')
}

let previousName = function (previousName) {
  return notMandatoryAndPatternMatch(
    previousName, /^[^\d]+$/,
    'pinfo:validation-invalidName')
}

let country = function (country) {
  return mandatory(country, 'pinfo:validation-noCountry')
}

let place = function (place) {
  return mandatory(place, 'pinfo:validation-noPlace')
}

let region = function (region) {
  return notMandatory(region)
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
  return mandatory(fatherName, 'pinfo:validation-noFatherName')
}

let motherName = function (motherName) {
  return mandatory(motherName, 'pinfo:validation-noMotherName')
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
  return mandatory(bankName, 'pinfo:validation-noBankName')
}

let bankAddress = function (bankAddress) {
  return mandatory(bankAddress, 'pinfo:validation-noBankAddress')
}

let bankCountry = function (bankCountry) {
  return mandatory(bankCountry, 'pinfo:validation-noBankCountry')
}

let bankBicSwift = function (bankBicSwift) {
  return mandatoryAndPatternMatch(bankBicSwift, 'pinfo:validation-noBankBicSwift',
    /[\d\w]+/, 'pinfo:validation-invalidBankBicSwift')
}

let bankIban = function (bankIban) {
  return mandatoryAndPatternMatch(bankIban, 'pinfo:validation-noBankIban',
    /[\d\w]+/, 'pinfo:validation-invalidBankIban')
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
  return validPeriodStartDate(startDate)
}

let periodEndDate = function (endDate) {
  if (!endDate || _.isEmpty(endDate)) {
    return 'pinfo:validation-noEndDate'
  }
  if (!endDate.year) {
    return 'pinfo:validation-noYear'
  }
  if (!endDate.month) {
    return 'pinfo:validation-noMonth'
  }
  validPeriodEndDate(endDate)
}

// tests if startDate is a valid date.
// The validation for whether startdate exists is another test to avoid
// Overeager validation.
let validPeriodStartDate = function (startDate) {
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

let validPeriodEndDate = function (endDate) {
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
  return notMandatory(insuranceName)
}

let insuranceType = function (insuranceType) {
  return notMandatory(insuranceType)
}

let insuranceId = function (insuranceId) {
  return notMandatory(insuranceId)
}

let periodCountry = function (country) {
  return mandatory(country, 'pinfo:validation-noCountry')
}

let periodPlace = function (place) {
  return mandatory(place, 'pinfo:validation-noPlace')
}

let workActivity = function (workActivity) {
  return mandatory(workActivity, 'pinfo:validation-noWorkActivity')
}

let workName = function (workName) {
  return notMandatory(workName)
}

let workPlace = function (workPlace) {
  return notMandatory(workPlace)
}

let childFirstName = function (childFirstName) {
  return mandatoryAndPatternMatch(childFirstName, 'pinfo:validation-noChildFirstName',
    /^[^\d]+$/, 'pinfo:validation-invalidName')
}

let childLastName = function (childLastName) {
  return mandatoryAndPatternMatch(childLastName, 'pinfo:validation-noChildLastName',
    /^[^\d]+$/, 'pinfo:validation-invalidName')
}

let childBirthDate = function (childBirthDate) {
  return !childBirthDate ? 'pinfo:validation-noChildBirthDate'
    : (childBirthDate < new Date().getTime()) ? 'pinfo:validation-invalidChildBirthDate' : undefined
}

let learnInstitution = function (learnInstitution) {
  return mandatory(learnInstitution, 'pinfo:validation-noLearnInstitution')
}

// PERIOD

export const periodValidation = {
  periodType,
  periodStartDate,
  periodEndDate,
  validPeriodStartDate,
  validPeriodEndDate,
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
