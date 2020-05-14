import { Files } from 'eessi-pensjon-ui/dist/declarations/types'

export interface PeriodDate {
  day: string;
  month: string;
  year: string;
}

export interface Country {
  label: string;
  value: string;
}

export interface Period {
  id?: number | null,
  type: string;
  startDate: PeriodDate;
  endDate?: PeriodDate | null;
  dateType: string;
  uncertainDate: boolean;
  country: Country;
  comment: string;
  otherType?: string | null;
  insuranceName?: string | null;
  insuranceType?: string | null;
  insuranceId ?: string | null;
  workActivity ?: string | null;
  workName ?: string | null;
  workType ?: string | null;
  workStreet ?: string | null;
  workCity ?: string | null;
  workZipCode ?: string | null;
  workRegion ?: string | null;
  childFirstName ?: string | null;
  childLastName ?: string | null;
  childBirthDate ?: PeriodDate | null;
  learnInstitution ?: string | null;
  payingInstitution ?: string | null;
  attachments ?: Files | null;
  [key: string]: any;
}

export type Periods = Array<Period>

export type PeriodErrors = {[k: string]: string | undefined}

export interface PayloadPeriod {
  land: string;
  periode: null | {
    lukketPeriode?: {
      fom: string | null;
      tom: string | null;
    }
    openPeriode?: {
      fom: string | null;
      extra: string;
    }
  };
  vedlegg ?: Array[any] | null;
  trygdeordningnavn ?: string | null;
  medlemskap ?: string | null;
  forsikkringEllerRegistreringNr ?: string | null;
  annenInformasjon ?: string | null;
  usikkerDatoIndikator ?: string | null;
  jobbUnderAnsattEllerSelvstendig ?: string | null;
  navnFirma ?: string | null;
  typePeriode ?: string | null;
  adresseFirma ?: {
    postnummer: string | null | undefined;
    by: string | null | undefined;
    land: string;
    gate: string | null | undefined;
    region: string | null | undefined;
  } | null;
  navnPaaInstitusjon ?: string | null;
  informasjonBarn ?: {
    etternavn: string | null | undefined;
    fornavn: string | null | undefined;
    foedseldato: string | null | undefined;
    land: string;
  } | null;
}

export interface Payload {
  ansattSelvstendigPerioder ?: Array<PayloadPeriod>;
  boPerioder ?: Array<PayloadPeriod>;
  barnepassPerioder ?: Array<PayloadPeriod>;
  frivilligPerioder ?: Array<PayloadPeriod>;
  forsvartjenestePerioder ?: Array<PayloadPeriod>;
  foedselspermisjonPerioder ?: Array<PayloadPeriod>;
  opplaeringPerioder ?: Array<PayloadPeriod>;
  arbeidsledigPerioder ?: Array<PayloadPeriod>;
  sykePerioder ?: Array<PayloadPeriod>;
  andrePerioder ?: Array<PayloadPeriod>;
}

export type StayAbroad = Array<Period>

export interface Person {

}

export interface P4000Info {
  person: Person,
  bank: any,
  stayAbroad: StayAbroad
}

export interface P4000PayloadInfo {
  personInfo: any,
  bankInfo: any,
  periodeInfo: Array<PayloadPeriod>
}
