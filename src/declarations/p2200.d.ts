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

export interface Uforhet {
  arbeidsUlykke?: string
  startDatoPensjon?: string
  startdatoLege?: string
  militartjenesteUlykke?: string
  ansvarligTredjepart?: string
  bevisstforsaketSoker?: string
}

export interface NavBruker extends Bruker {
  uforhet?: Uforhet
}

export interface Nav {
  eessisak?: Array<Eessisak>
  bruker?: NavBruker
  verge: Verge,
  krav: Krav,
  barn: Array<Barn>,
  ektefelle: Ektefelle,
}

export interface Ytelse {
  status?: string
  startdatoutbetaling?: string
  beloep?: Array<Beloep>
  sluttdatoutbetaling?: string
  annenytelse?: string
  institusjon?: Institusjon
  pin?: PIN
  startdatoretttilytelse?: string
  ytelse?: string
  mottasbasertpaaitem?: Array<{
    totalbruttobeloepbostedsbasert?: string
    totalbruttobeloeparbeidsbasert?: string
    mottasbasertpaa?: string
  }>
  sluttdatoRettTilUtbetaling?: string
}

export interface Pensjon {
  ytelser?: Array<Ytelse>
  ytterligeinformasjon?: string
  bruker?: Bruker
  vedtak?: Array<{
    mottaker?: Array<string>
    trekkgrunnlag?: Array<string>
  }>
  etterspurtedokumenter?: string
  vedlegg?: Array<string>
  vedleggandre?: string
}

export interface P2200SED extends BaseSED {
  nav: Nav
  pensjon: Pensjon
}
