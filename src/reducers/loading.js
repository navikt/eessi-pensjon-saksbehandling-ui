import * as types from '../constants/actionTypes'
import _ from 'lodash'

export const initialLoadingState = {}

const loadingReducer = (state = initialLoadingState, action = {}) => {
  let status

  if (_.startsWith(action.type, 'SERVER_')) {
    return initialLoadingState
  }

  if (_.endsWith(action.type, '/REQUEST')) {
    status = undefined
  }

  if (_.endsWith(action.type, '/FAILURE')) {
    status = 'ERROR'
  }

  if (_.endsWith(action.type, '/SUCCESS')) {
    status = 'OK'
  }
  switch (action.type) {
    case types.BUC_GET_CASE_NUMBER_REQUEST:

      return Object.assign({}, state, {
        gettingBUC: true,
        status: status
      })

    case types.BUC_GET_SUBJECT_AREA_LIST_REQUEST:

      return Object.assign({}, state, {
        subjectAreaList: true,
        status: status
      })

    case types.BUC_GET_INSTITUTION_LIST_REQUEST:

      return Object.assign({}, state, {
        institutionList: true,
        status: status
      })

    case types.BUC_GET_SED_LIST_REQUEST:

      return Object.assign({}, state, {
        sedList: true,
        status: status
      })

    case types.BUC_GET_BUC_LIST_REQUEST:

      return Object.assign({}, state, {
        bucList: true,
        status: status
      })

    case types.BUC_GET_COUNTRY_LIST_REQUEST:

      return Object.assign({}, state, {
        countryList: true,
        status: status
      })

    case types.RINA_GET_URL_REQUEST:

      return Object.assign({}, state, {
        rinaUrl: true,
        status: status
      })

    case types.BUC_CREATE_SED_REQUEST:
    case types.BUC_ADD_TO_SED_REQUEST:

      return Object.assign({}, state, {
        savingCase: true,
        status: status
      })

    case types.BUC_SEND_SED_REQUEST:

      return Object.assign({}, state, {
        sendingCase: true,
        status: status
      })

    case types.APP_USERINFO_REQUEST:

      return Object.assign({}, state, {
        gettingUserInfo: true,
        status: status
      })

    case types.STATUS_GET_REQUEST:

      return Object.assign({}, state, {
        gettingStatus: true,
        status: status
      })

    case types.STATUS_SED_GET_REQUEST:

      return Object.assign({}, state, {
        gettingSED: true,
        status: status
      })

    case types.STATUS_RINA_CASE_REQUEST:

      return Object.assign({}, state, {
        gettingRinaCase: true,
        status: status
      })

    case types.BUC_GET_CASE_NUMBER_SUCCESS:
    case types.BUC_GET_CASE_NUMBER_FAILURE:

      return Object.assign({}, state, {
        gettingBUC: false,
        status: status
      })

    case types.BUC_GET_SUBJECT_AREA_LIST_SUCCESS:
    case types.BUC_GET_SUBJECT_AREA_LIST_FAILURE:

      return Object.assign({}, state, {
        subjectAreaList: false,
        status: status
      })

    case types.BUC_GET_INSTITUTION_LIST_SUCCESS:
    case types.BUC_GET_INSTITUTION_LIST_FAILURE:

      return Object.assign({}, state, {
        institutionList: false,
        status: status
      })

    case types.BUC_GET_SED_LIST_SUCCESS:
    case types.BUC_GET_SED_LIST_FAILURE:

      return Object.assign({}, state, {
        sedList: false,
        status: status
      })

    case types.BUC_GET_BUC_LIST_SUCCESS:
    case types.BUC_GET_BUC_LIST_FAILURE:

      return Object.assign({}, state, {
        bucList: false,
        status: status
      })

    case types.BUC_GET_COUNTRY_LIST_SUCCESS:
    case types.BUC_GET_COUNTRY_LIST_FAILURE:

      return Object.assign({}, state, {
        countryList: false,
        status: status
      })

    case types.BUC_CREATE_SED_SUCCESS:
    case types.BUC_CREATE_SED_FAILURE:
    case types.BUC_ADD_TO_SED_SUCCESS:
    case types.BUC_ADD_TO_SED_FAILURE:

      return Object.assign({}, state, {
        savingCase: false,
        status: status
      })

    case types.BUC_SEND_SED_SUCCESS:
    case types.BUC_SEND_SED_FAILURE:

      return Object.assign({}, state, {
        sendingCase: false,
        status: status
      })

    case types.RINA_GET_URL_SUCCESS:
    case types.RINA_GET_URL_FAILURE:

      return Object.assign({}, state, {
        rinaUrl: false,
        status: status
      })

    case types.APP_USERINFO_SUCCESS:
    case types.APP_USERINFO_FAILURE:

      return Object.assign({}, state, {
        gettingUserInfo: false,
        status: status
      })

    case types.STATUS_GET_SUCCESS:
    case types.STATUS_GET_FAILURE:

      return Object.assign({}, state, {
        gettingStatus: false,
        status: status
      })

    case types.STATUS_SED_GET_SUCCESS:
    case types.STATUS_SED_GET_FAILURE:

      return Object.assign({}, state, {
        gettingSED: false,
        status: status
      })

    case types.STATUS_RINA_CASE_SUCCESS:
    case types.STATUS_RINA_CASE_FAILURE:

      return Object.assign({}, state, {
        gettingRinaCase: true,
        status: status
      })

    case types.PDF_GENERATE_REQUEST:

      return Object.assign({}, state, {
        generatingPDF: true,
        status: status
      })

    case types.PDF_GENERATE_SUCCESS:
    case types.PDF_GENERATE_FAILURE:

      return Object.assign({}, state, {
        generatingPDF: false,
        status: status
      })

    case types.PDF_LOADING_FILES_STARTED:

      return Object.assign({}, state, {
        loadingPDF: true,
        status: status
      })

    case types.PDF_LOADING_FILES_FINISHED:

      return Object.assign({}, state, {
        loadingPDF: false,
        status: status
      })

    case types.STORAGE_LIST_REQUEST:
    case types.STORAGE_LIST_NO_NOTIF_REQUEST:

      return Object.assign({}, state, {
        loadingStorageFileList: true,
        status: status
      })

    case types.STORAGE_LIST_SUCCESS:
    case types.STORAGE_LIST_NO_NOTIF_SUCCESS:
    case types.STORAGE_LIST_FAILURE:
    case types.STORAGE_LIST_NO_NOTIF_FAILURE:

      return Object.assign({}, state, {
        loadingStorageFileList: false,
        status: status
      })

    case types.STORAGE_GET_REQUEST:
    case types.STORAGE_GET_NO_NOTIF_REQUEST:

      return Object.assign({}, state, {
        loadingStorageFile: true,
        status: status
      })

    case types.STORAGE_GET_SUCCESS:
    case types.STORAGE_GET_NO_NOTIF_SUCCESS:
    case types.STORAGE_GET_FAILURE:
    case types.STORAGE_GET_NO_NOTIF_FAILURE:

      return Object.assign({}, state, {
        loadingStorageFile: false,
        status: status
      })

    case types.STORAGE_POST_REQUEST:
    case types.STORAGE_POST_NO_NOTIF_REQUEST:

      return Object.assign({}, state, {
        savingStorageFile: true,
        status: status
      })

    case types.STORAGE_POST_SUCCESS:
    case types.STORAGE_POST_NO_NOTIF_SUCCESS:
    case types.STORAGE_POST_FAILURE:
    case types.STORAGE_POST_NO_NOTIF_FAILURE:

      return Object.assign({}, state, {
        savingStorageFile: false,
        status: status
      })

    case types.STORAGE_DELETE_REQUEST:

      return Object.assign({}, state, {
        deletingStorageFile: true,
        status: status
      })

    case types.STORAGE_DELETE_SUCCESS:
    case types.STORAGE_DELETE_FAILURE:

      return Object.assign({}, state, {
        deletingStorageFile: false,
        status: status
      })

    case types.P4000_SUBMIT_REQUEST:

      return Object.assign({}, state, {
        submittingP4000: true,
        status: status
      })

    case types.P4000_SUBMIT_SUCCESS:
    case types.P4000_SUBMIT_FAILURE:

      return Object.assign({}, state, {
        submittingP4000: false,
        status: status
      })

    case types.APP_LOGIN_REQUEST: {
      return Object.assign({}, state, {
        isLoggingIn: true
      })
    }

    case types.APP_LOGOUT_REQUEST:
      return Object.assign({}, state, {
        isLoggingOut: true
      })

    case types.APP_LOGOUT_SUCCESS:
    case types.APP_LOGOUT_FAILURE:
      return Object.assign({}, state, {
        isLoggingOut: false
      })

    case types.PINFO_SEND_SUCCESS:
    case types.PINFO_SEND_FAILURE:
      return Object.assign({}, state, {
        isSendingPinfo: false
      })

    case types.PINFO_SEND_REQUEST:

      return Object.assign({}, state, {
        isSendingPinfo: true
      })

    case types.PINFO_INVITE_SUCCESS:
    case types.PINFO_INVITE_FAILURE:
      return Object.assign({}, state, {
        isInvitingPinfo: false
      })

    case types.PINFO_INVITE_REQUEST:
      return Object.assign({}, state, {
        isInvitingPinfo: true
      })

    case types.PINFO_SAKTYPE_SUCCESS:
    case types.PINFO_SAKTYPE_FAILURE:
      return Object.assign({}, state, {
        gettingPinfoSaktype: false
      })

    case types.PINFO_SAKTYPE_REQUEST:
      return Object.assign({}, state, {
        gettingPinfoSaktype: true
      })

    default:

      return state
  }
}

export default loadingReducer
