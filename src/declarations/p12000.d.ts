import {BaseSED, Bruker, Nav, Pensjon} from "src/declarations/sed";

export interface Betalingsdetaljer {
  fradato?: string
  belop?: string
  effektueringsdato?: string
  annenutbetalingshyppighet?: string
  valuta?: string
  utbetalingshyppighet?: string
  pensjonstype?: string
  basertpaa?: string
  bosattotal?: string
  arbeidstotal?: string
  betaldato?: string
}

export interface Pensjoninfo {
  betalingsdetaljer?: Betalingsdetaljer
}

export interface P12000Pensjon extends Pensjon {
  pensjoninfo?: Array<Pensjoninfo>
  gjenlevende?: Bruker
}

export interface P12000SED extends BaseSED {
  nav: Nav,
  pensjon: P12000Pensjon
}
