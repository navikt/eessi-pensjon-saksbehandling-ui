import * as constants from 'constants/constants'
import { JoarkBrowserItem } from 'declarations/joark.d'
import { AllowedLocaleString, Option, PesysContext, T } from 'declarations/app.d'
import { PersonAvdodPDL, PersonAvdodsPDL, PersonPDL } from 'declarations/person.d'
import CountryData, { Country, CountryFilter } from 'land-verktoy'
import _ from 'lodash'
import { Buc, Sed, ValidBuc } from 'declarations/buc'
import moment from 'moment'

interface getBucTypeLabelProps {
  type: string
  locale: AllowedLocaleString
  t: T
}

// the higher the indexOf, the higher it goes in the sorted list
const sedTypes: Array<string> = ['X', 'H', 'P']

export const bucSorter = (a: Buc, b: Buc): number => {
  return moment((a as ValidBuc).startDate).isSameOrAfter(moment((b as ValidBuc).startDate)) ? -1 : 1
}

export const bucFilter = (buc: Buc): boolean => {
  return !_.isEmpty(buc.error) || (
    buc.type
      ? (
          buc.type.startsWith('P_BUC') || _.includes(['H_BUC_07', 'R_BUC_01', 'R_BUC_02', 'M_BUC_02', 'M_BUC_03a', 'M_BUC_03b'], buc.type)
        )
      : true
  )
}

export const bucsThatSupportAvdod = (bucType: string | null | undefined): boolean => _.includes(['P_BUC_02', 'P_BUC_05', 'P_BUC_10'], bucType)

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

export const getBucTypeLabel = ({ type, locale, t }: getBucTypeLabelProps): string => {
  if (type && !type.match('P3000_')) {
    return t('buc:buc-' + type)
  }
  const re: RegExpMatchArray | null = type ? type.match(/_(.*)$/) : null
  if (!re) {
    return ''
  }
  const countryLabel: Country | undefined = CountryData.getCountryInstance(locale).findByValue(re[1])
  return t('buc:buc-P3000_XX', { country: countryLabel?.label || t('ui:unknownLand') })
}

export const getFnr = (p: PersonPDL | null | undefined): string | undefined => _.find(p?.identer, i => i.gruppe === 'FOLKEREGISTERIDENT')?.ident

export const getRelasjonTilPerson = (p: PersonPDL | null | undefined, needle: string | undefined) => _.find(p?.familierelasjoner, r => r.relatertPersonsIdent === needle)?.relatertPersonsRolle

export const getRelasjonTilAvdod = (pa: PersonAvdodPDL | null | undefined, needle: string | undefined) => _.find(pa?.familierelasjoner, r => r.relatertPersonsIdent === needle)?.minRolleForPerson

export const labelSorter = (a: Option, b: Option) => a.label.localeCompare(b.label)

export const pbuc02filter = (pesysContext: PesysContext, personAvdods: PersonAvdodsPDL | undefined) =>
  (buc: Buc) => {
    if (buc.type === 'P_BUC_02' && pesysContext !== constants.VEDTAKSKONTEKST && (
      // 'NO:NAVAT08' in test environment should be read as a foreign institution
      buc?.creator?.country === 'NO' && (buc?.creator?.institution !== 'NO:NAVAT06' && buc?.creator?.institution !== 'NO:NAVAT08')
    )) {
      return false
    }
    if (buc.type === 'P_BUC_02' && pesysContext === constants.VEDTAKSKONTEKST &&
      personAvdods?.length === 0 && buc?.creator?.country === 'NO') {
      return false
    }
    return true
  }

export const renderAvdodName = (avdod: PersonAvdodPDL | null | undefined, person: PersonPDL | null | undefined, t: Function): string | undefined => {
  if (!avdod || !person) {
    return undefined
  }
  const fnr = getFnr(avdod)
  const personFnr = getFnr(person)
  return avdod?.navn?.fornavn +
    (avdod?.navn?.mellomnavn ? ' ' + avdod?.navn?.mellomnavn : '') +
    (avdod?.navn?.etternavn ? ' ' + avdod?.navn?.etternavn : '') +
    ' - ' + fnr + ' (' + t('buc:relasjon-' + getRelasjonTilAvdod(avdod, personFnr)) + ')'
}

export const sedAttachmentSorter = (a: JoarkBrowserItem, b: JoarkBrowserItem): number => {
  if (b.type === 'joark' && a.type === 'sed') return -1
  if (b.type === 'sed' && a.type === 'joark') return 1
  return b.key.localeCompare(a.key)
}

export const sedFilter = (sed: Sed): boolean => {
  return sed.status !== 'empty'
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

export const valueSorter = (a: Option, b: Option) => a.value.localeCompare(b.value)
