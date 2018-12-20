import moment from 'moment'

let isEmpty = function (value, error) {
  return !value || value === '' ? error : undefined
}

let isEmptyOrPatternMatch = function (value, error, pattern, patternError) {
  return !value || value === '' ? error : !pattern.test(value) ? patternError : undefined
}

let isEmptyArray = function (value, error) {
  return !value || (Array.isArray(value) && value.length === 0) ? error : undefined
}

// PERSON

let nameAtBirth = function (nameAtBirth) {
  return isEmptyOrPatternMatch(nameAtBirth, 'pinfo:validation-noNameAtBirth',
    /^[^\d]+$/, 'pinfo:validation-invalidName')
}

let phone = function (phone) {
  return isEmptyOrPatternMatch(phone, 'pinfo:validation-noPhone',
    /^[(^0-9-+\s())]+$/, 'pinfo:validation-invalidPhone')
}

let email = function (email) {
  return isEmptyOrPatternMatch(email, 'pinfo:validation-noEmail',
    /^(([^<>()[\].,;:\s@"]+(.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+.)+[^<>()[\].,;:\s@"]{2,})$/, 'pinfo:validation-invalidEmail')
}

let previousName = function (previousName) {
  return isEmptyOrPatternMatch(previousName, 'pinfo:validation-noPreviousName',
    /^[^\d]+$/, 'pinfo:validation-invalidName')
}

let country = function (country) {
  return isEmpty(country, 'pinfo:validation-noCountry')
}

let address = function (address) {
  return isEmpty(address, 'pinfo:validation-noAddress')
}

let city = function (city) {
  return isEmpty(city, 'pinfo:validation-noCity')
}

let region = function (region) {
  return isEmpty(region, 'pinfo:validation-noRegion')
}

export const personValidation = {
  nameAtBirth,
  phone,
  email,
  previousName,
  country,
  city,
  region
}

// BANK

let bankName = function (bankName) {
  return isEmpty(bankName, 'pinfo:validation-noBankName')
}

let bankAddress = function (bankAddress) {
  return isEmpty(bankAddress, 'pinfo:validation-noBankAddress')
}

let bankCountry = function (bankCountry) {
  return isEmptyArray(bankCountry, 'pinfo:validation-noBankCountry')
}

let bankBicSwift = function (bankBicSwift) {
  return isEmptyOrPatternMatch(bankBicSwift, 'pinfo:validation-noBankBicSwift',
    /[\d\w]+/, 'pinfo:validation-invalidBankBicSwift')
}

let bankIban = function (bankIban) {
  return isEmptyOrPatternMatch(bankIban, 'pinfo:validation-noBankIban',
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
  return isEmptyArray(stayAbroad, 'pinfo:validation-atLeastOnePeriod')
}

export const stayAbroadValidation = {
  atLeastOnePeriod
}

let periodType = function (type) {
  return !type ? 'pinfo:validation-noPeriodType'
    : ['work', 'home', 'child', 'voluntary', 'military', 'birth', 'learn', 'daily', 'sick', 'other']
      .indexOf(type) < 0 ? 'pinfo:validation-invalidPeriodType' : undefined
}

let startDate = function (startDate) {
  return !startDate ? 'pinfo:validation-noStartDate'
    : (startDate > new Date().getTime()) ? 'pinfo:validation-invalidStartDate' : undefined
}

let endDate = function (endDate) {
  return endDate && endDate > new Date().getTime() ? 'pinfo:validation-invalidEndDate' : undefined
}

let insuranceName = function (insuranceName) {
  return isEmpty(insuranceName, 'pinfo:validation-noInsuranceName')
}

let insuranceType = function (insuranceType) {
  return isEmpty(insuranceType, 'pinfo:validation-noInsuranceType')
}

let insuranceId = function (insuranceId) {
  return isEmpty(insuranceId, 'pinfo:validation-noInsuranceId')
}

let workActivity = function (workActivity) {
  return isEmpty(workActivity, 'pinfo:validation-noWorkActivity')
}

let workName = function (workName) {
  return isEmpty(workName, 'pinfo:validation-noWorkName')
}

let workAddress = function (workAddress) {
  return isEmpty(workAddress, 'pinfo:validation-noWorkAddress')
}

let workCity = function (workCity) {
  return isEmpty(workCity, 'pinfo:validation-noWorkCity')
}

let workRegion = function (workRegion) {
  return isEmpty(workRegion, 'pinfo:validation-noWorkRegion')
}

let childFirstName = function (childFirstName) {
  return isEmptyOrPatternMatch(childFirstName, 'pinfo:validation-noChildFirstName',
    /^[^\d]+$/, 'pinfo:validation-invalidName')
}

let childLastName = function (childLastName) {
  return isEmptyOrPatternMatch(childLastName, 'pinfo:validation-noChildLastName',
    /^[^\d]+$/, 'pinfo:validation-invalidName')
}

let childBirthDate = function (childBirthDate) {
  return !childBirthDate ? 'pinfo:validation-noChildBirthDate'
    : (childBirthDate < new Date().getTime()) ? 'pinfo:validation-invalidChildBirthDate' : undefined
}

let learnInstitution = function (learnInstitution) {
  return isEmpty(learnInstitution, 'pinfo:validation-noLearnInstitution')
}

// PERIOD

export const periodValidation = {
  periodType,
  startDate,
  endDate,
  country,
  address,
  city,
  region,
  insuranceName,
  insuranceType,
  insuranceId,
  workActivity,
  workName,
  workAddress,
  workCity,
  workRegion,
  childFirstName,
  childLastName,
  childBirthDate,
  learnInstitution
}

// WORK AND INCOME

export function workType (workType) {
  return !workType ? 'pinfo:validation-noWorkType' : undefined
}

export function workStartDate (workStartDate, workEndDate) {
  return !workStartDate ? 'pinfo:validation-noWorkStartDate'
    : workStartDate > moment().valueOf() ? 'pinfo:validation-noFutureStartDate'
      : workEndDate && workStartDate > workEndDate ? 'pinfo:validation-workStartAfterEnd' : undefined
}

export function workEndDate (workEndDate, workStartDate) {
  return !workEndDate ? 'pinfo:validation-noWorkEndDate'
    : workStartDate && workStartDate > workEndDate ? 'pinfo:validation-workEndBeforeStart' : undefined
}

export function workEstimatedRetirementDate (workEstimatedRetirementDate) {
  return !workEstimatedRetirementDate ? 'pinfo:validation-noWorkEstimatedRetirementDate' : undefined
}

export function workHourPerWeek (workHourPerWeek) {
  return !workHourPerWeek ? 'pinfo:validation-noWorkHourPerWeek' : undefined
}

export function workIncome (workIncome) {
  return !workIncome ? 'pinfo:validation-noWorkIncome' : undefined
}

export function workIncomeCurrency (workIncomeCurrency) {
  return !workIncomeCurrency ? 'pinfo:validation-noWorkIncomeCurrency' : undefined
}

export function workPaymentDate (workPaymentDate) {
  return !workPaymentDate ? 'pinfo:validation-noWorkPaymentDate' : undefined
}

export function workPaymentFrequency (workPaymentFrequency) {
  return !workPaymentFrequency ? 'pinfo:validation-noWorkPaymentFrequency' : undefined
}

export const workValidation = {
  workType,
  workStartDate,
  workEndDate,
  workEstimatedRetirementDate,
  workHourPerWeek,
  workIncome,
  workIncomeCurrency,
  workPaymentDate,
  workPaymentFrequency
}
