import {Sed} from "src/declarations/buc";

export interface BaseSED {
  sed: string
  originalSed?: Sed // removed before SAVE
  options?: any
}

export interface Eessisak {
  institusjonsnavn?: string
  institusjonsid?: string
  saksnummer?: string
  land?: string
}

export interface Nav {
  eessisak: Array<Eessisak>
  bruker: Bruker,
  verge: Verge,
  krav: Krav,
  barn: Array<Barn>,
  ektefelle: Ektefelle,
}

export interface Pensjon {

}

export interface Foedested {
  by?: string
  land?: string
  region?: string
}

export interface Person {
  pin?: Array<PIN>,
  statsborgerskap?: Array<Statsborgerskap>
  etternavn?: string
  etternavnvedfoedsel?: string
  fornavn?: string
  kjoenn?: string
  foedested?: Foedested,
  foedselsdato?: string
  doedsdato?: string
  sivilstand?: Array<Sivilstand>
  relasjontilavdod?: string
  rolle?: string
  kontakt?: {
    telefon: Array<Telefon>
    email: Array<Email>
  }
}

export interface Bruker {
  far?: {
    person: Person
  },
  mor?: {
    person: Person
  }
  person: Person
  adresse?: Adresse
  bank?: Bank
}

export interface Ektefelle {
  person: Person,
  type: string
  far?: {
    person: Person
  },
  mor?: {
    person: Person
  }
}

export interface Barn {
  person?: Person
  far?: {
    person: Person
  },
  mor?: {
    person: Person
  }
  relasjontilbruker?: string
  opplysningeromannetbarn?: string
}

export interface Verge {
  person: Person,
  vergemaal?: {
    mandat?: string
  },
  adresse?: Adresse
}

export interface Adresse {
  gate: string
  bygning?: string
  by?: string
  postkode?: string
  postnummer?: string
  region?: string
  land: string
  kontaktpersonadresse?: string
  datoforadresseendring?: string
  postadresse?: string
  startdato?: string
}

export interface Telefon {
  nummer: string
  type: string
}

export interface Email {
  adresse: string
}

export interface Statsborgerskap {
  land: string
}

export interface PIN {
  institusjonsnavn?: string
  institusjonsid?: string
  sektor?: string
  identifikator?: string
  land?: string
}

export interface Sivilstand {
  status: string
  fradato: string
}

export interface Bank {
  navn?: string
  konto: {
    kontonr: string
    innehaver: Innehaver
    sepa?: SEPA
    ikkesepa?: {
      swift: string
    }
  },
  adresse: Adresse
}

export interface Innehaver {
  navn?: string
  rolle?: string
}

export interface SEPA {
  iban: string
  swift: string
}

export interface Krav {
  dato: string
  type?: string
}

