import * as tests from './singleTests'

export function personStep (person) {
  let errors = {}
  let nameAtBirth = tests.personValidation.nameAtBirth(person.nameAtBirth)
  let previousName = tests.personValidation.previousName(person.previousName)
  let id = tests.personValidation.id(person.id)
  let fatherName = tests.personValidation.fatherName(person.fatherName)
  let motherName = tests.personValidation.motherName(person.motherName)
  let country = tests.personValidation.country(person.country)
  let city = tests.personValidation.city(person.city)
  let region = tests.personValidation.region(person.region)
  let phone = tests.personValidation.phone(person.phone)
  let email = tests.personValidation.email(person.email)

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
  let errors = {}
  let bankName = tests.bankValidation.bankName(bank.bankName)
  let bankAddress = tests.bankValidation.bankAddress(bank.bankAddress)
  let bankCountry = tests.bankValidation.bankCountry(bank.bankCountry)
  let bankBicSwift = tests.bankValidation.bankBicSwift(bank.bankBicSwift)
  let bankIban = tests.bankValidation.bankIban(bank.bankIban)

  if (bankName) errors.bankName = bankName
  if (bankAddress) errors.bankAddress = bankAddress
  if (bankCountry) errors.bankCountry = bankCountry
  if (bankBicSwift) errors.bankBicSwift = bankBicSwift
  if (bankIban) errors.bankIban = bankIban
  return errors
}

export function stayAbroadStep (stayAbroad) {
  let errors = {}
  let onePeriod = tests.stayAbroadValidation.atLeastOnePeriod(stayAbroad)
  if (onePeriod) errors.onePeriod = onePeriod
  return errors
}

export function periodStep (period) {
  let errors = {}
  let startDate = tests.periodValidation.startDate(period.startDate)
  let endDate = tests.periodValidation.endDate(period.endDate)
  let insuranceName = tests.periodValidation.insuranceName(period.insuranceName)
  let insuranceType = tests.periodValidation.insuranceType(period.insuranceType)
  let address = tests.periodValidation.address(period.address)
  let city = tests.periodValidation.city(period.city)
  let region = tests.periodValidation.region(period.region)

  if (startDate) errors.startDate = startDate
  if (endDate) errors.endDate = endDate
  if (insuranceName) errors.insuranceName = insuranceName
  if (insuranceType) errors.insuranceType = insuranceType
  if (address) errors.address = address
  if (city) errors.city = city
  if (region) errors.region = region

  switch (period.type) {
    case 'work':

    let workActivity = tests.periodValidation.workActivity(period.workActivity)
    let workId = tests.periodValidation.workId(period.workId)
    let workName = tests.periodValidation.workName(period.workName)
    let workAddress = tests.periodValidation.workAddress(period.workAddress)
    let workCity = tests.periodValidation.workCity(period.workCity)
    let workRegion = tests.periodValidation.workRegion(period.workRegion)

    if (workActivity) errors.workActivity = workActivity
    if (workId) errors.workId = workId
    if (workName) errors.workName = workName
    if (workAddress) errors.workAddress = workAddress
    if (workCity) errors.workCity = workCity
    if (workRegion) errors.workRegion = workRegion
    break

    case 'child':

    let childFirstName = tests.periodValidation.childFirstName(period.childFirstName)
    let childLastName = tests.periodValidation.childLastName(period.childLastName)
    let childBirthDate = tests.periodValidation.childBirthDate(period.childBirthDate)

    if (childFirstName) errors.childFirstName = childFirstName
    if (childLastName) errors.childLastName = childLastName
    if (childBirthDate) errors.childBirthDate = childBirthDate
    break

    case 'learn':

    let learnInstitution = tests.periodValidation.learnInstitution(period.learnInstitution)
    if (learnInstitution) errors.learnInstitution = learnInstitution
    break

    default:
    break
  }
  return errors
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
