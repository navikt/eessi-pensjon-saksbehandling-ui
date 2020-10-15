import * as constants from 'constants/constants'
import { SakTypeValue } from 'declarations/buc'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { OptionTypeBase } from 'react-select'

export type AllowedLocaleString = 'en' | 'nb'

export type Feature =
  'P5000_VISIBLE' // See P5000 button
  | 'P_BUC_02_VISIBLE' // See P_BUC_02 in new BUCs
  | 'SED_PREFILL_INSTITUTIONS' // Prefill with institutions in new SED
  | 'NR_AVDOD' // for mock purposes

export type FeatureToggles = {[key in Feature]: boolean | number}

export type Labels = {[k in string]? : string}

export type Loading = {[key: string]: boolean}

export interface Option extends OptionTypeBase {
  label: string
  navn?: string
  value: string
}

export type Options = Array<Option>

export type Params = {[k: string] : string}

export type PesysContext = constants.BRUKEROVERSIKT | constants.KRAVKONTEKST | constants.VEDTAKSKONTEKST

export interface ParamPayload {
  key: string,
  value?: any
}

export type RinaUrl = string

export type T = (line: string, ...args: any[]) => string

export interface UserInfoPayload {
  subject: string
  role: string
  allowed: boolean
  featureToggles: FeatureToggles
}

export type Validation = {[key: string]: FeiloppsummeringFeil | undefined}

export type WidthSize = 'sm' | 'md' | 'lg'
