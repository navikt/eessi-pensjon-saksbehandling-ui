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

export interface Ytelseskomponent {
  ytelsesKomponentType: string
  belopTilUtbetaling: number
}

export interface YtelsePerMaaned {
  fom: string
  tom: string | null
  mottarMinstePensjonsniva: boolean
  vinnendeBeregningsmetode: string | null
  belop: number
  ytelseskomponenter: Array<Ytelseskomponent>
}

export type YtelserPerMaanedResponse = Array<YtelsePerMaaned>

// A block restored from the generated text in Ytterligere informasjon (when no options are saved)
export interface GjenopprettetYtelsePerMaaned {
  fom: string
  tom?: string
  linjer: Array<string>
}

// Stored by fagmodul next to the SED (like P8000 options), used to restore Ytelser per måned.
// selected holds the indexes of the checked ytelser
export interface YtelserPerMaanedPeriodeOption {
  fom: string
  tom?: string
  ytelser: Array<YtelsePerMaaned | GjenopprettetYtelsePerMaaned>
  selected: Array<number>
}

export interface P12000Options {
  ytelserPerMaaned?: {
    perioder: Array<YtelserPerMaanedPeriodeOption>
  }
}
