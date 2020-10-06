import * as constants from 'constants/constants'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'

export type AllowedLocaleString = 'en' | 'nb'

export type T = (line: string, ...args: any[]) => string

export type Feature =
    'P5000_VISIBLE' // See P5000 button
  | 'P_BUC_02_VISIBLE' // See P_BUC_02 in new BUCs
  | 'SED_PREFILL_INSTITUTIONS' // Prefill with institutions in new SED
  | 'NR_AVDOD' // for mock purposes

export type PesysContext = constants.BRUKEROVERSIKT | constants.KRAVKONTEKST | constants.VEDTAKSKONTEKST

export type RinaUrl = string
export type Loading = {[key: string]: boolean}
export type Validation = {[key: string]: FeiloppsummeringFeil}
export type Params = {[k: string] : string}
export type FeatureToggles = {[key in Feature]: boolean | number}

export interface Option {
  label: string
  navn?: string
  value: string
}

export type Options = Array<Option>

export type Labels = {[k in string]? : string}

export interface Person {
  diskresjonskode: any
  bostedsadresse: any
  sivilstand: any
  statsborgerskap: any
  harFraRolleI: any
  aktoer: any
  kjoenn: any
  personnavn: any
  personstatus: any
  postadresse: any
  foedselsdato: any
  doedsdato: any
  foedested: any
  gjeldendePostadressetype: any
  geografiskTilknytning: any
  midlertidigPostadresse: any
  vergeListe: any
  kontaktinformasjon: any
  bankkonto: any
  tilrettelagtKommunikasjon: any
  sikkerhetstiltak: any
  maalform: any
  endringstidspunkt: any
  endretAv: any
  endringstype: any
}

export interface PersonAvdod {
  aktoerId: string
  etternavn: string
  fnr: string
  fornavn: string
  fulltNavn: string
  mellomnavn: string | null
  relasjon: string
}

export type PersonAvdods = Array<PersonAvdod>
