import { renderDate, pinfoDateToDate } from './Date'

describe('utils/Date', () => {
  const t = jest.fn((translationString) => { return translationString })

  it('renderDate invalid date', () => {
    expect(renderDate(null, t)).toEqual('ui:unknown')
  })

  it('renderDate valid date', () => {
    const date = new Date('2020-12-17T03:24:00')
    expect(renderDate(date, t)).toEqual('2020.12.17')
  })

  it('pinfoDateToDate invalid date', () => {
    expect(pinfoDateToDate(null)).toEqual(null)
  })

  it('pinfoDateToDate valid date', () => {
    const date = { month: 11, year: 2020 }
    expect(pinfoDateToDate(date)).toEqual({ day: 1, month: 10, year: 2020 })
  })
})
