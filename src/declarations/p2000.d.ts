import {Arbeidsforhold, BaseSED, Beloep, Krav, Nav, Pensjon, Utsettelse} from "src/declarations/sed";

export interface Ytelse {
  status?: string
  startdatoutbetaling?: string
  beloep?: Array<Beloep>
  sluttdatoutbetaling?: string
  annenytelse?: string
  institusjon?: {
    saksnummer?: string
    land?: string
    pin?: string
    institusjonsnavn?: string
    sektor?: string
    institusjonsid?: string
  },
  totalbruttobeloeparbeidsbasert?: string
  totalbruttobeloepbostedsbasert?: string
  mottasbasertpaa?: string
  startdatoretttilytelse?: string
  ytelse?: string
  sluttdatoUtbetaling?: string
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
