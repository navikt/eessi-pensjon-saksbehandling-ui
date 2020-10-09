
import PT from 'prop-types'

export const PersonPropType = PT.any

export const PersonAvdodPropType = PT.shape({
  aktoerId: PT.string.isRequired,
  etternavn: PT.string.isRequired,
  fnr: PT.string.isRequired,
  fornavn: PT.string.isRequired,
  fulltNavn: PT.string.isRequired,
  mellomnavn: PT.string,
  relasjon: PT.string.isRequired
})

export const PersonAvdodsPropType = PT.arrayOf(PersonAvdodPropType.isRequired)
