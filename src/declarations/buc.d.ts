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

export type Participants = Array<Participant>

export interface Version {
  id: string;
  date: number;
}

export interface Sed {
  id: string;
  parentDocumentId?: string | null;
  type: string;
  status: string;
  creationDate: number;
  lastUpdate: number;
  displayName?: string | null;
  participants: Participants;
  attachments: Array<BUCAttachment>;
  version?: string | null;
  firstVersion: Version;
  lastVersion: Version;
  allowsAttachments: boolean;
}

export type Seds = Array<Sed>;

export type SedContent = any;

export type SedContentMap = {[k: string]: SedContent}

export interface Institution {
  country: string;
  institution: string;
  name?: string | null;
}

export type Institutions = Array<Institution>

export interface ErrorBuc {
  caseId: string | null;
  readOnly ?: any;
  creator: null;
  error: string;
  institusjon: null | undefined;
  deltakere?: null;
  lastUpdate: null;
  sakType: null;
  seds: null;
  status: null;
  startDate: null;
  type: string | null;
}

export interface ValidBuc {
  aktoerId?: string | null;
  readOnly?: boolean;
  caseId: string;
  creator: Institution;
  description?: string | null | undefined;
  error?: null | undefined;
  deltakere?: Institutions;
  institusjon: Institutions | undefined;
  lastUpdate: number;
  sakType: string | null;
  seds: Seds;
  status: string;
  startDate: number;
  type: string;
}

export type Buc = ValidBuc | ErrorBuc

export type Bucs = {[caseId: string]: Buc}

export interface BucInfo {
  tags?: Array<string> | null;
  comment?: string | null;
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

export type SedsWithAttachmentsMap = {[k: string]: boolean}

export interface Tag {
  value: string,
  label: string
}

export type Tags = Array<Tag>

export type AttachedFiles = { [namespace: string]: JoarkFiles | BUCAttachments }
