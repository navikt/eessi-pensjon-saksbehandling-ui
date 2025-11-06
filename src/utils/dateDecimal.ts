import _ from 'lodash'
import { DateDiff, FormattedDateDiff } from 'src/utils/dateDiff'
import dayjs, {Dayjs} from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat"
dayjs.extend(customParseFormat)

export const isFloat = (value: string | number) => _.isNumber(value) ? !!(value % 1) : value.indexOf('.') >= 0

export const writeFloat = (value: string | number) => _.isNumber(value) ? String(value.toFixed(2)) : String(parseFloat(value).toFixed(2))

export const writeDateDiff = (dateDiff: DateDiff) =>
  ((_.isNumber(dateDiff.years) ? String(dateDiff.years) : !_.isEmpty(dateDiff.years) ? dateDiff.years : '0') + '/' +
    (_.isNumber(dateDiff.months) ? String(dateDiff.months) : !_.isEmpty(dateDiff.months) ? dateDiff.months : '0') + '/' +
    (_.isNumber(dateDiff.days) ? String(dateDiff.days) : !_.isEmpty(dateDiff.days) ? dateDiff.days : '0'))

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

const addFractionalYears = (tomDate: Dayjs, fractionalYears: number) => {
  const years = Math.floor(fractionalYears);
  const months = Math.floor((fractionalYears - years) * 12);
  const days = Math.floor((fractionalYears - years - (months / 12)) * 365);

  return tomDate.add(years, 'year').add(months, 'month').add(days, 'day');
}

const addFractionalMonths = (tomDate : Dayjs, fractionalMonths: number) => {
  const months = Math.floor(fractionalMonths);
  const remainingDays = (fractionalMonths - months) * 30; // Assuming 30 days per month

  return tomDate.add(months, 'month').add(remainingDays, 'day');
}


const dateDecimal = (date: DateDiff, outputAsString = false): FormattedDateDiff => {
  const days = _.isNil(date.days) ? 0 : _.isNumber(date.days) ? date.days : date.days === '' ? 0 : parseFloat(date.days)
  const months = (_.isNil(date.months) ? 0 : _.isNumber(date.months) ? date.months : date.months === '' ? 0 : parseFloat(date.months))
  const years = (_.isNil(date.years) ? 0 : _.isNumber(date.years) ? date.years : date.years === '' ? 0 : parseFloat(date.years))

  if(!date.dateFom){
    const allInDays = days + months * 30 + years * 360
    const leftoverInMonths = Math.floor(allInDays / 30)
    return {
      days: Math.round(allInDays % 30),
      months: Math.round(leftoverInMonths % 12),
      years: Math.floor(leftoverInMonths / 12)
    }
  }

  const fomDate: Dayjs = dayjs(date.dateFom, 'YYYY-MM-DD')

  let calculatedTomDate: Dayjs = dayjs(date.dateFom, 'YYYY-MM-DD')

  if (Object.prototype.hasOwnProperty.call(date, 'quarter')) {
    const months = _.isNil(date.quarter) ? 0 : _.isNumber(date.quarter) ? date.quarter * 3.0 : parseFloat(date.quarter!) * 3.0
    //calculatedTomDate = calculatedTomDate.add(months, 'month')
    calculatedTomDate = addFractionalMonths(calculatedTomDate, months)
  }
  if (Object.prototype.hasOwnProperty.call(date, 'weeks')) {
    const weeks = _.isNil(date.weeks) ? 0 : _.isNumber(date.weeks) ? date.weeks : parseFloat(date.weeks!)
    const wholeYears = Math.floor(weeks/52)
    const remainingWeeks = weeks % 52

    calculatedTomDate = calculatedTomDate.add(wholeYears, 'year')
    calculatedTomDate = calculatedTomDate.add(remainingWeeks, 'week')
  }

  //calculatedTomDate = calculatedTomDate.add(days, 'day').add(months, 'month').add(years, 'year')
  calculatedTomDate = addFractionalYears(calculatedTomDate, years)
  calculatedTomDate = addFractionalMonths(calculatedTomDate, months)
  calculatedTomDate = calculatedTomDate.add(days, 'day')

  const calculatedYears = calculatedTomDate.diff(fomDate, 'year');
  const calculatedMonths = calculatedTomDate.diff(fomDate, 'month') - calculatedYears * 12;
  const calculatedDays = calculatedTomDate.diff(fomDate.add(calculatedYears, 'year').add(calculatedMonths, 'month'), 'day');

  if (outputAsString) {
    return {
      days: calculatedDays === 0 ? '' : String(calculatedDays),
      months: calculatedMonths === 0 ? '' : String(calculatedMonths),
      years: calculatedYears === 0 ? '' : String(calculatedYears)
    }
  }

  return {
    days: calculatedDays,
    months: calculatedMonths,
    years: calculatedYears
  }
}

export default dateDecimal
