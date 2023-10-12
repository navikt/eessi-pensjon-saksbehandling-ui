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
  pin : Array<PIN>,
  statsborgerskap: Array<Statsborgerskap>
  etternavn : string
  fornavn : string
  kjoenn : string
  foedested : {
    by : string | null
    land : string | null
    region : string | null
  } | null,
  foedselsdato : string
  sivilstand : Array<Sivilstand>,
  relasjontilavdod : string | null,
  rolle : string | null,
  kontakt: {
    telefon: Array<Telefon> | null,
    email: Array<Email> | null
  }
}

export interface Bruker {
  mor : string | null
  far : string | null
  person : Person,
  adresse : Adresse | null,
  bank : Bank | null
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
    barn : null,
    ektefelle : null,
  },
  pensjon : {
    utsettelse: Array<{
      land: string
      institusjonsid: string
      institusjonsnavn: string
      tildato: string
    }>
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
}
