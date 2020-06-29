import { AllowedLocaleString, T } from 'declarations/types'
import CountryData from 'land-verktoy'
import _ from 'lodash'
import { Buc, Sed, ValidBuc } from 'declarations/buc'
import moment from 'moment'

interface getBucTypeLabelProps {
  type: string;
  locale: AllowedLocaleString;
  t: T
}

export const getBucTypeLabel = ({ type, locale, t }: getBucTypeLabelProps): string => {
  if (!type.match('P3000_')) {
    return t('buc:buc-' + type)
  }
  const re: RegExpMatchArray | null = type.match(/_(.*)$/)
  if (!re) {
    return ''
  }
  const country: string = re[1]
  const countryLabel: any = CountryData.getCountryInstance(locale).findByValue(country)
  return t('buc:buc-P3000_XX', { country: countryLabel.label })
}

// the higher the indexOf, the higher it goes in the sorted list
const sedTypes: Array<string> = ['X', 'H', 'P']

export const bucSorter = (firstEl: Buc, secondEl: Buc): number => {
  return moment((firstEl as ValidBuc).startDate).isSameOrAfter(moment((secondEl as ValidBuc).startDate)) ? -1 : 1
}

export const sedSorter = (a: Sed, b: Sed): number => {
  if (b.lastUpdate - a.lastUpdate > 0) return 1
  if (b.lastUpdate - a.lastUpdate < 0) return -1
  const mainCompare = parseInt(a.type.replace(/[^\d]/g, ''), 10) - parseInt(b.type.replace(/[^\d]/g, ''), 10)
  const sedTypeA = a.type.charAt(0)
  const sedTypeB = b.type.charAt(0)
  if (sedTypes.indexOf(sedTypeB) - sedTypes.indexOf(sedTypeA) > 0) return 1
  if (sedTypes.indexOf(sedTypeB) - sedTypes.indexOf(sedTypeA) < 0) return -1
  return mainCompare > 0 ? 1 : -1
}

export const sedFilter = (sed: Sed): boolean => {
  return sed.status !== 'empty'
}

export const bucFilter = (buc: Buc): boolean => {
  return !_.isEmpty(buc.error) || (
    buc.type ? (
      buc.type.startsWith('P_BUC') || _.includes(['H_BUC_07', 'R_BUC_01', 'R_BUC_02', 'M_BUC_02', 'M_BUC_03a', 'M_BUC_03b'], buc.type)
    ) : true
  )
}
