import { Validation } from 'declarations/app'
import { TFunction } from 'react-i18next'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'

export interface SEDP5000EditValidationProps {
  ytelseOption: string
  forsikringElklerBosetningsperioder: string
}

export const SEDP5000EditValidate = (
  v: Validation,
  t: TFunction,
  {
    ytelseOption,
    forsikringElklerBosetningsperioder
  }: SEDP5000EditValidationProps
): boolean => {
  let hasErrors: boolean = false
  if (_.isEmpty(ytelseOption)) {
    v['sedP5000Edit-ytelse'] = {
      feilmelding: t('buc:error-noYtelse'),
      skjemaelementId: 'sedP5000Edit-ytelse'
    } as FeiloppsummeringFeil
    hasErrors = true
  }
  if (_.isEmpty(forsikringElklerBosetningsperioder)) {
    v['sedP5000Edit-forsikringElklerBosetningsperioder'] = {
      feilmelding: t('buc:error-noForsikringElklerBosetningsperioder'),
      skjemaelementId: 'sedP5000Edit-forsikringElklerBosetningsperioder'
    } as FeiloppsummeringFeil
    hasErrors = true
  }
  return hasErrors
}
