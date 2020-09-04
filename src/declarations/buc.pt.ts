import { JoarkFilesPropType } from 'declarations/joark.pt'
import PT from 'prop-types'

export const DatePropType = PT.shape({
  year: PT.number.isRequired,
  month: PT.string.isRequired,
  chronology: PT.shape({
    id: PT.string.isRequired,
    calendarType: PT.string.isRequired
  }).isRequired,
  dayOfMonth: PT.number.isRequired,
  dayOfWeek: PT.string.isRequired,
  era: PT.string.isRequired,
  dayOfYear: PT.number.isRequired,
  leapYear: PT.bool.isRequired,
  monthValue: PT.number.isRequired
})

export const BUCAttachmentPropType = PT.shape({
  id: PT.string.isRequired,
  name: PT.string.isRequired,
  fileName: PT.string.isRequired,
  mimeType: PT.string.isRequired,
  documentId: PT.string.isRequired,
  lastUpdate: PT.oneOfType([PT.number, DatePropType]).isRequired,
  medical: PT.bool.isRequired
})

export const BUCAttachmentsPropType = PT.arrayOf(BUCAttachmentPropType.isRequired)

export const AddressPropType = PT.shape({
  country: PT.string.isRequired,
  town: PT.string,
  street: PT.string,
  postalCode: PT.string,
  region: PT.string
})

export const OrganisationPropType = PT.shape({
  address: AddressPropType.isRequired,
  activeSince: PT.oneOfType([PT.number, PT.string]).isRequired,
  registryNumber: PT.any,
  acronym: PT.string.isRequired,
  countryCode: PT.string.isRequired,
  contactMethods: PT.any,
  name: PT.string.isRequired,
  location: PT.any,
  assignedBUCs: PT.any,
  id: PT.string.isRequired,
  accessPoint: PT.any
})

export const ParticipantPropType = PT.shape({
  role: PT.string.isRequired,
  organisation: OrganisationPropType.isRequired,
  selected: PT.bool.isRequired
})

export const VersionPropType = PT.shape({
  id: PT.string.isRequired,
  date: PT.number.isRequired
})

export const SedPropType = PT.shape({
  id: PT.string.isRequired,
  parentDocumentId: PT.string,
  type: PT.string.isRequired,
  status: PT.string.isRequired,
  creationDate: PT.number.isRequired,
  lastUpdate: PT.number.isRequired,
  displayName: PT.string,
  participants: PT.arrayOf(ParticipantPropType.isRequired).isRequired,
  attachments: PT.arrayOf(BUCAttachmentPropType.isRequired).isRequired,
  version: PT.string,
  firstVersion: VersionPropType.isRequired,
  lastVersion: VersionPropType.isRequired,
  allowsAttachments: PT.bool.isRequired
})

export const SedsPropType = PT.arrayOf(SedPropType.isRequired)

export const InstitutionPropType = PT.shape({
  country: PT.string.isRequired,
  institution: PT.string.isRequired,
  name: PT.string
})

export const InstitutionsPropType = PT.arrayOf(InstitutionPropType.isRequired)

export const ValidBucPropType = PT.shape({
  aktoerId: PT.string,
  caseId: PT.string.isRequired,
  creator: InstitutionPropType.isRequired,
  description: PT.string,
  institusjon: InstitutionsPropType.isRequired,
  lastUpdate: PT.number.isRequired,
  sakType: PT.string.isRequired,
  status: PT.string.isRequired,
  startDate: PT.number.isRequired,
  seds: PT.arrayOf(SedPropType.isRequired).isRequired,
  type: PT.string.isRequired
})

export const ErrorBucPropType = PT.shape({
  type: PT.string.isRequired,
  caseId: PT.string.isRequired,
  creator: PT.any.isRequired,
  description: () => null,
  institusjon: () => null,
  lastUpdate: () => null,
  sakType: () => null,
  status: () => null,
  startDate: () => null,
  seds: () => null,
  error: PT.string
})

export const BucPropType = PT.any// oneOfType([ValidBucPropType, ErrorBucPropType])

export const BucsPropType = PT.objectOf(BucPropType)

export const BucInfoPropType = PT.shape({
  tags: PT.arrayOf(PT.string.isRequired),
  comment: PT.string
})

export const BucsInfoPropType = PT.shape({
  bucs: PT.objectOf(BucInfoPropType.isRequired).isRequired
})

export const NewSedPayloadPropType = PT.shape({
  sakId: PT.string.isRequired,
  buc: PT.string.isRequired,
  sed: PT.string.isRequired,
  institutions: PT.arrayOf(InstitutionPropType.isRequired).isRequired,
  aktoerId: PT.string.isRequired,
  euxCaseId: PT.string.isRequired,
  vedtakId: PT.string,
  avdodfnr: PT.string
})

export const RawInstitutionPropType = PT.shape({
  id: PT.string.isRequired,
  navn: PT.string.isRequired,
  akronym: PT.string.isRequired,
  landkode: PT.string.isRequired,
  buc: PT.string
})

export const InstitutionListMapPropType = PT.objectOf(PT.arrayOf(PT.any).isRequired)

export const InstitutionNamesPropType = PT.objectOf(PT.string.isRequired)

export const TagPropType = PT.shape({
  value: PT.string.isRequired,
  label: PT.string.isRequired
})

export const TagsPropType = PT.arrayOf(TagPropType.isRequired)

export const AttachedFilesPropType = PT.objectOf(PT.oneOfType([JoarkFilesPropType, BUCAttachmentsPropType]).isRequired)
