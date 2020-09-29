import { JoarkBrowserItem } from 'declarations/joark.d'
import { AllowedLocaleString, PersonAvdod, T } from 'declarations/types.d'
import CountryData, { CountryFilter } from 'land-verktoy'
import _ from 'lodash'
import { Buc, Sed, ValidBuc } from 'declarations/buc'
import moment from 'moment'

interface getBucTypeLabelProps {
  type: string
  locale: AllowedLocaleString
  t: T
}

export const getBucTypeLabel = ({ type, locale, t }: getBucTypeLabelProps): string => {
  if (type && !type.match('P3000_')) {
    return t('buc:buc-' + type)
  }
  const re: RegExpMatchArray | null = type ? type.match(/_(.*)$/) : null
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

export const sedAttachmentSorter = (a: JoarkBrowserItem, b: JoarkBrowserItem): number => {
  if (b.type === 'joark' && a.type === 'sed') return -1
  if (b.type === 'sed' && a.type === 'joark') return 1
  return b.key.localeCompare(a.key)
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

export const countrySorter = (locale: string) => {
  return (a: string, b: string): number => {
    const countryInstance: any = CountryData.getCountryInstance(locale)
    const labelA = countryInstance.findByValue(a)
    const labelB = countryInstance.findByValue(b)
    if (CountryFilter.SCANDINAVIA.indexOf(b.toUpperCase()) - CountryFilter.SCANDINAVIA.indexOf(a.toUpperCase()) > 0) return 1
    if (CountryFilter.SCANDINAVIA.indexOf(b.toUpperCase()) - CountryFilter.SCANDINAVIA.indexOf(a.toUpperCase()) < 0) return -1
    return labelA.label.localeCompare(labelB.label)
  }
}

export const renderAvdodName = (avdod: PersonAvdod | undefined, t: Function) => {
  return avdod?.fornavn +
  (avdod?.mellomnavn ? ' ' + avdod?.mellomnavn : '') +
  (avdod?.etternavn ? ' ' + avdod?.etternavn : '') +
  ' - ' + avdod?.fnr + ' (' + t('buc:relasjon-' + avdod?.relasjon) + ')'
}
