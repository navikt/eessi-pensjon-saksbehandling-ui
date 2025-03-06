import {BaseSED, Krav, Nav, Pensjon} from "src/declarations/sed";

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

export interface Inntekt {
  beloep?: string
  valuta?: string
  beloeputbetaltsiden?: string
  betalingshyppighetinntekt?: string
  annenbetalingshyppighetinntekt?: string
}

export interface Utsettelse {
  land?: string
  institusjonsid?: string
  institusjonsnavn?: string
  tildato?: string
}

export interface P2000Pensjon extends Pensjon {
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
  kravDato?: Krav
}

export interface P2000SED extends BaseSED{
  nav: Nav,
  pensjon : P2000Pensjon
}

