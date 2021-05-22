export interface SedSender {
  date: string
  country: string
  countryLabel: string
  institution: string
  acronym: string
}

export type ActiveSeds = {[k: string]: boolean}

export type EmptyPeriodsReport = {[k: string]: boolean}

export interface P5000PeriodInterval {
  fom :  string
  tom :  string |  null
  extra : string |  null
}

export interface P5000Payload {
  sed: string
  sedGVer: string
  sedVer: string
  nav: any
  pensjon: any
  trygdetid: any
  ignore: any
  horisontal: any
}

export interface P5000Period {
  relevans : string | null,
    ordning : string | null,
    land : string | null,
    sum : {
    kvartal : string | null,
      aar : string | null,
      uker : string | null,
      dager : {
      nr : string | null,
        type : string | null,
    },
    maaneder : string | null
  },
  yrke : string | null,
    gyldigperiode : string | null,
    type : string | null,
    beregning : string | null,
    informasjonskalkulering : string | null,
    periode : P5000PeriodInterval | null,
    enkeltkrav : string | null,
}

export interface P5000SED {
  sed: string
  sedGVer: string
  sedVer: string
  nav: {
    eessisak: Array<{
      "institusjonsid" : string
      "institusjonsnavn" : string
      "saksnummer" : string
      "land" : string
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
        },
        foedselsdato : string
        sivilstand : string | null,
        relasjontilavdod : string | null,
        rolle : string | null
      },
      adresse : {
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
      },
      arbeidsforhold : string | null,
      bank : string | null
    },
    brukere : null,
    ektefelle : null,
    barn : null,
    verge : null,
    krav : null,
    sak : null,
    annenperson : null
  },
  pensjon : {
    trygdetid : Array<P5000Period>
    medlemskapAnnen : null
    medlemskapTotal : Array<P5000Period>
    medlemskap : null
    medlemskapboarbeid : {
      enkeltkrav : {
        datoFrist : string | null
        krav : string
      }
      gyldigperiode : string
      medlemskap : Array<P5000Period>
    }
  }
}
