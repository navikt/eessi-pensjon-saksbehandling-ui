import {BaseSED, Nav, Pensjon} from "src/declarations/sed";

import {
  BRUKERS_ADRESSE,
  BRUKERS_SIVILSTAND,
  DOKUMENTASJON_PAA_ARBEID_I_NORGE,
  FOLKBOKFOERING,
  IBAN_SWIFT,
  INNTEKT_FOER_UFOERHET_I_UTLANDET,
  MEDISINSK_INFORMASJON,
  NAAVAERENDE_ARBEID, OPPLYSNINGER_OM_EPS,
  P4000, P5000_FOR_P5000NO,
  P5000,
  P6000, PERSON_UTEN_PNR_DNR, SAKSBEHANDLINGSTID,
  TILTAK,
  YTELSESHISTORIKK, P5000_MED_BEGRUNNELSE
} from "src/constants/p8000";


export interface SendFolgendeSEDer {
  sendFolgendeSEDer: Array<string>
}

export interface P8000Pensjon extends Pensjon{
  anmodning: {
    referanseTilPerson: "01" | "02"
    seder: Array<SendFolgendeSEDer>
  }
  ytterligeinformasjon: string | undefined
}

export interface P8000Field {
  value: string
  doNotGenerateFritekst: boolean
  landkode: string
  periodeFra: string
  periodeTil: string
  antallMaaneder: string
  begrunnelseForKravet: string
}

export interface OfteEtterspurtInformasjon {
  [P5000]: P8000Field
  [P5000_MED_BEGRUNNELSE]: P8000Field
  [P4000]: P8000Field
  [P6000]: P8000Field
  [BRUKERS_ADRESSE]: P8000Field
  [MEDISINSK_INFORMASJON]: P8000Field
  [TILTAK]: P8000Field
  [NAAVAERENDE_ARBEID]: P8000Field
  [DOKUMENTASJON_PAA_ARBEID_I_NORGE]: P8000Field
  [YTELSESHISTORIKK]: P8000Field
  [INNTEKT_FOER_UFOERHET_I_UTLANDET]: P8000Field
  [IBAN_SWIFT]: P8000Field
  [FOLKBOKFOERING]: P8000Field
  [BRUKERS_SIVILSTAND]: P8000Field
  [OPPLYSNINGER_OM_EPS]: P8000Field
  [PERSON_UTEN_PNR_DNR]: P8000Field
}

export interface InformasjonSomKanLeggesInn {
  [SAKSBEHANDLINGSTID]: P8000Field,
  [P5000_FOR_P5000NO]: P8000Field
}

export interface P8000Type {
  ytelse: "AP" | "UT" | "EO"
  bosettingsstatus: "NO" | "UTL"
  spraak: "no" | "en"
}

export interface P8000SED extends BaseSED{
  nav: Nav,
  pensjon: P8000Pensjon
  options?: {
    ofteEtterspurtInformasjon: OfteEtterspurtInformasjon
    informasjonSomKanLeggesInn: InformasjonSomKanLeggesInn
    type?: P8000Type
  }
  fritekst?: string // Remove before save
}
