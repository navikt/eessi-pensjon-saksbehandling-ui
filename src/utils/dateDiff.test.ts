import dateDiff from 'utils/dateDiff'

describe('utils/dateDiff', () => {
  it('31 day month starting on 01 works like regneark', () => {
    expect(dateDiff('01.01.1980', '01.01.1980')).toEqual({
      days: 0, months: 0, years: 0
    })
    expect(dateDiff('01.01.1980', '02.01.1980')).toEqual({
      days: 1, months: 0, years: 0
    })
    expect(dateDiff('01.01.1980', '29.01.1980')).toEqual({
      days: 28, months: 0, years: 0
    })
    expect(dateDiff('01.01.1980', '30.01.1980')).toEqual({
      days: 29, months: 0, years: 0
    })
    expect(dateDiff('01.01.1980', '31.01.1980')).toEqual({
      days: 30, months: 0, years: 0
    })
    expect(dateDiff('01.01.1980', '01.02.1980')).toEqual({
      days: 0, months: 1, years: 0
    })
  })

  it('31 day month starting on 02 works like regneark', () => {
    expect(dateDiff('02.01.1980', '31.01.1980')).toEqual({
      days: 29, months: 0, years: 0
    })
    expect(dateDiff('02.01.1980', '01.02.1980')).toEqual({
      days: 30, months: 0, years: 0
    })
    expect(dateDiff('02.01.1980', '02.02.1980')).toEqual({
      days: 0, months: 1, years: 0
    })
    expect(dateDiff('02.01.1980', '03.02.1980')).toEqual({
      days: 1, months: 1, years: 0
    })
  })

  it('31 day month starting on 03 works like regneark', () => {
    expect(dateDiff('03.01.1980', '31.01.1980')).toEqual({
      days: 28, months: 0, years: 0
    })
    expect(dateDiff('03.01.1980', '01.02.1980')).toEqual({
      days: 29, months: 0, years: 0
    })
    expect(dateDiff('03.01.1980', '02.02.1980')).toEqual({
      days: 30, months: 0, years: 0
    })
    expect(dateDiff('03.01.1980', '03.02.1980')).toEqual({
      days: 0, months: 1, years: 0
    })
  })

  it('February in leap year works', () => {
    expect(dateDiff('01.02.1980', '01.02.1980')).toEqual({
      days: 0, months: 0, years: 0
    })
    expect(dateDiff('01.02.1980', '02.02.1980')).toEqual({
      days: 1, months: 0, years: 0
    })
    expect(dateDiff('01.02.1980', '28.02.1980')).toEqual({
      days: 27, months: 0, years: 0
    })
    expect(dateDiff('01.02.1980', '29.02.1980')).toEqual({
      days: 28, months: 0, years: 0
    })
    expect(dateDiff('01.02.1980', '01.03.1980')).toEqual({
      days: 0, months: 1, years: 0
    })
  })

  it('February in non-leap year works', () => {
    expect(dateDiff('01.02.1981', '01.02.1981')).toEqual({
      days: 0, months: 0, years: 0
    })
    expect(dateDiff('01.02.1981', '02.02.1981')).toEqual({
      days: 1, months: 0, years: 0
    })
    expect(dateDiff('01.02.1981', '28.02.1981')).toEqual({
      days: 27, months: 0, years: 0
    })
    expect(dateDiff('01.02.1981', '01.03.1981')).toEqual({
      days: 0, months: 1, years: 0
    })
  })

  it('1 year works', () => {
    expect(dateDiff('01.01.1982', '29.12.1982')).toEqual({
      days: 28, months: 11, years: 0
    })
    expect(dateDiff('01.01.1982', '30.12.1982')).toEqual({
      days: 29, months: 11, years: 0
    })
    expect(dateDiff('01.01.1982', '31.12.1982')).toEqual({
      days: 30, months: 11, years: 0
    })
    expect(dateDiff('01.01.1982', '01.01.1983')).toEqual({
      days: 0, months: 0, years: 1
    })
  })

  it('1 year works with subtracted days', () => {
    expect(dateDiff('03.01.1982', '31.12.1982')).toEqual({
      days: 28, months: 11, years: 0
    })
    expect(dateDiff('03.01.1982', '01.01.1983')).toEqual({
      days: 29, months: 11, years: 0
    })
    expect(dateDiff('03.01.1982', '02.01.1983')).toEqual({
      days: 30, months: 11, years: 0
    })
    expect(dateDiff('03.01.1982', '03.01.1983')).toEqual({
      days: 0, months: 0, years: 1
    })
  })

  it('2 year works', () => {
    expect(dateDiff('10.01.1982', '08.01.1984')).toEqual({
      days: 29, months: 11, years: 1
    })
    expect(dateDiff('10.01.1982', '09.01.1984')).toEqual({
      days: 30, months: 11, years: 1
    })
    expect(dateDiff('10.01.1982', '10.01.1984')).toEqual({
      days: 0, months: 0, years: 2
    })
    expect(dateDiff('10.01.1982', '11.01.1984')).toEqual({
      days: 1, months: 0, years: 2
    })
  })

  it('other works', () => {
    expect(dateDiff('31.07.1997', '19.12.1997')).toEqual({
      days: 19, months: 4, years: 0
    })
    expect(dateDiff('20.07.2015', '07.08.2015')).toEqual({
      days: 18, months: 0, years: 0
    })
  })
})
