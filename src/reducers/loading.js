import * as types from 'constants/actionTypes'
import _ from 'lodash'

export const initialLoadingState = {
  creatingBUC: false,
  creatingSed: false,
  deletingStorageFile: false,
  generatingPDF: false,
  gettingBUCs: false,
  gettingBucList: false,
  gettingBUCinfo: false,
  gettingCountryList: false,
  gettingInstitutionList: false,
  gettingPersonInfo: false,
  gettingSedList: false,
  gettingSubjectAreaList: false,
  gettingUserInfo: false,
  isInvitingPinfo: false,
  isLoggingIn: false,
  isLoggingOut: false,
  isSendingPinfo: false,
  loadingJoarkList: false,
  loadingJoarkFile: false,
  loadingJoarkPreviewFile: false,
  loadingP4000list: false,
  loadingP4000info: false,
  loadingPDF: false,
  loadingStorageFile: false,
  loadingStorageFileList: false,
  rinaUrl: false,
  savingBucsInfo: false,
  savingStorageFile: false,
  status: undefined
}

const loadingReducer = (state = initialLoadingState, action = {}) => {
  let status

  if (_.endsWith(action.type, '/ERROR')) {
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

      return {
        ...state,
        gettingUserInfo: true,
        status: status
      }

    case types.APP_USERINFO_SUCCESS:
    case types.APP_USERINFO_FAILURE:

      return {
        ...state,
        gettingUserInfo: false,
        status: status
      }

    case types.APP_PERSONINFO_REQUEST:

      return {
        ...state,
        gettingPersonInfo: true,
        status: status
      }

    case types.APP_PERSONINFO_SUCCESS:
    case types.APP_PERSONINFO_FAILURE:

      return {
        ...state,
        gettingPersonInfo: false,
        status: status
      }

    case types.APP_LOGIN_REQUEST: {
      return {
        ...state,
        isLoggingIn: true,
        status: status
      }
    }

    case types.APP_LOGOUT_SUCCESS:
    case types.APP_LOGOUT_FAILURE:
      return {
        ...state,
        isLoggingOut: false,
        status: status
      }

    case types.APP_LOGOUT_REQUEST:
      return {
        ...state,
        isLoggingOut: true,
        status: status
      }

      // BUC

    case types.BUC_GET_BUCS_REQUEST:

      return {
        ...state,
        gettingBUCs: true,
        status: status
      }

    case types.BUC_GET_BUCS_SUCCESS:
    case types.BUC_GET_BUCS_FAILURE:

      return {
        ...state,
        gettingBUCs: false,
        status: status
      }

    case types.BUC_GET_BUCSINFO_REQUEST:

      return {
        ...state,
        gettingBUCinfo: true,
        status: status
      }

    case types.BUC_GET_BUCSINFO_SUCCESS:
    case types.BUC_GET_BUCSINFO_FAILURE:

      return {
        ...state,
        gettingBUCinfo: false,
        status: status
      }

    case types.BUC_GET_SUBJECT_AREA_LIST_REQUEST:

      return {
        ...state,
        gettingSubjectAreaList: true,
        status: status
      }

    case types.BUC_GET_SUBJECT_AREA_LIST_SUCCESS:
    case types.BUC_GET_SUBJECT_AREA_LIST_FAILURE:

      return {
        ...state,
        gettingSubjectAreaList: false,
        status: status
      }

    case types.BUC_GET_BUC_LIST_REQUEST:

      return {
        ...state,
        gettingBucList: true,
        status: status
      }

    case types.BUC_GET_BUC_LIST_SUCCESS:
    case types.BUC_GET_BUC_LIST_FAILURE:

      return {
        ...state,
        gettingBucList: false,
        status: status
      }

    case types.BUC_CREATE_BUC_REQUEST:

      return {
        ...state,
        creatingBUC: true,
        status: status
      }

    case types.BUC_CREATE_BUC_SUCCESS:
    case types.BUC_CREATE_BUC_FAILURE:

      return {
        ...state,
        creatingBUC: false,
        status: status
      }

    case types.BUC_SAVE_BUCSINFO_REQUEST:

      return {
        ...state,
        savingBucsInfo: true,
        status: status
      }

    case types.BUC_SAVE_BUCSINFO_SUCCESS:
    case types.BUC_SAVE_BUCSINFO_FAILURE:

      return {
        ...state,
        savingBucsInfo: false,
        status: status
      }

    case types.BUC_GET_SED_LIST_REQUEST:

      return {
        ...state,
        gettingSedList: true,
        status: status
      }

    case types.BUC_GET_SED_LIST_SUCCESS:
    case types.BUC_GET_SED_LIST_FAILURE:

      return {
        ...state,
        gettingSedList: false,
        status: status
      }

    case types.BUC_GET_COUNTRY_LIST_REQUEST:

      return {
        ...state,
        gettingCountryList: true,
        status: status
      }

    case types.BUC_GET_COUNTRY_LIST_SUCCESS:
    case types.BUC_GET_COUNTRY_LIST_FAILURE:

      return {
        ...state,
        gettingCountryList: false,
        status: status
      }

    case types.BUC_GET_INSTITUTION_LIST_REQUEST:

      return {
        ...state,
        gettingInstitutionList: true,
        status: status
      }

    case types.BUC_GET_INSTITUTION_LIST_SUCCESS:
    case types.BUC_GET_INSTITUTION_LIST_FAILURE:

      return {
        ...state,
        gettingInstitutionList: false,
        status: status
      }

    case types.BUC_CREATE_SED_REQUEST:

      return {
        ...state,
        creatingSed: true,
        status: status
      }

    case types.BUC_CREATE_SED_SUCCESS:
    case types.BUC_CREATE_SED_FAILURE:

      return {
        ...state,
        creatingSed: false,
        status: status
      }

    case types.BUC_RINA_GET_URL_REQUEST:

      return {
        ...state,
        rinaUrl: true,
        status: status
      }

    case types.BUC_RINA_GET_URL_SUCCESS:
    case types.BUC_RINA_GET_URL_FAILURE:

      return {
        ...state,
        rinaUrl: false,
        status: status
      }

    case types.BUC_GET_P4000_LIST_REQUEST:

      return {
        ...state,
        loadingP4000list: true,
        status: status
      }

    case types.BUC_GET_P4000_LIST_SUCCESS:
    case types.BUC_GET_P4000_LIST_FAILURE:

      return {
        ...state,
        loadingP4000list: false,
        status: status
      }

    case types.BUC_GET_P4000_INFO_REQUEST:

      return {
        ...state,
        loadingP4000info: true,
        status: status
      }

    case types.BUC_GET_P4000_INFO_SUCCESS:
    case types.BUC_GET_P4000_INFO_FAILURE:

      return {
        ...state,
        loadingP4000info: false,
        status: status
      }
      // JOARK

    case types.JOARK_LIST_REQUEST:

      return {
        ...state,
        loadingJoarkList: true,
        status: status
      }

    case types.JOARK_LIST_SUCCESS:
    case types.JOARK_LIST_FAILURE:

      return {
        ...state,
        loadingJoarkList: false,
        status: status
      }

    case types.JOARK_PREVIEW_REQUEST:

      return {
        ...state,
        loadingJoarkPreviewFile: true,
        status: status
      }

    case types.JOARK_PREVIEW_SUCCESS:
    case types.JOARK_PREVIEW_FAILURE:

      return {
        ...state,
        loadingJoarkPreviewFile: false,
        status: status
      }

    case types.JOARK_GET_REQUEST:

      return {
        ...state,
        loadingJoarkFile: true,
        status: status
      }

    case types.JOARK_GET_SUCCESS:
    case types.JOARK_GET_FAILURE:

      return {
        ...state,
        loadingJoarkFile: false,
        status: status
      }

      // PDF

    case types.PDF_GENERATE_REQUEST:

      return {
        ...state,
        generatingPDF: true,
        status: status
      }

    case types.PDF_GENERATE_SUCCESS:
    case types.PDF_GENERATE_FAILURE:

      return {
        ...state,
        generatingPDF: false,
        status: status
      }

    case types.PDF_LOADING_FILES_STARTED:

      return {
        ...state,
        loadingPDF: true,
        status: status
      }

    case types.PDF_LOADING_FILES_FINISHED:

      return {
        ...state,
        loadingPDF: false,
        status: 'OK'
      }

    case types.STORAGE_LIST_REQUEST:
    case types.STORAGE_LIST_NO_NOTIF_REQUEST:

      return {
        ...state,
        loadingStorageFileList: true,
        status: status
      }

    case types.STORAGE_LIST_SUCCESS:
    case types.STORAGE_LIST_NO_NOTIF_SUCCESS:
    case types.STORAGE_LIST_FAILURE:
    case types.STORAGE_LIST_NO_NOTIF_FAILURE:

      return {
        ...state,
        loadingStorageFileList: false,
        status: status
      }

    case types.STORAGE_GET_REQUEST:
    case types.STORAGE_GET_NO_NOTIF_REQUEST:

      return {
        ...state,
        loadingStorageFile: true,
        status: status
      }

    case types.STORAGE_GET_SUCCESS:
    case types.STORAGE_GET_NO_NOTIF_SUCCESS:
    case types.STORAGE_GET_FAILURE:
    case types.STORAGE_GET_NO_NOTIF_FAILURE:

      return {
        ...state,
        loadingStorageFile: false,
        status: status
      }

    case types.STORAGE_POST_REQUEST:
    case types.STORAGE_POST_NO_NOTIF_REQUEST:

      return {
        ...state,
        savingStorageFile: true,
        status: status
      }

    case types.STORAGE_POST_SUCCESS:
    case types.STORAGE_POST_NO_NOTIF_SUCCESS:
    case types.STORAGE_POST_FAILURE:
    case types.STORAGE_POST_NO_NOTIF_FAILURE:

      return {
        ...state,
        savingStorageFile: false,
        status: status
      }

    case types.STORAGE_DELETE_REQUEST:

      return {
        ...state,
        deletingStorageFile: true,
        status: status
      }

    case types.STORAGE_DELETE_SUCCESS:
    case types.STORAGE_DELETE_FAILURE:

      return {
        ...state,
        deletingStorageFile: false,
        status: status
      }

    case types.PINFO_SEND_SUCCESS:
    case types.PINFO_SEND_FAILURE:

      return {
        ...state,
        isSendingPinfo: false,
        status: status
      }

    case types.PINFO_SEND_REQUEST:

      return {
        ...state,
        isSendingPinfo: true,
        status: status
      }

    case types.PINFO_INVITE_SUCCESS:
    case types.PINFO_INVITE_FAILURE:

      return {
        ...state,
        isInvitingPinfo: false,
        status: status
      }

    case types.PINFO_INVITE_REQUEST:

      return {
        ...state,
        isInvitingPinfo: true,
        status: status
      }

    default:

      return state
  }
}

export default loadingReducer
