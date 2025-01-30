import {Sed} from "src/declarations/buc";


export interface Pensjon {

}

export interface Nav {

}

export interface P8000SED extends BaseSED{
  nav: Nav,
  pensjon : Pensjon
}

export interface BaseSED {
  sed: string
  sedGVer: string
  sedVer: string
  originalSed: Sed // removed before SAVE
}
