import * as constants from 'src/constants/constants'
import { JoarkBrowserItem } from 'src/declarations/joark.d'
import { AllowedLocaleString, Option, PesysContext, T } from 'src/declarations/app.d'
import { PersonAvdod, PersonAvdods, PersonPDL } from 'src/declarations/person.d'
import CountryData, { Country, CountryFilter } from '@navikt/land-verktoy'
import _ from 'lodash'
import {Buc, JoarkBuc, Sed} from 'src/declarations/buc'
import moment from 'moment'

interface getBucTypeLabelProps {
  type: string
  locale: AllowedLocaleString
  t: T
}

// the higher the indexOf, the higher it goes in the sorted list
const sedTypes: Array<string> = ['X', 'H', 'P']

export const bucSorter = (a: Buc | JoarkBuc, b: Buc | JoarkBuc): number => {
  return moment(a.startDate).isSameOrAfter(moment(b.startDate)) ? -1 : 1
}

export const bucFilter = (buc: Buc | JoarkBuc): boolean => {
  return !_.isEmpty(buc.error) || (
    buc.type
      ? (
          buc.type.startsWith('P_BUC') || _.includes(['H_BUC_07', 'R_BUC_01', 'R_BUC_02', 'M_BUC_02', 'M_BUC_03a', 'M_BUC_03b'], buc.type)
        )
      : true
  )
}

export const bucsThatSupportAvdod = (bucType: string | null | undefined): boolean => _.includes(['P_BUC_02', 'P_BUC_05', 'P_BUC_06', 'P_BUC_10'], bucType)

export const countrySorter = (locale: string) => {
  return (a: string, b: string): number => {
    const countryInstance: any = CountryData.getCountryInstance(locale)
    const labelA = countryInstance.findByValue(a)
    const labelB = countryInstance.findByValue(b)
    if (CountryFilter.SCANDINAVIA.indexOf(b.toUpperCase()) - CountryFilter.SCANDINAVIA.indexOf(a.toUpperCase()) > 0) return 1
    if (CountryFilter.SCANDINAVIA.indexOf(b.toUpperCase()) - CountryFilter.SCANDINAVIA.indexOf(a.toUpperCase()) < 0) return -1

    return labelA && labelB ? labelA.label.localeCompare(labelB.label) : a.localeCompare(b)
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
export const getNPID = (p: PersonPDL | null | undefined): string | undefined => _.find(p?.identer, i => i.gruppe === 'NPID')?.ident

export const labelSorter = (a: Option, b: Option) => a.label.localeCompare(b.label)

export const pbuc02filter = (pesysContext: PesysContext, personAvdods: PersonAvdods | undefined) =>
  (buc: Buc | JoarkBuc) => {
    if (buc.type === 'P_BUC_02' &&
      pesysContext !== constants.VEDTAKSKONTEKST &&
      pesysContext !== constants.GJENNY &&
      buc?.creator?.country === 'NO'
    ) {
      return false
    }

    if (buc.type === 'P_BUC_02' &&
      (pesysContext === constants.VEDTAKSKONTEKST || pesysContext === constants.GJENNY) &&
      personAvdods?.length === 0 && buc?.creator?.country === 'NO') {
      return false
    }
    return true
  }

export const renderAvdodName = (avdod: PersonAvdod | null | undefined, t: Function): string | undefined => {
  if (!avdod) {
    return undefined
  }
  return avdod?.fornavn +
    (avdod?.mellomnavn ? ' ' + avdod?.mellomnavn : '') +
    (avdod?.etternavn ? ' ' + avdod?.etternavn : '') +
    ' - ' + avdod?.fnr + ' (' + t('buc:relasjon-' + avdod?.relasjon) + ')'
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
  if (b.status === 'new' && a.status !== 'new') return 1
  if (a.status === 'new' && b.status !== 'new') return -1
  if ((b.receiveDate ?? b.lastUpdate) - (a.receiveDate ?? a.lastUpdate) > 0) return 1
  if ((b.receiveDate ?? b.lastUpdate) - (a.receiveDate ?? a.lastUpdate) < 0) return -1
  const mainCompare = parseInt(a.type.replace(/[^\d]/g, ''), 10) - parseInt(b.type.replace(/[^\d]/g, ''), 10)
  const sedTypeA = a.type.charAt(0)
  const sedTypeB = b.type.charAt(0)
  if (sedTypes.indexOf(sedTypeB) - sedTypes.indexOf(sedTypeA) > 0) return 1
  if (sedTypes.indexOf(sedTypeB) - sedTypes.indexOf(sedTypeA) < 0) return -1
  return mainCompare > 0 ? 1 : -1
}

export const valueSorter = (a: Option, b: Option) => a.value.localeCompare(b.value)

export const dateSorter = (a: Sed, b: Sed): number => {
  return moment(a.lastUpdate).isSameOrAfter(moment(b.lastUpdate)) ? -1 : 1
}
