import moment, { Moment } from "moment"

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
const dateDiff = (startdato: string, sluttdato: string): FormattedDateDiff => {

  let Fomdato: Moment // C
  let Tomdato: Moment // D
  let Tomdatokorr: Moment // 'L
  let AnslagHeleAar: number // 'M
  let AnslagNyFomEtterAar: Moment //'N
  let HeleAar: number //'O
  let NyFomEtterAar: Moment //'P
  let AnslagHeleMndr: number // 'Q
  let AnslagNyFomEtterMndr: Moment //'R
  let KorrAnslagNyFomEtterMndr: Moment // 'S
  let HeleMndr: number // 'T
  let NyFomEtterMndr: Moment //'U
  let KorrNyFomEtterMndr: Moment //'V
  let AntallDager: number //'W

  Fomdato = moment(startdato, 'DD.MM.YYYY')
  Tomdato = moment(sluttdato, 'DD.MM.YYYY')

  // Add a day to end date
  Tomdatokorr = moment(Tomdato.toDate())
  Tomdatokorr.add(1, 'days')

  // estimate years based on number of days
  let numberOfDays = Tomdatokorr!.diff(Fomdato, 'days')
  AnslagHeleAar = Math.round(numberOfDays / 365)

  // Estimates new start date after whole year was added
  AnslagNyFomEtterAar = moment(Fomdato.toDate())
  AnslagNyFomEtterAar.add(AnslagHeleAar, 'years')

  // check if estimeted new startdate is over end date
  if (AnslagNyFomEtterAar > Tomdatokorr!) {
    HeleAar = AnslagHeleAar - 1
  } else {
    HeleAar = AnslagHeleAar
  }

  // sets new startdate after correct number of whole years is calculated
  NyFomEtterAar = moment(Fomdato.toDate())
  NyFomEtterAar.add(HeleAar, 'years')

  // from total days estimate whole months
  let numberOfDays2 = Tomdatokorr!.diff(NyFomEtterAar, 'days')
  AnslagHeleMndr = Math.round(numberOfDays2 / 30)

  // set estimation of new stardate after whole month added to new startdate after whole years were added

  AnslagNyFomEtterMndr = moment(NyFomEtterAar.toDate())
  AnslagNyFomEtterMndr.add(AnslagHeleMndr, 'months')

  KorrAnslagNyFomEtterMndr = moment(AnslagNyFomEtterMndr.toDate())

  // adjust new fom for errors caused by leap days
  // NOTE: .date() returns the day of the month, as in 13.02.2000 => 13
  // do NOT confuse with .toDate()
  if (AnslagNyFomEtterMndr.date() === 28 && Fomdato.date() === 29) {
    if (AnslagNyFomEtterMndr.month() === (AnslagNyFomEtterMndr.month() + 1)) {
      KorrAnslagNyFomEtterMndr.add(1, 'days')
    }
  }

  // adjust whole month if new startdate is higher than enddate
  if (KorrAnslagNyFomEtterMndr.isAfter(Tomdatokorr!)) {
    HeleMndr = AnslagHeleMndr - 1
  } else {
    HeleMndr = AnslagHeleMndr
  }

  NyFomEtterMndr = moment(NyFomEtterAar.toDate())
  NyFomEtterMndr.add(HeleMndr, 'months')

  KorrNyFomEtterMndr = moment(NyFomEtterMndr.toDate())

  // adjust new fom for errors caused by leap days
  if (NyFomEtterMndr.date() === 28 && Fomdato.date() === 29) {
    if (NyFomEtterMndr.month() === (NyFomEtterMndr.month() + 1)) {
      KorrNyFomEtterMndr.add(1, 'days')
    }
  }

  // calculate total days remaining after whole years and months are done
  AntallDager = Tomdatokorr!.diff(KorrNyFomEtterMndr, 'days')

  return {
    years: HeleAar,
    months: HeleMndr,
    days: AntallDager
  }
}

export default dateDiff

