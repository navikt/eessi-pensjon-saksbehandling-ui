import { ErrorElement, Validation } from 'declarations/app'
import _ from 'lodash'
import i18n from "../../i18n";

export interface PageNotificationValidationProps {
  message: string | null | undefined
  byline: string | null | undefined
  show: boolean | undefined
}

export const pageNotificationValidate = (
  v: Validation,
  namespace: string | undefined,
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
      feilmelding: i18n.t('feil')
    } as ErrorElement
    hasError = true
  }

  if (show === true) {
    if (_.isEmpty(message)) {
      v['w-pagenotification-message'] = {
        skjemaelementId: 'w-pagenotification-message',
        feilmelding: i18n.t('feil')
      } as ErrorElement
      hasError = true
    }

    if (_.isEmpty(byline)) {
      v['w-pagenotification-byline'] = {
        skjemaelementId: 'w-pagenotification-byline',
        feilmelding: i18n.t('feil')
      } as ErrorElement
      hasError = true
    }
  }

  return hasError
}
