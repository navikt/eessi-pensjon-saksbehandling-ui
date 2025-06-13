import alertReducer, { initialAlertState } from './alert'
import * as types from 'src/constants/actionTypes'
import i18n from "i18next";

describe('reducers/alert', () => {
  it('ALERT_CLIENT_CLEAR', () => {
    expect(
      alertReducer(initialAlertState, {
        type: types.ALERT_CLEAR,
        payload: 'mockPayload'
      })
    ).toEqual({
      ...initialAlertState
    })
  })

  it('SERVER_INTERNAL_ERROR', () => {
    expect(
      alertReducer(initialAlertState, {
        type: types.SERVER_INTERNAL_ERROR,
        payload: {
          error: 'mockPayload'
        }
      })
    ).toEqual({
      ...initialAlertState,
      type: types.SERVER_INTERNAL_ERROR,
      bannerStatus : 'error',
      bannerMessage: i18n.t('ui:serverInternalError'),
      error: 'mockPayload'
    })
  })

  it('SERVER_UNAUTHORIZED_ERROR', () => {
    expect(
      alertReducer(initialAlertState, {
        type: types.SERVER_UNAUTHORIZED_ERROR,
        payload: {
          error: 'mockPayload'
        }
      })
    ).toEqual({
      ...initialAlertState,
      type: types.SERVER_UNAUTHORIZED_ERROR,
      bannerStatus : 'error',
      bannerMessage: i18n.t('ui:serverAuthenticationError'),
      error: 'mockPayload'
    })
  })

  it('SOMETHING_ERROR', () => {
    expect(
      alertReducer(initialAlertState, {
        type: 'SOMETHING/ERROR',
        payload: {
          message: 'mockErrorMessagePayload'
        }
      })
    ).toEqual({
      ...initialAlertState,
      type: "SOMETHING/ERROR",
      bannerStatus : 'error',
      bannerMessage: 'mockErrorMessagePayload',
    })
  })

  it('BUC_CREATE_BUC_FAILURE', () => {
    expect(
      alertReducer(initialAlertState, {
        type: types.BUC_CREATE_BUC_FAILURE
      })
    ).toEqual({
      ...initialAlertState,
      type: types.BUC_CREATE_BUC_FAILURE,
      stripeStatus : 'error',
      stripeMessage : i18n.t('message:alert-createBucFailure'),
      bannerStatus: 'error',
      bannerMessage: i18n.t('message:alert-createBucFailure'),
      error: i18n.t('ui:error')
    })
  })

  it('BUC_CREATE_SED_FAILURE', () => {
    expect(
      alertReducer(initialAlertState, {
        type: types.BUC_CREATE_SED_FAILURE
      })
    ).toEqual({
      ...initialAlertState,
      type: types.BUC_CREATE_SED_FAILURE,
      stripeStatus : 'error',
      stripeMessage : i18n.t('message:alert-createSedFailure'),
      bannerStatus: 'error',
      bannerMessage: i18n.t('message:alert-createSedFailure'),
      error: i18n.t('ui:error')
    })
  })

  it('BUC_GET_BUC_OPTIONS_FAILURE', () => {
    expect(
      alertReducer(initialAlertState, {
        type: types.BUC_GET_BUC_OPTIONS_FAILURE
      })
    ).toEqual({
      ...initialAlertState,
      type: types.BUC_GET_BUC_OPTIONS_FAILURE,
      stripeStatus : 'error',
      stripeMessage : i18n.t('message:alert-noBucOptions'),
      bannerStatus: 'error',
      bannerMessage: i18n.t('message:alert-noBucOptions'),
      error: i18n.t('ui:error')
    })
  })

  it('BUC_GET_BUCSLIST_FAILURE', () => {
    expect(
      alertReducer(initialAlertState, {
        type: types.BUC_GET_BUCSLIST_FAILURE
      })
    ).toEqual({
      ...initialAlertState,
      type: types.BUC_GET_BUCSLIST_FAILURE,
      stripeStatus : 'error',
      stripeMessage : i18n.t('message:alert-noBucs'),
      bannerStatus: 'error',
      bannerMessage: i18n.t('message:alert-noBucs'),
      error: i18n.t('ui:error')
    })
  })

  it('BUC_GET_BUCSINFO_FAILURE', () => {
    expect(
      alertReducer(initialAlertState, {
        type: types.BUC_GET_BUCSINFO_FAILURE
      })
    ).toEqual({
      ...initialAlertState,
      type: types.BUC_GET_BUCSINFO_FAILURE,
      stripeStatus : 'error',
      stripeMessage : i18n.t('message:alert-noBucsInfo'),
      bannerStatus: 'error',
      bannerMessage: i18n.t('message:alert-noBucsInfo'),
      error: i18n.t('ui:error')
    })
  })

  it('BUC_GET_BUCSINFO_LIST_FAILURE', () => {
    expect(
      alertReducer(initialAlertState, {
        type: types.BUC_GET_BUCSINFO_LIST_FAILURE
      })
    ).toEqual({
      ...initialAlertState,
      type: types.BUC_GET_BUCSINFO_LIST_FAILURE,
      stripeStatus : 'error',
      stripeMessage : i18n.t('message:alert-noBucsListInfo'),
      bannerStatus: 'error',
      bannerMessage: i18n.t('message:alert-noBucsListInfo'),
      error: i18n.t('ui:error')
    })
  })

  it('BUC_GET_COUNTRY_LIST_FAILURE', () => {
    expect(
      alertReducer(initialAlertState, {
        type: types.BUC_GET_COUNTRY_LIST_FAILURE
      })
    ).toEqual({
      ...initialAlertState,
      type: types.BUC_GET_COUNTRY_LIST_FAILURE,
      stripeStatus : 'error',
      stripeMessage : i18n.t('message:alert-noCountryList'),
      bannerStatus: 'error',
      bannerMessage: i18n.t('message:alert-noCountryList'),
      error: i18n.t('ui:error')
    })
  })

  it('BUC_GET_INSTITUTION_LIST_FAILURE', () => {
    expect(
      alertReducer(initialAlertState, {
        type: types.BUC_GET_INSTITUTION_LIST_FAILURE
      })
    ).toEqual({
      ...initialAlertState,
      type: types.BUC_GET_INSTITUTION_LIST_FAILURE,
      stripeStatus : 'error',
      stripeMessage : i18n.t('message:alert-noInstitutionList'),
      bannerStatus: 'error',
      bannerMessage: i18n.t('message:alert-noInstitutionList'),
      error: i18n.t('ui:error')
    })
  })

  it('BUC_GET_SED_LIST_FAILURE', () => {
    expect(
      alertReducer(initialAlertState, {
        type: types.BUC_GET_SED_LIST_FAILURE
      })
    ).toEqual({
      ...initialAlertState,
      type: types.BUC_GET_SED_LIST_FAILURE,
      stripeStatus : 'error',
      stripeMessage : i18n.t('message:alert-noSedList'),
      bannerStatus: 'error',
      bannerMessage: i18n.t('message:alert-noSedList'),
      error: i18n.t('ui:error')
    })
  })

  it('BUC_GET_TAG_LIST_FAILURE', () => {
    expect(
      alertReducer(initialAlertState, {
        type: types.BUC_GET_TAG_LIST_FAILURE
      })
    ).toEqual({
      ...initialAlertState,
      type: types.BUC_GET_TAG_LIST_FAILURE,
      stripeStatus : 'error',
      stripeMessage : i18n.t('message:alert-noTagList'),
      bannerStatus: 'error',
      bannerMessage: i18n.t('message:alert-noTagList'),
      error: i18n.t('ui:error')
    })
  })

  it('BUC_SAVE_BUCSINFO_FAILURE', () => {
    expect(
      alertReducer(initialAlertState, {
        type: types.BUC_SAVE_BUCSINFO_FAILURE
      })
    ).toEqual({
      ...initialAlertState,
      type: types.BUC_SAVE_BUCSINFO_FAILURE,
      stripeStatus : 'error',
      stripeMessage : i18n.t('message:alert-saveBucsInfoFailure'),
      bannerStatus: 'error',
      bannerMessage: i18n.t('message:alert-saveBucsInfoFailure'),
      error: i18n.t('ui:error')
    })
  })

  it('BUC_SEND_ATTACHMENT_FAILURE', () => {
    expect(
      alertReducer(initialAlertState, {
        type: types.BUC_SEND_ATTACHMENT_FAILURE
      })
    ).toEqual({
      ...initialAlertState,
      type: types.BUC_SEND_ATTACHMENT_FAILURE,
      stripeStatus : 'error',
      stripeMessage : i18n.t('message:alert-createAttachmentFailure'),
      bannerStatus: 'error',
      bannerMessage: i18n.t('message:alert-createAttachmentFailure'),
      error: i18n.t('ui:error')
    })
  })

  it('JOARK_LIST_FAILURE', () => {
    expect(
      alertReducer(initialAlertState, {
        type: types.JOARK_LIST_FAILURE
      })
    ).toEqual({
      ...initialAlertState,
      type: types.JOARK_LIST_FAILURE,
      stripeStatus : 'error',
      stripeMessage : i18n.t('message:alert-joarkListFailure'),
      bannerStatus: 'error',
      bannerMessage: i18n.t('message:alert-joarkListFailure'),
      error: i18n.t('ui:error')
    })
  })

  it('JOARK_PREVIEW_FAILURE', () => {
    expect(
      alertReducer(initialAlertState, {
        type: types.JOARK_PREVIEW_FAILURE
      })
    ).toEqual({
      ...initialAlertState,
      type: types.JOARK_PREVIEW_FAILURE,
      stripeStatus : 'error',
      stripeMessage : i18n.t('message:alert-joarkPreviewFailure'),
      bannerStatus: 'error',
      bannerMessage: i18n.t('message:alert-joarkPreviewFailure'),
      error: i18n.t('ui:error')
    })
  })

  it('SOMETHING/FAILURE', () => {
    expect(
      alertReducer(initialAlertState, {
        type: 'SOMETHING/FAILURE'
      })
    ).toEqual({
      ...initialAlertState,
      type: 'SOMETHING/FAILURE',
      stripeStatus : 'error',
      stripeMessage : i18n.t('ui:error'),
      bannerStatus: 'error',
      bannerMessage: i18n.t('ui:error'),
      error: i18n.t('ui:error')
    })
  })

  it('BUC_CREATE_BUC_SUCCESS', () => {
    expect(
      alertReducer(initialAlertState, {
        type: types.BUC_CREATE_BUC_SUCCESS,
        payload: {
          type: 'mockType'
        }
      })
    ).toEqual({
      ...initialAlertState,
      type: types.BUC_CREATE_BUC_SUCCESS,
      bannerStatus: 'success',
      bannerMessage: i18n.t('message:alert-createdBuc'),
    })
  })

  it('BUC_CREATE_SED_SUCCESS', () => {
    expect(
      alertReducer(initialAlertState, {
        type: types.BUC_CREATE_SED_SUCCESS,
        payload: {
          type: 'mockType'
        }
      })
    ).toEqual({
      ...initialAlertState,
      type: types.BUC_CREATE_SED_SUCCESS,
      bannerStatus: 'success',
      bannerMessage: i18n.t('message:alert-createdSed')
    })
  })

  it('BUC_CREATE_REPLY_SED_SUCCESS', () => {
    expect(
      alertReducer(initialAlertState, {
        type: types.BUC_CREATE_REPLY_SED_SUCCESS,
        payload: {
          type: 'mockType'
        }
      })
    ).toEqual({
      ...initialAlertState,
      type: types.BUC_CREATE_REPLY_SED_SUCCESS,
      bannerStatus: 'success',
      bannerMessage: i18n.t('message:alert-createdSed')
    })
  })

  it('UNKNOWN_ACTION', () => {
    expect(
      alertReducer(initialAlertState, {
        type: 'UNKNOWN_ACTION'
      })
    ).toEqual({
      ...initialAlertState
    })
  })
})
