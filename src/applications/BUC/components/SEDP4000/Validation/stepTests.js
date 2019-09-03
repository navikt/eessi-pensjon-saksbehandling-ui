import * as tests from './singleTests'

export function stayAbroadStep (stayAbroad) {
  return {}
}

export function periodStep (period) {
  const errors = {
    startDate: tests.periodValidation.periodStartDate(period.startDate),
    endDate: tests.periodValidation.periodEndDate(period.endDate),
    insuranceName: tests.periodValidation.insuranceName(period.insuranceName),
    insuranceType: tests.periodValidation.insuranceType(period.insuranceType),
    insuranceId: tests.periodValidation.insuranceId(period.insuranceId),
    country: tests.periodValidation.periodCountry(period.country),
    timeSpan: tests.periodValidation.periodTimeSpan(period.startDate, period.endDate)
  }

  switch (period.type) {
    case 'work':
      errors.workActivity = tests.periodValidation.workActivity(period.workActivity)
      errors.workName = tests.periodValidation.workName(period.workName)
      errors.workPlace = tests.periodValidation.workPlace(period.workPlace)
      break

    case 'home':
      errors.place = tests.periodValidation.periodPlace(period.place)
      break

    case 'child':
      errors.childFirstName = tests.periodValidation.childFirstName(period.childFirstName)
      errors.childLastName = tests.periodValidation.childLastName(period.childLastName)
      errors.childBirthDate = tests.periodValidation.childBirthDate(period.childBirthDate)
      break

    case 'learn':
      errors.learnInstitution = tests.periodValidation.learnInstitution(period.learnInstitution)
      break

    case 'daily':
    case 'sick':
      errors.payingInstitution = tests.periodValidation.payingInstitution(period.payingInstitution)
      break

    case 'other':
      errors.otherType = tests.periodValidation.otherType(period.otherType)
      break

    default:
      break
  }
  return errors
}
