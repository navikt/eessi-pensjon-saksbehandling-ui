import { ErrorElement, Validation } from 'declarations/app'
import _ from 'lodash'
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
    v['w-journalføring--sed-select-id'] = {
      skjemaelementId: 'w-journalføring--sed-select-id',
      feilmelding: t('jou:validation-noSed')
    } as ErrorElement
    hasError = true
  }

  return hasError
}
