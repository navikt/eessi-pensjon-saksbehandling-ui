import * as types from 'constants/actionTypes'
import { Sed } from 'declarations/buc'
import { AlertVariant } from 'declarations/components'
import { ActionWithPayload } from 'js-fetch-api'
import _ from 'lodash'
import { Action } from 'redux'

export interface AlertState {
  clientErrorMessage: string | undefined
  clientErrorParam: any | undefined
  clientErrorStatus: AlertVariant | undefined
  error: any |undefined
  serverErrorMessage: string | undefined
  uuid: string | undefined
}

export const initialAlertState: AlertState = {
  clientErrorMessage: undefined,
  clientErrorParam: {},
  clientErrorStatus: undefined,
  error: undefined,
  serverErrorMessage: undefined,
  uuid: undefined
}

const alertReducer = (state: AlertState = initialAlertState, action: Action | ActionWithPayload = { type: '' }) => {
  let clientErrorMessage: string | undefined
  let serverErrorMessage: string
  let clientErrorStatus: string
  let clientErrorParam = {}

  if (action.type === types.ALERT_CLEAR) {
    return initialAlertState
  }

  if (_.endsWith(action.type, '/ERROR')) {
    switch (action.type) {
      case types.SERVER_INTERNAL_ERROR:
        serverErrorMessage = 'ui:serverInternalError'
        if ((action as ActionWithPayload)?.payload?.error?.status === 504) {
          serverErrorMessage = 'ui:gatewayTimeout'
        }
        break

      case types.SERVER_UNAUTHORIZED_ERROR:
        serverErrorMessage = 'ui:serverAuthenticationError'
        break

      default:
        serverErrorMessage = (action as ActionWithPayload).payload.message || 'ui:serverInternalError'
        break
    }

    return {
      ...state,
      serverErrorMessage: serverErrorMessage,
      error: (action as ActionWithPayload).payload ? (action as ActionWithPayload).payload.error : undefined,
      uuid: (action as ActionWithPayload).payload ? (action as ActionWithPayload).payload.uuid : undefined
    }
  }

  if (_.endsWith(action.type, '/FAILURE')) {
    clientErrorStatus = 'error'

    switch (action.type) {
      case types.BUC_CREATE_BUC_FAILURE:

        clientErrorMessage = 'message:alert-createBucFailure'
        break

      case types.BUC_CREATE_SED_FAILURE:

        clientErrorMessage = 'message:alert-createSedFailure'
        break

      case types.BUC_GET_BUC_OPTIONS_FAILURE:

        clientErrorMessage = 'message:alert-noBucOptions'
        break

      case types.BUC_GET_BUCSLIST_FAILURE:

        clientErrorMessage = 'message:alert-noBucs'
        break

      case types.BUC_GET_BUCSINFO_FAILURE:

        clientErrorMessage = 'message:alert-noBucsInfo'
        break

      case types.BUC_GET_BUCSINFO_LIST_FAILURE:

        clientErrorMessage = 'message:alert-noBucsListInfo'
        break

      case types.BUC_GET_COUNTRY_LIST_FAILURE:

        clientErrorMessage = 'message:alert-noCountryList'
        break

      case types.BUC_GET_INSTITUTION_LIST_FAILURE:

        clientErrorMessage = 'message:alert-noInstitutionList'
        break

      case types.BUC_GET_SED_LIST_FAILURE:

        clientErrorMessage = 'message:alert-noSedList'
        break

      case types.BUC_GET_SUBJECT_AREA_LIST_FAILURE:

        clientErrorMessage = 'message:alert-noSubjectAreaList'
        break

      case types.BUC_GET_TAG_LIST_FAILURE:

        clientErrorMessage = 'message:alert-noTagList'
        break

      case types.BUC_SAVE_BUCSINFO_FAILURE:

        clientErrorMessage = 'message:alert-saveBucsInfoFailure'
        break

      case types.BUC_SEND_ATTACHMENT_FAILURE:

        clientErrorMessage = 'message:alert-createAttachmentFailure'
        break

      case types.JOARK_LIST_FAILURE:

        clientErrorMessage = 'message:alert-joarkListFailure'
        break

      case types.JOARK_PREVIEW_FAILURE:

        clientErrorMessage = 'message:alert-joarkPreviewFailure'
        break

      default:

        clientErrorMessage = (action as ActionWithPayload).payload?.message ?? 'ui:error'
        break
    }

    return {
      ...state,
      clientErrorStatus: clientErrorMessage ? clientErrorStatus : undefined,
      clientErrorMessage: clientErrorMessage,
      clientErrorParam: clientErrorParam,
      error: (action as ActionWithPayload).payload?.error,
      uuid: (action as ActionWithPayload).payload?.uuid
    }
  }

  switch (action.type) {
    case types.BUC_CREATE_BUC_SUCCESS:

      clientErrorMessage = 'message:alert-createdBuc'
      clientErrorParam = {
        type: (action as ActionWithPayload).payload.type
      }
      break

    case types.PAGE_NOTIFICATION_SET_SUCCESS:

      clientErrorMessage = 'message:alert-updatedPageNotification'
      clientErrorParam = {
        type: (action as ActionWithPayload).payload.type
      }
      break

    case types.BUC_CREATE_SED_SUCCESS:
    case types.BUC_CREATE_REPLY_SED_SUCCESS: {
      const message = ((action as ActionWithPayload).payload as Sed).message
      clientErrorMessage = 'message:alert-createdSed'
      clientErrorParam = {
        sed: (((action as ActionWithPayload).payload as Sed).type),
        message: message ? ' - ' + message : ''
      }
      break
    }

    case types.ALERT_SUCCESS: {
      clientErrorMessage = (action as ActionWithPayload).payload.message
      clientErrorParam = {
        type: (action as ActionWithPayload).payload.type
      }
      break
    }

    default:
      break
  }

  if (!clientErrorMessage) {
    return state
  }

  return {
    ...state,
    clientErrorStatus: 'info',
    clientErrorMessage: clientErrorMessage,
    clientErrorParam: clientErrorParam,
    uuid: undefined,
    error: undefined
  }
}

export default alertReducer
