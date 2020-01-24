import * as types from 'constants/actionTypes'
import _ from 'lodash'
import { Action } from 'redux'

export interface LoadingState {
  [k: string]: boolean;
}

export const initialLoadingState: LoadingState = {
  creatingBUC: false,
  creatingSed: false,
  deletingStorageFile: false,
  generatingPDF: false,
  gettingBUCs: false,
  gettingAvdodBUCs: false,
  gettingBucList: false,
  gettingBUCinfo: false,
  gettingCountryList: false,
  gettingInstitutionList: false,
  gettingPersonInfo: false,
  gettingSakType: false,
  gettingSedList: false,
  gettingSubjectAreaList: false,
  gettingTagList: false,
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
  loadingStorageFile: false,
  loadingStorageFileList: false,
  rinaUrl: false,
  savingBucsInfo: false,
  savingStorageFile: false
}

const loadingReducer = (state: LoadingState = initialLoadingState, action: Action) => {
  if (_.endsWith(action.type, '/ERROR')) {
    return initialLoadingState
  }

  switch (action.type) {
  // APP

    case types.APP_USERINFO_REQUEST:

      return {
        ...state,
        gettingUserInfo: true
      }

    case types.APP_USERINFO_SUCCESS:
    case types.APP_USERINFO_FAILURE:

      return {
        ...state,
        gettingUserInfo: false
      }

    case types.APP_PERSONINFO_REQUEST:

      return {
        ...state,
        gettingPersonInfo: true
      }

    case types.APP_PERSONINFO_SUCCESS:
    case types.APP_PERSONINFO_FAILURE:

      return {
        ...state,
        gettingPersonInfo: false
      }

    case types.APP_SAKTYPE_REQUEST:

      return {
        ...state,
        gettingSakType: true
      }

    case types.APP_SAKTYPE_SUCCESS:
    case types.APP_SAKTYPE_FAILURE:

      return {
        ...state,
        gettingSakType: false
      }

    case types.APP_LOGIN_REQUEST: {
      return {
        ...state,
        isLoggingIn: true
      }
    }

    case types.APP_LOGOUT_SUCCESS:
    case types.APP_LOGOUT_FAILURE:
      return {
        ...state,
        isLoggingOut: false
      }

    case types.APP_LOGOUT_REQUEST:
      return {
        ...state,
        isLoggingOut: true
      }

      // BUC

    case types.BUC_GET_BUCS_REQUEST:

      return {
        ...state,
        gettingBUCs: true
      }

    case types.BUC_GET_BUCS_SUCCESS:
    case types.BUC_GET_BUCS_FAILURE:
      return {
        ...state,
        gettingBUCs: false
      }

    case types.BUC_GET_AVDOD_BUCS_REQUEST:

      return {
        ...state,
        gettingAvdodBUCs: true
      }

    case types.BUC_GET_AVDOD_BUCS_SUCCESS:
    case types.BUC_GET_AVDOD_BUCS_FAILURE:
      return {
        ...state,
        gettingAvdodBUCs: false
      }

    case types.BUC_GET_BUCSINFO_REQUEST:

      return {
        ...state,
        gettingBUCinfo: true
      }

    case types.BUC_GET_BUCSINFO_SUCCESS:
    case types.BUC_GET_BUCSINFO_FAILURE:

      return {
        ...state,
        gettingBUCinfo: false
      }

    case types.BUC_GET_SUBJECT_AREA_LIST_REQUEST:

      return {
        ...state,
        gettingSubjectAreaList: true
      }

    case types.BUC_GET_SUBJECT_AREA_LIST_SUCCESS:
    case types.BUC_GET_SUBJECT_AREA_LIST_FAILURE:

      return {
        ...state,
        gettingSubjectAreaList: false
      }

    case types.BUC_GET_BUC_LIST_REQUEST:

      return {
        ...state,
        gettingBucList: true
      }

    case types.BUC_GET_BUC_LIST_SUCCESS:
    case types.BUC_GET_BUC_LIST_FAILURE:

      return {
        ...state,
        gettingBucList: false
      }

    case types.BUC_CREATE_BUC_REQUEST:

      return {
        ...state,
        creatingBUC: true
      }

    case types.BUC_CREATE_BUC_SUCCESS:
    case types.BUC_CREATE_BUC_FAILURE:

      return {
        ...state,
        creatingBUC: false
      }

    case types.BUC_SAVE_BUCSINFO_REQUEST:

      return {
        ...state,
        savingBucsInfo: true
      }

    case types.BUC_SAVE_BUCSINFO_SUCCESS:
    case types.BUC_SAVE_BUCSINFO_FAILURE:

      return {
        ...state,
        savingBucsInfo: false
      }

    case types.BUC_GET_SED_LIST_REQUEST:

      return {
        ...state,
        gettingSedList: true
      }

    case types.BUC_GET_SED_LIST_SUCCESS:
    case types.BUC_GET_SED_LIST_FAILURE:

      return {
        ...state,
        gettingSedList: false
      }

    case types.BUC_GET_COUNTRY_LIST_REQUEST:

      return {
        ...state,
        gettingCountryList: true
      }

    case types.BUC_GET_COUNTRY_LIST_SUCCESS:
    case types.BUC_GET_COUNTRY_LIST_FAILURE:

      return {
        ...state,
        gettingCountryList: false
      }

    case types.BUC_GET_INSTITUTION_LIST_REQUEST:

      return {
        ...state,
        gettingInstitutionList: true
      }

    case types.BUC_GET_INSTITUTION_LIST_SUCCESS:
    case types.BUC_GET_INSTITUTION_LIST_FAILURE:

      return {
        ...state,
        gettingInstitutionList: false
      }

    case types.BUC_CREATE_SED_REQUEST:

      return {
        ...state,
        creatingSed: true
      }

    case types.BUC_CREATE_SED_SUCCESS:
    case types.BUC_CREATE_SED_FAILURE:

      return {
        ...state,
        creatingSed: false
      }

    case types.BUC_RINA_GET_URL_REQUEST:

      return {
        ...state,
        rinaUrl: true
      }

    case types.BUC_RINA_GET_URL_SUCCESS:
    case types.BUC_RINA_GET_URL_FAILURE:

      return {
        ...state,
        rinaUrl: false
      }

    case types.BUC_GET_P4000_LIST_REQUEST:

      return {
        ...state,
        loadingP4000list: true
      }

    case types.BUC_GET_P4000_LIST_SUCCESS:
    case types.BUC_GET_P4000_LIST_FAILURE:

      return {
        ...state,
        loadingP4000list: false
      }

    case types.BUC_GET_P4000_INFO_REQUEST:

      return {
        ...state,
        loadingP4000info: true
      }

    case types.BUC_GET_P4000_INFO_SUCCESS:
    case types.BUC_GET_P4000_INFO_FAILURE:

      return {
        ...state,
        loadingP4000info: false
      }
      // JOARK

    case types.JOARK_LIST_REQUEST:

      return {
        ...state,
        loadingJoarkList: true
      }

    case types.JOARK_LIST_SUCCESS:
    case types.JOARK_LIST_FAILURE:

      return {
        ...state,
        loadingJoarkList: false
      }

    case types.JOARK_PREVIEW_REQUEST:

      return {
        ...state,
        loadingJoarkPreviewFile: true
      }

    case types.JOARK_PREVIEW_SUCCESS:
    case types.JOARK_PREVIEW_FAILURE:

      return {
        ...state,
        loadingJoarkPreviewFile: false
      }

    case types.JOARK_GET_REQUEST:

      return {
        ...state,
        loadingJoarkFile: true
      }

    case types.JOARK_GET_SUCCESS:
    case types.JOARK_GET_FAILURE:

      return {
        ...state,
        loadingJoarkFile: false
      }

    case types.STORAGE_LIST_REQUEST:

      return {
        ...state,
        loadingStorageFileList: true
      }

    case types.STORAGE_LIST_SUCCESS:
    case types.STORAGE_LIST_FAILURE:

      return {
        ...state,
        loadingStorageFileList: false
      }

    case types.STORAGE_GET_REQUEST:

      return {
        ...state,
        loadingStorageFile: true
      }

    case types.STORAGE_GET_SUCCESS:
    case types.STORAGE_GET_FAILURE:

      return {
        ...state,
        loadingStorageFile: false
      }

    case types.STORAGE_POST_REQUEST:

      return {
        ...state,
        savingStorageFile: true
      }

    case types.STORAGE_POST_SUCCESS:
    case types.STORAGE_POST_FAILURE:

      return {
        ...state,
        savingStorageFile: false
      }

    case types.STORAGE_DELETE_REQUEST:

      return {
        ...state,
        deletingStorageFile: true
      }

    case types.STORAGE_DELETE_SUCCESS:
    case types.STORAGE_DELETE_FAILURE:

      return {
        ...state,
        deletingStorageFile: false
      }

    case types.PINFO_SEND_SUCCESS:
    case types.PINFO_SEND_FAILURE:

      return {
        ...state,
        isSendingPinfo: false
      }

    case types.PINFO_SEND_REQUEST:

      return {
        ...state,
        isSendingPinfo: true
      }

    case types.PINFO_INVITE_SUCCESS:
    case types.PINFO_INVITE_FAILURE:

      return {
        ...state,
        isInvitingPinfo: false
      }

    case types.PINFO_INVITE_REQUEST:

      return {
        ...state,
        isInvitingPinfo: true
      }

    default:

      return state
  }
}

export default loadingReducer
