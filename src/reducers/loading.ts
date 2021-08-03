import * as types from 'constants/actionTypes'
import { Action } from 'redux'

export interface LoadingState {
  [k: string]: boolean
}

export const initialLoadingState: LoadingState = {
  creatingBUC: false,
  creatingSed: false,
  generatingPDF: false,
  gettingBUCs: false,
  gettingBucDeltakere: false,
  gettingBucList: false,
  gettingBUCinfo: false,
  gettingCountryList: false,
  gettingKravDato: false,
  gettingInstitutionList: false,
  gettingPersonInfo: false,
  gettingPersonAvdodInfo: false,
  gettingP6000: false,
  gettingP6000PDF: false,
  gettingSakType: false,
  gettingSedList: false,
  gettingSubjectAreaList: false,
  gettingTagList: false,
  gettingUserInfo: false,
  isLoggingIn: false,
  isLoggingOut: false,
  loadingJoarkList: false,
  loadingJoarkPreviewFile: false,
  rinaUrl: false,
  savingBucsInfo: false,
  sendingP5000info: false
}

const loadingReducer = (state: LoadingState = initialLoadingState, action: Action = { type: '' }) => {
  switch (action.type) {
  // APP

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

    case types.APP_PERSONINFO_SUCCESS:
    case types.APP_PERSONINFO_FAILURE:

      return {
        ...state,
        gettingPersonInfo: false
      }

    case types.APP_PERSONINFO_REQUEST:

      return {
        ...state,
        gettingPersonInfo: true
      }

    case types.APP_PERSONINFO_AVDOD_REQUEST:

      return {
        ...state,
        gettingPersonAvdodInfo: true
      }

    case types.APP_PERSONINFO_AVDOD_SUCCESS:
    case types.APP_PERSONINFO_AVDOD_FAILURE:

      return {
        ...state,
        gettingPersonAvdodInfo: false
      }

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

    case types.P5000_SEND_REQUEST:

      return {
        ...state,
        sendingP5000info: true
      }

    case types.P5000_SEND_SUCCESS:
    case types.P5000_SEND_FAILURE:

      return {
        ...state,
        sendingP5000info: false
      }

      // BUC
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

    case types.BUC_GET_P6000_REQUEST:

      return {
        ...state,
        gettingP6000: true
      }

    case types.BUC_GET_P6000_SUCCESS:
    case types.BUC_GET_P6000_FAILURE:

      return {
        ...state,
        gettingP6000: false
      }

    case types.BUC_GET_P6000PDF_REQUEST:

      return {
        ...state,
        gettingP6000PDF: true
      }

    case types.BUC_GET_P6000PDF_SUCCESS:
    case types.BUC_GET_P6000PDF_FAILURE:

      return {
        ...state,
        gettingP6000PDF: false
      }

    case types.BUC_GET_KRAVDATO_REQUEST:
      return {
        ...state,
        gettingKravDato: true
      }

    case types.BUC_GET_KRAVDATO_FAILURE:
    case types.BUC_GET_KRAVDATO_SUCCESS:
      return {
        ...state,
        gettingKravDato: false
      }

    case types.BUC_GET_PARTICIPANTS_REQUEST:

      return {
        ...state,
        gettingBucDeltakere: true
      }

    case types.BUC_GET_PARTICIPANTS_SUCCESS:
    case types.BUC_GET_PARTICIPANTS_FAILURE:

      return {
        ...state,
        gettingBucDeltakere: false
      }

    case types.BUC_GET_SAKTYPE_REQUEST:

      return {
        ...state,
        gettingSakType: true
      }

    case types.BUC_GET_SAKTYPE_SUCCESS:
    case types.BUC_GET_SAKTYPE_FAILURE:

      return {
        ...state,
        gettingSakType: false
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

    default:

      return state
  }
}

export default loadingReducer
