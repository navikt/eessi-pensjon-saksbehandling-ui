import {Adresse, BaseSED, Bruker} from "src/declarations/sed";

export interface SendeItem {
  type?: string
  detaljer?: string
}

export interface Paaminnelse {
  sende?: Array<SendeItem>
}

export interface Refusjonskrav {
  antallkrav?: string
  id?: string
}

export interface IdentifikatorItem {
  id?: string
  type?: string
}

export interface Arbeidsgiver {
  identifikator?: Array<IdentifikatorItem>
  adresse?: Adresse
  navn?: string
}

export interface Kontekst {
  bruker?: Bruker
  refusjonskrav?: Refusjonskrav
  arbeidsgiver?: Arbeidsgiver
}

export interface Sak {
  kontekst?: Kontekst
  paaminnelse?: Paaminnelse
}

export interface Nav {
  sak?: Sak
}

export interface X009SED extends BaseSED {
  sed: string
  nav: Nav
}
