import * as constants from 'constants/constants'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { OptionProps } from 'react-select'
import { Sort } from 'tabell'

export type AllowedLocaleString = 'en' | 'nb'

export type BUCMode = 'buclist' | 'bucedit' | 'bucnew' | 'sednew' | 'p5000'

export type Feature =
  'P5000_SUMMER_VISIBLE'
  | 'SED_PREFILL_INSTITUTIONS' // Prefill with institutions in new SED
  | 'NR_AVDOD' // for mock purposes
  | 'X010_X009_VISIBLE'

export type FeatureToggles = {[key in Feature]: boolean | number}

export type Labels = {[k in string]? : string}

export type Loading = {[key: string]: boolean}

export interface O {
  label: string
  navn?: string
  value: string
}

export type Option = OptionProps<O, false>
export type MOption = OptionProps<O, true>

export type Options = Array<Option>

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

export type Validation = {[key: string]: FeiloppsummeringFeil | undefined}

export type WidthSize = 'sm' | 'md' | 'lg'

export type LocalStorageEntry<CustomLocalStorageContent extends any = any> = {[k in string]: Array<LocalStorageValue<CustomLocalStorageContent>>}

export interface LocalStorageValue<CustomLocalStorageContent extends any = any> {
  id: string
  date: number
  sort?: Sort
  content: CustomLocalStorageContent
}
