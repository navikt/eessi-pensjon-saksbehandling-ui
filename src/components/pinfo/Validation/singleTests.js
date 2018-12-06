import moment from 'moment'

// CONTACT

export function phoneNumber (phone) {
  return !phone ? 'pinfo:validation-noUserPhone'
    : !/\+?[\d]+[\d\s-]*/.test(phone) ? 'pinfo:validation-invalidUserPhone'
      : ''
}

export function emailAddress (email) {
  return !email ? 'pinfo:validation-noUserEmail'
    : !/.+@.+\..+/.test(email) ? 'pinfo:validation-invalidUserEmail'
      : ''
}

export function previousName (name) {
  return !name ? 'pinfo:validation-noUserPreviousName'
    : ''
}

export function noValidPhone (phones) {
  return !phones || (Array.isArray(phones) && phones.length === 0)
    ? 'pinfo:validation-noPhones' : ''
}

export function noValidEmail (emails) {
  return !emails || (Array.isArray(emails) && emails.length === 0)
    ? 'pinfo:validation-noEmails' : ''
}

export const contactValidation = {
  phoneNumber,
  noValidPhone,
  emailAddress,
  noValidEmail,
  previousName
}
// BANK

export function bankName (bankName) {
  return !bankName ? 'pinfo:validation-noBankName' : ''
}

export function bankAddress (bankAddress) {
  return !bankAddress ? 'pinfo:validation-noBankAddress' : ''
}

export function bankCountry (bankCountry) {
  return !bankCountry || (Array.isArray(bankCountry) && bankCountry.length === 0)
    ? 'pinfo:validation-noBankCountry'
    : ''
}

export function bankBicSwift (bankBicSwift) {
  return !bankBicSwift ? 'pinfo:validation-noBankBicSwift'
    : !(/[\d\w]+/.test(bankBicSwift)) ? 'pinfo:validation-invalidBankBicSwift'
      : ''
}

export function bankIban (bankIban) {
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

// WORK AND INCOME

export function workType (workType) {
  return !workType ? 'pinfo:validation-noWorkType' : ''
}

export function workStartDate (workStartDate, workEndDate) {
  return !workStartDate ? 'pinfo:validation-noWorkStartDate'
    : workStartDate > moment().valueOf() ? 'pinfo:validation-noFutureStartDate'
      : workEndDate && workStartDate > workEndDate  ? 'pinfo:validation-workStartAfterEnd' : ''
}

export function workEndDate (workEndDate, workStartDate) {
  return  !workEndDate ? 'pinfo:validation-noWorkEndDate'
    : workStartDate && workStartDate > workEndDate ? 'pinfo:validation-workEndBeforeStart' : ''
}

export function workEstimatedRetirementDate (workEstimatedRetirementDate) {
  return  !workEstimatedRetirementDate ? 'pinfo:validation-noWorkEstimatedRetirementDate' : ''
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
