import moment from 'moment'

// PERSON

let nameAtBirth = function (nameAtBirth) {
  return !nameAtBirth ? 'pinfo:validation-noNameAtBirth' :
    /\d/.test(nameAtBirth) ? 'pinfo:validation-invalidName'
     : ''
}

let phone = function (phone) {
  return !phone ? 'pinfo:validation-noPhone'
    : !/\+?[\d]+[\d\s-]*/.test(phone) ? 'pinfo:validation-invalidPhone'
      : ''
}

let email = function (email) {
  return !email ? 'pinfo:validation-noEmail'
    : !/.+@.+\..+/.test(email) ? 'pinfo:validation-invalidEmail'
      : ''
}

let previousName = function (previousName) {
  return !previousName ? 'pinfo:validation-noPreviousName' :
    /\d/.test(previousName) ? 'pinfo:validation-invalidName'
      : ''
}

export const personValidation = {
  nameAtBirth,
  phone,
  email,
  previousName
}
// BANK

let bankName = function (bankName) {
  return !bankName ? 'pinfo:validation-noBankName' : ''
}

let bankAddress = function (bankAddress) {
  return !bankAddress ? 'pinfo:validation-noBankAddress' : ''
}

let bankCountry = function (bankCountry) {
  return !bankCountry || (Array.isArray(bankCountry) && bankCountry.length === 0)
    ? 'pinfo:validation-noBankCountry'
    : ''
}

let bankBicSwift = function (bankBicSwift) {
  return !bankBicSwift ? 'pinfo:validation-noBankBicSwift'
    : !(/[\d\w]+/.test(bankBicSwift)) ? 'pinfo:validation-invalidBankBicSwift'
      : ''
}

let bankIban = function (bankIban) {
  return !bankIban ? 'pinfo:validation-noBankIban'
    : !(/[\d\w]+/.test(bankIban)) ? 'pinfo:validation-invalidBankIban'
      : ''
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
  return !stayAbroad || (Array.isArray(stayAbroad) && stayAbroad.length === 0) ? 'pinfo:validation-atLeastOnePeriod'
      : ''
}



export const stayAbroadValidation = {
  atLeastOnePeriod
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
