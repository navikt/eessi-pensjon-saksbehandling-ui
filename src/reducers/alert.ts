import * as types from 'src/constants/actionTypes'
import { Sed } from 'src/declarations/buc'
import i18n from 'src/i18n'
import { ActionWithPayload } from '@navikt/fetch'
import _ from 'lodash'
import { AnyAction } from 'redux'
import {JSX} from "react";

export interface AlertState {
  stripeStatus: string | undefined
  stripeMessage: JSX.Element | string | undefined
  bannerStatus: string | undefined
  bannerMessage: string | undefined
  error: any |undefined
  type: string | undefined
  uuid: string | undefined
}

export const initialAlertState: AlertState = {
  stripeStatus: undefined,
  stripeMessage: undefined,
  bannerStatus: undefined,
  bannerMessage: undefined,
  uuid: undefined,
  error: undefined,
  type: undefined
}

const alertReducer = (state: AlertState = initialAlertState, action: AnyAction) => {
  let stripeMessage: JSX.Element | string | undefined
  let bannerMessage: string | undefined
  let stripeStatus: string
  let bannerStatus: string

  if (action.type === types.ALERT_CLEAR ||
    action.type === types.APP_DATA_CLEAR) {
    return initialAlertState
  }

  if (action.type === types.ALERT_SUCCESS) {
    return {
      ...state,
      type: action.type,
      bannerMessage: (action as ActionWithPayload).payload.message,
      bannerStatus: 'success'
    }
  }

  if (action.type === types.ALERT_WARNING) {
    return {
      ...state,
      type: action.type,
      bannerMessage: (action as ActionWithPayload).payload.message,
      bannerStatus: 'warning'
    }
  }

  if (action.type === types.ALERT_FAILURE) {
    return {
      ...state,
      type: action.type,
      bannerMessage: (action as ActionWithPayload).payload.message,
      bannerStatus: 'error',
      error: (action as ActionWithPayload).payload.error
    }
  }

  /**
   * All ERROR MESSAGES go here, to banner alert
   */
  if (_.endsWith(action.type, '/ERROR')) {
    bannerStatus = 'error'
    switch (action.type) {
      case types.SERVER_INTERNAL_ERROR:
        bannerMessage = i18n.t('ui:serverInternalError')
        if ((action as ActionWithPayload)?.payload?.error?.status === 504) {
          bannerMessage = i18n.t('ui:gatewayTimeout')
        }
        break

      case types.SERVER_UNAUTHORIZED_ERROR:
        bannerMessage = i18n.t('ui:serverAuthenticationError')
        break

      default:
        bannerMessage = (action as ActionWithPayload).payload.message || i18n.t('ui:serverInternalError')
        break
    }

    return {
      ...state,
      type: action.type,
      bannerMessage,
      bannerStatus,
      error: (action as ActionWithPayload).payload
        ? _.isString((action as ActionWithPayload).payload.error)
            ? (action as ActionWithPayload).payload.error
            : (action as ActionWithPayload).payload.error?.message
        : undefined,
      uuid: (action as ActionWithPayload).payload ? (action as ActionWithPayload).payload.uuid : undefined
    }
  }

  /**
   * All FAILURE MESSAGES go here, to stripe alert
   */
  if (_.endsWith(action.type, '/FAILURE')) {
    stripeStatus = 'error'
    switch (action.type) {
      case types.BUC_CREATE_BUC_FAILURE:
      case types.GJENNY_CREATE_BUC_FAILURE:
        stripeMessage = i18n.t('message:alert-createBucFailure')
        bannerMessage = i18n.t('message:alert-createBucFailure')
        break

      case types.BUC_CREATE_SED_FAILURE:
      case types.BUC_CREATE_REPLY_SED_FAILURE:
      case types.GJENNY_CREATE_SED_FAILURE:
      case types.GJENNY_CREATE_REPLY_SED_FAILURE:
        stripeMessage = i18n.t('message:alert-createSedFailure')
        bannerMessage = i18n.t('message:alert-createSedFailure')
        break

      case types.BUC_GET_BUC_OPTIONS_FAILURE:
        stripeMessage = i18n.t('message:alert-noBucOptions')
        bannerMessage = i18n.t('message:alert-noBucOptions')
        break

      case types.BUC_GET_BUCSLIST_FAILURE:
        stripeMessage = i18n.t('message:alert-noBucs')
        bannerMessage = i18n.t('message:alert-noBucs')
        break

      case types.BUC_GET_BUCSINFO_FAILURE:
        stripeMessage = i18n.t('message:alert-noBucsInfo')
        bannerMessage = i18n.t('message:alert-noBucsInfo')
        break

      case types.BUC_GET_BUCSINFO_LIST_FAILURE:
        stripeMessage = i18n.t('message:alert-noBucsListInfo')
        bannerMessage = i18n.t('message:alert-noBucsListInfo')
        break

      case types.BUC_GET_COUNTRY_LIST_FAILURE:
        stripeMessage = i18n.t('message:alert-noCountryList')
        bannerMessage = i18n.t('message:alert-noCountryList')
        break

      case types.BUC_GET_INSTITUTION_LIST_FAILURE:
        stripeMessage = i18n.t('message:alert-noInstitutionList')
        bannerMessage = i18n.t('message:alert-noInstitutionList')
        break

      case types.BUC_GET_SED_LIST_FAILURE:
        stripeMessage = i18n.t('message:alert-noSedList')
        bannerMessage = i18n.t('message:alert-noSedList')
        break

      case types.BUC_GET_TAG_LIST_FAILURE:
        stripeMessage = i18n.t('message:alert-noTagList')
        bannerMessage = i18n.t('message:alert-noTagList')
        break

      case types.BUC_SAVE_BUCSINFO_FAILURE:
        stripeMessage = i18n.t('message:alert-saveBucsInfoFailure')
        bannerMessage = i18n.t('message:alert-saveBucsInfoFailure')
        break

      case types.BUC_SEND_ATTACHMENT_FAILURE:
        stripeMessage = i18n.t('message:alert-createAttachmentFailure')
        bannerMessage = i18n.t('message:alert-createAttachmentFailure')
        break

      case types.JOARK_LIST_FAILURE:
        stripeMessage = i18n.t('message:alert-joarkListFailure')
        bannerMessage = i18n.t('message:alert-joarkListFailure')
        break

      case types.JOARK_PREVIEW_FAILURE:
        stripeMessage = i18n.t('message:alert-joarkPreviewFailure')
        bannerMessage = i18n.t('message:alert-joarkPreviewFailure')
        break

      default:
        stripeMessage = i18n.t((action as ActionWithPayload).payload?.message ?? 'ui:error')
        bannerMessage = i18n.t((action as ActionWithPayload).payload?.message ?? 'ui:error')
        break
    }

    return {
      ...state,
      type: action.type,
      bannerStatus: stripeStatus,
      bannerMessage: bannerMessage,
      stripeStatus,
      stripeMessage,
      error: (action as ActionWithPayload).payload
        ? _.isString((action as ActionWithPayload).payload.error)
          ? (action as ActionWithPayload).payload.error
          : (action as ActionWithPayload).payload.error?.message
        : undefined,
      uuid: (action as ActionWithPayload).payload ? (action as ActionWithPayload).payload.uuid : undefined
    }
  }

  /**
   * All OK MESSAGES for banner go here
   */
  let dealWithBanner = false

  switch (action.type) {
    case types.BUC_CREATE_BUC_SUCCESS:
    case types.GJENNY_CREATE_BUC_SUCCESS:
      bannerMessage = i18n.t('message:alert-createdBuc', { type: (action as ActionWithPayload).payload.type })
      dealWithBanner = true
      break

    case types.BUC_CREATE_SED_SUCCESS:
    case types.BUC_CREATE_REPLY_SED_SUCCESS:
    case types.GJENNY_CREATE_SED_SUCCESS:
    case types.GJENNY_CREATE_REPLY_SED_SUCCESS: {
      const message = ((action as ActionWithPayload).payload as Sed).message
      bannerMessage = i18n.t('message:alert-createdSed', {
        sed: (((action as ActionWithPayload).payload as Sed).type),
        message: message ? ' - ' + message : ''
      })
      dealWithBanner = true
      break
    }

    case types.P5000_PESYS_SEND_SUCCESS:
      bannerMessage = i18n.t('message:alert-sentToPesys')
      dealWithBanner = true
      break

    default:
      break
  }

  if (dealWithBanner) {
    return {
      ...state,
      type: action.type,
      bannerStatus: 'success',
      bannerMessage,
      uuid: undefined,
      error: undefined
    }
  }

  /**
   * All OK MESSAGES for stripe go here
   */

  stripeStatus = 'success'

  if (!stripeMessage) {
    return state
  }

  return {
    ...state,
    type: action.type,
    stripeStatus,
    stripeMessage,
    uuid: undefined,
    error: undefined
  }
}

export default alertReducer
