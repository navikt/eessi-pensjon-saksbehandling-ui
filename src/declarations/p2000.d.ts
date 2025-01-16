import {Sed} from "src/declarations/buc";

export interface Beloep {
  annenbetalingshyppighetytelse?: string
  gjeldendesiden?: string
  beloep?: string
  valuta?: string
  betalingshyppighetytelse?: string
}

export interface Ytelse {
  status?: string
  totalbruttobeloeparbeidsbasert?: string
  startdatoutbetaling?: string
  beloep?: Array<Beloep>
  sluttdatoutbetaling?: string
  annenytelse?: string
  totalbruttobeloepbostedsbasert?: string
  institusjon?: {
    saksnummer?: string
    land?: string
    pin?: string
    institusjonsnavn?: string
    sektor?: string
    institusjonsid?: string
  },
  mottasbasertpaa?: string
  startdatoretttilytelse?: string
  ytelse?: string
  sluttdatoUtbetaling?: string
}

export interface Arbeidsforhold {
  yrke?: string
  planlagtpensjoneringsdato?: string
  inntekt?: Array<Inntekt>
  type?: string
  arbeidstimerperuke?: string
  sluttdato?: string
  planlagtstartdato?: string
}

export interface Foedested {
  by?: string
  land?: string
  region?: string
}

export interface Person {
  pin? : Array<PIN>,
  statsborgerskap?: Array<Statsborgerskap>
  etternavn?: string
  etternavnvedfoedsel?: string
  fornavn?: string
  kjoenn?: string
  foedested?: Foedested,
  foedselsdato?: string
  doedsdato?: string
  sivilstand?: Array<Sivilstand>
  relasjontilavdod?: string
  rolle?: string
  kontakt?: {
    telefon: Array<Telefon>
    email: Array<Email>
  }
}

export interface Bruker {
  far?: {
    person: Person
  },
  mor?: {
    person: Person
  }
  person : Person
  adresse?: Adresse
  bank?: Bank
}

export interface Ektefelle {
  person: Person,
  type: string
  far?: {
    person: Person
  },
  mor?: {
    person: Person
  }
}

export interface Barn {
  person?: Person
  far?: {
    person: Person
  },
  mor?: {
    person: Person
  }
  relasjontilbruker?: string
  opplysningeromannetbarn?: string
}

export interface Verge {
  person: Person,
  vergemaal?: {
    mandat?: string
  },
  adresse?: Adresse
}

export interface Adresse {
  gate : string
  bygning?: string
  by?: string
  postkode?: string
  postnummer?: string
  region?: string
  land: string
  kontaktpersonadresse?: string
  datoforadresseendring?: string
  postadresse?: string
  startdato?: string
}

export interface Telefon {
  nummer: string
  type: string
}

export interface Email {
  adresse: string
}

export interface Statsborgerskap {
  land: string
}

export interface PIN {
  institusjonsnavn?: string
  institusjonsid?: string
  sektor?: string
  identifikator?: string
  land?: string
}

export interface Sivilstand {
  status: string
  fradato: string
}

export interface Inntekt {
  beloep?: string
  valuta?: string
  beloeputbetaltsiden?: string
  betalingshyppighetinntekt?: string
  annenbetalingshyppighetinntekt?: string
}

export interface Bank {
  navn?: string
  konto: {
    kontonr: string
    innehaver: Innehaver
    sepa?: SEPA
    ikkesepa?: {
      swift: string
    }
  },
  adresse: Adresse
}

export interface Innehaver{
  navn?: string
  rolle?: string
}

export interface SEPA{
  iban: string
  swift: string
}

export interface Utsettelse {
  land?: string
  institusjonsid?: string
  institusjonsnavn?: string
  tildato?: string
}

export interface Krav {
  dato: string
  type?: string
}

export interface Pensjon {
  utsettelse?: Array<Utsettelse>
  ytelser?: Array<Ytelse>
  ytterligeinformasjon?: string
  bruker?: {
    arbeidsforhold: Array<Arbeidsforhold>
  }
  etterspurtedokumenter?: string
  mottaker?: Array<string>
  trekkgrunnlag?: Array<string>
  vedlegg?: Array<string>
  institusjonennaaikkesoektompensjon?: Array<string>
  vedleggandre?: string
  forespurtstartdato?: string
  angitidligstdato?: string
  kravDato?: string
}

export interface Nav {
  eessisak: Array<{
    institusjonsid?: string
    institusjonsnavn?: string
    saksnummer?: string
    land?: string
  }>
  bruker : Bruker,
  verge : Verge,
  krav : Krav,
  barn : Array<Barn>,
  ektefelle: Ektefelle,
}

export interface P2000SED extends BaseSED{
  nav: Nav,
  pensjon : Pensjon
}

export interface BaseSED {
  sed: string
  sedGVer: string
  sedVer: string
  originalSed: Sed // removed before SAVE
}
