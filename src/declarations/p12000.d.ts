import {Adresse, BaseSED, Nav, Pensjon, Person} from "src/declarations/sed";

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

export interface PensjonsAvslagEllerOpphor {
  begrunnelse?: string
  pensjonstype?: string
}

export interface Pensjoninfo {
  betalingsdetaljer?: Array<Betalingsdetaljer>
  pensjonsavslag?: Array<PensjonsAvslagEllerOpphor>
  pensjonsopphoring?: Array<PensjonsAvslagEllerOpphor>
  tilleggsytelserutbetalingitilleggtilpensjon?: string
}

export interface Foresporsel {
  referanseTilPerson?: "01" | "02"
}

export interface Gjenlevende {
  mor?: {
    person: Person
  }
  far?: {
    person: Person
  }
  person?: Person
  adresse?: Adresse
}

export interface P12000Pensjon extends Pensjon {
  pensjoninfo?: Pensjoninfo
  gjenlevende?: Gjenlevende
  ytterligereInformasjon?: string
  foresporsel?: Foresporsel
  anmodning13000verdi?: string
}

export interface P12000SED extends BaseSED {
  nav: Nav,
  pensjon: P12000Pensjon
  options?: P12000Options
}

export interface UtbetalingerPeriode {
  fom?: string
  tom?: string
}

export interface UtbetalingerItem {
  type: string
  belop: number
  valuta: string
  utbetalingshyppighet: string
}

export interface UtbetalingerResponse {
  periode: UtbetalingerPeriode
  info: Array<UtbetalingerItem>
}

// Stored by fagmodul next to the SED (like P8000 options), used to restore the Utbetalinger tab.
// Items are raw search results; a string item is a line restored from Ytterligere informasjon (no options saved yet).
export interface UtbetalingerPeriodeOption {
  fom: string
  tom?: string
  items: Array<UtbetalingerItem | string>
  selected: Array<number>
}

export interface P12000Options {
  utbetalinger?: {
    perioder: Array<UtbetalingerPeriodeOption>
  }
}
