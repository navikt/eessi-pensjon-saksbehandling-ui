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

export interface Pensjonsavslag {
  grunnAvslag?: string
  pensjonstype?: string
}

export interface Pensjonsopphoring {
  grunnOpphoer?: string
  pensjonstype?: string
}

export interface Pensjoninfo {
  betalingsdetaljer?: Betalingsdetaljer
  pensjonsavslag?: Pensjonsavslag
  pensjonsopphoring?: Pensjonsopphoring
}

export interface Merinformasjon {
  ytelser?: Array<{
    tilleggsytelserutbetalingitilleggtilpensjon?: string
  }>
}

export interface Foresporsel {
  referanseTilPerson?: string
}

export interface P12000Pensjon extends Pensjon {
  pensjoninfo?: Array<Pensjoninfo>
  gjenlevende?: Bruker
  merinformasjon?: Merinformasjon
  ytterligereInformasjon?: string
  foresporsel?: Foresporsel
  anmodning13000verdi?: string
}

export interface P12000SED extends BaseSED {
  nav: Nav,
  pensjon: P12000Pensjon
}
