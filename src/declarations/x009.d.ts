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

export interface XArbeidsgiver {
  identifikator?: Array<IdentifikatorItem>
  adresse?: Adresse
  navn?: string
}

export interface Kontekst {
  bruker?: Bruker
  refusjonskrav?: Refusjonskrav
  arbeidsgiver?: XArbeidsgiver
}

export interface Navsak {
  kontekst?: Kontekst
  paaminnelse?: Paaminnelse
}

export interface XNav {
  sak?: Navsak
}

export interface X009SED extends BaseSED {
  sed: string
  nav: XNav
}
