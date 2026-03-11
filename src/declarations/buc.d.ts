import { Option } from 'src/declarations/app.d'
import { JoarkBrowserItem, JoarkBrowserItems } from 'src/declarations/joark.d'
import { PersonAvdod } from 'src/declarations/person.d'

export interface Address {
  country: string
}

export interface Avdod {
  fnr: string
}

export type AvdodOrSokerValue = 'AVDOD' | 'SOKER'

export type KravOmValue = 'Alderspensjon' | 'Etterlatteytelser' | 'Uføretrygd'

export interface Gjenlevende {
  fnr: string
}

export interface BUCSubject {
  gjenlevende: Gjenlevende
  avdod: Avdod
}

export interface BucListItem {
  euxCaseId: string
  buctype: string
  aktoerId: string
  saknr: string
  avdodFnr: string | null
  kilde: string
}

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
  internationalId?: string | null
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
  cdm: string | null
}

export interface Institution {
  country: string
  institution: string
  name: string
  acronym: string
  buc?: string
}

export type Institutions = Array<Institution>

export interface InstitutionListMap<T> {
  [landkode: string]: Array<T>
}

export interface InstitutionNames {
  [id: string]: Institution
}

export interface NewBucPayload {
  buc: string
  person: any // Person
  avdod?: PersonAvdod
  avdodfnr?: string
  kravDato?: string
  sakType?: SakTypeKey
  sakId?: string | null
}

export interface NewSedPayload {
  aktoerId: string
  avdodfnr?: string
  buc: string
  euxCaseId: string
  institutions: Institutions
  kravDato?: string
  kravType?: SakTypeKey
  payload ?: string
  sakId: string
  sakType?: SakTypeKey
  sed: string
  subject?: BUCSubject
  vedtakId?: string
  referanseTilPerson?: AvdodOrSokerValue
}

export interface Organisation {
  acronym?: string
  countryCode: string
  name: string
  id: string
}

export interface Participant {
  role: string
  organisation: Organisation
  selected: boolean
}

export type Participants = Array<Participant>

export type RawList = Array<string>

export interface RinaUrlPayload {
  rinaUrl: string
}

export interface BucInfo {
  avdod ?: string
  tags?: RawList | null
}

export interface BucsInfo {
  bucs: {
    [key: string]: BucInfo
  }
}

export type SakTypeKey = 'AFP'|'AFP_PRIVAT'|'ALDER'|'BARNEP'|'FAM_PL'|'GAM_YRK'|'GENRL'|'GJENLEV'|'GRBL'|'KRIGSP'|'OMSORG'| 'OMSST' | 'UFOREP'|'UKJENT'

export type SakTypeValue = 'AFP'|'AFP Privat'|'Alderspensjon'|'Barnepensjon'|'Familiepleierytelse'|'Gammel yrkesskade'|
  'Generell'|'Gjenlevendeytelse'|'Grunnblanketter'|'Krigspensjon'|'Omsorgsopptjening'| 'Omstillingsstønad' | 'Uføretrygd' | 'Ukjent'

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
  OMSST: 'Omstillingsstønad',
  UFOREP: 'Uføretrygd',
  Ukjent: 'Ukjent'
}

export const SakTypeValueToKeyMap: {[value in SakTypeValue]: SakTypeKey} = {
  'AFP': 'AFP',
  'AFP Privat': 'AFP_PRIVAT',
  'Alderspensjon': 'ALDER',
  'Barnepensjon': 'BARNEP',
  'Familiepleierytelse': 'FAM_PL',
  'Gammel yrkesskade': 'GAM_YRK',
  'Generell': 'GENRL',
  'Gjenlevendeytelse': 'GJENLEV',
  'Grunnblanketter': 'GRBL',
  'Krigspensjon': 'KRIGSP',
  'Omsorgsopptjening': 'OMSORG',
  'Omstillingsstønad': 'OMSST',
  'Uføretrygd': 'UFOREP',
  'Ukjent': 'Ukjent'
}

export interface SaveBucsInfoProps {
  aktoerId: string
  avdod ?: string
  buc: {
    caseId: string
  };
  bucsInfo: BucsInfo
  kravDato?: string
  tags?: RawList
}

export interface SavingAttachmentsJob {
  total: JoarkBrowserItems
  saved: JoarkBrowserItems
  saving: JoarkBrowserItem | {[k in string]: string} | undefined
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
  lastUpdate: number
  medical: boolean
}
export type SEDAttachments = Array<SEDAttachment>

export type Direction = 'IN' | 'OUT'

export interface Sed {
  allowsAttachments: boolean
  attachments: Array<SEDAttachment>
  conversations?: any
  creationDate: number
  direction: Direction
  displayName?: string | null
  firstVersion: Version
  id: string
  isSendExecuted?: any
  lastUpdate: number
  lastVersion: Version
  message ?: string
  parentDocumentId?: string | null
  participants: Participants
  receiveDate?: number | null
  status: string
  type: string
  typeVersion?: any
  version?: string | null
  versions?: any
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

export interface P6000 {
   type: string
   bucid: string
   documentID: string
   fraLand: string
   sisteVersjon: string
   pdfUrl: string
}

export type SedType = 'sed'
export type SedNewType = 'sednew'

export type SedsWithAttachmentsMap = {[k: string]: boolean}

export type Seds = Array<Sed>

export type Tag = Option

export interface ValidBuc {
  aktoerId?: string | null
  readOnly?: boolean
  caseId: string
  internationalId?: string
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
  addedParams?: {
    subject?: BUCSubject
    kravDato?: string
  }
  type: string
  cdm: string
}

export interface JoarkBuc {
  caseId: string
  type: string
  startDate: number
  creator: Institution
  deltakere?: Institutions
  numberOfSeds: number,
  error?: null | undefined
}

export type Buc = ValidBuc | ErrorBuc

export type Bucs = {[caseId: string]: Buc }

export type BUCOptions = RawList
export type BucsInfoRawList = RawList
export type CountryRawList = RawList
export type InstitutionRawList = RawList
export type SEDRawList = RawList
export type SubjectAreaRawList = RawList
export type Tags = Array<Tag>
export type TagRawList = RawList
