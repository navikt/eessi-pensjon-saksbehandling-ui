import * as stepTests from './stepTests'
import _ from 'lodash'

describe('applications/BUC/components/SEDP4000/Validation/stepTests', () => {
  it('stayAbroadStep', () => {
    let errors = stepTests.stayAbroadStep({})
    expect(errors).toEqual({})
  })

  it('periodStep - work', () => {
    let period = { type: 'work' }
    let errors = stepTests.periodStep(period)
    expect(errors.startDate).toEqual('pinfo:validation-noStartDate')

    period = { ...period, startDate: { day: '1', month: '1', year: '1970' } }
    errors = stepTests.periodStep(period)
    expect(errors.endDate).toEqual('pinfo:validation-noEndDate')

    period = { ...period, endDate: { day: '1', month: '1', year: '1980' } }
    errors = stepTests.periodStep(period)
    expect(errors.place).toEqual('pinfo:validation-noPlace')

    period = { ...period, place: 'something' }
    errors = stepTests.periodStep(period)
    expect(errors.country).toEqual('pinfo:validation-noCountry')

    period = { ...period, country: 'something' }
    errors = stepTests.periodStep(period)
    expect(errors.workActivity).toEqual('pinfo:validation-noWorkActivity')

    period = { ...period, workActivity: 'something' }
    errors = stepTests.periodStep(period)
    expect(_(errors).find(err => err !== undefined)).toEqual(undefined)
  })

  it('periodStep - home', () => {
    let period = { type: 'home' }
    let errors = stepTests.periodStep(period)
    expect(errors.startDate).toEqual('pinfo:validation-noStartDate')

    period = { ...period, startDate: { day: '1', month: '1', year: '1970' } }
    errors = stepTests.periodStep(period)
    expect(errors.endDate).toEqual('pinfo:validation-noEndDate')

    period = { ...period, endDate: { day: '1', month: '1', year: '1980' } }
    errors = stepTests.periodStep(period)
    expect(errors.place).toEqual('pinfo:validation-noPlace')

    period = { ...period, place: 'something' }
    errors = stepTests.periodStep(period)
    expect(errors.country).toEqual('pinfo:validation-noCountry')

    period = { ...period, country: 'something' }
    errors = stepTests.periodStep(period)
    expect(_(errors).find(err => err !== undefined)).toEqual(undefined)
  })

  it('periodStep - military', () => {
    let period = { type: 'military' }
    let errors = stepTests.periodStep(period)
    expect(errors.startDate).toEqual('pinfo:validation-noStartDate')

    period = { ...period, startDate: { day: '1', month: '1', year: '1970' } }
    errors = stepTests.periodStep(period)
    expect(errors.endDate).toEqual('pinfo:validation-noEndDate')

    period = { ...period, endDate: { day: '1', month: '1', year: '1980' } }
    errors = stepTests.periodStep(period)
    expect(errors.place).toEqual('pinfo:validation-noPlace')

    period = { ...period, place: 'something' }
    errors = stepTests.periodStep(period)
    expect(errors.country).toEqual('pinfo:validation-noCountry')

    period = { ...period, country: 'something' }
    errors = stepTests.periodStep(period)
    expect(_(errors).find(err => err !== undefined)).toEqual(undefined)
  })

  it('periodStep - voluntary', () => {
    let period = { type: 'voluntary' }
    let errors = stepTests.periodStep(period)
    expect(errors.startDate).toEqual('pinfo:validation-noStartDate')

    period = { ...period, startDate: { day: '1', month: '1', year: '1970' } }
    errors = stepTests.periodStep(period)
    expect(errors.endDate).toEqual('pinfo:validation-noEndDate')

    period = { ...period, endDate: { day: '1', month: '1', year: '1980' } }
    errors = stepTests.periodStep(period)
    expect(errors.place).toEqual('pinfo:validation-noPlace')

    period = { ...period, place: 'something' }
    errors = stepTests.periodStep(period)
    expect(errors.country).toEqual('pinfo:validation-noCountry')

    period = { ...period, country: 'something' }
    errors = stepTests.periodStep(period)
    expect(_(errors).find(err => err !== undefined)).toEqual(undefined)
  })

  it('periodStep - child', () => {
    let period = { type: 'child' }
    let errors = stepTests.periodStep(period)
    expect(errors.startDate).toEqual('pinfo:validation-noStartDate')

    period = { ...period, startDate: { day: '1', month: '1', year: '1970' } }
    errors = stepTests.periodStep(period)
    expect(errors.endDate).toEqual('pinfo:validation-noEndDate')

    period = { ...period, endDate: { day: '1', month: '1', year: '1980' } }
    errors = stepTests.periodStep(period)
    expect(errors.place).toEqual('pinfo:validation-noPlace')

    period = { ...period, place: 'something' }
    errors = stepTests.periodStep(period)
    expect(errors.country).toEqual('pinfo:validation-noCountry')

    period = { ...period, country: 'something' }
    errors = stepTests.periodStep(period)
    expect(errors.childFirstName).toEqual('pinfo:validation-noChildFirstName')

    period = { ...period, childFirstName: 'something' }
    errors = stepTests.periodStep(period)
    expect(errors.childLastName).toEqual('pinfo:validation-noChildLastName')

    period = { ...period, childLastName: 'something' }
    errors = stepTests.periodStep(period)
    expect(errors.childBirthDate).toEqual('pinfo:validation-noChildBirthDate')

    period = { ...period, childBirthDate: { day: '1', month: '1', year: '1970' } }
    errors = stepTests.periodStep(period)
    expect(_(errors).find(err => err !== undefined)).toEqual(undefined)
  })

  it('periodStep - birth', () => {
    let period = { type: 'birth' }
    let errors = stepTests.periodStep(period)
    expect(errors.startDate).toEqual('pinfo:validation-noStartDate')

    period = { ...period, startDate: { day: '1', month: '1', year: '1970' } }
    errors = stepTests.periodStep(period)
    expect(errors.endDate).toEqual('pinfo:validation-noEndDate')

    period = { ...period, endDate: { day: '1', month: '1', year: '1980' } }
    errors = stepTests.periodStep(period)
    expect(errors.place).toEqual('pinfo:validation-noPlace')

    period = { ...period, place: 'something' }
    errors = stepTests.periodStep(period)
    expect(errors.country).toEqual('pinfo:validation-noCountry')

    period = { ...period, country: 'something' }
    errors = stepTests.periodStep(period)
    expect(_(errors).find(err => err !== undefined)).toEqual(undefined)
  })

  it('periodStep - daily', () => {
    let period = { type: 'daily' }
    let errors = stepTests.periodStep(period)
    expect(errors.startDate).toEqual('pinfo:validation-noStartDate')

    period = { ...period, startDate: { day: '1', month: '1', year: '1970' } }
    errors = stepTests.periodStep(period)
    expect(errors.endDate).toEqual('pinfo:validation-noEndDate')

    period = { ...period, endDate: { day: '1', month: '1', year: '1980' } }
    errors = stepTests.periodStep(period)
    expect(errors.place).toEqual('pinfo:validation-noPlace')

    period = { ...period, place: 'something' }
    errors = stepTests.periodStep(period)
    expect(errors.country).toEqual('pinfo:validation-noCountry')

    period = { ...period, country: 'something' }
    errors = stepTests.periodStep(period)
    expect(errors.payingInstitution).toEqual('pinfo:validation-noPayingInstitution')

    period = { ...period, payingInstitution: 'something' }
    errors = stepTests.periodStep(period)
    expect(_(errors).find(err => err !== undefined)).toEqual(undefined)
  })

  it('periodStep - sick', () => {
    let period = { type: 'sick' }
    let errors = stepTests.periodStep(period)
    expect(errors.startDate).toEqual('pinfo:validation-noStartDate')

    period = { ...period, startDate: { day: '1', month: '1', year: '1970' } }
    errors = stepTests.periodStep(period)
    expect(errors.endDate).toEqual('pinfo:validation-noEndDate')

    period = { ...period, endDate: { day: '1', month: '1', year: '1980' } }
    errors = stepTests.periodStep(period)
    expect(errors.place).toEqual('pinfo:validation-noPlace')

    period = { ...period, place: 'something' }
    errors = stepTests.periodStep(period)
    expect(errors.country).toEqual('pinfo:validation-noCountry')

    period = { ...period, country: 'something' }
    errors = stepTests.periodStep(period)
    expect(errors.payingInstitution).toEqual('pinfo:validation-noPayingInstitution')

    period = { ...period, payingInstitution: 'something' }
    errors = stepTests.periodStep(period)
    expect(_(errors).find(err => err !== undefined)).toEqual(undefined)
  })

  it('periodStep - learn', () => {
    let period = { type: 'learn' }
    let errors = stepTests.periodStep(period)
    expect(errors.startDate).toEqual('pinfo:validation-noStartDate')

    period = { ...period, startDate: { day: '1', month: '1', year: '1970' } }
    errors = stepTests.periodStep(period)
    expect(errors.endDate).toEqual('pinfo:validation-noEndDate')

    period = { ...period, endDate: { day: '1', month: '1', year: '1980' } }
    errors = stepTests.periodStep(period)
    expect(errors.place).toEqual('pinfo:validation-noPlace')

    period = { ...period, place: 'something' }
    errors = stepTests.periodStep(period)
    expect(errors.country).toEqual('pinfo:validation-noCountry')

    period = { ...period, country: 'something' }
    errors = stepTests.periodStep(period)
    expect(errors.learnInstitution).toEqual('pinfo:validation-noLearnInstitution')

    period = { ...period, learnInstitution: 'something' }
    errors = stepTests.periodStep(period)
    expect(_(errors).find(err => err !== undefined)).toEqual(undefined)
  })

  it('periodStep - other', () => {
    let period = { type: 'other' }
    let errors = stepTests.periodStep(period)
    expect(errors.startDate).toEqual('pinfo:validation-noStartDate')

    period = { ...period, startDate: { day: '1', month: '1', year: '1970' } }
    errors = stepTests.periodStep(period)
    expect(errors.endDate).toEqual('pinfo:validation-noEndDate')

    period = { ...period, endDate: { day: '1', month: '1', year: '1980' } }
    errors = stepTests.periodStep(period)
    expect(errors.place).toEqual('pinfo:validation-noPlace')

    period = { ...period, place: 'something' }
    errors = stepTests.periodStep(period)
    expect(errors.country).toEqual('pinfo:validation-noCountry')

    period = { ...period, country: 'something' }
    errors = stepTests.periodStep(period)
    expect(errors.otherType).toEqual('pinfo:validation-noOtherType')

    period = { ...period, otherType: 'something' }
    errors = stepTests.periodStep(period)
    expect(_(errors).find(err => err !== undefined)).toEqual(undefined)
  })
})
