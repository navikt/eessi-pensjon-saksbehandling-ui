import dateDecimal, { isFloat, getFloatValues, writeFloat, sumValues, sumDates } from 'src/utils/dateDecimal'

describe('utils/dateDecimal', () => {
  it('isFloat', () => {
    expect(isFloat('6.25')).toEqual(true)
    expect(isFloat(6.25)).toEqual(true)
    expect(isFloat('6')).toEqual(false)
    expect(isFloat(6)).toEqual(false)
  })

  it('writeFloat', () => {
    expect(writeFloat('6.2525')).toEqual('6.25')
    expect(writeFloat(6.2525)).toEqual('6.25')
    expect(writeFloat('6.2')).toEqual('6.20')
    expect(writeFloat(6.2)).toEqual('6.20')
  })

  it('sumValues', () => {
    expect(sumValues(1, '2', 3, '4')).toEqual(10)
    expect(sumValues(1, '2', 3.1, '4.1')).toEqual(10.2)
  })

  it('getFloatValues', () => {
    expect(getFloatValues('6.25')).toEqual([6, 0.25])
    expect(getFloatValues('6.0')).toEqual([6, 0])
    expect(getFloatValues('6')).toEqual([6, 0])
    expect(getFloatValues('.25')).toEqual([0, 0.25])
    expect(getFloatValues(0)).toEqual([0, 0])
  })

  it('sumDates', () => {
    // 40 + 40.1 + 13.5 * 30 + 12.5 * 30 + 2.5 * 360 = 1760.1 = 4 years 10 months 20.1 days
    expect(sumDates(
      { days: '40', months: 13.5, years: '2.5' },
      { days: 40.1, months: '12.5', years: undefined }
    )).toEqual({
      days: 20, months: 10, years: 4, totalDays: 1760
    })
  })

  it('dateDecimal: handles null/undefined', () => {
    expect(dateDecimal({ dateFom: '1992-04-06', years: null, months: 3.5, days: undefined })).toEqual({
      days: 15, months: 3, years: 0, totalDays: 106
    })
  })

  it('dateDecimal: handles decimals', () => {
    expect(dateDecimal({ dateFom: '1992-04-06', years: 5.25, months: 0, days: 0 })).toEqual({
      days: 0, months: 3, years: 5, totalDays: 1917
    })
    expect(dateDecimal({ dateFom: '1992-04-06', years: 0, months: 32.12, days: 0 })).toEqual({
      days: 4, months: 8, years: 2, totalDays: 978
    })
    expect(dateDecimal({ dateFom: '1992-04-06', years: 1.5, months: 1.5, days: 1.5 })).toEqual({
      days: 17, months: 7, years: 1, totalDays: 596
    })
  })

  it('dateDecimal: outputs as string', () => {
    expect(dateDecimal({ dateFom: '1992-04-06', dateTom: '1997-10-05', years: 5.5, months: 0, days: 0 }, true)).toEqual({
      days: '', months: '6', years: '5', totalDays: '2009'
    })
  })

  it('dateDecimal: handles quarter', () => {
    expect(dateDecimal({ dateFom: '1992-04-06', dateTom: '1993-04-05', years: 0, months: 0, quarter: 2.75, days: 0 })).toEqual({
      days: 8, months: 8, years: 0, totalDays: 252
    })
  })

  it('dateDecimal: handles mix of numbers and strings', () => {
    expect(dateDecimal({ dateFom: '1992-04-06', dateTom: '1998-04-05', years: '5.5', months: '1', days: 10 })).toEqual({
      days: 10, months: 7, years: 5, totalDays: 2050
    })
  })

  it('dateDecimal: handles all values', () => {
    // 45 + 7 * 7 + 20 * 30 + 5 * 90 + 1 * 360 = 1504 = 4 years, 2 months, 4 days
    expect(dateDecimal({ dateFom: '1992-04-06', dateTom: '1997-04-05', days: '45', weeks: '7', months: '20', quarter: '5', years: '1' })).toEqual({
      days: 2, months: 2, years: 4, totalDays: 1524
    })
  })

  it('dateDecimal: doesn\'t touch dateDiff values if we are with no weeks/quarter', () => {
    expect(dateDecimal({ dateFom: '1992-04-06', dateTom: '1993-04-05', days: '30', months: '0', years: '0' })).toEqual({
      days: 0, months: 1, years: 0, totalDays: 30
    })
    // adding quarter triggers different "rules" than dateDiff, thus converts 30 days to 1 month
    expect(dateDecimal({ dateFom: '1992-04-06', dateTom: '1993-04-05', days: '30', months: '0', years: '0', quarter: '1' })).toEqual({
      days: 30, months: 3, years: 0, totalDays: 121
    })
  })

  it('dateDecimal: handles all values 3', () => { //Usikker på om denne fungerer helt som den skal
    expect(dateDecimal({ dateFom: '1992-04-06', dateTom: '1996-04-05', days: '0', weeks: '200', months: '0', quarter: '0', years: '0' })).toEqual({
      days: 2, months: 10, years: 3, totalDays: 1403
    })
  })

  it('dateDecimal: handles all values 4', () => {
    expect(dateDecimal({ dateFom: '1992-04-06', dateTom: '1993-04-12', days: '0', weeks: '53', months: '0', quarter: '0', years: '0' })).toEqual({
      days: 7, months: 0, years: 1, totalDays: 372
    })
  })

  it('dateDecimal: handles all values 4', () => {
    expect(dateDecimal({ dateFom: '1992-04-06', dateTom: '1994-04-05', days: '0', weeks: '104', months: '0', quarter: '0', years: '0' })).toEqual({
      days: 0, months: 0, years: 2, totalDays: 730
    })
  })

  it('dateDecimal: handles all values 5', () => {
    expect(dateDecimal({ dateFom: '1992-04-06', dateTom: '1993-04-05', days: '0', weeks: '5', months: '0', quarter: '0', years: '0' })).toEqual({
      days: 5, months: 1, years: 0, totalDays: 35
    })
  })

  it('dateDecimal: handles all values 6', () => {
    expect(dateDecimal({ dateFom: '1992-04-06', dateTom: '1993-04-05', days: '0', weeks: '4', months: '0', quarter: '0', years: '0' })).toEqual({
      days: 28, months: 0, years: 0, totalDays: 28
    })
  })

  it('dateDecimal: Should actual when calculated tomdate is after actual tomdate', () => {
    expect(dateDecimal({ dateFom: '2009-04-06', dateTom: '2022-04-05', days: '0', weeks: '678', months: '0', quarter: '0', years: '0' })).toEqual({
      days: 14, months: 0, years: 13, totalDays: 4762
    })
  })

  it('dateDecimal: Should return calculated when calculated tomdate is before or same as actual tomdatt', () => {
    expect(dateDecimal({ dateFom: '2009-04-06', dateTom: '2022-04-19', days: '0', weeks: '678', months: '0', quarter: '0', years: '0' })).toEqual({
      days: 14, months: 0, years: 13, totalDays: 4762
    })
  })
})
