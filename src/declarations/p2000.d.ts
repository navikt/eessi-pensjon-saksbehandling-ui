export interface Beloep {
  annenbetalingshyppighetytelse?: string | null
  gjeldendesiden?: string | null
  beloep?: string | null
  valuta?: string | null
  betalingshyppighetytelse?: string | null
}

export interface Ytelse {
  status?: string | null
  totalbruttobeloeparbeidsbasert?: string | null
  startdatoutbetaling?: string | null
  beloep?: Array<Beloep> | null
  sluttdatoutbetaling?: string | null
  annenytelse?: string | null
  totalbruttobeloepbostedsbasert?: string | null
  institusjon?: {
    saksnummer?: string | null
    land?: string | null
    pin?: string | null
    institusjonsnavn?: string | null
    sektor?: string | null
    institusjonsid?: string | null
  },
  mottasbasertpaa?: string | null
  startdatoretttilytelse?: string | null
  ytelse?: string | null
  sluttdatoUtbetaling?: string | null
}

export interface Arbeidsforhold {
  yrke?: string | null
  planlagtpensjoneringsdato?: string | null
  inntekt?: Array<Inntekt> | null
  type?: string | null
  arbeidstimerperuke?: string | null
  sluttdato?: string | null
  planlagtstartdato?: string | null
}

export interface Person {
  pin? : Array<PIN>,
  statsborgerskap?: Array<Statsborgerskap>
  etternavn?: string
  etternavnvedfoedsel?: string
  fornavn?: string
  kjoenn?: string
  foedested?: {
    by?: string | null | undefined
    land?: string | null | undefined
    region?: string | null | undefined
  } | null | undefined,
  foedselsdato?: string
  doedsdato?: string
  sivilstand?: Array<Sivilstand>,
  relasjontilavdod?: string | null,
  rolle?: string | null,
  kontakt?: {
    telefon: Array<Telefon> | null,
    email: Array<Email> | null
  }
}

export interface Bruker {
  far?: {
    person: Person
  },
  mor?: {
    person: Person
  }
  person : Person,
  adresse : Adresse | null,
  bank : Bank | null
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
  person: {
    kontakt: {
      telefon: Array<Telefon> | null
      email: Array<Email> | null
    },
    fornavn: string
    etternavn: string
  },
  vergemaal: {
    mandat: string | null
  } | null,
  adresse: Adresse | null
}

export interface Adresse {
  gate : string
  bygning : string | null
  by : string | null
  postkode : string | null,
  postnummer : string | null,
  region : string | null,
  land : string
  kontaktpersonadresse : string | null,
  datoforadresseendring : string | null,
  postadresse : string | null,
  startdato : string | null
}

export interface Telefon {
  nummer: string | null
  type: string | null
}

export interface Email {
  adresse: string | null
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
  status: string | null
  fradato: string
}

export interface Inntekt {
  beloep?: string | null,
  valuta?: string | null,
  beloeputbetaltsiden?: string | null,
  betalingshyppighetinntekt?: string | null,
  annenbetalingshyppighetinntekt?: string | null
}

export interface Bank {
  navn: string | null,
  konto: {
    kontonr: string
    innehaver: Innehaver
    sepa: SEPA
    ikkesepa: {
      swift: string | null
    }
  },
  adresse: Adresse
}

export interface Innehaver{
  navn: string | null
  rolle: string | null
}

export interface SEPA{
  iban: string | null
  swift: string | null
}

export interface Utsettelse {
  land?: string
  institusjonsid?: string
  institusjonsnavn?: string
  tildato?: string
}

export interface Pensjon {
  utsettelse: Array<Utsettelse>
  ytelser: Array<Ytelse>
  ytterligeinformasjon: string
  bruker: {
    arbeidsforhold: Array<Arbeidsforhold>
  }
  etterspurtedokumenter: string
  vedtak: Array<{
    mottaker: Array<string>
    trekkgrunnlag: Array<string>
  }>
  vedlegg: Array<string>
  institusjonennaaikkesoektompensjon: Array<string>
  vedleggandre: string
  forespurtstartdato: string
  angitidligstdato: string
}

export interface P2000SED {
  sed: string
  sedGVer: string
  sedVer: string
  nav: {
    eessisak: Array<{
      institusjonsid : string | null
      institusjonsnavn : string | null
      saksnummer : string | null
      land : string | null
    }>
    bruker : Bruker,
    verge : Verge | null,
    krav : null,
    barn : Barn,
    ektefelle: Ektefelle,
  },
  pensjon : Pensjon
}
