
export interface DateDiff {
  days: number
  months: number
  years: number
}

const dateDiff = (startdato: string, sluttdato: string): DateDiff => {
  const res: DateDiff = {
    days: 0, months: 0, years: 0
  }

  const startDatoPieces: Array<number> = startdato.split('.').map(i => parseInt(i, 10))
  const sluttDatoPieces: Array<number> = sluttdato.split('.').map(i => parseInt(i, 10))

  const dayDiff: number = (sluttDatoPieces[0] + 1 - startDatoPieces[0])
  let leftoverMonth = 0

  if (startDatoPieces[0] === 1) {
    leftoverMonth = (dayDiff >= 30 ? 1 : 0)
    res.days = leftoverMonth === 1 ? 0 : dayDiff // do not let above 30
  } else {
    // deal with negatives
    res.days = (dayDiff + 30) % 30 // do not let above 30
  }

  const monthDiff = leftoverMonth + (dayDiff < 0 ? -1 : 0) + (sluttDatoPieces[1] - startDatoPieces[1])
  const leftoverYear = monthDiff >= 12 ? 1 : 0

  res.months = leftoverYear ? 0 : (monthDiff >= 0 ? monthDiff : (monthDiff + 12) % 12)
  res.years = leftoverYear + (monthDiff < 0 ? -1 : 0) + (sluttDatoPieces[2] - startDatoPieces[2])
  return res
}

export default dateDiff
