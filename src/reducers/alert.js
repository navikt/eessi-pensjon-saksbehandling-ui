import * as types from '../constants/actionTypes'
import _ from 'lodash'

export const initialAlertState = {}

const printError = (error) => {
  let errorMessage = []
  if (error.status) {
    errorMessage.push(error.status)
  }
  if (error.message) {
    errorMessage.push(error.message)
  } else {
    if (error.error) {
      errorMessage.push(error.error)
    }
  }
  if (error.serverMessage) {
    errorMessage.push(error.serverMessage)
  }

  if (error.uuid) {
    errorMessage.push(error.uuid)
  }
  return errorMessage.join(' ')
}

const alertReducer = (state = initialAlertState, action = {}) => {
  let clientErrorMessage, serverErrorMessage, clientErrorStatus

  if (_.endsWith(action.type, '/REQUEST') || action.type === types.ALERT_CLIENT_CLEAR) {
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

    return Object.assign({}, state, {
      serverErrorMessage: serverErrorMessage,
      uuid: action.payload.uuid
    })
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

      case types.BUC_VERIFY_CASE_NUMBER_FAILURE:

        clientErrorMessage = 'buc:alert-caseNotFound'
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

      case types.BUC_SAVE_BUCSINFO_FAILURE:

        clientErrorMessage = 'buc:alert-saveBucsInfoFailure'
        break

      case types.JOARK_LIST_FAILURE:

        clientErrorMessage = 'buc:alert-joarkListFailure|' + action.payload.error
        break

      case types.JOARK_PREVIEW_FAILURE:

        clientErrorMessage = 'buc:alert-joarkPreviewFailure|' + action.payload.error
        break

      case types.JOARK_GET_FAILURE:

        clientErrorMessage = 'buc:alert-joarkGetFailure|' + action.payload.error
        break

      case types.PDF_GENERATE_FAILURE:

        clientErrorMessage = 'pdf:alert-PDFGenerationFail'
        break

      case types.P4000_OPEN_FAILURE:

        clientErrorMessage = 'p4000:alert-openP4000error|' + action.payload.error
        break

      case types.P4000_SUBMIT_FAILURE:

        clientErrorMessage = 'p4000:alert-submitFailure'
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

        clientErrorMessage = printError(action.payload)
        break
    }

    return Object.assign({}, state, {
      clientErrorStatus: clientErrorMessage ? clientErrorStatus : undefined,
      clientErrorMessage: clientErrorMessage,
      uuid: action.payload.uuid
    })
  }

  switch (action.type) {
    case types.BUC_VERIFY_CASE_NUMBER_SUCCESS:

      clientErrorMessage = 'buc:alert-caseFound'
      break

    case types.BUC_CREATE_BUC_SUCCESS:

      clientErrorMessage = 'buc:alert-createdBuc|' + action.payload.type
      break

    case types.BUC_CREATE_SED_SUCCESS:

      clientErrorMessage = 'buc:alert-createdSed|' + action.payload.type
      break

    case types.PDF_GENERATE_SUCCESS:

      clientErrorMessage = 'pdf:alert-PDFGenerationSuccess'
      break

    case types.P4000_NEW:

      clientErrorMessage = 'p4000:alert-newP4000Form'
      break

    case types.P4000_OPEN_SUCCESS:

      clientErrorMessage = 'p4000:alert-openP4000Form'
      break

    case types.P4000_EVENT_ADD:

      clientErrorMessage = 'p4000:alert-addedP4000Event'
      break

    case types.P4000_EVENT_REPLACE:

      clientErrorMessage = 'p4000:alert-replacedP4000Event'
      break

    case types.P4000_EVENT_DELETE:

      clientErrorMessage = 'p4000:alert-deletedP4000Event'
      break

    case types.P4000_SUBMIT_SUCCESS:

      clientErrorMessage = 'p4000:alert-submitSuccess'
      break

    case types.STORAGE_GET_SUCCESS:

      clientErrorMessage = 'ui:loadSuccess'
      break

    case types.STORAGE_POST_SUCCESS:

      clientErrorMessage = 'ui:saveSuccess'
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

  return Object.assign({}, state, {
    clientErrorStatus: 'OK',
    clientErrorMessage: clientErrorMessage,
    uuid: undefined
  })
}

export default alertReducer
