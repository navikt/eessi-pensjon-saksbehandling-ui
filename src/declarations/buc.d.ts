import { JoarkBrowserItem } from 'components/JoarkBrowser/JoarkBrowser'
import { Option } from 'declarations/app'
import { JoarkBrowserItems } from 'declarations/joark'

export interface Address {
  country: string
  town?: string | null
  street?: string| null
  postalCode?: string| null
  region?: string| null
}

export interface Avdod {
  fnr: string
}

export interface Gjenlevende {
  fnr: string
}

export interface BUCSubject {
  gjenlevende: Gjenlevende
  avdod: Avdod
}

export interface Comment {
  value: string
}

export type Comments = Array<Comment>

export interface Date {
  year: number
  month: string
  chronology: {
    id: string
    calendarType: string
  }
  dayOfMonth: number
  dayOfWeek: string
  era: string
  dayOfYear: number
  leapYear: boolean
  monthValue: number
}

export interface ErrorBuc {
  caseId: string | null
  readOnly ?: any
  creator: null
  error: string
  institusjon: null | undefined
  deltakere?: null
  lastUpdate: null
  sakType: null
  seds: null
  status: null
  startDate: null
  type: string | null
}

export interface Institution {
  country: string
  institution: string
  name?: string | null
}

export type Institutions = Array<Institution>

export interface InstitutionListMap<T> {
  [landkode: string]: Array<T>
}

export interface InstitutionNames {
  [id: string]: string
}

export interface NewSedPayload {
  aktoerId: string
  avdodfnr?: string
  buc: string
  euxCaseId: string
  institutions: Institutions
  sakId: string
  sed: string
  subject?: BUCSubject
  vedtakId?: string
  xxx?: string
}

export interface Organisation {
  address: Address
  activeSince: string | number
  registryNumber?: any
  acronym: string
  countryCode: string
  contactMethods?: any
  name: string
  location?: any
  assignedBUCs?: any
  id: string
  accessPoint?: any
}

export interface Participant {
  role: string
  organisation: Organisation
  selected: boolean
}

export type Participants = Array<Participant>

export type RawList = Array<string>

export interface RawInstitution {
  id: string
  navn: string
  akronym: string
  landkode: string
  buc?: string
}

export type RawInstitutions = Array<RawInstitution>

export interface RinaUrlPayload {
  rinaUrl: string
}

export interface BucInfo {
  avdod ?: string
  tags?: RawList | null
  comment?: Comments | string | null
}

export interface BucsInfo {
  bucs: {
    [key: string]: BucInfo
  }
}

export type SakTypeKey = 'AFP'|'AFP_PRIVAT'|'ALDER'|'BARNEP'|'FAM_PL'|'GAM_YRK'|'GENRL'|'GJENLEV'|'GRBL'|'KRIGSP'|'OMSORG'|'UFOREP'

export type SakTypeValue = 'AFP'|'AFP Privat'|'Alderspensjon'|'Barnepensjon'|'Familiepleierytelse'|'Gammel yrkesskade'|
  'Generell'|'Gjenlevendeytelse'|'Grunnblanketter'|'Krigspensjon'|'Omsorgsopptjening'|'Uføretrygd'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const SakTypeMap: {[key in SakTypeKey]: SakTypeValue} = {
  AFP: 'AFP',
  AFP_PRIVAT: 'AFP Privat',
  ALDER: 'Alderspensjon',
  BARNEP: 'Barnepensjon',
  FAM_PL: 'Familiepleierytelse',
  GAM_YRK: 'Gammel yrkesskade',
  GENRL: 'Generell',
  GJENLEV: 'Gjenlevendeytelse',
  GRBL: 'Grunnblanketter',
  KRIGSP: 'Krigspensjon',
  OMSORG: 'Omsorgsopptjening',
  UFOREP: 'Uføretrygd'
}

export interface SaveBucsInfoProps {
  aktoerId: string
  avdod ?: string
  buc: {
    caseId: string
  };
  bucsInfo: BucsInfo
  comment?: string
  tags?: RawList
}

export interface SavingAttachmentsJob {
  total: JoarkBrowserItems
  saved: JoarkBrowserItems
  saving: JoarkBrowserItem | undefined
  remaining: JoarkBrowserItems
}

export interface Version {
  id: string
  date: number
}

export interface SEDAttachment {
  id: string
  name: string
  fileName: string
  mimeType: string
  documentId: string
  lastUpdate: any
  medical: boolean
}
export type SEDAttachments = Array<SEDAttachment>

export interface Sed {
  id: string
  parentDocumentId?: string | null
  type: string
  status: string
  creationDate: number
  lastUpdate: number
  displayName?: string | null
  participants: Participants
  attachments: Array<SEDAttachment>
  version?: string | null
  firstVersion: Version
  lastVersion: Version
  allowsAttachments: boolean
  message ?: string
}

export interface SEDAttachmentPayload {
  aktoerId: string
  rinaId: string
  rinaDokumentId: string
}

export interface SEDAttachmentPayloadWithFile extends SEDAttachmentPayload {
  journalpostId: string | undefined
  dokumentInfoId: string | undefined
  variantformat: string | undefined
}

export interface SEDP5000Payload {
  sed: string
  sedGVer: string
  sedVer: string
  nav: any
  pensjon: any
  trygdetid: any
  ignore: any
  horisontal: any
}

export type SedType = 'sed'
export type SedNewType = 'sednew'

export type SedsWithAttachmentsMap = {[k: string]: boolean}

export type Seds = Array<Sed>

export type SedContent = any

export type SedContentMap = {[k: string]: SedContent}

export interface Tag extends Option {}

export interface ValidBuc {
  aktoerId?: string | null
  readOnly?: boolean
  caseId: string
  creator: Institution
  description?: string | null | undefined
  error?: null | undefined
  deltakere?: Institutions
  institusjon: Institutions | undefined
  lastUpdate: number
  sakType: SakTypeValue | null
  seds: Seds
  status: string
  startDate: number
  subject?: BUCSubject
  type: string
}

export type Buc = ValidBuc | ErrorBuc

export type Bucs = {[caseId: string]: Buc}

export type BUCRawList = RawList
export type BucsInfoRawList = RawList
export type CountryRawList = RawList
export type InstitutionRawList = RawList
export type SEDRawList = RawList
export type SubjectAreaRawList = RawList
export type Tags = Array<Tag>
export type TagRawList = RawList
