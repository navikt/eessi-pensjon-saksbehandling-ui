import _ from 'lodash'
import moment from 'moment'

export interface DateDiff {
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

/** This is a transcription of a macro function TRYGDETID found in regneark excel file
 * Don't think too much -- this is how they calculate dates, it's weird,
 * just look at the test file to understand the rules
 */
const dateDiff = (startdato: Date | string, sluttdato: Date | string): FormattedDateDiff => {
  const Fomdato = _.isString(startdato) ? moment(startdato, 'DD.MM.YYYY') : moment(startdato)
  // Add a day to end date
  const Tomdato = _.isString(sluttdato) ? moment(sluttdato, 'DD.MM.YYYY').add(1, 'days') : moment(sluttdato).add(1, 'days')

  // estimate years based on number of days
  let numberOfDays = Tomdato!.diff(Fomdato, 'days')
  const AnslagHeleAar = Math.round(numberOfDays / 365)

  // Estimates new start date after whole year was added
  const AnslagNyFomEtterAar = moment(Fomdato.toDate())
  AnslagNyFomEtterAar.add(AnslagHeleAar, 'years')

  // check if estimeted new startdate is over end date
  const HeleAar = AnslagNyFomEtterAar > Tomdato ? AnslagHeleAar - 1 : AnslagHeleAar

  // sets new startdate after correct number of whole years is calculated
  const NyFomEtterAar = moment(Fomdato.toDate())
  NyFomEtterAar.add(HeleAar, 'years')

  // from total days estimate whole months
  numberOfDays = Tomdato!.diff(NyFomEtterAar, 'days')
  const AnslagHeleMndr = Math.round(numberOfDays / 30)

  // set estimation of new stardate after whole month added to new startdate after whole years were added
  const AnslagNyFomEtterMndr = moment(NyFomEtterAar.toDate())
  AnslagNyFomEtterMndr.add(AnslagHeleMndr, 'months')

  const KorrAnslagNyFomEtterMndr = moment(AnslagNyFomEtterMndr.toDate())

  // adjust new fom for errors caused by leap days
  // NOTE: .date() returns the day of the month, as in 13.02.2000 => 13
  // do NOT confuse with .toDate()
  if (AnslagNyFomEtterMndr.date() === 28 && Fomdato.date() === 29) {
    if (AnslagNyFomEtterMndr.month() === (AnslagNyFomEtterMndr.month() + 1)) {
      KorrAnslagNyFomEtterMndr.add(1, 'days')
    }
  }

  // adjust whole month if new startdate is higher than enddate
  const HeleMndr = (KorrAnslagNyFomEtterMndr.isAfter(Tomdato)) ? AnslagHeleMndr - 1 : AnslagHeleMndr

  const NyFomEtterMndr = moment(NyFomEtterAar.toDate())
  NyFomEtterMndr.add(HeleMndr, 'months')

  const KorrNyFomEtterMndr = moment(NyFomEtterMndr.toDate())

  // adjust new fom for errors caused by leap days
  if (NyFomEtterMndr.date() === 28 && Fomdato.date() === 29) {
    if (NyFomEtterMndr.month() === (NyFomEtterMndr.month() + 1)) {
      KorrNyFomEtterMndr.add(1, 'days')
    }
  }

  // calculate total days remaining after whole years and months are done
  const AntallDager = Tomdato!.diff(KorrNyFomEtterMndr, 'days')

  return {
    years: HeleAar,
    months: HeleMndr,
    days: AntallDager
  }
}

export default dateDiff
