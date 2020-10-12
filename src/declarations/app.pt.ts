import { AllowedLocaleString } from 'declarations/app.d'
import PT from 'prop-types'

export const AllowedLocaleStringPropType = PT.oneOf<AllowedLocaleString>(['en', 'nb'])

export const LabelsPropType = PT.objectOf(PT.string.isRequired)

export const RinaUrlPropType = PT.string

export const TPropType = PT.func

export const ValidationPropType = PT.objectOf(PT.string)
