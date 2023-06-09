export interface Beloep {
  annenbetalingshyppighetytelse: string | null
  gjeldendesiden: string | null
  beloep: string | null
  valuta: string | null
  betalingshyppighetytelse: string | null
}

export interface Ytelser {
  status: string | null
  totalbruttobeloeparbeidsbasert: string | null
  startdatoutbetaling: string | null
  beloep: Array<Beloep> | null
  sluttdatoutbetaling: string | null
  annenytelse: string | null
  totalbruttobeloepbostedsbasert: string | null
  institusjon: {
    saksnummer: string | null
    land: string | null
    pin: string | null
    institusjonsnavn: string | null
    sektor: string | null
    institusjonsid: string | null
  },
  mottasbasertpaa: string | null
  startdatoretttilytelse: string | null
  ytelse: string | null
  sluttdatoUtbetaling: string | null
}

export interface Arbeidsforhold {
  yrke: string | null
  planlagtpensjoneringsdato: string | null
  inntekt: [
    {
      "beloeputbetaltsiden": string | null
      "annenbetalingshyppighetinntekt": string | null
      "beloep": string | null
      "valuta": string | null
      "betalingshyppighetinntekt": string | null
    }
  ],
  type: string | null
  arbeidstimerperuke: string | null
  sluttdato: string | null
  planlagtstartdato: string | null
}

export interface Verge {
  person: {
    kontakt: {
      telefon: Array<Telefon> | null,
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
    bruker : {
      mor : string | null
      far : string | null
      person : {
        pin : Array<{
          institusjonsnavn: string | null
          institusjonsid: string | null
          sektor: string | null
          identifikator: string
          land: string
          institusjon: string | null
        }>,
        pinland : string | null,
        statsborgerskap: Array<{
          land: string
        }>
        etternavn : string
        fornavn : string
        kjoenn : string
        foedested : {
          by : string | null
          land : string | null
          region : string | null
        } | null,
        foedselsdato : string
        sivilstand : string | null,
        relasjontilavdod : string | null,
        rolle : string | null
      },
      adresse : Adresse | null,
      arbeidsforhold : string | null,
      bank : string | null
    },
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
    ytelser: Array<Ytelser>
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
