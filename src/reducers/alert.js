import * as types from 'constants/actionTypes'
import _ from 'lodash'

export const initialAlertState = {}

const alertReducer = (state = initialAlertState, action = {}) => {
  let clientErrorMessage, serverErrorMessage, clientErrorStatus

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
        serverErrorMessage = 'ui:serverInternalError'
        break
    }

    return {
      ...state,
      serverErrorMessage: serverErrorMessage,
      error: action.payload
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

      case types.BUC_SED_ATTACHMENT_FAILURE:

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

      case types.JOARK_GET_FAILURE:

        clientErrorMessage = 'buc:alert-joarkGetFailure'
        break

      case types.PDF_GENERATE_FAILURE:

        clientErrorMessage = 'pdf:alert-PDFGenerationFail'
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
      error: action.payload
    }
  }

  switch (action.type) {
    case types.BUC_CREATE_BUC_SUCCESS:

      clientErrorMessage = 'buc:alert-createdBuc|' + action.payload.type
      break

    case types.BUC_CREATE_SED_SUCCESS:

      clientErrorMessage = 'buc:alert-createdSed|' + (action.payload.type || action.payload.sed)
      break

    case types.PDF_GENERATE_SUCCESS:

      clientErrorMessage = 'pdf:alert-PDFGenerationSuccess'
      break

    case types.STORAGE_GET_SUCCESS:
      if (action.context.notification) {
        clientErrorMessage = 'ui:loadSuccess'
      }
      break

    case types.STORAGE_POST_SUCCESS:
      if (action.context.notification) {
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
    error: undefined
  }
}

export default alertReducer
