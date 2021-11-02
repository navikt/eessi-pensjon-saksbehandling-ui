import { Validation } from 'declarations/app'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { TFunction } from 'react-i18next'

export interface JournalføringValidationProps {
  sed: string | undefined
}

export const JournalføringValidate = (
  v: Validation,
  t: TFunction,
  {
    sed
  }: JournalføringValidationProps
): boolean => {
  let hasError: boolean = false
  if (_.isEmpty(sed)) {
    v['w-journalføring__sed-select-id'] = {
      skjemaelementId: 'w-journalføring__sed-select-id',
      feilmelding: t('jou:validation-noSed')
    } as FeiloppsummeringFeil
    hasError = true
  }

  return hasError
}
