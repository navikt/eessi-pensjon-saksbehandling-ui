import loadingReducer, { initialLoadingState } from './loading'
import * as types from 'constants/actionTypes'

describe('reducers/loading', () => {
  const simulate = (type, param, initialBool, status) => {
    expect(
      loadingReducer({
        ...initialLoadingState,
        [param]: initialBool
      }, {
        type: type
      })
    ).toEqual({
      ...initialLoadingState,
      [param]: !initialBool,
      status: status
    })
  }

  const simulateRequest = (type, param) => {
    return simulate(type, param, false, undefined)
  }

  const simulateSuccess = (type, param) => {
    return simulate(type, param, true, 'OK')
  }

  const simulateFailure = (type, param) => {
    return simulate(type, param, true, 'ERROR')
  }

  it('SOMETHING_ERROR', () => {
    expect(
      loadingReducer({}, {
        type: 'SOMETHING/ERROR'
      })
    ).toEqual(initialLoadingState)
  })

  it('APP_USERINFO_REQUEST', () => {
    simulateRequest(types.APP_USERINFO_REQUEST, 'gettingUserInfo')
  })

  it('APP_USERINFO_SUCCESS', () => {
    simulateSuccess(types.APP_USERINFO_SUCCESS, 'gettingUserInfo')
  })

  it('APP_USERINFO_FAILURE', () => {
    simulateFailure(types.APP_USERINFO_FAILURE, 'gettingUserInfo')
  })

  it('APP_PERSONINFO_REQUEST', () => {
    simulateRequest(types.APP_PERSONINFO_REQUEST, 'gettingPersonInfo')
  })

  it('APP_PERSONINFO_SUCCESS', () => {
    simulateSuccess(types.APP_PERSONINFO_SUCCESS, 'gettingPersonInfo')
  })

  it('APP_PERSONINFO_FAILURE', () => {
    simulateFailure(types.APP_PERSONINFO_FAILURE, 'gettingPersonInfo')
  })

  it('APP_SAKTYPE_REQUEST', () => {
    simulateRequest(types.APP_SAKTYPE_REQUEST, 'gettingSakType')
  })

  it('APP_SAKTYPE_SUCCESS', () => {
    simulateSuccess(types.APP_SAKTYPE_SUCCESS, 'gettingSakType')
  })

  it('APP_SAKTYPE_FAILURE', () => {
    simulateFailure(types.APP_SAKTYPE_FAILURE, 'gettingSakType')
  })

  it('APP_LOGIN_REQUEST', () => {
    simulateRequest(types.APP_LOGIN_REQUEST, 'isLoggingIn')
  })

  it('APP_LOGOUT_REQUEST', () => {
    simulateRequest(types.APP_LOGOUT_REQUEST, 'isLoggingOut')
  })

  it('APP_LOGOUT_SUCCESS', () => {
    simulateSuccess(types.APP_LOGOUT_SUCCESS, 'isLoggingOut')
  })

  it('APP_LOGOUT_FAILURE', () => {
    simulateFailure(types.APP_LOGOUT_FAILURE, 'isLoggingOut')
  })

  it('BUC_GET_BUCS_REQUEST', () => {
    simulateRequest(types.BUC_GET_BUCS_REQUEST, 'gettingBUCs')
  })

  it('BUC_GET_BUCS_SUCCESS', () => {
    simulateSuccess(types.BUC_GET_BUCS_SUCCESS, 'gettingBUCs')
  })

  it('BUC_GET_BUCS_FAILURE', () => {
    simulateFailure(types.BUC_GET_BUCS_FAILURE, 'gettingBUCs')
  })

  it('BUC_GET_AVDOD_BUCS_REQUEST', () => {
    simulateRequest(types.BUC_GET_AVDOD_BUCS_REQUEST, 'gettingAvdodBUCs')
  })

  it('BUC_GET_AVDOD_BUCS_SUCCESS', () => {
    simulateSuccess(types.BUC_GET_AVDOD_BUCS_SUCCESS, 'gettingAvdodBUCs')
  })

  it('BUC_GET_AVDOD_BUCS_FAILURE', () => {
    simulateFailure(types.BUC_GET_AVDOD_BUCS_FAILURE, 'gettingAvdodBUCs')
  })

  it('BUC_GET_BUCSINFO_REQUEST', () => {
    simulateRequest(types.BUC_GET_BUCSINFO_REQUEST, 'gettingBUCinfo')
  })

  it('BUC_GET_BUCSINFO_SUCCESS', () => {
    simulateSuccess(types.BUC_GET_BUCSINFO_SUCCESS, 'gettingBUCinfo')
  })

  it('BUC_GET_BUCSINFO_FAILURE', () => {
    simulateFailure(types.BUC_GET_BUCSINFO_FAILURE, 'gettingBUCinfo')
  })

  it('BUC_GET_SUBJECT_AREA_LIST_REQUEST', () => {
    simulateRequest(types.BUC_GET_SUBJECT_AREA_LIST_REQUEST, 'gettingSubjectAreaList')
  })

  it('BUC_GET_SUBJECT_AREA_LIST_SUCCESS', () => {
    simulateSuccess(types.BUC_GET_SUBJECT_AREA_LIST_SUCCESS, 'gettingSubjectAreaList')
  })

  it('BUC_GET_SUBJECT_AREA_LIST_FAILURE', () => {
    simulateFailure(types.BUC_GET_SUBJECT_AREA_LIST_FAILURE, 'gettingSubjectAreaList')
  })

  it('BUC_GET_BUC_LIST_REQUEST', () => {
    simulateRequest(types.BUC_GET_BUC_LIST_REQUEST, 'gettingBucList')
  })

  it('BUC_GET_BUC_LIST_SUCCESS', () => {
    simulateSuccess(types.BUC_GET_BUC_LIST_SUCCESS, 'gettingBucList')
  })

  it('BUC_GET_BUC_LIST_FAILURE', () => {
    simulateFailure(types.BUC_GET_BUC_LIST_FAILURE, 'gettingBucList')
  })

  it('BUC_CREATE_BUC_REQUEST', () => {
    simulateRequest(types.BUC_CREATE_BUC_REQUEST, 'creatingBUC')
  })

  it('BUC_CREATE_BUC_SUCCESS', () => {
    simulateSuccess(types.BUC_CREATE_BUC_SUCCESS, 'creatingBUC')
  })

  it('BUC_CREATE_BUC_FAILURE', () => {
    simulateFailure(types.BUC_CREATE_BUC_FAILURE, 'creatingBUC')
  })

  it('BUC_SAVE_BUCSINFO_REQUEST', () => {
    simulateRequest(types.BUC_SAVE_BUCSINFO_REQUEST, 'savingBucsInfo')
  })

  it('BUC_SAVE_BUCSINFO_SUCCESS', () => {
    simulateSuccess(types.BUC_SAVE_BUCSINFO_SUCCESS, 'savingBucsInfo')
  })

  it('BUC_SAVE_BUCSINFO_FAILURE', () => {
    simulateFailure(types.BUC_SAVE_BUCSINFO_FAILURE, 'savingBucsInfo')
  })

  it('BUC_GET_SED_LIST_REQUEST', () => {
    simulateRequest(types.BUC_GET_SED_LIST_REQUEST, 'gettingSedList')
  })

  it('BUC_GET_SED_LIST_SUCCESS', () => {
    simulateSuccess(types.BUC_GET_SED_LIST_SUCCESS, 'gettingSedList')
  })

  it('BUC_GET_SED_LIST_FAILURE', () => {
    simulateFailure(types.BUC_GET_SED_LIST_FAILURE, 'gettingSedList')
  })

  it('BUC_GET_COUNTRY_LIST_REQUEST', () => {
    simulateRequest(types.BUC_GET_COUNTRY_LIST_REQUEST, 'gettingCountryList')
  })

  it('BUC_GET_COUNTRY_LIST_SUCCESS', () => {
    simulateSuccess(types.BUC_GET_COUNTRY_LIST_SUCCESS, 'gettingCountryList')
  })

  it('BUC_GET_COUNTRY_LIST_FAILURE', () => {
    simulateFailure(types.BUC_GET_COUNTRY_LIST_FAILURE, 'gettingCountryList')
  })

  it('BUC_GET_INSTITUTION_LIST_REQUEST', () => {
    simulateRequest(types.BUC_GET_INSTITUTION_LIST_REQUEST, 'gettingInstitutionList')
  })

  it('BUC_GET_INSTITUTION_LIST_SUCCESS', () => {
    simulateSuccess(types.BUC_GET_INSTITUTION_LIST_SUCCESS, 'gettingInstitutionList')
  })

  it('BUC_GET_INSTITUTION_LIST_FAILURE', () => {
    simulateFailure(types.BUC_GET_INSTITUTION_LIST_FAILURE, 'gettingInstitutionList')
  })

  it('BUC_CREATE_SED_REQUEST', () => {
    simulateRequest(types.BUC_CREATE_SED_REQUEST, 'creatingSed')
  })

  it('BUC_CREATE_SED_SUCCESS', () => {
    simulateSuccess(types.BUC_CREATE_SED_SUCCESS, 'creatingSed')
  })

  it('BUC_CREATE_SED_FAILURE', () => {
    simulateFailure(types.BUC_CREATE_SED_FAILURE, 'creatingSed')
  })

  it('BUC_RINA_GET_URL_REQUEST', () => {
    simulateRequest(types.BUC_RINA_GET_URL_REQUEST, 'rinaUrl')
  })

  it('BUC_RINA_GET_URL_SUCCESS', () => {
    simulateSuccess(types.BUC_RINA_GET_URL_SUCCESS, 'rinaUrl')
  })

  it('BUC_RINA_GET_URL_FAILURE', () => {
    simulateFailure(types.BUC_RINA_GET_URL_FAILURE, 'rinaUrl')
  })

  it('BUC_GET_P4000_LIST_REQUEST', () => {
    simulateRequest(types.BUC_GET_P4000_LIST_REQUEST, 'loadingP4000list')
  })

  it('BUC_GET_P4000_LIST_SUCCESS', () => {
    simulateSuccess(types.BUC_GET_P4000_LIST_SUCCESS, 'loadingP4000list')
  })

  it('BUC_GET_P4000_LIST_FAILURE', () => {
    simulateFailure(types.BUC_GET_P4000_LIST_FAILURE, 'loadingP4000list')
  })

  it('BUC_GET_P4000_INFO_REQUEST', () => {
    simulateRequest(types.BUC_GET_P4000_INFO_REQUEST, 'loadingP4000info')
  })

  it('BUC_GET_P4000_INFO_SUCCESS', () => {
    simulateSuccess(types.BUC_GET_P4000_INFO_SUCCESS, 'loadingP4000info')
  })

  it('BUC_GET_P4000_INFO_FAILURE', () => {
    simulateFailure(types.BUC_GET_P4000_INFO_FAILURE, 'loadingP4000info')
  })

  it('JOARK_LIST_REQUEST', () => {
    simulateRequest(types.JOARK_LIST_REQUEST, 'loadingJoarkList')
  })

  it('JOARK_LIST_SUCCESS', () => {
    simulateSuccess(types.JOARK_LIST_SUCCESS, 'loadingJoarkList')
  })

  it('JOARK_LIST_FAILURE', () => {
    simulateFailure(types.JOARK_LIST_FAILURE, 'loadingJoarkList')
  })

  it('JOARK_PREVIEW_REQUEST', () => {
    simulateRequest(types.JOARK_PREVIEW_REQUEST, 'loadingJoarkPreviewFile')
  })

  it('JOARK_PREVIEW_SUCCESS', () => {
    simulateSuccess(types.JOARK_PREVIEW_SUCCESS, 'loadingJoarkPreviewFile')
  })

  it('JOARK_PREVIEW_FAILURE', () => {
    simulateFailure(types.JOARK_PREVIEW_FAILURE, 'loadingJoarkPreviewFile')
  })

  it('JOARK_GET_REQUEST', () => {
    simulateRequest(types.JOARK_GET_REQUEST, 'loadingJoarkFile')
  })

  it('JOARK_GET_SUCCESS', () => {
    simulateSuccess(types.JOARK_GET_SUCCESS, 'loadingJoarkFile')
  })

  it('JOARK_GET_FAILURE', () => {
    simulateFailure(types.JOARK_GET_FAILURE, 'loadingJoarkFile')
  })

  it('STORAGE_LIST_REQUEST', () => {
    simulateRequest(types.STORAGE_LIST_REQUEST, 'loadingStorageFileList')
  })

  it('STORAGE_LIST_SUCCESS', () => {
    simulateSuccess(types.STORAGE_LIST_SUCCESS, 'loadingStorageFileList')
  })

  it('STORAGE_LIST_FAILURE', () => {
    simulateFailure(types.STORAGE_LIST_FAILURE, 'loadingStorageFileList')
  })

  it('STORAGE_GET_REQUEST', () => {
    simulateRequest(types.STORAGE_GET_REQUEST, 'loadingStorageFile')
  })

  it('STORAGE_GET_SUCCESS', () => {
    simulateSuccess(types.STORAGE_GET_SUCCESS, 'loadingStorageFile')
  })

  it('STORAGE_GET_FAILURE', () => {
    simulateFailure(types.STORAGE_GET_FAILURE, 'loadingStorageFile')
  })

  it('STORAGE_POST_REQUEST', () => {
    simulateRequest(types.STORAGE_POST_REQUEST, 'savingStorageFile')
  })

  it('STORAGE_POST_SUCCESS', () => {
    simulateSuccess(types.STORAGE_POST_SUCCESS, 'savingStorageFile')
  })

  it('STORAGE_POST_FAILURE', () => {
    simulateFailure(types.STORAGE_POST_FAILURE, 'savingStorageFile')
  })

  it('STORAGE_DELETE_REQUEST', () => {
    simulateRequest(types.STORAGE_DELETE_REQUEST, 'deletingStorageFile')
  })

  it('STORAGE_DELETE_SUCCESS', () => {
    simulateSuccess(types.STORAGE_DELETE_SUCCESS, 'deletingStorageFile')
  })

  it('STORAGE_DELETE_FAILURE', () => {
    simulateFailure(types.STORAGE_DELETE_FAILURE, 'deletingStorageFile')
  })

  it('PINFO_SEND_REQUEST', () => {
    simulateRequest(types.PINFO_SEND_REQUEST, 'isSendingPinfo')
  })

  it('PINFO_SEND_SUCCESS', () => {
    simulateSuccess(types.PINFO_SEND_SUCCESS, 'isSendingPinfo')
  })

  it('PINFO_SEND_FAILURE', () => {
    simulateFailure(types.PINFO_SEND_FAILURE, 'isSendingPinfo')
  })

  it('PINFO_INVITE_REQUEST', () => {
    simulateRequest(types.PINFO_INVITE_REQUEST, 'isInvitingPinfo')
  })

  it('PINFO_INVITE_SUCCESS', () => {
    simulateSuccess(types.PINFO_INVITE_SUCCESS, 'isInvitingPinfo')
  })

  it('PINFO_INVITE_FAILURE', () => {
    simulateFailure(types.PINFO_INVITE_FAILURE, 'isInvitingPinfo')
  })
})
