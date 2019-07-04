import * as tests from './singleTests'

export function personStep (person) {
  return {
    nameAtBirth: tests.personValidation.nameAtBirth(person.nameAtBirth),
    previousName: tests.personValidation.previousName(person.previousName),
    country: tests.personValidation.country(person.country),
    place: tests.personValidation.place(person.place),
    region: tests.personValidation.region(person.region),
    phone: tests.personValidation.phone(person.phone),
    email: tests.personValidation.email(person.email)
  }
}

export function bankStep (bank) {
  return {
    bankName: tests.bankValidation.bankName(bank.bankName),
    bankAddress: tests.bankValidation.bankAddress(bank.bankAddress),
    bankCountry: tests.bankValidation.bankCountry(bank.bankCountry),
    bankBicSwift: tests.bankValidation.bankBicSwift(bank.bankBicSwift),
    bankIban: tests.bankValidation.bankIban(bank.bankIban)
  }
}

export function stayAbroadStep (stayAbroad) {
  return {}
}

export function periodStep (period) {
  let errors = {
    startDate: tests.periodValidation.periodStartDate(period.startDate),
    endDate: tests.periodValidation.periodEndDate(period.endDate),
    insuranceName: tests.periodValidation.insuranceName(period.insuranceName),
    insuranceType: tests.periodValidation.insuranceType(period.insuranceType),
    insuranceId: (period.type !== 'work') ? tests.periodValidation.insuranceId(period.insuranceId) : undefined,
    place: tests.periodValidation.periodPlace(period.place),
    country: tests.periodValidation.periodCountry(period.country),
    timeSpan: tests.periodValidation.periodTimeSpan(period.startDate, period.endDate)
  }

  switch (period.type) {
    case 'work':
      errors.workActivity = tests.periodValidation.workActivity(period.workActivity)
      errors.workName = tests.periodValidation.workName(period.workName)
      errors.workPlace = tests.periodValidation.workPlace(period.workPlace)
      break

    case 'child':
      errors.childFirstName = tests.periodValidation.childFirstName(period.childFirstName)
      errors.childLastName = tests.periodValidation.childLastName(period.childLastName)
      errors.childBirthDate = tests.periodValidation.childBirthDate(period.childBirthDate)
      break

    case 'learn':
      errors.learnInstitution = tests.periodValidation.learnInstitution(period.learnInstitution)
      break

    default:
      break
  }
  return errors
}
