import { ErrorElement, Validation } from 'declarations/app'
import _ from 'lodash'
import { TFunction } from 'react-i18next'

export interface PageNotificationValidationProps {
  message: string | null | undefined
  byline: string | null | undefined
  show: boolean | undefined
}

export const pageNotificationValidate = (
  v: Validation,
  t: TFunction,
  {
    message,
    byline,
    show
  }: PageNotificationValidationProps
): boolean => {
  let hasError: boolean = false
  if (_.isNil(show)) {
    v['w-pagenotification-show'] = {
      skjemaelementId: 'w-pagenotification-show',
      feilmelding: t('feil')
    } as ErrorElement
    hasError = true
  }

  if (_.isEmpty(message)) {
    v['w-pagenotification-message'] = {
      skjemaelementId: 'w-pagenotification-message',
      feilmelding: t('feil')
    } as ErrorElement
    hasError = true
  }

  if (_.isEmpty(byline)) {
    v['w-pagenotification-byline'] = {
      skjemaelementId: 'w-pagenotification-byline',
      feilmelding: t('feil')
    } as ErrorElement
    hasError = true
  }

  return hasError
}
