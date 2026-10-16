import {Arbeidsforhold, BaseSED, Beloep, Institusjon, Krav, Nav, Pensjon, Utsettelse} from "src/declarations/sed";

export interface Ytelse {
  status?: string
  startdatoutbetaling?: string
  beloep?: Array<Beloep>
  sluttdatoutbetaling?: string
  annenytelse?: string
  institusjon?: Institusjon,
  totalbruttobeloeparbeidsbasert?: string
  totalbruttobeloepbostedsbasert?: string
  mottasbasertpaa?: string
  startdatoretttilytelse?: string
  ytelse?: string
  sluttdatorettilutbetaling?: string
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
