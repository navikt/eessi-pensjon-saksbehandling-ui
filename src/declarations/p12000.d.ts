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
}
