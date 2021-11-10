import dateDecimal, { isFloat, getFloatValues, writeFloat, sumValues, sumDates } from 'utils/dateDecimal'

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
      days: 20, months: 10, years: 4
    })
  })

  it('dateDecimal: handles null/undefined', () => {
    expect(dateDecimal({ years: null, months: 3.5, days: undefined })).toEqual({
      days: 15, months: 3, years: 0
    })
  })

  it('dateDecimal: handles decimals', () => {
    expect(dateDecimal({ years: 5.25, months: 0, days: 0 })).toEqual({
      days: 0, months: 3, years: 5
    })
    expect(dateDecimal({ years: 0, months: 32.12, days: 0 })).toEqual({
      days: 4, months: 8, years: 2
    })
    expect(dateDecimal({ years: 1.5, months: 1.5, days: 1.5 })).toEqual({
      days: 17, months: 7, years: 1
    })
  })

  it('dateDecimal: outputs as string', () => {
    expect(dateDecimal({ years: 5.25, months: 0, days: 0 }, true)).toEqual({
      days: '', months: '3', years: '5'
    })
  })

  it('dateDecimal: handles trimesters', () => {
    expect(dateDecimal({ years: 0, months: 0, trimesters: 2.75, days: 0 })).toEqual({
      days: 8, months: 8, years: 0
    })
  })

  it('dateDecimal: handles mix of numbers and strings', () => {
    expect(dateDecimal({ years: '5.5', months: '1', days: 10 })).toEqual({
      days: 10, months: 7, years: 5
    })
  })

  it('dateDecimal: handles weeks > 52 as 1 year', () => {
    expect(dateDecimal({ weeks: 1000 })).toEqual({
      days: 0, months: 0, years: 1
    })
  })

  it('dateDecimal: handles all values', () => {
    // 45 + 7 * 7 + 20 * 30 + 5 * 90 + 1 * 360 = 1504 = 4 years, 2 months, 4 days
    expect(dateDecimal({ days: '45', weeks: '7', months: '20', trimesters: '5', years: '1' })).toEqual({
      days: 4, months: 2, years: 4
    })
  })

  it('dateDecimal: doesn\'t touch dateDiff values if we are with no weeks/trimesters', () => {
    expect(dateDecimal({ days: '30', months: '0',  years: '0' })).toEqual({
      days: 30, months: 0, years: 0
    })
    // adding trimester triggers different "rules" than dateDiff, thus converts 30 days to 1 month
    expect(dateDecimal({ days: '30', months: '0',  years: '0', trimesters: '1' })).toEqual({
      days: 0, months: 4, years: 0
    })
  })

})
