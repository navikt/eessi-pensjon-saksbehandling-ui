import moment from 'moment'

let isEmpty = function (value, error) {
  return !value ? error : ''
}

let isEmptyOrPatternMatch = function (value, error, pattern, patternError) {
  return !value ? error : !pattern.test(value) ? patternError : ''
}

let isEmptyArray = function (value, error) {
  return !value || (Array.isArray(value) && value.length === 0) ? error : ''
}

let patternMatchIfNotEmpty = function (value, pattern, patternError) {
   return value && !pattern.test(value) ? patternError : ''
}

// PERSON

let nameAtBirth = function (nameAtBirth) {
  return isEmptyOrPatternMatch(nameAtBirth, 'pinfo:validation-noNameAtBirth',
    /^[^\d]+$/, 'pinfo:validation-invalidName')
}

let phone = function (phone) {
  return isEmptyOrPatternMatch(phone, 'pinfo:validation-noPhone',
    /\+?[\d]+[\d\s-]*/, 'pinfo:validation-invalidPhone')
}

let email = function (email) {
  return isEmptyOrPatternMatch(email, 'pinfo:validation-noEmail',
    /.+@.+\..+/, 'pinfo:validation-invalidEmail')
}

let previousName = function (previousName) {
  return isEmptyOrPatternMatch(previousName, 'pinfo:validation-noPreviousName',
    /^[^\d]+$/, 'pinfo:validation-invalidName')
}

let fatherName = function (fatherName) {
  return patternMatchIfNotEmpty(fatherName, /^[^\d]+$/, 'pinfo:validation-invalidFatherName')
}

let motherName = function (motherName) {
  return patternMatchIfNotEmpty(motherName, /^[^\d]+$/, 'pinfo:validation-invalidMotherName')
}

let country = function (country) {
  return isEmpty(country, 'pinfo:validation-noCountry')
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
  fatherName,
  motherName,
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
     /[\d\w]+/,  'pinfo:validation-invalidBankIban')
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
    : ['work','home','child','voluntary','military','birth','learn','daily','sick','other']
      .indexOf(type) < 0 ? 'pinfo:validation-invalidPeriodType' : ''
}

let startDate = function (startDate) {
 return !startDate ? 'pinfo:validation-noStartDate'
    : (startDate > new Date().getTime()) ? 'pinfo:validation-invalidStartDate' : ''
}

let endDate = function (endDate) {
  return endDate && endDate > new Date().getTime() ? 'pinfo:validation-invalidEndDate' : ''
}

let workActivity = function (workActivity) {
  return isEmpty(workActivity, 'pinfo:validation-noWorkActivity')
}

let workId = function (workId) {
  return isEmpty(workId, 'pinfo:validation-noWorkId')
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
    : (childBirthDate < new Date().getTime()) ? 'pinfo:validation-invalidChildBirthDate' : ''
}

let learnInstitution = function (learnInstitution) {
  return isEmpty(learnInstitution, 'pinfo:validation-noLearnInstitution')
}

// PERIOD

export const periodValidation = {
    periodType,
    startDate,
    endDate,
    workActivity,
    workId,
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
  return !workType ? 'pinfo:validation-noWorkType' : ''
}

export function workStartDate (workStartDate, workEndDate) {
  return !workStartDate ? 'pinfo:validation-noWorkStartDate'
    : workStartDate > moment().valueOf() ? 'pinfo:validation-noFutureStartDate'
      : workEndDate && workStartDate > workEndDate ? 'pinfo:validation-workStartAfterEnd' : ''
}

export function workEndDate (workEndDate, workStartDate) {
  return !workEndDate ? 'pinfo:validation-noWorkEndDate'
    : workStartDate && workStartDate > workEndDate ? 'pinfo:validation-workEndBeforeStart' : ''
}

export function workEstimatedRetirementDate (workEstimatedRetirementDate) {
  return !workEstimatedRetirementDate ? 'pinfo:validation-noWorkEstimatedRetirementDate' : ''
}

export function workHourPerWeek (workHourPerWeek) {
  return !workHourPerWeek ? 'pinfo:validation-noWorkHourPerWeek' : ''
}

export function workIncome (workIncome) {
  return !workIncome ? 'pinfo:validation-noWorkIncome' : ''
}

export function workIncomeCurrency (workIncomeCurrency) {
  return !workIncomeCurrency ? 'pinfo:validation-noWorkIncomeCurrency' : ''
}

export function workPaymentDate (workPaymentDate) {
  return !workPaymentDate ? 'pinfo:validation-noWorkPaymentDate' : ''
}

export function workPaymentFrequency (workPaymentFrequency) {
  return !workPaymentFrequency ? 'pinfo:validation-noWorkPaymentFrequency' : ''
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
