import dayjs, {Dayjs} from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat"
import _ from "lodash";
dayjs.extend(customParseFormat)

export interface DateDiff {
  dateFom?: string | number | null | undefined
  dateTom?: string | number | null | undefined
  days?: string | number | null | undefined
  months?: string | number | null | undefined
  years?: string | number | null | undefined
  quarter ?: string | number | null | undefined
  weeks ?: string | number | null | undefined
}

export interface FormattedDateDiff {
  days: string | number
  months: string | number
  years: string | number
}

const dateDiff = (startdato: Date | string, sluttdato: Date | string): FormattedDateDiff => {

  const fomDato : Dayjs = _.isString(startdato) ?
    dayjs(startdato, 'DD.MM.YYYY') :
    dayjs(startdato)
  const tomDato : Dayjs = _.isString(sluttdato) ?
    dayjs(sluttdato, 'DD.MM.YYYY').add(1, 'day') :
    dayjs(sluttdato).add(1, 'day') //Include fomDato in count

  const years = tomDato.diff(fomDato, 'year');
  const months = tomDato.diff(fomDato, 'month') - years * 12;
  const days = tomDato.diff(fomDato.add(years, 'year').add(months, 'month'), 'day');

  return {
    years,
    months,
    days
  }
}

export default dateDiff
