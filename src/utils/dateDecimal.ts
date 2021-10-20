import _ from 'lodash'
import { DateDiff, FormattedDateDiff } from 'utils/dateDiff'

export const isFloat = (value: string | number) => _.isNumber(value) ? !!(value % 1) : value.indexOf('.') >= 0

export const writeFloat = (value: string | number) => _.isNumber(value) ? String(value.toFixed(2)) : String(parseFloat(value).toFixed(2))

export const getFloatValues = (value: string | number): [number, number] => {
  const v = _.isNumber(value) ? value : parseFloat(value)
  const leftPart = Math.floor(v)
  const rightPart = v % (leftPart !== 0 ? leftPart : 1)
  return [leftPart, rightPart]
}

export const sumValues = (...values: any[]): number => {
  let sum = 0
  values.forEach((value: string | number) => {
    sum += _.isNumber(value) ? value : parseFloat(value)
  })
  return sum
}

export const sumDates = (date1: DateDiff, date2: DateDiff, outputAsString = false): FormattedDateDiff => {
  const res1 = dateDecimal(date1); const res2 = dateDecimal(date2)
  return dateDecimal({
    days: (res1.days as number) + (res2.days as number),
    months: (res1.months as number) + (res2.months as number),
    years: (res1.years as number) + (res2.years as number)
  }, outputAsString)
}

const dateDecimal = (date: DateDiff, outputAsString = false): FormattedDateDiff => {
  const res: FormattedDateDiff = {
    days: 0, months: 0, years: 0
  }
  // decimals: worry only to months and years
  res.days = _.isNil(date.days) ? 0 : _.isNumber(date.days) ? date.days : date.days === '' ? 0 : parseFloat(date.days)
  res.months = (_.isNil(date.months) ? 0 : _.isNumber(date.months) ? date.months : date.months === '' ? 0 : parseFloat(date.months))
  res.years = (_.isNil(date.years) ? 0 : _.isNumber(date.years) ? date.years : date.years === '' ? 0 : parseFloat(date.years))
  if (Object.prototype.hasOwnProperty.call(date, 'trimesters')) {
    res.months += _.isNil(date.trimesters) ? 0 : _.isNumber(date.trimesters) ? date.trimesters * 3.0 : parseFloat(date.trimesters!) * 3.0
  }
  if (Object.prototype.hasOwnProperty.call(date, 'weeks')) {
    res.days += _.isNil(date.weeks) ? 0 : _.isNumber(date.weeks) ? date.weeks * 7.0 : parseFloat(date.weeks!) * 7.0
  }
  const allInDays = res.days + res.months * 30 + res.years * 360
  const leftoverInMonths = Math.floor(allInDays / 30)
  res.days = Math.round(allInDays % 30)
  res.years = Math.floor(leftoverInMonths / 12)
  res.months = Math.round(leftoverInMonths % 12)

  if (outputAsString) {
    return {
      days: res.days === 0 ? '' : String(res.days),
      months: res.months === 0 ? '' : String(res.months),
      years: res.years === 0 ? '' : String(res.years)
    }
  }
  return res
}

export default dateDecimal
