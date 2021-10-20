import { Item, Sort } from 'tabell'

export type P5000Context = 'edit' | 'overview'

export type P5000PeriodStatus = 'rina' | 'edited' | 'new'

export type P5000SourceStatus = 'rina' | 'storage'

export interface SedSender {
  date: string
  country: string
  countryLabel: string
  institution: string
  acronym: string
}

export type EmptyPeriodsReport = {[k: string]: boolean}

export interface P5000PeriodInterval {
  fom : string | null
  tom : string | null
}

export interface P5000Period {
  key ?: string
  selected ?: boolean
  relevans : string | null
  ordning? : string | null
  land : string | null
  sum : {
    kvartal : string | null
    aar : string | null
    uker : string | null
    dager : {
      nr : string | null
      type : string | null
    },
    maaneder : string | null
  },
  yrke : string | null
  gyldigperiode : string | null
  type : string | null
  beregning : string | null
  informasjonskalkulering? : string | null
  periode : P5000PeriodInterval | null
  enkeltkrav? : string | null
}

export interface P5000SED {
  sed: string
  sedGVer: string
  sedVer: string
  nav: {
    eessisak: Array<{
      institusjonsid : string
      institusjonsnavn : string
      saksnummer : string
      land : string
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
        datoFrist? : string | null
        krav : string
      }
      gyldigperiode : string
      medlemskap : Array<P5000Period>
    }
  }
}

export interface P5000ListRow extends Item {
  key: string
  status: P5000PeriodStatus
  land: string
  acronym: string
  type: string
  startdato: string
  sluttdato: string
  aar: string
  mnd: string
  dag: string
  ytelse: string
  ordning: string
  beregning: string
}

export type P5000ListRows = Array<P5000ListRow>

export interface P5000SumRow extends Item {
  key: string
  type: string
  land: string | null
  sec51aar: string
  sec51mnd: string
  sec51dag: string
  sec52aar: string
  sec52mnd: string
  sec52dag: string
  startdato: string
  sluttdato: string
  beregning: string | null
}

export interface P5000UpdatePayload {
  items?: P5000ListRows
  ytelseOption?: string
  sort?: Sort
  forsikringEllerBosetningsperioder?: string
}

export type P5000SumRows = Array<P5000SumRow>

export interface P5000TableContext {
  items: P5000ListRows
  forsikringEllerBosetningsperioder: string | undefined
}
