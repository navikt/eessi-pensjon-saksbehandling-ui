import loadingReducer, { initialLoadingState } from './loading'
import * as types from 'src/constants/actionTypes'

describe('reducers/loading', () => {
  const simulate = (type: string, param: string, initialBool: boolean) => {
    expect(
      loadingReducer({
        ...initialLoadingState,
        [param]: initialBool
      }, {
        type
      })
    ).toEqual({
      ...initialLoadingState,
      [param]: !initialBool
    })
  }

  const simulateRequest = (type: string, param: string) => {
    return simulate(type, param, false)
  }

  const simulateSuccess = (type: string, param: string) => {
    return simulate(type, param, true)
  }

  const simulateFailure = (type: string, param: string) => {
    return simulate(type, param, true)
  }

  it('SOMETHING_ERROR', () => {
    expect(
      loadingReducer(initialLoadingState, {
        type: 'SOMETHING/ERROR'
      })
    ).toEqual(initialLoadingState)
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

  it('PERSON_PDL_REQUEST', () => {
    simulateRequest(types.PERSON_PDL_REQUEST, 'gettingPersonInfo')
  })

  it('PERSON_PDL_SUCCESS', () => {
    simulateSuccess(types.PERSON_PDL_SUCCESS, 'gettingPersonInfo')
  })

  it('PERSON_PDL_FAILURE', () => {
    simulateFailure(types.PERSON_PDL_FAILURE, 'gettingPersonInfo')
  })

  it('PERSON_AVDOD_REQUEST', () => {
    simulateRequest(types.PERSON_AVDOD_REQUEST, 'gettingPersonAvdodInfo')
  })

  it('PERSON_AVDOD_SUCCESS', () => {
    simulateSuccess(types.PERSON_AVDOD_SUCCESS, 'gettingPersonAvdodInfo')
  })

  it('PERSON_AVDOD_FAILURE', () => {
    simulateFailure(types.PERSON_AVDOD_FAILURE, 'gettingPersonAvdodInfo')
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

  it('BUC_CREATE_BUC_REQUEST', () => {
    simulateRequest(types.BUC_CREATE_BUC_REQUEST, 'creatingBUC')
  })

  it('BUC_CREATE_BUC_SUCCESS', () => {
    simulateSuccess(types.BUC_CREATE_BUC_SUCCESS, 'creatingBUC')
  })

  it('BUC_CREATE_BUC_FAILURE', () => {
    simulateFailure(types.BUC_CREATE_BUC_FAILURE, 'creatingBUC')
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

  it('BUC_GET_BUC_OPTIONS_REQUEST', () => {
    simulateRequest(types.BUC_GET_BUC_OPTIONS_REQUEST, 'gettingBucOptions')
  })

  it('BUC_GET_BUC_OPTIONS_SUCCESS', () => {
    simulateSuccess(types.BUC_GET_BUC_OPTIONS_SUCCESS, 'gettingBucOptions')
  })

  it('BUC_GET_BUC_OPTIONS_FAILURE', () => {
    simulateFailure(types.BUC_GET_BUC_OPTIONS_FAILURE, 'gettingBucOptions')
  })

  it('BUC_GET_BUCSLIST_REQUEST', () => {
    simulateRequest(types.BUC_GET_BUCSLIST_REQUEST, 'gettingBucsList')
  })

  it('BUC_GET_BUCSLIST_SUCCESS', () => {
    simulateSuccess(types.BUC_GET_BUCSLIST_SUCCESS, 'gettingBucsList')
  })

  it('BUC_GET_BUCSLIST_FAILURE', () => {
    simulateFailure(types.BUC_GET_BUCSLIST_FAILURE, 'gettingBucsList')
  })

  it('BUC_GET_BUCSINFO_REQUEST', () => {
    simulateRequest(types.BUC_GET_BUCSINFO_REQUEST, 'gettingBucsInfo')
  })

  it('BUC_GET_BUCSINFO_SUCCESS', () => {
    simulateSuccess(types.BUC_GET_BUCSINFO_SUCCESS, 'gettingBucsInfo')
  })

  it('BUC_GET_BUCSINFO_FAILURE', () => {
    simulateFailure(types.BUC_GET_BUCSINFO_FAILURE, 'gettingBucsInfo')
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

  it('BUC_GET_KRAVDATO_REQUEST', () => {
    simulateRequest(types.BUC_GET_KRAVDATO_REQUEST, 'gettingKravDato')
  })

  it('BUC_GET_KRAVDATO_SUCCESS', () => {
    simulateSuccess(types.BUC_GET_KRAVDATO_SUCCESS, 'gettingKravDato')
  })

  it('BUC_GET_KRAVDATO_FAILURE', () => {
    simulateFailure(types.BUC_GET_KRAVDATO_FAILURE, 'gettingKravDato')
  })

  it('BUC_GET_PARTICIPANTS_REQUEST', () => {
    simulateRequest(types.BUC_GET_PARTICIPANTS_REQUEST, 'gettingBucDeltakere')
  })

  it('BUC_GET_PARTICIPANTS_SUCCESS', () => {
    simulateSuccess(types.BUC_GET_PARTICIPANTS_SUCCESS, 'gettingBucDeltakere')
  })

  it('BUC_GET_PARTICIPANTS_FAILURE', () => {
    simulateFailure(types.BUC_GET_PARTICIPANTS_FAILURE, 'gettingBucDeltakere')
  })

  it('BUC_GET_SAKTYPE_REQUEST', () => {
    simulateRequest(types.BUC_GET_SAKTYPE_REQUEST, 'gettingSakType')
  })

  it('BUC_GET_SAKTYPE_SUCCESS', () => {
    simulateSuccess(types.BUC_GET_SAKTYPE_SUCCESS, 'gettingSakType')
  })

  it('BUC_GET_SAKTYPE_FAILURE', () => {
    simulateFailure(types.BUC_GET_SAKTYPE_FAILURE, 'gettingSakType')
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

  it('BUC_RINA_GET_URL_REQUEST', () => {
    simulateRequest(types.BUC_RINA_GET_URL_REQUEST, 'rinaUrl')
  })

  it('BUC_RINA_GET_URL_SUCCESS', () => {
    simulateSuccess(types.BUC_RINA_GET_URL_SUCCESS, 'rinaUrl')
  })

  it('BUC_RINA_GET_URL_FAILURE', () => {
    simulateFailure(types.BUC_RINA_GET_URL_FAILURE, 'rinaUrl')
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

  it('JOARK_LIST_REQUEST', () => {
    simulateRequest(types.JOARK_LIST_REQUEST, 'loadingJoarkList')
  })

  it('JOARK_LIST_SUCCESS', () => {
    simulateSuccess(types.JOARK_LIST_SUCCESS, 'loadingJoarkList')
  })

  it('JOARK_LIST_FAILURE', () => {
    simulateFailure(types.JOARK_LIST_FAILURE, 'loadingJoarkList')
  })

  it('UNKNOWN_ACTION', () => {
    expect(
      loadingReducer(initialLoadingState, {
        type: 'UNKNOWN_ACTION'
      })
    ).toEqual(initialLoadingState)
  })
})
