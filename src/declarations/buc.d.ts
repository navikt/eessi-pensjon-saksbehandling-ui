import { JoarkFiles } from 'declarations/joark'

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

export interface BUCAttachment {
  id: string;
  name: string;
  fileName: string;
  mimeType: string;
  documentId: string;
  lastUpdate: number | Date;
  medical: boolean;
}

export type BUCAttachments = Array<BUCAttachment>

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
  displayName?: string | null;
  participants: Array<Participant>;
  attachments: Array<BUCAttachment>;
  version?: string;
}

export type Seds = Array<Sed>;

export interface Institution {
  country: string;
  institution: string;
  name?: string | undefined;
}

export type Institutions = Array<Institution>

export interface ErrorBuc {
  type: string | null;
  caseId: string | null;
  creator: null;
  sakType: null;
  status: null;
  startDate: null;
  lastUpdate: null;
  institusjon: null;
  seds: null;
  error: string;
}

export interface ValidBuc {
  type: string;
  caseId: string;
  creator: Institution;
  sakType: string | null;
  aktoerId?: string | null;
  status: string;
  startDate: number;
  lastUpdate: number;
  institusjon: Institutions;
  seds: Seds;
  error?: null | undefined;
}

export type Buc = ValidBuc | ErrorBuc

export type Bucs = {[caseId: string]: Buc}

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
  institutions: Institutions;
  aktoerId: string;
  euxCaseId: string;
  periodeInfo?: Array<Period>;
  vedtakId?: string;
  avdodfnr?: string;
}

export interface RawInstitution {
  id: string;
  navn: string;
  akronym: string;
  landkode: string;
  buc?: string;
}

export interface InstitutionListMap<T> {
  [landkode: string]: Array<T>
}

export interface InstitutionNames {
  [id: string]: string
}

export interface Tag {
  value: string,
  label: string
}

export type Tags = Array<Tag>

export type AttachedFiles = { [namespace: string]: JoarkFiles | BUCAttachments }
