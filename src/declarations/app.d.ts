import * as constants from 'constants/constants'
import { P4000SED } from 'declarations/p4000'
import { P5000SED } from 'declarations/p5000'
import { Sort } from '@navikt/tabell'

export type AllowedLocaleString = 'en' | 'nb'

export type BUCMode = 'buclist' | 'bucedit' | 'bucnew' | 'sednew' | 'p4000' | 'p5000'

export type SedType = 'P4000' | 'P5000'

export type PSED = P4000SED | P5000SED

export type LocalStorageEntriesMap<T extends PSED = PSED> = { [caseId in string]: Array<LocalStorageEntry<T>> } | null | undefined

export type Feature =
  'P4000_VISIBLE'
  | 'P5000_SUMMER_VISIBLE'
  | 'P5000_UPDATES_VISIBLE' // for new P5000 developments
  | 'SED_PREFILL_INSTITUTIONS' // Prefill with institutions in new SED
  | 'NR_AVDOD' // for mock purposes
  | 'X010_X009_VISIBLE' //
  | 'ADMIN_NOTIFICATION_MESSAGE'

export type FeatureToggles = {[key in Feature]: boolean | number}

export type Labels = {[k in string]? : string}

export type Loading = {[key: string]: boolean}

export interface Option {
  label: string
  navn?: string
  value: string
}

export type Params = {[k: string] : string | null | undefined}

export type PesysContext = constants.BRUKERKONTEKST | constants.KRAVKONTEKST | constants.VEDTAKSKONTEKST

export interface ParamPayload {
  key: string,
  value?: any
}

export type RinaUrl = string

export type T = (line: string, ...args: any[]) => string

export interface UserInfoPayload {
  subject: string
  role: string
  featureToggles: FeatureToggles
}

export type Validation = {[key: string]: ErrorElement | undefined}

export type WidthSize = 'sm' | 'md' | 'lg'

export interface LocalStorageEntry<CustomLocalStorageContent extends any = any> {
  sedId: string
  sedType: SedType
  date: number
  sort?: Sort
  content: CustomLocalStorageContent
}

export interface ErrorElement {
  feilmelding: string
  skjemaelementId: string
}
