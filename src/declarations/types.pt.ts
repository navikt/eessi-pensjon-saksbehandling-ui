import { AllowedLocaleString } from 'declarations/types.d'
import PT from 'prop-types'

export const ActionCreatorPropType = PT.func

export const LabelsPropType = PT.objectOf(PT.string.isRequired)

export const FilePropType = PT.shape({
  id: PT.string,
  size: PT.number.isRequired,
  name: PT.string.isRequired,
  numPages: PT.number,
  mimetype: PT.string.isRequired,
  content: PT.shape({
    text: PT.string,
    base64: PT.string
  }).isRequired
})

export const PersonPropType = PT.any

export const FilesPropType = PT.arrayOf(FilePropType.isRequired)

export const AllowedLocaleStringPropType = PT.oneOf<AllowedLocaleString>(['en', 'nb'])

export const TPropType = PT.func

export const RinaUrlPropType = PT.string

export const LoadingPropType = PT.objectOf(PT.bool.isRequired)

export const ValidationPropType = PT.objectOf(PT.string)

export const PersonAvdodPropType = PT.shape({
  aktoerId: PT.string.isRequired,
  etternavn: PT.string.isRequired,
  fnr: PT.string.isRequired,
  fornavn: PT.string.isRequired,
  fulltNavn: PT.string.isRequired,
  mellomnavn: PT.string.isRequired,
  relasjon: PT.string.isRequired
})

export const PersonAvdodsPropType = PT.arrayOf(PersonAvdodPropType.isRequired)
