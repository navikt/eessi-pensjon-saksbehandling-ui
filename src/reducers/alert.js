import * as types from '../constants/actionTypes'
import _ from 'lodash'

function processError (error) {
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
  return errorMessage.join(' ')
}

export default function (state = {}, action = {}) {
  let message

  if (_.endsWith(action.type, '/REQUEST')) {
    return Object.assign({}, state, {
      clientErrorMessage: undefined,
      clientErrorStatus: undefined
    })
  }

  if (action.type === types.SERVER_OFFLINE) {
    return Object.assign({}, state, {
      serverErrorMessage: 'ui:serverOffline'
    })
  }

  if (_.endsWith(action.type, '/FAILURE')) {
    switch (action.type) {
      case types.CASE_GET_SUBJECT_AREA_LIST_FAILURE:

        message = 'case:alert-noSubjectAreaList'
        break

      case types.CASE_GET_INSTITUTION_LIST_FAILURE:

        message = 'case:alert-noInstitutionList'
        break

      case types.CASE_GET_SED_LIST_FAILURE:

        message = 'case:alert-noSedList'
        break

      case types.CASE_GET_BUC_LIST_FAILURE:

        message = 'case:alert-noBucList'
        break

      case types.CASE_GET_COUNTRY_LIST_FAILURE:

        message = 'case:alert-noCountryList'
        break

      case types.APP_USERINFO_FAILURE:

        message = 'ui:alert-noSuchUser'
        break

      case types.PDF_GENERATE_FAILURE:

        message = 'pdf:alert-PDFGenerationFail'
        break

      case types.P4000_OPEN_FAILURE:

        message = 'p4000:alert-openP4000error|' + action.payload.error
        break

      case types.P4000_SUBMIT_FAILURE:

        message = 'p4000:alert-submitFailure'
        break

      case types.STORAGE_LIST_FAILURE:

        message = 'ui:listFailure'
        break

      case types.STORAGE_GET_FAILURE:

        message = 'ui:loadFailure'
        break

      default:

        message = processError(action.payload)
        break
    }

    return Object.assign({}, state, {
      clientErrorStatus: 'ERROR',
      clientErrorMessage: message
    })
  }

  switch (action.type) {
    case types.ALERT_CLIENT_CLEAR:

      return Object.assign({}, state, {
        clientErrorStatus: undefined,
        clientErrorMessage: undefined
      })

    case types.CASE_GET_CASE_NUMBER_SUCCESS:

      message = 'case:alert-caseFound'
      break

    case types.CASE_GENERATE_DATA_SUCCESS:

      message = 'case:alert-generatedData'
      break

    case types.CASE_CREATE_SED_SUCCESS:
    case types.CASE_ADD_TO_SED_SUCCESS:

      message = 'case:alert-savedData'
      break

    case types.CASE_SEND_SED_SUCCESS:

      message = 'case:alert-sentData'
      break

    case types.PDF_GENERATE_SUCCESS:

      message = 'pdf:alert-PDFGenerationSuccess'
      break

    case types.P4000_NEW:

      message = 'p4000:alert-newP4000Form'
      break

    case types.P4000_OPEN_SUCCESS:

      message = 'p4000:alert-openP4000Form'
      break

    case types.P4000_EVENT_ADD:

      message = 'p4000:alert-addedP4000Event'
      break

    case types.P4000_EVENT_REPLACE:

      message = 'p4000:alert-replacedP4000Event'
      break

    case types.P4000_EVENT_DELETE:

      message = 'p4000:alert-deletedP4000Event'
      break

    case types.P4000_SUBMIT_SUCCESS:

      message = 'p4000:alert-submitSuccess'
      break

    case types.STORAGE_GET_SUCCESS:

      message = 'ui:loadSuccess'
      break

    case types.STORAGE_POST_SUCCESS:

      message = 'ui:saveSuccess'
      break

    default:
      break
  }

  if (!message) {
    return state
  }

  return Object.assign({}, state, {
    clientErrorStatus: 'OK',
    clientErrorMessage: message
  })
}
