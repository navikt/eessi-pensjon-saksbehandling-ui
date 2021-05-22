import { Validation } from 'declarations/app'
import { TFunction } from 'react-i18next'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'

export interface P5000EditValidationProps {
  ytelseOption: string
  forsikringElklerBosetningsperioder: string
}

export const P5000EditValidate = (
  v: Validation,
  t: TFunction,
  {
    ytelseOption,
    forsikringElklerBosetningsperioder
  }: P5000EditValidationProps
): boolean => {
  let hasErrors: boolean = false
  if (_.isEmpty(ytelseOption)) {
    v['P5000Edit-ytelse'] = {
      feilmelding: t('buc:error-noYtelse'),
      skjemaelementId: 'P5000Edit-ytelse'
    } as FeiloppsummeringFeil
    hasErrors = true
  }
  if (_.isEmpty(forsikringElklerBosetningsperioder)) {
    v['P5000Edit-forsikringElklerBosetningsperioder'] = {
      feilmelding: t('buc:error-noForsikringElklerBosetningsperioder'),
      skjemaelementId: 'P5000Edit-forsikringElklerBosetningsperioder'
    } as FeiloppsummeringFeil
    hasErrors = true
  }
  return hasErrors
}
