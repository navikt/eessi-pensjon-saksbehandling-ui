import dayjs, {Dayjs} from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat"

dayjs.extend(customParseFormat)
export interface DateDiff {
  dateFom?: string | number | null | undefined
  dateTom?: string | number | null | undefined
  days?: string | number | null | undefined
  months?: string | number | null | undefined
  years?: string | number | null | undefined
  trimesters ?: string | number | null | undefined
  weeks ?: string | number | null | undefined
}

export interface FormattedDateDiff {
  days: string | number
  months: string | number
  years: string | number
}

const dateDiff = (startdato: Date | string, sluttdato: Date | string): FormattedDateDiff => {

  const fomDato : Dayjs = dayjs(startdato, 'DD.MM.YYYY')
  const tomDato : Dayjs = dayjs(sluttdato, 'DD.MM.YYYY')

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
