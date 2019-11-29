import { Period } from 'applications/BUC/declarations/period'
import _ from 'lodash'
import * as stepTests from './stepTests'

describe('applications/BUC/components/SEDP4000/Validation/stepTests', () => {
  it('periodStep - work', () => {
    let period: Period = { type: 'work' } as Period
    let errors = stepTests.periodStep(period)
    expect(errors.startDate).toEqual('buc:validation-noStartDate')

    period = { ...period, startDate: { day: '1', month: '1', year: '1970' } }
    errors = stepTests.periodStep(period)
    expect(errors.endDate).toEqual('buc:validation-noEndDate')

    period = { ...period, endDate: { day: '1', month: '1', year: '1980' } }
    errors = stepTests.periodStep(period)
    expect(errors.country).toEqual('buc:validation-noCountry')

    period = { ...period, country: {label: 'something', value: 'something'} }
    errors = stepTests.periodStep(period)
    expect(errors.workActivity).toEqual('buc:validation-noWorkActivity')

    period = { ...period, workActivity: 'something' }
    errors = stepTests.periodStep(period)
    expect(errors.workType).toEqual('buc:validation-noWorkType')

    period = { ...period, workType: '01' }
    errors = stepTests.periodStep(period)
    expect(errors.workCity).toEqual('buc:validation-noWorkCity')

    period = { ...period, workCity: 'something' }
    errors = stepTests.periodStep(period)
    expect(_(errors).find(err => err !== undefined)).toEqual(undefined)
  })

  it('periodStep - home', () => {
    let period: Period  = { type: 'home' } as Period
    let errors = stepTests.periodStep(period)
    expect(errors.startDate).toEqual('buc:validation-noStartDate')

    period = { ...period, startDate: { day: '1', month: '1', year: '1970' } }
    errors = stepTests.periodStep(period)
    expect(errors.endDate).toEqual('buc:validation-noEndDate')

    period = { ...period, endDate: { day: '1', month: '1', year: '1980' } }
    errors = stepTests.periodStep(period)
    expect(errors.country).toEqual('buc:validation-noCountry')

    period = { ...period, country: {label: 'something', value: 'something'} }
    errors = stepTests.periodStep(period)
    expect(_(errors).find(err => err !== undefined)).toEqual(undefined)
  })

  it('periodStep - military', () => {
    let period: Period = { type: 'military' } as Period
    let errors = stepTests.periodStep(period)
    expect(errors.startDate).toEqual('buc:validation-noStartDate')

    period = { ...period, startDate: { day: '1', month: '1', year: '1970' } }
    errors = stepTests.periodStep(period)
    expect(errors.endDate).toEqual('buc:validation-noEndDate')

    period = { ...period, endDate: { day: '1', month: '1', year: '1980' } }
    errors = stepTests.periodStep(period)
    expect(errors.country).toEqual('buc:validation-noCountry')

    period = { ...period, country: {label: 'something', value: 'something'} }
    errors = stepTests.periodStep(period)
    expect(_(errors).find(err => err !== undefined)).toEqual(undefined)
  })

  it('periodStep - voluntary', () => {
    let period: Period  = { type: 'voluntary' } as Period
    let errors = stepTests.periodStep(period)
    expect(errors.startDate).toEqual('buc:validation-noStartDate')

    period = { ...period, startDate: { day: '1', month: '1', year: '1970' } }
    errors = stepTests.periodStep(period)
    expect(errors.endDate).toEqual('buc:validation-noEndDate')

    period = { ...period, endDate: { day: '1', month: '1', year: '1980' } }
    errors = stepTests.periodStep(period)
    expect(errors.country).toEqual('buc:validation-noCountry')

    period = { ...period, country: {label: 'something', value: 'something'} }
    errors = stepTests.periodStep(period)
    expect(_(errors).find(err => err !== undefined)).toEqual(undefined)
  })

  it('periodStep - child', () => {
    let period: Period = { type: 'child' } as Period
    let errors = stepTests.periodStep(period)
    expect(errors.startDate).toEqual('buc:validation-noStartDate')

    period = { ...period, startDate: { day: '1', month: '1', year: '1970' } }
    errors = stepTests.periodStep(period)
    expect(errors.endDate).toEqual('buc:validation-noEndDate')

    period = { ...period, endDate: { day: '1', month: '1', year: '1980' } }
    errors = stepTests.periodStep(period)
    expect(errors.childFirstName).toEqual('buc:validation-noChildFirstName')

    period = { ...period, childFirstName: 'something' }
    errors = stepTests.periodStep(period)
    expect(errors.childLastName).toEqual('buc:validation-noChildLastName')

    period = { ...period, childLastName: 'something' }
    errors = stepTests.periodStep(period)
    expect(errors.childBirthDate).toEqual('buc:validation-noChildBirthDate')

    period = { ...period, childBirthDate: { day: '1', month: '1', year: '1970' } }
    errors = stepTests.periodStep(period)
    expect(errors.country).toEqual('buc:validation-noCountry')

    period = { ...period, country: {label: 'something', value: 'something'} }
    errors = stepTests.periodStep(period)
    expect(_(errors).find(err => err !== undefined)).toEqual(undefined)
  })

  it('periodStep - birth', () => {
    let period: Period = { type: 'birth' } as Period
    let errors = stepTests.periodStep(period)
    expect(errors.startDate).toEqual('buc:validation-noStartDate')

    period = { ...period, startDate: { day: '1', month: '1', year: '1970' } }
    errors = stepTests.periodStep(period)
    expect(errors.endDate).toEqual('buc:validation-noEndDate')

    period = { ...period, endDate: { day: '1', month: '1', year: '1980' } }
    errors = stepTests.periodStep(period)
    expect(errors.country).toEqual('buc:validation-noCountry')

    period = { ...period, country: {label: 'something', value: 'something'} }
    errors = stepTests.periodStep(period)
    expect(_(errors).find(err => err !== undefined)).toEqual(undefined)
  })

  it('periodStep - daily', () => {
    let period: Period  = { type: 'daily' } as Period
    let errors = stepTests.periodStep(period)
    expect(errors.startDate).toEqual('buc:validation-noStartDate')

    period = { ...period, startDate: { day: '1', month: '1', year: '1970' } }
    errors = stepTests.periodStep(period)
    expect(errors.endDate).toEqual('buc:validation-noEndDate')

    period = { ...period, endDate: { day: '1', month: '1', year: '1980' } }
    errors = stepTests.periodStep(period)
    expect(errors.country).toEqual('buc:validation-noCountry')

    period = { ...period, country: {label: 'something', value: 'something'} }
    errors = stepTests.periodStep(period)
    expect(errors.payingInstitution).toEqual('buc:validation-noPayingInstitution')

    period = { ...period, payingInstitution: 'something' }
    errors = stepTests.periodStep(period)
    expect(_(errors).find(err => err !== undefined)).toEqual(undefined)
  })

  it('periodStep - sick', () => {
    let period: Period = { type: 'sick' } as Period
    let errors = stepTests.periodStep(period)
    expect(errors.startDate).toEqual('buc:validation-noStartDate')

    period = { ...period, startDate: { day: '1', month: '1', year: '1970' } }
    errors = stepTests.periodStep(period)
    expect(errors.endDate).toEqual('buc:validation-noEndDate')

    period = { ...period, endDate: { day: '1', month: '1', year: '1980' } }
    errors = stepTests.periodStep(period)
    expect(errors.country).toEqual('buc:validation-noCountry')

    period = { ...period, country: {label: 'something', value: 'something'} }
    errors = stepTests.periodStep(period)
    expect(errors.payingInstitution).toEqual('buc:validation-noPayingInstitution')

    period = { ...period, payingInstitution: 'something' }
    errors = stepTests.periodStep(period)
    expect(_(errors).find(err => err !== undefined)).toEqual(undefined)
  })

  it('periodStep - learn', () => {
    let period: Period = { type: 'learn' } as Period
    let errors = stepTests.periodStep(period)
    expect(errors.startDate).toEqual('buc:validation-noStartDate')

    period = { ...period, startDate: { day: '1', month: '1', year: '1970' } }
    errors = stepTests.periodStep(period)
    expect(errors.endDate).toEqual('buc:validation-noEndDate')

    period = { ...period, endDate: { day: '1', month: '1', year: '1980' } }
    errors = stepTests.periodStep(period)
    expect(errors.country).toEqual('buc:validation-noCountry')

    period = { ...period, country: {label: 'something', value: 'something'} }
    errors = stepTests.periodStep(period)
    expect(errors.learnInstitution).toEqual('buc:validation-noLearnInstitution')

    period = { ...period, learnInstitution: 'something' }
    errors = stepTests.periodStep(period)
    expect(_(errors).find(err => err !== undefined)).toEqual(undefined)
  })

  it('periodStep - other', () => {
    let period: Period = { type: 'other' } as Period
    let errors = stepTests.periodStep(period)
    expect(errors.startDate).toEqual('buc:validation-noStartDate')

    period = { ...period, startDate: { day: '1', month: '1', year: '1970' } }
    errors = stepTests.periodStep(period)
    expect(errors.endDate).toEqual('buc:validation-noEndDate')

    period = { ...period, endDate: { day: '1', month: '1', year: '1980' } }
    errors = stepTests.periodStep(period)
    expect(errors.country).toEqual('buc:validation-noCountry')

    period = { ...period, country: {label: 'something', value: 'something'} }
    errors = stepTests.periodStep(period)
    expect(errors.otherType).toEqual('buc:validation-noOtherType')

    period = { ...period, otherType: 'something' }
    errors = stepTests.periodStep(period)
    expect(_(errors).find(err => err !== undefined)).toEqual(undefined)
  })
})
