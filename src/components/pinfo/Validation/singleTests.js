
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

let city = function (city) {
  return mandatory(city, 'pinfo:validation-noCity')
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
  city,
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

let atLeastOnePeriod = function (stayAbroad) {
  return mandatory(stayAbroad, 'pinfo:validation-atLeastOnePeriod')
}

export const stayAbroadValidation = {
  atLeastOnePeriod
}

let periodType = function (type) {
  return !type ? 'pinfo:validation-noPeriodType'
    : ['work', 'home', 'child', 'voluntary', 'military', 'birth', 'learn', 'daily', 'sick', 'other']
      .indexOf(type) < 0 ? 'pinfo:validation-invalidPeriodType' : undefined
}

let periodStartDate = function (startDate) {
  return !startDate ? 'pinfo:validation-noStartDate'
    : (startDate > new Date().getTime()) ? 'pinfo:validation-invalidStartDate' : undefined
}

let periodEndDate = function (endDate) {
  return !endDate ? 'pinfo:validation-noEndDate'
    : (endDate > new Date().getTime()) ? 'pinfo:validation-invalidEndDate' : undefined
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
