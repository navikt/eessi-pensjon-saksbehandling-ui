import dateDiff from 'src/utils/dateDiff'

describe('utils/dateDiff', () => {
  it('31 day month starting on 01 works like regneark with date strings', () => {
    expect(dateDiff('01.01.1980', '01.01.1980')).toEqual({
      days: 1, months: 0, totalDays: 1, years: 0
    })
    expect(dateDiff('01.01.1980', '02.01.1980')).toEqual({
      days: 2, months: 0, years: 0, totalDays: 2
    })
    expect(dateDiff('01.01.1980', '29.01.1980')).toEqual({
      days: 29, months: 0, totalDays: 29, years: 0
    })
    expect(dateDiff('01.01.1980', '30.01.1980')).toEqual({
      days: 30, months: 0, totalDays: 30, years: 0
    })
    expect(dateDiff('01.01.1980', '31.01.1980')).toEqual({
      days: 0, months: 1, years: 0, totalDays: 31
    })
    expect(dateDiff('01.01.1980', '01.02.1980')).toEqual({
      days: 1, months: 1, years: 0, totalDays: 32
    })
  })

  it('31 day month starting on 01 works like regneark with Dates', () => {
    expect(dateDiff(new Date('1980,01,01'), new Date('1980,01,01'))).toEqual({
      days: 1, months: 0, totalDays: 1, years: 0
    })
    expect(dateDiff(new Date('1980,01,01'), new Date('1980,01,02'))).toEqual({
      days: 2, months: 0, years: 0, totalDays: 2
    })
    expect(dateDiff(new Date('1980,01,01'), new Date('1980,01,29'))).toEqual({
      days: 29, months: 0, totalDays: 29, years: 0
    })
    expect(dateDiff(new Date('1980,01,01'), new Date('1980,01,30'))).toEqual({
      days: 30, months: 0, totalDays: 30, years: 0
    })
    expect(dateDiff(new Date('1980,01,01'), new Date('1980,01,31'))).toEqual({
      days: 0, months: 1, years: 0, totalDays: 31
    })
    expect(dateDiff(new Date('1980,01,01'), new Date('1980,02,01'))).toEqual({
      days: 1, months: 1, years: 0, totalDays: 32
    })
  })

  it('31 day month starting on 02 works like regneark with date strings', () => {
    expect(dateDiff('02.01.1980', '31.01.1980')).toEqual({
      days: 30, months: 0, years: 0, totalDays: 30
    })
    expect(dateDiff('02.01.1980', '01.02.1980')).toEqual({
      days: 0, months: 1, years: 0, totalDays: 31
    })
    expect(dateDiff('02.01.1980', '02.02.1980')).toEqual({
      days: 1, months: 1, years: 0, totalDays: 32
    })
    expect(dateDiff('02.01.1980', '03.02.1980')).toEqual({
      days: 2, months: 1, years: 0, totalDays: 33
    })
  })

  it('31 day month starting on 02 works like regneark with Dates', () => {
    expect(dateDiff(new Date('1980,01,02'), new Date('1980,01,31'))).toEqual({
      days: 30, months: 0, years: 0, totalDays: 30
    })
    expect(dateDiff(new Date('1980,01,02'), new Date('1980,02,01'))).toEqual({
      days: 0, months: 1, years: 0, totalDays: 31
    })
    expect(dateDiff(new Date('1980,01,02'), new Date('1980,02,02'))).toEqual({
      days: 1, months: 1, years: 0, totalDays: 32
    })
    expect(dateDiff(new Date('1980,01,02'), new Date('1980,02,03'))).toEqual({
      days: 2, months: 1, years: 0, totalDays: 33
    })
  })

  it('31 day month starting on 03 works like regneark with date strings', () => {
    expect(dateDiff('03.01.1980', '31.01.1980')).toEqual({
      days: 29, months: 0, years: 0, totalDays: 29
    })
    expect(dateDiff('03.01.1980', '01.02.1980')).toEqual({
      days: 30, months: 0, years: 0, totalDays: 30
    })
    expect(dateDiff('03.01.1980', '02.02.1980')).toEqual({
      days: 0, months: 1, years: 0, totalDays: 31
    })
    expect(dateDiff('03.01.1980', '03.02.1980')).toEqual({
      days: 1, months: 1, years: 0, totalDays: 32
    })
  })

  it('31 day month starting on 03 works like regneark with Dates', () => {
    expect(dateDiff(new Date('1980,01,03'), new Date('1980,01,31'))).toEqual({
      days: 29, months: 0, years: 0, totalDays: 29
    })
    expect(dateDiff(new Date('1980,01,03'), new Date('1980,02,01'))).toEqual({
      days: 30, months: 0, years: 0, totalDays: 30
    })
    expect(dateDiff(new Date('1980,01,03'), new Date('1980,02,02'))).toEqual({
      days: 0, months: 1, years: 0, totalDays: 31
    })
    expect(dateDiff(new Date('1980,01,03'), new Date('1980,02,03'))).toEqual({
      days: 1, months: 1, years: 0, totalDays: 32
    })
  })

  it('February in leap year works with date strings', () => {
    expect(dateDiff('01.02.1980', '01.02.1980')).toEqual({
      days: 1, months: 0, totalDays: 1, years: 0
    })
    expect(dateDiff('01.02.1980', '02.02.1980')).toEqual({
      days: 2, months: 0, years: 0, totalDays: 2
    })
    expect(dateDiff('01.02.1980', '28.02.1980')).toEqual({
      days: 28, months: 0, years: 0, totalDays: 28
    })
    expect(dateDiff('01.02.1980', '29.02.1980')).toEqual({
      days: 0, months: 1, years: 0, totalDays: 29
    })
    expect(dateDiff('01.02.1980', '01.03.1980')).toEqual({
      days: 1, months: 1, years: 0, totalDays: 30
    })
  })

  it('February in leap year works with Dates', () => {
    expect(dateDiff(new Date('1980,02,01'), new Date('1980,02,01'))).toEqual({
      days: 1, months: 0, totalDays: 1, years: 0
    })
    expect(dateDiff(new Date('1980,02,01'), new Date('1980,02,02'))).toEqual({
      days: 2, months: 0, years: 0, totalDays: 2
    })
    expect(dateDiff(new Date('1980,02,01'), new Date('1980,02,28'))).toEqual({
      days: 28, months: 0, years: 0, totalDays: 28
    })
    expect(dateDiff(new Date('1980,02,01'), new Date('1980,02,29'))).toEqual({
      days: 0, months: 1, years: 0, totalDays: 29
    })
    expect(dateDiff(new Date('1980,02,01'), new Date('1980,03,01'))).toEqual({
      days: 1, months: 1, years: 0, totalDays: 30
    })
  })

  it('February in non-leap year works with date strings', () => {
    expect(dateDiff('01.02.1981', '01.02.1981')).toEqual({
      days: 1, months: 0, totalDays: 1, years: 0
    })
    expect(dateDiff('01.02.1981', '02.02.1981')).toEqual({
      days: 2, months: 0, years: 0, totalDays: 2
    })
    expect(dateDiff('01.02.1981', '28.02.1981')).toEqual({
      days: 0, months: 1, years: 0, totalDays: 28
    })
    expect(dateDiff('01.02.1981', '01.03.1981')).toEqual({
      days: 1, months: 1, years: 0, totalDays: 29
    })
  })

  it('February in non-leap year works with Dates', () => {
    expect(dateDiff(new Date('1981,02,01'), new Date('1981,02,01'))).toEqual({
      days: 1, months: 0, totalDays: 1, years: 0
    })
    expect(dateDiff(new Date('1981,02,01'), new Date('1981,02,02'))).toEqual({
      days: 2, months: 0, years: 0, totalDays: 2
    })
    expect(dateDiff(new Date('1981,02,01'), new Date('1981,02,28'))).toEqual({
      days: 0, months: 1, years: 0, totalDays: 28
    })
    expect(dateDiff(new Date('1981,02,01'), new Date('1981,03,01'))).toEqual({
      days: 1, months: 1, years: 0, totalDays: 29
    })
  })

  it('1 year works with date strings', () => {
    expect(dateDiff('01.01.1982', '29.12.1982')).toEqual({
      days: 29, months: 11,  totalDays: 363, years: 0
    })
    expect(dateDiff('01.01.1982', '30.12.1982')).toEqual({
      days: 30, months: 11, years: 0, totalDays: 364
    })
    expect(dateDiff('01.01.1982', '31.12.1982')).toEqual({
      days: 0, months: 0, years: 1, totalDays: 365
    })
    expect(dateDiff('01.01.1982', '01.01.1983')).toEqual({
      days: 1, months: 0, years: 1, totalDays: 366
    })
  })

  it('1 year works with Dates', () => {
    expect(dateDiff(new Date('1982,01.01'), new Date('1982,12,29'))).toEqual({
      days: 29, months: 11, totalDays: 363, years: 0
    })
    expect(dateDiff(new Date('1982,01.01'), new Date('1982,12,30'))).toEqual({
      days: 30, months: 11, years: 0, totalDays: 364
    })
    expect(dateDiff(new Date('1982,01.01'), new Date('1982,12,31'))).toEqual({
      days: 0, months: 0, years: 1, totalDays: 365
    })
    expect(dateDiff(new Date('1982,01.01'), new Date('1983,01,01'))).toEqual({
      days: 1, months: 0, years: 1, totalDays: 366
    })
  })

  it('1 year works with subtracted days with date strings', () => {
    expect(dateDiff('03.01.1982', '31.12.1982')).toEqual({
      days: 29, months: 11, totalDays: 363, years: 0
    })
    expect(dateDiff('03.01.1982', '01.01.1983')).toEqual({
      days: 30, months: 11, years: 0, totalDays: 364
    })
    expect(dateDiff('03.01.1982', '02.01.1983')).toEqual({
      days: 0, months: 0, years: 1, totalDays: 365
    })
    expect(dateDiff('03.01.1982', '03.01.1983')).toEqual({
      days: 1, months: 0, years: 1, totalDays: 366
    })
  })

  it('1 year works with subtracted days with Dates', () => {
    expect(dateDiff(new Date('1982,01,03'), new Date('1982,12,31'))).toEqual({
      days: 29, months: 11,  totalDays: 363, years: 0
    })
    expect(dateDiff(new Date('1982,01,03'), new Date('1983,01,01'))).toEqual({
      days: 30, months: 11, years: 0, totalDays: 364
    })
    expect(dateDiff(new Date('1982,01,03'), new Date('1983,01,02'))).toEqual({
      days: 0, months: 0, years: 1, totalDays: 365
    })
    expect(dateDiff(new Date('1982,01,03'), new Date('1983,01,03'))).toEqual({
      days: 1, months: 0, years: 1, totalDays: 366
    })
  })

  it('2 year works with date strings', () => {
    expect(dateDiff('10.01.1982', '08.01.1984')).toEqual({
      days: 30, months: 11, totalDays: 729, years: 1
    })
    expect(dateDiff('10.01.1982', '09.01.1984')).toEqual({
      days: 0, months: 0, years: 2, totalDays: 730
    })
    expect(dateDiff('10.01.1982', '10.01.1984')).toEqual({
      days: 1, months: 0, years: 2, totalDays: 731
    })
    expect(dateDiff('10.01.1982', '11.01.1984')).toEqual({
      days: 2, months: 0, years: 2, totalDays: 732
    })
  })

  it('2 year works with Dates', () => {
    expect(dateDiff(new Date('1982,01,10'), new Date('1984,01,08'))).toEqual({
      days: 30, months: 11, totalDays: 729, years: 1
    })
    expect(dateDiff(new Date('1982,01,10'), new Date('1984,01,09'))).toEqual({
      days: 0, months: 0, years: 2, totalDays: 730
    })
    expect(dateDiff(new Date('1982,01,10'), new Date('1984,01,10'))).toEqual({
      days: 1, months: 0, years: 2, totalDays: 731
    })
    expect(dateDiff(new Date('1982,01,10'), new Date('1984,01,11'))).toEqual({
      days: 2, months: 0, years: 2, totalDays: 732
    })
  })

  it('other works with date strings', () => {
    expect(dateDiff('31.07.1997', '19.12.1997')).toEqual({
      days: 20, months: 4, totalDays: 142, years: 0
    })
    expect(dateDiff('20.07.2015', '07.08.2015')).toEqual({
      days: 19, months: 0, years: 0, totalDays: 19
    })
  })

  it('other works with Dates', () => {
    expect(dateDiff(new Date('1997,07,31'), new Date('1997,12,19'))).toEqual({
      days: 20, months: 4, totalDays: 142, years: 0
    })
    expect(dateDiff(new Date('2015,07,20'), new Date('2015,08,07'))).toEqual({
      days: 19, months: 0, years: 0, totalDays: 19
    })
  })
})
