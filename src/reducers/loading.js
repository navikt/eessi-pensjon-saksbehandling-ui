import * as types from '../constants/actionTypes'
import _ from 'lodash'

export const initialLoadingState = {
  status: undefined,
  gettingBUCs: false
}

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
  // APP

    case types.APP_USERINFO_REQUEST:

      return Object.assign({}, state, {
        gettingUserInfo: true,
        status: status
      })

    case types.APP_USERINFO_SUCCESS:
    case types.APP_USERINFO_FAILURE:

      return Object.assign({}, state, {
        gettingUserInfo: false,
        status: status
      })

    case types.APP_LOGIN_REQUEST: {
      return Object.assign({}, state, {
        isLoggingIn: true
      })
    }

    case types.APP_LOGOUT_SUCCESS:
    case types.APP_LOGOUT_FAILURE:
      return Object.assign({}, state, {
        isLoggingOut: false
      })

    case types.APP_LOGOUT_REQUEST:
      return Object.assign({}, state, {
        isLoggingOut: true
      })

      // BUC

    case types.BUC_GET_BUCS_REQUEST:

      return Object.assign({}, state, {
        gettingBUCs: true,
        status: status
      })

    case types.BUC_GET_BUCS_SUCCESS:
    case types.BUC_GET_BUCS_FAILURE:

      return Object.assign({}, state, {
        gettingBUCs: false,
        status: status
      })

    case types.BUC_GET_BUCSINFO_REQUEST:

      return Object.assign({}, state, {
        gettingBUCinfo: true,
        status: status
      })

    case types.BUC_GET_BUCSINFO_SUCCESS:
    case types.BUC_GET_BUCSINFO_FAILURE:

      return Object.assign({}, state, {
        gettingBUCinfo: false,
        status: status
      })

    case types.BUC_VERIFY_CASE_NUMBER_REQUEST:

      return Object.assign({}, state, {
        verifyingCaseNumber: true,
        status: status
      })

    case types.BUC_VERIFY_CASE_NUMBER_SUCCESS:
    case types.BUC_VERIFY_CASE_NUMBER_FAILURE:

      return Object.assign({}, state, {
        verifyingCaseNumber: false,
        status: status
      })

    case types.BUC_GET_SUBJECT_AREA_LIST_REQUEST:

      return Object.assign({}, state, {
        gettingSubjectAreaList: true,
        status: status
      })

    case types.BUC_GET_SUBJECT_AREA_LIST_SUCCESS:
    case types.BUC_GET_SUBJECT_AREA_LIST_FAILURE:

      return Object.assign({}, state, {
        gettingSubjectAreaList: false,
        status: status
      })

    case types.BUC_GET_BUC_LIST_REQUEST:

      return Object.assign({}, state, {
        gettingBucList: true,
        status: status
      })

    case types.BUC_GET_BUC_LIST_SUCCESS:
    case types.BUC_GET_BUC_LIST_FAILURE:

      return Object.assign({}, state, {
        gettingBucList: false,
        status: status
      })

    case types.BUC_CREATE_BUC_REQUEST:

      return Object.assign({}, state, {
        creatingBUC: true,
        status: status
      })

    case types.BUC_CREATE_BUC_SUCCESS:
    case types.BUC_CREATE_BUC_FAILURE:

      return Object.assign({}, state, {
        creatingBUC: false,
        status: status
      })

    case types.BUC_SAVE_BUCSINFO_REQUEST:

      return Object.assign({}, state, {
        savingBUCinfo: true,
        status: status
      })

    case types.BUC_SAVE_BUCSINFO_SUCCESS:
    case types.BUC_SAVE_BUCSINFO_FAILURE:

      return Object.assign({}, state, {
        savingBUCinfo: false,
        status: status
      })

    case types.BUC_GET_SED_LIST_REQUEST:

      return Object.assign({}, state, {
        gettingSedList: true,
        status: status
      })

    case types.BUC_GET_SED_LIST_SUCCESS:
    case types.BUC_GET_SED_LIST_FAILURE:

      return Object.assign({}, state, {
        gettingSedList: false,
        status: status
      })

    case types.BUC_GET_COUNTRY_LIST_REQUEST:

      return Object.assign({}, state, {
        gettingCountryList: true,
        status: status
      })

    case types.BUC_GET_COUNTRY_LIST_SUCCESS:
    case types.BUC_GET_COUNTRY_LIST_FAILURE:

      return Object.assign({}, state, {
        gettingCountryList: false,
        status: status
      })

    case types.BUC_GET_INSTITUTION_LIST_REQUEST:

      return Object.assign({}, state, {
        institutionList: true,
        status: status
      })

    case types.BUC_GET_INSTITUTION_LIST_SUCCESS:
    case types.BUC_GET_INSTITUTION_LIST_FAILURE:

      return Object.assign({}, state, {
        institutionList: false,
        status: status
      })

    case types.BUC_CREATE_SED_REQUEST:

      return Object.assign({}, state, {
        creatingSed: true,
        status: status
      })

    case types.BUC_CREATE_SED_SUCCESS:
    case types.BUC_CREATE_SED_FAILURE:

      return Object.assign({}, state, {
        creatingSed: false,
        status: status
      })

    case types.RINA_GET_URL_REQUEST:

      return Object.assign({}, state, {
        rinaUrl: true,
        status: status
      })

    case types.RINA_GET_URL_SUCCESS:
    case types.RINA_GET_URL_FAILURE:

      return Object.assign({}, state, {
        rinaUrl: false,
        status: status
      })

      // JOARK

    case types.JOARK_LIST_REQUEST:

      return Object.assign({}, state, {
        loadingJoarkList: true,
        status: status
      })

    case types.JOARK_LIST_SUCCESS:
    case types.JOARK_LIST_FAILURE:

      return Object.assign({}, state, {
        loadingJoarkList: false,
        status: status
      })

    case types.JOARK_GET_REQUEST:

      return Object.assign({}, state, {
        loadingJoarkFile: true,
        status: status
      })

    case types.JOARK_GET_SUCCESS:
    case types.JOARK_GET_FAILURE:

      return Object.assign({}, state, {
        loadingJoarkFile: false,
        status: status
      })

      // PDF

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
