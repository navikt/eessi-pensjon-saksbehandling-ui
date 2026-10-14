import {
  Barn,
  BaseSED,
  Bruker,
  Eessisak,
  Institusjon,
  Krav,
  PIN,
  Verge, Ektefelle
} from "src/declarations/sed";

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
  verge: Verge,
  krav: Krav,
  barn: Array<Barn>,
  ektefelle: Ektefelle,
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
  ytelser?: Array<P2200Ytelse>
  ytterligeinformasjon?: string
  bruker?: Bruker
  vedtak?: Array<{
    mottaker?: Array<string>
    trekkgrunnlag?: Array<string>
  }>
  etterspurtedokumenter?: string
  vedlegg?: Array<string>
  vedleggandre?: string
  kravDato?: Krav
}

export interface P2200SED extends BaseSED {
  nav: P2200Nav
  pensjon: P2200Pensjon
}
