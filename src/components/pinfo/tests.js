import moment from 'moment'

// BANK
export function bankName (bank, t) {
  return (
    !bank.bankName
      ? t('pinfo:validation-noBankName')
      : ''
  )
}
export function bankAddress (bank, t) {
  return (
    !bank.bankAddress
      ? t('pinfo:validation-noBankAddress')
      : ''
  )
}
export function bankCountry (bank, t) {
  return (
    !bank.bankCountry || (Array.isArray(bank.bankCountry) && bank.bankCountry.length === 0)
      ? t('pinfo:validation-noBankCountry')
      : ''
  )
}
export function bankBicSwift (bank, t) {
  return (
    !bank.bankBicSwift ? t('pinfo:validation-noBankBicSwift')
      : !(/[\d\w]+/.test(bank.bankBicSwift)) ? t('pinfo:validation-invalidBankBicSwift')
        : ''
  )
}
export function bankIban (bank, t) {
  return (
    !bank.bankIban ? t('pinfo:validation-noBankIban')
      : !(/[\d\w]+/.test(bank.bankIban)) ? t('pinfo:validation-invalidBankIban')
        : ''
  )
}
export function bankCode (bank, t) {
  return (
    !bank.bankCode ? t('pinfo:validation-noBankCode')
      : ''
  )
}

export const bankValidation = {
  bankName,
  bankAddress,
  bankCountry,
  bankBicSwift,
  bankIban,
  bankCode
}

// CONTACT

export function phoneNumber (phone, t) {
  return (
    !phone.number ? t('pinfo:validation-noUserPhone')
      : !/\+?[\d]+[\d\s-]*/.test(phone.number) ? t('pinfo:validation-invalidUserPhone')
        : ''
  )
}
export function phoneType (phone, t) {
  return (
    !phone.type ? t('pinfo:validation-noTypePhone')
      : ''
  )
}
export function emailAddress (email, t) {
  return (
    !email.address ? t('pinfo:validation-noUserEmail')
      : !/.+@.+\..+/.test(email.address) ? t('pinfo:validation-invalidUserEmail')
        : ''
  )
}

export function phoneHasError (phone, t) {
  return (phoneNumber(phone, t) || phoneType(phone, t))
}

export function oneValidPhone (KV, t) {
  // Statement before '.reduce' is essentially Object.values(obj) || obj(K V) => arr[V]
  return Object.keys(KV).map(key => KV[key]).reduce((acc, value) => (acc || !phoneHasError(value, t)), false)
    ? ''
    : t('pinfo:validation-noValidPhones')
}

export function oneValidEmail (KV, t) {
  // Statement before '.reduce' is essentially Object.values(obj) || obj(K V) => arr[V]
  return Object.keys(KV).map(key => KV[key]).reduce((acc, value) => (acc || !emailAddress(value, t)), false)
    ? ''
    : t('pinfo:validation-noValidEmails')
}

export const contactValidation = {
  phoneNumber,
  phoneType,
  phoneHasError,
  oneValidPhone,
  emailAddress,
  oneValidEmail
}

// WORK AND INCOME

export function workType (workIncome, t) {
  return (
    !workIncome.workType ? t('pinfo:validation-noWorkType')
      : ''
  )
}
export function workStartDate (workIncome, t) {
  return (
    !workIncome.workStartDate ? t('pinfo:validation-noWorkStartDate')
      : workIncome.workStartDate > moment().valueOf() ? t('pinfo:validation-noFutureStartDate')
        : (workIncome.workEndDate && (workIncome.workStartDate > workIncome.workEndDate)) ? t('pinfo:validation-workStartAfterEnd')
          : ''
  )
}
export function workEndDate (workIncome, t) {
  return (
    !workIncome.workEndDate ? t('pinfo:validation-noWorkEndDate')
      : (workIncome.workStartDate && (workIncome.workStartDate > workIncome.workEndDate)) ? t('pinfo:validation-workEndBeforeStart')
        : ''
  )
}
export function workEstimatedRetirementDate (workIncome, t) {
  return (
    !workIncome.workEstimatedRetirementDate ? t('pinfo:validation-noWorkEstimatedRetirementDate')
      : ''
  )
}
export function workHourPerWeek (workIncome, t) {
  return (
    !workIncome.workHourPerWeek ? t('pinfo:validation-noWorkHourPerWeek')
      : ''
  )
}
export function workIncome (workIncome, t) {
  return (
    !workIncome.workIncome ? t('pinfo:validation-noWorkIncome')
      : ''
  )
}
export function workIncomeCurrency (workIncome, t) {
  return (
    !workIncome.workIncomeCurrency ? t('pinfo:validation-noWorkIncomeCurrency')
      : ''
  )
}
export function workPaymentDate (workIncome, t) {
  return (
    !workIncome.workPaymentDate ? t('pinfo:validation-noWorkPaymentDate')
      : ''
  )
}
export function workPaymentFrequency (workIncome, t) {
  return (
    !workIncome.workPaymentFrequency ? t('pinfo:validation-noWorkPaymentFrequency')
      : ''
  )
}

export const workAndIncomeValidation = {
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

// ATTACHMENTS
function typesSelected (attachments) {
  return (
    attachments.attachmentTypes &&
    typeof attachments.attachmentTypes === 'object' &&
    Object.keys(attachments.attachmentTypes).reduce((acc, key) => (acc || attachments.attachmentTypes[key]), false)
  )
}

function filesUploaded (attachments) {
  return (
    attachments.attachments &&
    Array.isArray(attachments.attachments) &&
    attachments.attachments.length > 0
  )
}

export function attachments (attachments, t) {
  return (typesSelected(attachments) && !filesUploaded(attachments))
    ? t('pinfo:validation-noAttachments')
    : ''
}

export function attachmentTypes (attachments, t) {
  return (!typesSelected(attachments) && filesUploaded(attachments))
    ? t('pinfo:validation-noAttachmentTypes')
    : ''
}

export const attachmentValidation = {
  attachments,
  attachmentTypes
}

// PENSION

export function retirementCountry (pension, t) {
  return (
    !pension.retirementCountry || (Array.isArray(pension.retirementCountry) && pension.retirementCountry.length === 0)
      ? t('pinfo:validation-noRetirementCountry')
      : ''
  )
}

export const pensionValidation = {
  retirementCountry
}
