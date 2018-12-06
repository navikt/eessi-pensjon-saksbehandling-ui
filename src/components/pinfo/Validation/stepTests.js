import * as tests from './singleTests'

export function personStep (person) {
  return ''
/*  return tests.personValidation.noValidLastName(person.lastNameAfterBirth) ||
         tests.personValidation.noValidPersonName(person.names) ||
         tests.personValidation.noValidPhone(person.phones) ||
         tests.personValidation.noValidEmail(person.emails) ||
  '' */
}

export function bankStep (bank) {
  return ''
/*  return tests.bankValidation.bankName(bank.bankName) ||
         tests.bankValidation.bankAddress(bank.bankAddress) ||
         tests.bankValidation.bankCountry(bank.bankCountry) ||
         tests.bankValidation.bankBicSwift(bank.bankBicSwift) ||
         tests.bankValidation.bankIban(bank.bankIban) ||
  '' */
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

export function stayAbroadStep (stayAbroad) {
  return ''
}
