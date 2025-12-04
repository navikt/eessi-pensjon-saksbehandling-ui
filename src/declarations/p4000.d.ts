import {Item} from "@navikt/tabell";
import {BaseSED} from "src/declarations/sed";

export interface P4000PeriodInterval {
  fom : string | null
  tom : string | null
  extra: string | null
}

export interface P4000PeriodObject {
  "lukketPeriode": P4000PeriodInterval
  "openPeriode": P4000PeriodInterval
  "periodebeskrivelse": string | null
}



export interface P4000Period {
  "land": string,
  "annenInformasjon": string | null,
  "periode": P4000PeriodObject,
  "usikkerDatoIndikator": string | null,
  "navnPaaInstitusjon": string | null,
  "typePeriode": string | null
}

export interface P4000BarnepassPeriod extends P4000Period{
  "informasjonBarn": {
    "fornavn": string | null,
    "land": string | null,
    "etternavn": string | null,
    "foedseldato": string | null
  }
}

export interface P4000AnsattSelvstendigPeriod extends P4000Period{
  "jobbUnderAnsattEllerSelvstendig": string | null,
  "annenInformasjon": string | null,
  "adresseFirma": {
    "gate": string | null,
    "bygning": string | null,
    "by": string | null,
    "postnummer": string | null,
    "postkode": string | null,
    "region": string | null,
    "land": string | null,
    "kontaktpersonadresse": string | null,
    "datoforadresseendring": string | null,
    "postadresse": string | null,
    "startdato": string | null,
    "type": string | null,
    "annen": string | null
  }
  "forsikkringEllerRegistreringNr": string | null,
  "navnFirma": string | null,
}

export interface P4000ListRow extends Item {
  land: string | null,
  type: string | null,
  startdato: Date | null,
  sluttdato: Date | null,
  usikreDatoer: string | null,
  tillegsInfo: string | null,
  arbeidsgiver: string | null,
  sted: string | null,
  yrke: string | null,
  ansattSelvstendig: string | null
}

export type P4000ListRows = Array<P4000ListRow>

export interface P4000TableContext {
  items: P4000ListRows
}

export interface P4000SED  extends BaseSED {
  sedId: string
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
        } | null,
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
      } | null,
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
  pensjon : null,
  trygdetid : {
    "andrePerioder": Array<P4000Period>,
    "arbeidsledigPerioder": Array<P4000Period>,
    "boPerioder": Array<P4000Period>,
    "opplaeringPerioder": Array<P4000Period>,
    "sykePerioder": Array<P4000Period>,
    "barnepassPerioder": Array<P4000BarnepassPeriod>,
    "ansattSelvstendigPerioder": Array<P4000AnsattSelvstendigPeriod>,
    "forsvartjenestePerioder": Array<P4000Period>,
    "foedselspermisjonPerioder": Array<P4000Period>,
    "frivilligPerioder": Array<P4000Period>
  }
}
