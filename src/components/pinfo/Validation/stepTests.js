import * as tests from './singleTests'

export function personStep (person) {
  return tests.personValidation.nameAtBirth(person.nameAtBirth) ||
         tests.personValidation.previousName(person.previousName) ||
         tests.personValidation.phone(person.phone) ||
         tests.personValidation.email(person.email) ||
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

export function stayAbroadStep (stayAbroad) {
  return tests.stayAbroadValidation.atLeastOnePeriod(stayAbroad) || ''
}

export function periodStep (period) {

  let result = ''
  switch(period.type) {

   case 'work':
    result = result ||
    tests.periodValidation.startDate(period.startDate) ||
    tests.periodValidation.endDate(period.endDate) ||
    tests.periodValidation.workActivity(period.workActivity) ||
    tests.periodValidation.workId(period.workId) ||
    tests.periodValidation.workName(period.workName) ||
    tests.periodValidation.workAddress(period.workAddress) ||
    tests.periodValidation.workCity(period.workCity) ||
    tests.periodValidation.workRegion(period.workRegion)
    break
  case 'child':
    result = result ||
    tests.periodValidation.startDate(period.startDate) ||
    tests.periodValidation.endDate(period.endDate) ||
    tests.periodValidation.childFirstName(period.childFirstName) ||
    tests.periodValidation.childLastName(period.childLastName) ||
    tests.periodValidation.childBirthDate(period.childBirthDate)
    break
   case 'learn':
    result = result ||
    tests.periodValidation.startDate(period.startDate) ||
    tests.periodValidation.endDate(period.endDate) ||
    tests.periodValidation.learnInstitution(period.learnInstitution)
    break
  default:
    result = result ||
    tests.periodValidation.startDate(period.startDate) ||
    tests.periodValidation.endDate(period.endDate)
  }
  return result
}
