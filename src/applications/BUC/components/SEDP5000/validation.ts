import { Validation } from 'declarations/app'
import { TFunction } from 'i18next'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'

export interface SEDP5000EditValidationProps {
  ytelseOption: any
}

export const SEDP5000EditValidate = (
  v: Validation,
  t: TFunction,
  {
    ytelseOption
  }: SEDP5000EditValidationProps
): boolean => {

  let hasErrors: boolean = false
  if (_.isEmpty(ytelseOption)) {
    v['sedP5000Edit-ytelse-select'] = {
      feilmelding: t('buc:error-noYtelse'),
      skjemaelementId: 'sedP5000Edit-ytelse-select'
    } as FeiloppsummeringFeil
    hasErrors = true
  }
  return hasErrors
}
