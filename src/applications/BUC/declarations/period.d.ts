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
  id?: number,
  type: string;
  startDate: PeriodDate;
  endDate?: PeriodDate;
  dateType: string;
  uncertainDate: boolean;
  country: Country;
  comment: string;
  otherType?: string;
  insuranceName?: string;
  insuranceType?: string;
  insuranceId ?: string;
  workActivity ?: string;
  workName ?: string;
  workType ?: string;
  workStreet ?: string;
  workCity ?: string;
  workZipCode ?: string;
  workRegion ?: string;
  childFirstName ?: string;
  childLastName ?: string;
  childBirthDate ?: PeriodDate;
  learnInstitution ?: string;
  payingInstitution ?: string;
  attachments ?: Array[any];
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
    openPeriode?:  {
      fom: string | null;
      extra: string;
    }
  };
  vedlegg ?: Array[any];
  trygdeordningnavn ?: string;
  medlemskap ?: string;
  forsikkringEllerRegistreringNr ?: string;
  annenInformasjon ?: string;
  usikkerDatoIndikator ?: string;
  jobbUnderAnsattEllerSelvstendig ?: string;
  navnFirma ?: string;
  typePeriode ?: string;
  adresseFirma ?: {
    postnummer: string | undefined;
    by: string | undefined;
    land: string;
    gate: string | undefined;
    region: string | undefined;
  };
  navnPaaInstitusjon ?: string;
  informasjonBarn ?:  {
    etternavn: string | null | undefined;
    fornavn: string | null | undefined;
    foedseldato: string | null | undefined;
    land: string;
  }
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

export interface P4000Info {
  person: any,
  bank: any,
  stayAbroad: Array<Period>
}

export interface P4000PayloadInfo {
  personInfo: any,
  bankInfo: any,
  periodeInfo: Array<PayloadPeriod>
}
