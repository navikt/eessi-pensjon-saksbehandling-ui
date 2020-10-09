
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
  mellomnavn?: string | null
  relasjon: string
}

export type PersonAvdods = Array<PersonAvdod>
