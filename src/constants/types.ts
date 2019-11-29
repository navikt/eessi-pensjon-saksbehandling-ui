
export interface Date {
  year: number;
  month: string;
  chronology: {
    id: string;
    calendarType: string;
  },
  dayOfMonth: number;
  dayOfWeek: string;
  era: string;
  dayOfYear: number;
  leapYear: boolean;
  monthValue: number;
}

export interface Attachment {
  id: string;
  name: string;
  fileName: string;
  mimeType: string;
  documentId: string;
  lastUpdate: number | Date;
  medical: boolean;
}

export interface Address {
  country: string;
  town?: string | null;
  street?: string| null;
  postalCode?: string| null;
  region?: string| null;
}

export interface Organisation {
  address: Address;
  activeSince: string | number;
  registryNumber?: any;
  acronym: string;
  countryCode: string;
  contactMethods?: any;
  name: string;
  location?: any;
  assignedBUCs?: any;
  id: string;
  accessPoint?: any;
}

export interface Participant {
  role: string;
  organisation: Organisation;
  selected: boolean;
}

export interface Sed {
  id: string;
  parentDocumentId?: string | null | undefined;
  type: string;
  status: string;
  creationDate: number;
  lastUpdate: number;
  displayName?: string;
  participants: Array<Participant>;
  attachments: Array<Attachment>;
  version?: string;
}

export interface Institution {
  country: string;
  institution: string | null;
  name?: string | undefined;
}

export interface ErrorBuc {
  type: string | null;
  caseId: string | null;
  creator: null;
  sakType: null;
  status: any;
  startDate: null;
  lastUpdate: null;
  institusjon: null;
  seds: null;
  error: string;
}

export interface Buc {
  type: string;
  caseId: string;
  creator: Institution;
  sakType: string | null;
  aktoerId?: string | null;
  status: string;
  startDate: number;
  lastUpdate: number;
  institusjon: Array<Institution>;
  seds: Array<Sed>;
  error?: null | undefined;
}

export interface BucInfo {
  tags: Array<string>;
  comment: string;
}

export interface BucsInfo {
  bucs: {
    [key: string] : BucInfo
  };
}

export interface NewSedPayload {
  sakId: string;
  buc: string;
  sed: string;
  institutions: Array<Institution>;
  aktoerId: string;
  euxCaseId: string;
  periodeInfo?: Array<Period>;
  vedtakId?: string;
  avdodfnr?: string;
}

export interface Period {
  id: number,
  type: string;
  startDate: { day: number, month: number, year: number };
  endDate: { day: number, month: number, year: number };
  dateType: string;
  uncertainDate: boolean;
  country: { label: string, value: string };
  comment: string;
  otherType?: string;
}

export interface P4000Info {
  person: any,
  bank: any,
  stayAbroad: Array<Period>
}

export interface RawJoarkFile {
  journalpostId: string;
  tittel: string;
  tema: string;
  datoOpprettet: string;
  dokumenter: Array<{
    dokumentInfoId: string;
    tittel: string;
    dokumentvarianter: Array<{
      variantformat: string;
      filnavn: string;
    }>;
  }>;
}

export interface JoarkFile {
  journalpostId: string;
  tittel: string;
  tema: string;
  datoOpprettet: string;
  dokumentInfoId: string;
  variant: {
    variantformat: string
  };
}
