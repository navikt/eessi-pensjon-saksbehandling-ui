import * as types from 'src/constants/actionTypes'
import { AnyAction } from 'redux'

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
  gettingInstitutionList: false,
  gettingPersonInfo: false,
  gettingAktoerId: false,
  gettingPersonAvdodInfo: false,
  gettingPersonAvdodAktoerId: false,
  gettingP4000: false,
  gettingP6000: false,
  gettingP6000PDF: false,
  gettingSakType: false,
  gettingSedList: false,
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
  sendingP5000info: false,
  gettingP5000FromS3: false,
  sendingP5000ToS3: false,
  savingSed: false,
  gettingSed: false,
}

const loadingReducer = (state: LoadingState = initialLoadingState, action: AnyAction) => {
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

    case types.PERSON_AVDOD_FROM_AKTOERID_REQUEST:
      return{
        ...state,
        gettingPersonAvdodAktoerId: true
      }

    case types.PERSON_AVDOD_FROM_AKTOERID_SUCCESS:
    case types.PERSON_AVDOD_FROM_AKTOERID_FAILURE:
      return{
        ...state,
        gettingPersonAvdodAktoerId: false
      }

    case types.PERSON_AKTOERID_REQUEST:
      return{
        ...state,
        gettingAktoerId: true
      }

    case types.PERSON_AKTOERID_SUCCESS:
    case types.PERSON_AKTOERID_FAILURE:
      return{
        ...state,
        gettingAktoerId: false
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

    case types.P5000_PESYS_GET_REQUEST:

      return {
        ...state,
        gettingP5000FromS3: true
      }

    case types.P5000_PESYS_GET_SUCCESS:
    case types.P5000_PESYS_GET_FAILURE:

      return {
        ...state,
        gettingP5000FromS3: false
      }

    case types.P5000_PESYS_SEND_REQUEST:

      return {
        ...state,
        sendingP5000ToS3: true
      }

    case types.P5000_PESYS_SEND_SUCCESS:
    case types.P5000_PESYS_SEND_FAILURE:

      return {
        ...state,
        sendingP5000ToS3: false
      }

      // BUC
    case types.BUC_CREATE_BUC_REQUEST:
    case types.GJENNY_CREATE_BUC_REQUEST:
      return {
        ...state,
        creatingBUC: true
      }

    case types.BUC_CREATE_BUC_SUCCESS:
    case types.BUC_CREATE_BUC_FAILURE:
    case types.GJENNY_CREATE_BUC_SUCCESS:
    case types.GJENNY_CREATE_BUC_FAILURE:
      return {
        ...state,
        creatingBUC: false
      }

    case types.BUC_CREATE_SED_REQUEST:
    case types.BUC_CREATE_REPLY_SED_REQUEST:
    case types.GJENNY_CREATE_SED_REQUEST:
    case types.GJENNY_CREATE_REPLY_SED_REQUEST:
      return {
        ...state,
        creatingSed: true
      }

    case types.BUC_CREATE_SED_SUCCESS:
    case types.BUC_CREATE_SED_FAILURE:
    case types.BUC_CREATE_REPLY_SED_SUCCESS:
    case types.BUC_CREATE_REPLY_SED_FAILURE:
    case types.GJENNY_CREATE_SED_SUCCESS:
    case types.GJENNY_CREATE_SED_FAILURE:
    case types.GJENNY_CREATE_REPLY_SED_SUCCESS:
    case types.GJENNY_CREATE_REPLY_SED_FAILURE:

      return {
        ...state,
        creatingSed: false
      }

    case types.BUC_GET_BUC_OPTIONS_REQUEST:
    case types.GJENNY_GET_BUC_OPTIONS_REQUEST:

      return {
        ...state,
        gettingBucOptions: true
      }

    case types.BUC_GET_BUC_OPTIONS_SUCCESS:
    case types.BUC_GET_BUC_OPTIONS_FAILURE:
    case types.GJENNY_GET_BUC_OPTIONS_SUCCESS:
    case types.GJENNY_GET_BUC_OPTIONS_FAILURE:

      return {
        ...state,
        gettingBucOptions: false
      }

    case types.BUC_GET_BUCSLIST_REQUEST:
    case types.GJENNY_GET_BUCSLIST_FOR_GJENLEVENDE_REQUEST:
      return {
        ...state,
        gettingBucsList: true
      }

    case types.BUC_GET_BUCSLIST_SUCCESS:
    case types.BUC_GET_BUCSLIST_FAILURE:
    case types.GJENNY_GET_BUCSLIST_FOR_GJENLEVENDE_SUCCESS:
    case types.GJENNY_GET_BUCSLIST_FOR_GJENLEVENDE_FAILURE:
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

    case types.BUC_GET_P4000_REQUEST:
      return {
        ...state,
        gettingP4000: true
      }

    case types.BUC_GET_P4000_SUCCESS:
    case types.BUC_GET_P4000_FAILURE:
      return {
        ...state,
        gettingP4000: false
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

    case types.BUC_GET_SED_REQUEST:

      return {
        ...state,
        gettingSed: true
      }

    case types.BUC_GET_SED_SUCCESS:
    case types.BUC_GET_SED_FAILURE:

      return {
        ...state,
        gettingSed: false
      }

    case types.BUC_PUT_SED_REQUEST:

      return {
        ...state,
        savingSed: true
      }

    case types.BUC_PUT_SED_SUCCESS:
    case types.BUC_PUT_SED_FAILURE:

      return {
        ...state,
        savingSed: false
      }

    default:

      return state
  }
}

export default loadingReducer
