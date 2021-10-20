import _ from 'lodash'
import { DateDiff } from 'utils/dateDiff'

export const isFloat = (value: string | number) => _.isNumber(value) ? !!(value % 1) : value.indexOf('.') >= 0

export const writeFloat = (value: string | number)  => _.isNumber(value) ? String(value.toFixed(2)) : String(parseFloat(value).toFixed(2))

export const getFloatValues = (value: string | number): [number, number] => {
  let v = _.isNumber(value) ? value : parseFloat(value)
  let leftPart = Math.floor(v)
  let rightPart = v % (leftPart !== 0 ? leftPart : 1)
  return [leftPart, rightPart]
}

export const sumValues = (...values: any[]): number => {
  let sum = 0
  values.forEach((value: string | number) => {
    sum += _.isNumber(value) ? value : parseFloat(value)
  })
  return sum
}

const dateDecimal = (date: DateDiff, outputAsString = false): DateDiff => {

  const res: DateDiff = {
    days: 0, months: 0, years: 0
  }
  // decimals: worry only to months and years
  res.days = _.isNil(date.days) ? 0 : _.isNumber(date.days) ? date.days : parseFloat(date.days)
  res.months = (_.isNil(date.months) ? 0 : _.isNumber(date.months) ? date.months : parseFloat(date.months))
  res.years = (_.isNil(date.years) ? 0 : _.isNumber(date.years) ? date.years : parseFloat(date.years))
  if (Object.prototype.hasOwnProperty.call(date, 'trimesters')) {
    res.months += _.isNil(date.trimesters) ? 0 : _.isNumber(date.trimesters) ? date.trimesters * 3.0 : parseFloat(date.trimesters!) * 3.0
  }
  if (Object.prototype.hasOwnProperty.call(date, 'weeks')) {
    res.days += _.isNil(date.weeks) ? 0 : _.isNumber(date.weeks) ? date.weeks * 7.0 : parseFloat(date.weeks!) * 7.0
  }
  let allInDays = res.days + res.months * 30 + res.years * 360
  let leftoverInMonths = Math.floor(allInDays / 30)
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
