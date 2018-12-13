import * as tests from './singleTests'

export function personStep (person) {
  let errors = {},
      nameAtBirth = tests.personValidation.nameAtBirth(person.nameAtBirth),
      previousName = tests.personValidation.previousName(person.previousName),
      id = tests.personValidation.id(person.id),
      fatherName = tests.personValidation.fatherName(person.fatherName),
      motherName = tests.personValidation.motherName(person.motherName),
      country = tests.personValidation.country(person.country),
      city = tests.personValidation.city(person.city),
      region = tests.personValidation.region(person.region),
      phone = tests.personValidation.phone(person.phone),
      email = tests.personValidation.email(person.email);

  if (nameAtBirth) errors.nameAtBirth = nameAtBirth
  if (previousName) errors.previousName = previousName
  if (person.idAbroad) {
    if (id) errors.id = id
  } else {
  if (fatherName) errors.fatherName = fatherName
  if (motherName) errors.motherName = motherName
  if (country) errors.country = country
  if (city) errors.city = city
  if (region) errors.region = region
  }
   if (phone) errors.phone = phone
    if (email) errors.email = email
    return errors

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
  switch (period.type) {
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
