import * as types from 'constants/actionTypes'
import { ActionWithPayload } from 'js-fetch-api'
import _ from 'lodash'
import { Action } from 'redux'
import { AlertStatus } from 'components/Alert/Alert'

export interface AlertState {
  clientErrorStatus: AlertStatus | undefined;
  clientErrorMessage: string | undefined;
  serverErrorMessage: string | undefined;
  uuid: string | undefined;
  error: any |undefined;
}

export const initialAlertState: AlertState = {
  clientErrorStatus: undefined,
  clientErrorMessage: undefined,
  serverErrorMessage: undefined,
  uuid: undefined,
  error: undefined
}

const alertReducer = (state: AlertState = initialAlertState, action: Action | ActionWithPayload) => {
  let clientErrorMessage: string | undefined, serverErrorMessage: string, clientErrorStatus: string

  if (action.type === types.ALERT_CLIENT_CLEAR) {
    return initialAlertState
  }

  if (_.endsWith(action.type, '/ERROR')) {
    switch (action.type) {
      case types.SERVER_INTERNAL_ERROR:
        serverErrorMessage = 'ui:serverInternalError'
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
    clientErrorStatus = 'ERROR'

    switch (action.type) {
      case types.BUC_GET_BUCS_FAILURE:

        clientErrorMessage = 'buc:alert-noBucs'
        break
      case types.BUC_GET_BUCSINFO_LIST_FAILURE:

        clientErrorMessage = 'buc:alert-noBucsListInfo'
        break

      case types.BUC_GET_BUCSINFO_FAILURE:

        clientErrorMessage = 'buc:alert-noBucsInfo'
        break

      case types.BUC_GET_SUBJECT_AREA_LIST_FAILURE:

        clientErrorMessage = 'buc:alert-noSubjectAreaList'
        break

      case types.BUC_GET_BUC_LIST_FAILURE:

        clientErrorMessage = 'buc:alert-noBucList'
        break

      case types.BUC_GET_TAG_LIST_FAILURE:

        clientErrorMessage = 'buc:alert-noTagList'
        break

      case types.BUC_GET_INSTITUTION_LIST_FAILURE:

        clientErrorMessage = 'buc:alert-noInstitutionList'
        break

      case types.BUC_GET_SED_LIST_FAILURE:

        clientErrorMessage = 'buc:alert-noSedList'
        break

      case types.BUC_GET_COUNTRY_LIST_FAILURE:

        clientErrorMessage = 'buc:alert-noCountryList'
        break

      case types.BUC_CREATE_BUC_FAILURE:

        clientErrorMessage = 'buc:alert-createBucFailure'
        break

      case types.BUC_CREATE_SED_FAILURE:

        clientErrorMessage = 'buc:alert-createSedFailure'
        break

      case types.BUC_SEND_ATTACHMENT_FAILURE:

        clientErrorMessage = 'buc:alert-createAttachmentFailure'
        break

      case types.BUC_SAVE_BUCSINFO_FAILURE:

        clientErrorMessage = 'buc:alert-saveBucsInfoFailure'
        break

      case types.BUC_GET_P4000_LIST_FAILURE:

        clientErrorMessage = 'buc:alert-getP4000ListFailure'
        break

      case types.BUC_GET_P4000_INFO_FAILURE:

        clientErrorMessage = 'buc:alert-getP4000InfoFailure'
        break

      case types.JOARK_LIST_FAILURE:

        clientErrorMessage = 'buc:alert-joarkListFailure'
        break

      case types.JOARK_PREVIEW_FAILURE:

        clientErrorMessage = 'buc:alert-joarkPreviewFailure'
        break

      case types.STORAGE_LIST_FAILURE:

        clientErrorMessage = 'ui:listFailure'
        break

      case types.STORAGE_GET_FAILURE:

        clientErrorMessage = 'ui:loadFailure'
        break

      case types.PINFO_SEND_FAILURE:

        clientErrorMessage = 'pinfo:alert-sendFailure'
        break

      default:

        clientErrorMessage = 'ui:error'
        break
    }

    return {
      ...state,
      clientErrorStatus: clientErrorMessage ? clientErrorStatus : undefined,
      clientErrorMessage: clientErrorMessage,
      error: (action as ActionWithPayload).payload ? (action as ActionWithPayload).payload.error : undefined,
      uuid: (action as ActionWithPayload).payload ? (action as ActionWithPayload).payload.uuid : undefined
    }
  }

  switch (action.type) {
    case types.BUC_CREATE_BUC_SUCCESS:

      clientErrorMessage = 'buc:alert-createdBuc|' + (action as ActionWithPayload).payload.type
      break

    case types.BUC_CREATE_SED_SUCCESS:

      clientErrorMessage = 'buc:alert-createdSed|' + ((action as ActionWithPayload).payload.type || (action as ActionWithPayload).payload.sed)
      break

    case types.STORAGE_GET_SUCCESS:
      if ((action as ActionWithPayload).context && (action as ActionWithPayload).context.notification) {
        clientErrorMessage = 'ui:loadSuccess'
      }
      break

    case types.STORAGE_POST_SUCCESS:
      if ((action as ActionWithPayload).context && (action as ActionWithPayload).context.notification) {
        clientErrorMessage = 'ui:saveSuccess'
      }
      break

    case types.PINFO_SEND_SUCCESS:

      clientErrorMessage = 'pinfo:alert-sendSuccess'
      break

    default:
      break
  }

  if (!clientErrorMessage) {
    return state
  }

  return {
    ...state,
    clientErrorStatus: 'OK',
    clientErrorMessage: clientErrorMessage,
    uuid: undefined,
    error: undefined
  }
}

export default alertReducer
