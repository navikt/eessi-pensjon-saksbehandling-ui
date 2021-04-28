export interface SedSender {
  date: string
  country: string
  countryLabel: string
  institution: string
  acronym: string
}

export type ActiveSeds = {[k: string]: boolean}

export type EmptyPeriodsReport = {[k: string]: boolean}
