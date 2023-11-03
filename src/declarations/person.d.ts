
/* export interface Person {
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
} */

type Sivilstandstype =
  'UOPPGITT' |
  'UGIFT' |
  'GIFT' |
  'ENKE_ELLER_ENKEMANN' |
  'SKILT' |
  'SEPARERT' |
  'PARTNER' |
  'SEPARERT_PARTNER' |
  'SKILT_PARTNER' |
  'GJENLEVENDE_PARTNER'

type Familierelasjonsrolle = 'FAR' | 'MOR' | 'MEDMOR' | 'BARN'

type KjoennType = 'MANN' | 'KVINNE' | 'UKJENT'

type IdentGruppe = 'AKTORID' | 'FOLKEREGISTERIDENT' | 'NPID'

interface IdentInformasjon {
  ident: string
  gruppe: IdentGruppe
}

interface Navn {
  fornavn: string
  mellomnavn?: string
  etternavn: string
  sammensattNavn?: string
}

type AdressebeskyttelseGradering =
  'STRENGT_FORTROLIG_UTLAND' |
  'STRENGT_FORTROLIG' |
  'FORTROLIG' |
  'UGRADERT'

interface Vegadresse {
  adressenavn?: string
  husnummer?: string
  husbokstav?: string
  postnummer?: string
}

interface UtenlandskAdresse {
  landkode: string
}

interface Bostedsadresse {
  gyldigFraOgMed?: string
  gyldigTilOgMed?: string
  vegadresse?: Vegadresse,
  utenlandskAdresse?: UtenlandskAdresse
}

type Oppholdsadresse = Bostedsadresse

interface Statsborgerskap {
  land: string
  gyldigFraOgMed?: string
  gyldigTilOgMed?: string
}

interface Foedsel {
  foedselsdato?: string
  foedeland?: string,
  foedested?: string,
  folkeregistermetadata?: {
    gyldighetstidspunkt: string
  }
}

type GtType = 'KOMMUNE' | 'BYDEL' | 'UTLAND' | 'UDEFINERT'

interface GeografiskTilknytning {
  gtType?: GtType
  gtKommune?: string
  gtBydel?: string
  gtLand?: string
}

interface Kjoenn {
  kjoenn: KjoennType
  folkeregistermetadata?: {
    gyldighetstidspunkt: string
  }
}

interface Doedsfall {
  doedsdato ?: string,
  folkeregistermetadata?: {
    gyldighetstidspunkt: string
  }
}

interface Familierelasjon {
  relatertPersonsIdent?: string
  relatertPersonsRolle?: Familierelasjonsrolle
  minRolleForPerson?: Familierelasjonsrolle
}

interface Sivilstand {
  type: Sivilstandstype
  gyldigFraOgMed?: string
  relatertVedSivilstand?: string
}

export interface PersonPDL {
  identer: Array<IdentInformasjon>
  navn?: Navn
  adressebeskyttelse?: Array<string>
  bostedsadresse?: Bostedsadresse
  oppholdsadresse?: Oppholdsadresse
  statsborgerskap: Array<Statsborgerskap>
  foedsel: Foedsel
  geografiskTilknytning?: GeografiskTilknytning
  kjoenn?: Kjoenn
  doedsfall?: Doedsfall
  familierelasjoner: Array<Familierelasjon>
  sivilstand: Array<Sivilstand>
}

export interface PersonAvdod {
  aktoerId: string
  etternavn: string
  fnr: string
  fornavn: string
  fulltNavn: string
  mellomnavn?: string | null
  relasjon?: string
  doedsDato?: string
}

export type PersonAvdods = Array<PersonAvdod>
