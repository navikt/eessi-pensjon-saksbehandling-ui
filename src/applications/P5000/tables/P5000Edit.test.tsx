import { rangesOverlap } from "src/applications/P5000/tables/P5000Edit";
import dayjs from "dayjs";

describe('applications/P5000/tables/P5000Edit', () => {

  it('should return true when both startDate and endDate for range 1 is inside range 2 ', () => {
    const startDateRange1 = dayjs(new Date('1982,01,01'))
    const endDateRange1 = dayjs(new Date('1983,01,01'))
    const startDateRange2 = dayjs(new Date('1980,01,01'))
    const endDateRange2 = dayjs(new Date('1985,01,01'))

    expect(rangesOverlap(startDateRange1, endDateRange1,
      startDateRange2, endDateRange2)
    ).toEqual(true)
  })

  it('should return true when both startDate and endDate for range 2 is inside range 1 ', () => {
    const startDateRange1 = dayjs(new Date('1980,01,01'))
    const endDateRange1 = dayjs(new Date('1985,01,01'))
    const startDateRange2 = dayjs(new Date('1982,01,01'))
    const endDateRange2 = dayjs(new Date('1983,01,01'))

    expect(rangesOverlap(startDateRange1, endDateRange1,
      startDateRange2, endDateRange2)
    ).toEqual(true)
  })

  it('should return false when startDate nor endDate for range 2 is before range 1 ', () => {
    const startDateRange1 = dayjs(new Date('1980,01,01'))
    const endDateRange1 = dayjs(new Date('1985,01,01'))
    const startDateRange2 = dayjs(new Date('1987,01,01'))
    const endDateRange2 = dayjs(new Date('1988,01,01'))

    expect(rangesOverlap(startDateRange1, endDateRange1,
      startDateRange2, endDateRange2)
    ).toEqual(false)
  })

  it('should return false when  startDate and endDate for range 1 is after range 2 ', () => {
    const startDateRange1 = dayjs(new Date('1987,01,01'))
    const endDateRange1 = dayjs(new Date('1988,01,01'))
    const startDateRange2 = dayjs(new Date('1980,01,01'))
    const endDateRange2 = dayjs(new Date('1985,01,01'))

    expect(rangesOverlap(startDateRange1, endDateRange1,
      startDateRange2, endDateRange2)
    ).toEqual(false)
  })

  it('should return true when startDate for range 1 is inside range 2 ', () => {
    const startDateRange1 = dayjs(new Date('1984,01,30'))
    const endDateRange1 = dayjs(new Date('1990,12,23'))
    const startDateRange2 = dayjs(new Date('1980,01,01'))
    const endDateRange2 = dayjs(new Date('1985,01,01'))

    expect(rangesOverlap(startDateRange1, endDateRange1,
      startDateRange2, endDateRange2)
    ).toEqual(true)
  })

  it('should return true when endDate for range 1 equals startDate for range 2 ', () => {
    const startDateRange1 = dayjs(new Date('1978,05,17'))
    const endDateRange1 = dayjs(new Date('1980,01,01'))
    const startDateRange2 = dayjs(new Date('1980,01,01'))
    const endDateRange2 = dayjs(new Date('1985,01,01'))

    expect(rangesOverlap(startDateRange1, endDateRange1,
      startDateRange2, endDateRange2)
    ).toEqual(true)
  })

  it('should return true when endDate for range 2 equals startDate for range 1 ', () => {
    const startDateRange1 = dayjs(new Date('1980,01,01'))
    const endDateRange1 = dayjs(new Date('1985,01,01'))
    const startDateRange2 = dayjs(new Date('1978,05,17'))
    const endDateRange2 = dayjs(new Date('1980,01,01'))

    expect(rangesOverlap(startDateRange1, endDateRange1,
      startDateRange2, endDateRange2)
    ).toEqual(true)
  })
})
