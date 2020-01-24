import * as singleTests from './singleTests'

describe('applications/BUC/components/SEDP4000/Validation/singleTests', () => {
  it('stayAbroadValidation', () => {
    expect(Object.keys(singleTests.stayAbroadValidation)).toEqual([
      'noPeriods'
    ])
  })

  it('periodValidation functions', () => {
    expect(Object.keys(singleTests.periodValidation)).toEqual([
      'periodType',
      'periodStartDate',
      'periodEndDate',
      'childBirthDate',
      'periodStartDateOnBlur',
      'periodEndDateOnBlur',
      'childBirthDateOnBlur',
      'periodStartDateOnChange',
      'periodEndDateOnChange',
      'childBirthDateOnChange',
      'periodTimeSpan',
      'periodCountry',
      'insuranceName',
      'insuranceType',
      'insuranceId',
      'workActivity',
      'workName',
      'workType',
      'workStreet',
      'workCity',
      'workZipCode',
      'workRegion',
      'workPlace',
      'childFirstName',
      'childLastName',
      'learnInstitution',
      'payingInstitution',
      'otherType',
      'comment'
    ])
  })

  it('periodValidation.periodType function', () => {
    let result: string | undefined = singleTests.periodValidation.periodType(undefined)
    expect(result).toEqual('buc:validation-noPeriodType')
    result = singleTests.periodValidation.periodType('mock')
    expect(result).toEqual('buc:validation-invalidPeriodType')
    result = singleTests.periodValidation.periodType('home')
    expect(result).toEqual(undefined)
  })

  it('periodValidation.periodStartDate function', () => {
    let result: string | undefined = singleTests.periodValidation.periodStartDate(undefined)
    expect(result).toEqual('buc:validation-noStartDate')
    result = singleTests.periodValidation.periodStartDate({ day: '1', month: '1' })
    expect(result).toEqual('buc:validation-noYear')
    result = singleTests.periodValidation.periodStartDate({ day: '1', year: '1970' })
    expect(result).toEqual('buc:validation-noMonth')
    result = singleTests.periodValidation.periodStartDate({ day: '1', month: '1', year: '1970' })
    expect(result).toEqual(undefined)
  })

  it('periodValidation.periodEndDate function', () => {
    let result: string | undefined = singleTests.periodValidation.periodEndDate(undefined)
    expect(result).toEqual('buc:validation-noEndDate')
    result = singleTests.periodValidation.periodEndDate({ day: '1', month: '1' })
    expect(result).toEqual('buc:validation-noYear')
    result = singleTests.periodValidation.periodEndDate({ day: '1', year: '1970' })
    expect(result).toEqual('buc:validation-noMonth')
    result = singleTests.periodValidation.periodEndDate({ day: '1', month: '1', year: '1970' })
    expect(result).toEqual(undefined)
  })

  it('periodValidation.childBirthDate function', () => {
    let result: string | undefined = singleTests.periodValidation.childBirthDate(undefined)
    expect(result).toEqual('buc:validation-noChildBirthDate')
    result = singleTests.periodValidation.childBirthDate({ day: '1', month: '1' })
    expect(result).toEqual('buc:validation-noYear')
    result = singleTests.periodValidation.childBirthDate({ day: '1', year: '1970' })
    expect(result).toEqual('buc:validation-noMonth')
    result = singleTests.periodValidation.childBirthDate({ day: '1', month: '1', year: '1970' })
    expect(result).toEqual(undefined)
  })

  it('periodValidation.periodStartDateOnBlur function', () => {
    let result: string | undefined = singleTests.periodValidation.periodStartDateOnBlur({ year: '70' })
    expect(result).toEqual('buc:validation-inValidYear')
    result = singleTests.periodValidation.periodStartDateOnBlur({ day: '1', month: '1', year: '1970' })
    expect(result).toEqual(undefined)
  })

  it('periodValidation.periodEndDateOnBlur function', () => {
    // @ts-ignore
    let result: string | undefined = singleTests.periodValidation.periodEndDateOnBlur({ year: '70' })
    expect(result).toEqual('buc:validation-inValidYear')
    result = singleTests.periodValidation.periodEndDateOnBlur({ day: '1', month: '1', year: '1970' })
    expect(result).toEqual(undefined)
  })

  it('periodValidation.childBirthDateOnBlur function', () => {
    // @ts-ignore
    let result: string | undefined = singleTests.periodValidation.childBirthDateOnBlur({ year: '70' })
    expect(result).toEqual('buc:validation-inValidYear')
    result = singleTests.periodValidation.childBirthDateOnBlur({ day: '1', month: '1', year: '1970' })
    expect(result).toEqual(undefined)
  })

  it('periodValidation.periodStartDateOnChange function', () => {
    let result: string | undefined = singleTests.periodValidation.periodStartDateOnChange({ day: 'one', month: '1', year: '1970' })
    expect(result).toEqual('buc:validation-invalidStartDate')
    result = singleTests.periodValidation.periodStartDateOnChange({ day: '1', month: '1', year: '2099' })
    expect(result).toEqual('buc:validation-futureDate')
    result = singleTests.periodValidation.periodStartDateOnChange({ day: '1', month: '1', year: '1970' })
    expect(result).toEqual(undefined)
  })

  it('periodValidation.periodEndDateOnChange function', () => {
    let result: string | undefined = singleTests.periodValidation.periodEndDateOnChange({ day: 'one', month: '1', year: '1970' })
    expect(result).toEqual('buc:validation-invalidEndDate')
    result = singleTests.periodValidation.periodEndDateOnChange({ day: '1', month: '1', year: '2099' })
    expect(result).toEqual('buc:validation-futureDate')
    result = singleTests.periodValidation.periodEndDateOnChange({ day: '1', month: '1', year: '1970' })
    expect(result).toEqual(undefined)
  })

  it('periodValidation.childBirthDateOnChange function', () => {
    let result: string | undefined = singleTests.periodValidation.childBirthDateOnChange({ day: 'one', month: '1', year: '1970' })
    expect(result).toEqual('buc:validation-invalidChildBirthDate')
    result = singleTests.periodValidation.childBirthDateOnChange({ day: '1', month: '1', year: '2099' })
    expect(result).toEqual('buc:validation-futureDate')
    result = singleTests.periodValidation.childBirthDateOnChange({ day: '1', month: '1', year: '1970' })
    expect(result).toEqual(undefined)
  })

  it('periodValidation.periodTimeSpan function', () => {
    let result: string | undefined = singleTests.periodValidation.periodTimeSpan(
      { day: '1', month: '1', year: '1970' },
      { day: '1', month: '1', year: '1960' })
    expect(result).toEqual('buc:validation-startAfterEnd')
    result = singleTests.periodValidation.periodTimeSpan(
      { day: '1', month: '1', year: '1970' },
      { day: '1', month: '1', year: '1980' })
    expect(result).toEqual(undefined)
  })

  it('periodValidation.insuranceName function', () => {
    let result: string | undefined = singleTests.periodValidation.insuranceName(undefined)
    expect(result).toEqual(undefined)
    result = singleTests.periodValidation.insuranceName('12345678901234567890123456789012345678901234567890123456789012345678901')
    expect(result).toEqual('buc:validation-wowMuchText')
    result = singleTests.periodValidation.insuranceName('something')
    expect(result).toEqual(undefined)
  })

  it('periodValidation.insuranceType function', () => {
    let result: string | undefined = singleTests.periodValidation.insuranceType(undefined)
    expect(result).toEqual(undefined)
    result = singleTests.periodValidation.insuranceType('something')
    expect(result).toEqual(undefined)
  })

  it('periodValidation.insuranceId function', () => {
    let result: string | undefined = singleTests.periodValidation.insuranceId(undefined)
    expect(result).toEqual(undefined)
    result = singleTests.periodValidation.insuranceId('123456789012345678901234567890123456789012345678901')
    expect(result).toEqual('buc:validation-wowMuchText')
    result = singleTests.periodValidation.insuranceId('something')
    expect(result).toEqual(undefined)
  })

  it('periodValidation.periodCountry function', () => {
    let result: string | undefined = singleTests.periodValidation.periodCountry(undefined)
    expect(result).toEqual('buc:validation-noCountry')
    result = singleTests.periodValidation.periodCountry('something')
    expect(result).toEqual(undefined)
  })

  it('periodValidation.workActivity function', () => {
    let result: string | undefined = singleTests.periodValidation.workActivity(undefined)
    expect(result).toEqual('buc:validation-noWorkActivity')
    result = singleTests.periodValidation.workActivity('12345678901234567890123456789012345678901234567890123456789012345678901')
    expect(result).toEqual('buc:validation-wowMuchText')
    result = singleTests.periodValidation.workActivity('something')
    expect(result).toEqual(undefined)
  })

  it('periodValidation.workName function', () => {
    let result: string | undefined = singleTests.periodValidation.workName(undefined)
    expect(result).toEqual(undefined)
    result = singleTests.periodValidation.workName('12345678901234567890123456789012345678901234567890123456789012345678901')
    expect(result).toEqual('buc:validation-wowMuchText')
    result = singleTests.periodValidation.workName('something')
    expect(result).toEqual(undefined)
  })

  it('periodValidation.workPlace function', () => {
    let result: string | undefined = singleTests.periodValidation.workPlace(undefined)
    expect(result).toEqual(undefined)
    result = singleTests.periodValidation.workPlace('12345678901234567890123456789012345678901234567890123456789012345678901')
    expect(result).toEqual('buc:validation-wowMuchText')
    result = singleTests.periodValidation.workPlace('something')
    expect(result).toEqual(undefined)
  })

  it('periodValidation.childFirstName function', () => {
    let result: string | undefined = singleTests.periodValidation.childFirstName(undefined)
    expect(result).toEqual('buc:validation-noChildFirstName')
    result = singleTests.periodValidation.childFirstName('123')
    expect(result).toEqual('buc:validation-invalidName')
    result = singleTests.periodValidation.childFirstName('abcdefghihjklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghij')
    expect(result).toEqual('buc:validation-wowMuchText')
    result = singleTests.periodValidation.childFirstName('something')
    expect(result).toEqual(undefined)
  })

  it('periodValidation.childLastName function', () => {
    let result: string | undefined = singleTests.periodValidation.childLastName(undefined)
    expect(result).toEqual('buc:validation-noChildLastName')
    result = singleTests.periodValidation.childLastName('123')
    expect(result).toEqual('buc:validation-invalidName')
    result = singleTests.periodValidation.childLastName('abcdefghihjklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghij')
    expect(result).toEqual('buc:validation-wowMuchText')
    result = singleTests.periodValidation.childLastName('something')
    expect(result).toEqual(undefined)
  })

  it('periodValidation.learnInstitution function', () => {
    let result: string | undefined = singleTests.periodValidation.learnInstitution(undefined)
    expect(result).toEqual('buc:validation-noLearnInstitution')
    result = singleTests.periodValidation.learnInstitution('12345678901234567890123456789012345678901234567890123456789012345678901')
    expect(result).toEqual('buc:validation-wowMuchText')
    result = singleTests.periodValidation.learnInstitution('something')
    expect(result).toEqual(undefined)
  })

  it('periodValidation.payingInstitution function', () => {
    let result: string | undefined = singleTests.periodValidation.payingInstitution(undefined)
    expect(result).toEqual('buc:validation-noPayingInstitution')
    result = singleTests.periodValidation.payingInstitution('12345678901234567890123456789012345678901234567890123456789012345678901')
    expect(result).toEqual('buc:validation-wowMuchText')
    result = singleTests.periodValidation.payingInstitution('something')
    expect(result).toEqual(undefined)
  })

  it('periodValidation.otherType function', () => {
    let result: string | undefined = singleTests.periodValidation.otherType(undefined)
    expect(result).toEqual('buc:validation-noOtherType')
    result = singleTests.periodValidation.otherType('12345678901234567890123456789012345678901234567890123456789012345678901')
    expect(result).toEqual('buc:validation-wowMuchText')
    result = singleTests.periodValidation.otherType('something')
    expect(result).toEqual(undefined)
  })
})
