import * as tests from './singleTests'

export function contactStep (contact) {
  return tests.contactValidation.noValidPhone(contact.phones) ||
         tests.contactValidation.noValidEmail(contact.emails) ||
  ''
}

export function bankStep (bank) {
  return tests.bankValidation.bankName(bank.bankName) ||
         tests.bankValidation.bankAddress(bank.bankAddress) ||
         tests.bankValidation.bankCountry(bank.bankCountry) ||
         tests.bankValidation.bankBicSwift(bank.bankBicSwift) ||
         tests.bankValidation.bankIban(bank.bankIban) ||
  ''
}

export function workStep (work) {
  return tests.workValidation.workType(work.workType) ||
         tests.workValidation.workStartDate(work.workStartDate, work.workEndDate) ||
         tests.workValidation.workEndDate(work.workEndDate, work.workStartDate) ||
         tests.workValidation.workEstimatedRetirementDate(work.workEstimatedRetirementDate) ||
         tests.workValidation.workHourPerWeek(work.workHourPerWeek) ||
         tests.workValidation.workIncome(work.workIncome) ||
         tests.workValidation.workIncomeCurrency(work.workIncomeCurrency) ||
         tests.workValidation.workPaymentDate(work.workPaymentDate) ||
         tests.workValidation.workPaymentFrequency(work.workPaymentFrequency) ||
  ''
}

export function p4000step(p4000) {
   return null
}
