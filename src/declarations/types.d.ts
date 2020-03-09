
export type AllowedLocaleString = 'en' | 'nb'

export type T = (line: string, ...args: any[]) => string

export type RinaUrl = string
export type Loading = {[key: string]: boolean}
export type Validation = {[key: string]: string | null | undefined}
export type Params = {[k: string] : string}
export type Features = {[key: string]: boolean}

interface Option {
  label: string;
  navn?: string;
  value: string;
}

export interface Person {
  diskresjonskode: any;
  bostedsadresse: any;
  sivilstand: any;
  statsborgerskap: any;
  harFraRolleI: any;
  aktoer: any;
  kjoenn: any;
  personnavn: any;
  personstatus: any;
  postadresse: any;
  foedselsdato: any;
  doedsdato: any;
  foedested: any;
  gjeldendePostadressetype: any;
  geografiskTilknytning: any;
  midlertidigPostadresse: any;
  vergeListe: any;
  kontaktinformasjon: any;
  bankkonto: any;
  tilrettelagtKommunikasjon: any;
  sikkerhetstiltak: any;
  maalform: any;
  endringstidspunkt: any;
  endretAv: any;
  endringstype: any;
}
