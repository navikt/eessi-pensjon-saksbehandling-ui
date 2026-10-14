import { Adresse, Barn, BaseSED, Bruker, Eessisak, Institusjon, Krav, PIN, Person, Utsettelse } from "src/declarations/sed";

export interface P2200Uforhet {
  arbeidsUlykke?: string
  startDatoPensjon?: string
  startdatoLege?: string
  militartjenesteUlykke?: string
  ansvarligTredjepart?: string
  bevisstforsaketSoker?: string
}

export interface P2200NavBruker extends Bruker {
  uforhet?: P2200Uforhet
}

export interface P2200Nav {
  eessisak?: Array<Eessisak>
  bruker?: P2200NavBruker
  verge?: {
    person?: Person
    vergemaal?: { mandat?: string }
    adresse?: Adresse
  }
  krav?: Krav
  barn?: Array<Barn>
  ektefelle?: {
    person?: Person
    type?: string
    far?: { person: Person }
    mor?: { person: Person }
  }
}

export interface P2200Ytelse {
  status?: string
  startdatoutbetaling?: string
  beloep?: Array<{
    annenbetalingshyppighetytelse?: string
    betalingshyppighetytelse?: string
    valuta?: string
    beloep?: string
    gjeldendesiden?: string
  }>
  sluttdatoutbetaling?: string
  annenytelse?: string
  institusjon?: Institusjon
  pin?: PIN
  startdatoretttilytelse?: string
  ytelse?: string
  mottasbasertpaaitem?: Array<{
    totalbruttobeloepbostedsbasert?: string
    totalbruttobeloeparbeidsbasert?: string
    verdi?: string
  }>
  sluttdatoRettTilUtbetaling?: string
}

export interface P2200Pensjon {
  utsettelse?: Array<Utsettelse>
  ytelser?: Array<P2200Ytelse>
  ytterligeinformasjon?: string
  bruker?: Bruker
  gjenlevende?: Bruker
  vedtak?: Array<{
    mottaker?: Array<string>
    trekkgrunnlag?: Array<string>
  }>
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

export interface P2200SED extends BaseSED {
  nav: P2200Nav
  pensjon: P2200Pensjon
}
