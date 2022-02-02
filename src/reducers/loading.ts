import * as types from 'constants/actionTypes'
import { Action } from 'redux'

export interface LoadingState {
  [k: string]: boolean
}

export const initialLoadingState: LoadingState = {
  creatingBUC: false,
  creatingSed: false,
  generatingPDF: false,
  gettingBucsList: false,
  gettingBucs: false,
  gettingBuc: false,
  gettingBucDeltakere: false,
  gettingBucOptions: false,
  gettingBucsInfo: false,
  gettingCountryList: false,
  gettingKravDato: false,
  gettingJournalføringSed: false,
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
  gettingUft: false,
  gettingGjpBp: false,
  isLoggingIn: false,
  isLoggingOut: false,
  loadingJoarkList: false,
  loadingJoarkPreviewFile: false,
  rinaUrl: false,
  savingBucsInfo: false,
  sendingJournalføringSend: false,
  sendingPageNotification: false,
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

    case types.PERSON_PDL_SUCCESS:
    case types.PERSON_PDL_FAILURE:

      return {
        ...state,
        gettingPersonInfo: false
      }

    case types.PERSON_PDL_REQUEST:

      return {
        ...state,
        gettingPersonInfo: true
      }

    case types.PERSON_AVDOD_REQUEST:

      return {
        ...state,
        gettingPersonAvdodInfo: true
      }

    case types.PERSON_AVDOD_SUCCESS:
    case types.PERSON_AVDOD_FAILURE:

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

    case types.BUC_GET_BUC_OPTIONS_REQUEST:

      return {
        ...state,
        gettingBucOptions: true
      }

    case types.BUC_GET_BUC_OPTIONS_SUCCESS:
    case types.BUC_GET_BUC_OPTIONS_FAILURE:

      return {
        ...state,
        gettingBucOptions: false
      }

    case types.BUC_GET_BUCSLIST_REQUEST:

      return {
        ...state,
        gettingBucsList: true
      }

    case types.BUC_GET_BUCSLIST_SUCCESS:
    case types.BUC_GET_BUCSLIST_FAILURE:
      return {
        ...state,
        gettingBucsList: false
      }

    case types.BUC_GET_BUCS_START:

      return {
        ...state,
        gettingBucs: true
      }

    case types.BUC_GET_BUCS_END:
      return {
        ...state,
        gettingBucs: false
      }

    case types.BUC_GET_BUC_REQUEST:

      return {
        ...state,
        gettingBuc: true
      }

    case types.BUC_GET_BUC_SUCCESS:
    case types.BUC_GET_BUC_FAILURE:
      return {
        ...state,
        gettingBuc: false
      }

    case types.BUC_GET_BUCSINFO_REQUEST:

      return {
        ...state,
        gettingBucsInfo: true
      }

    case types.BUC_GET_BUCSINFO_SUCCESS:
    case types.BUC_GET_BUCSINFO_FAILURE:

      return {
        ...state,
        gettingBucsInfo: false
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

    case types.JOURNALFØRING_SED_GET_REQUEST:

      return {
        ...state,
        gettingJournalføringSed: true
      }

    case types.JOURNALFØRING_SED_GET_FAILURE:
    case types.JOURNALFØRING_SED_GET_SUCCESS:

      return {
        ...state,
        gettingJournalføringSed: false
      }

    case types.JOURNALFØRING_SED_SEND_REQUEST:

      return {
        ...state,
        sendingJournalføringSend: true
      }

    case types.JOURNALFØRING_SED_SEND_FAILURE:
    case types.JOURNALFØRING_SED_SEND_SUCCESS:

      return {
        ...state,
        sendingJournalføringSend: false
      }

    case types.PAGE_NOTIFICATION_SET_REQUEST:

      return {
        ...state,
        sendingPageNotification: true
      }

    case types.PAGE_NOTIFICATION_SET_SUCCESS:
    case types.PAGE_NOTIFICATION_SET_FAILURE:

      return {
        ...state,
        sendingPageNotification: false
      }

    case types.PERSON_UFT_REQUEST:

      return {
        ...state,
        gettingUft: true
      }

    case types.PERSON_UFT_SUCCESS:
    case types.PERSON_UFT_FAILURE:

      return {
        ...state,
        gettingUft: false
      }

    case types.PERSON_GJP_BP_REQUEST:

      return {
        ...state,
        gettingGjpBp: true
      }

    case types.PERSON_GJP_BP_SUCCESS:
    case types.PERSON_GJP_BP_FAILURE:

      return {
        ...state,
        gettingGjpBp: false
      }

    default:

      return state
  }
}

export default loadingReducer
