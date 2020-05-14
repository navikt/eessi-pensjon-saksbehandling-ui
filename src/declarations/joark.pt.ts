import PT from 'prop-types'

export const JoarkFileVariantPropType = PT.shape({
  variantformat: PT.string.isRequired,
  filnavn: PT.string.isRequired
})

export const JoarkDocPropType = PT.shape({
  dokumentInfoId: PT.string.isRequired,
  tittel: PT.string.isRequired,
  dokumentvarianter: PT.arrayOf(JoarkFileVariantPropType).isRequired
})

export const JoarkPosterPropType = PT.shape({
  journalpostId: PT.string.isRequired,
  tittel: PT.string.isRequired,
  tema: PT.string.isRequired,
  datoOpprettet: PT.instanceOf(Date).isRequired,
  tilleggsopplysninger: PT.arrayOf(PT.string),
  dokumenter: PT.arrayOf(JoarkDocPropType).isRequired
})

export const JoarkFilePropType = PT.shape({
  journalpostId: PT.string.isRequired,
  tittel: PT.string.isRequired,
  tema: PT.string.isRequired,
  datoOpprettet: PT.instanceOf(Date).isRequired,
  dokumentInfoId: PT.string.isRequired,
  tilleggsopplysninger: PT.arrayOf(PT.string),
  variant: JoarkFileVariantPropType.isRequired
})

export const JoarkFilesPropType = PT.arrayOf(JoarkFilePropType.isRequired)

const ContentPropType = PT.shape({
  base64: PT.string.isRequired
})

export const JoarkFileWithContentPropType = PT.shape({
  journalpostId: PT.string.isRequired,
  tittel: PT.string.isRequired,
  tema: PT.string.isRequired,
  datoOpprettet: PT.instanceOf(Date).isRequired,
  dokumentInfoId: PT.string.isRequired,
  tilleggsopplysninger: PT.arrayOf(PT.string).isRequired,
  variant: JoarkFileVariantPropType.isRequired,
  content: ContentPropType.isRequired,
  name: PT.string.isRequired,
  size: PT.number.isRequired,
  mimetype: PT.string.isRequired
})
