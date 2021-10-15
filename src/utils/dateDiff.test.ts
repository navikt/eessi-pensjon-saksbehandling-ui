import dateDiff from 'utils/dateDiff'


describe('utils/dateDiff', () => {

  it('works', () => {

    expect(dateDiff('01.01.1982', '01.01.1982')).toEqual({
      days: 1, months: 0, years: 0
    })
    expect(dateDiff('01.01.1982', '02.01.1982')).toEqual({
      days: 2, months: 0, years: 0
    })
    expect(dateDiff('01.01.1982', '29.01.1982')).toEqual({
      days: 29, months: 0, years: 0
    })
    expect(dateDiff('01.01.1982', '30.01.1982')).toEqual({
      days: 0, months: 1, years: 0
    })
    expect(dateDiff('01.01.1982', '31.01.1982')).toEqual({
      days: 0, months: 1, years: 0
    })
    expect(dateDiff('01.01.1982', '01.02.1982')).toEqual({
      days: 1, months: 1, years: 0
    })


    expect(dateDiff('02.01.1982', '01.02.1982')).toEqual({
      days: 0, months: 1, years: 0
    })
    expect(dateDiff('02.01.1982', '02.02.1982')).toEqual({
      days: 1, months: 1, years: 0
    })
    expect(dateDiff('02.01.1982', '03.02.1982')).toEqual({
      days: 2, months: 1, years: 0
    })


    expect(dateDiff('03.01.1982', '01.02.1982')).toEqual({
      days: 29, months: 0, years: 0
    })
    expect(dateDiff('03.01.1982', '02.02.1982')).toEqual({
      days: 0, months: 1, years: 0
    })
    expect(dateDiff('03.01.1982', '03.02.1982')).toEqual({
      days: 1, months: 1, years: 0
    })

    expect(dateDiff('01.02.1982', '01.02.1982')).toEqual({
      days: 1, months: 0, years: 0
    })
    expect(dateDiff('01.02.1982', '02.02.1982')).toEqual({
      days: 2, months: 0, years: 0
    })
    expect(dateDiff('01.02.1982', '28.02.1982')).toEqual({
      days: 0, months: 1, years: 0
    })
    expect(dateDiff('01.02.1982', '29.02.1982')).toEqual({
      days: 0, months: 1, years: 0
    })


    expect(dateDiff('01.01.1982', '29.12.1982')).toEqual({
      days: 29, months: 11, years: 0
    })
    expect(dateDiff('01.01.1982', '30.12.1982')).toEqual({
      days: 0, months: 0, years: 1
    })
    expect(dateDiff('01.01.1982', '31.12.1982')).toEqual({
      days: 0, months: 0, years: 1
    })
    expect(dateDiff('01.01.1982', '01.01.1983')).toEqual({
      days: 1, months: 0, years: 1
    })

    expect(dateDiff('10.01.1982', '08.01.1984')).toEqual({
      days: 29, months: 11, years: 1
    })
    expect(dateDiff('10.01.1982', '09.01.1984')).toEqual({
      days: 0, months: 0, years: 2
    })
    expect(dateDiff('10.01.1982', '10.01.1984')).toEqual({
      days: 1, months: 0, years: 2
    })
    expect(dateDiff('10.01.1982', '11.01.1984')).toEqual({
      days: 2, months: 0, years: 2
    })



  })

})
