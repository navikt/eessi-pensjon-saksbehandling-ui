import * as constants from 'constants/constants'
import { P4000SED } from 'declarations/p4000'
import { P5000SED } from 'declarations/p5000'
import { P2000SED } from "declarations/p2000";
import { P8000SED } from "declarations/p8000";
import { Sort } from '@navikt/tabell'
import {SimpleCountry} from "@navikt/landvelger";

export type AllowedLocaleString = 'en' | 'nb'

export type BUCMode = 'buclist' | 'bucedit' | 'bucnew' | 'sednew' | 'p4000' | 'p5000' | 'p2000' | 'p8000'

export type SedType = 'P4000' | 'P5000'

export type PSED = P2000SED | P4000SED | P5000SED | P8000SED

export type LocalStorageEntriesMap<T extends PSED = PSED> = { [caseId in string]: Array<LocalStorageEntry<T>> } | null | undefined

export type Feature =
  'P5000_UPDATES_VISIBLE' // for new P5000 developments
  | 'SED_PREFILL_INSTITUTIONS' // Prefill with institutions in new SED
  | 'NR_AVDOD' // for mock purposes
  | 'ADMIN_NOTIFICATION_MESSAGE'

export type FeatureToggles = {[key in Feature]: boolean | number}

export type CountryCodes = {
  "v4.2": CountryCodeLists,
  "v4.3": CountryCodeLists
}

export type CountryCodeLists = {
  "euEftaLand": Array<SimpleCountry>
  "verdensLand": Array<SimpleCountry>
  "verdensLandHistorisk": Array<SimpleCountry>
  "statsborgerskap": Array<SimpleCountry>
}

export type SimpleCountry = {
  landkode: string
  landnavn: string
}

export type Labels = {[k in string]? : string}

export type Loading = {[key: string]: boolean}

export interface Option {
  label: string
  navn?: string
  value: string
}

export type Params = {[k: string] : string | null | undefined}

export type PesysContext = constants.BRUKERKONTEKST | constants.KRAVKONTEKST | constants.VEDTAKSKONTEKST | constants.GJENNY

export interface ParamPayload {
  key: string,
  value?: any
}

export interface ContextPayload {
  context: string
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
