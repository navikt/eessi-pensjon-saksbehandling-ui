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
      bannerMessage: i18n.t('message:alert-createBucFailure')
    })
  })

  it('BUC_CREATE_SED_FAILURE', () => {
    expect(
      alertReducer(initialAlertState, {
        type: types.BUC_CREATE_SED_FAILURE
      })
    ).toEqual({
      ...initialAlertState,
      bannerStatus: 'error',
      bannerMessage: 'message:alert-createSedFailure'
    })
  })

  it('BUC_GET_BUC_OPTIONS_FAILURE', () => {
    expect(
      alertReducer(initialAlertState, {
        type: types.BUC_GET_BUC_OPTIONS_FAILURE
      })
    ).toEqual({
      ...initialAlertState,
      bannerStatus: 'error',
      bannerMessage: 'message:alert-noBucOptions'
    })
  })

  it('BUC_GET_BUCSLIST_FAILURE', () => {
    expect(
      alertReducer(initialAlertState, {
        type: types.BUC_GET_BUCSLIST_FAILURE
      })
    ).toEqual({
      ...initialAlertState,
      bannerStatus: 'error',
      bannerMessage: 'message:alert-noBucs'
    })
  })

  it('BUC_GET_BUCSINFO_FAILURE', () => {
    expect(
      alertReducer(initialAlertState, {
        type: types.BUC_GET_BUCSINFO_FAILURE
      })
    ).toEqual({
      ...initialAlertState,
      bannerStatus: 'error',
      bannerMessage: 'message:alert-noBucsInfo'
    })
  })

  it('BUC_GET_BUCSINFO_LIST_FAILURE', () => {
    expect(
      alertReducer(initialAlertState, {
        type: types.BUC_GET_BUCSINFO_LIST_FAILURE
      })
    ).toEqual({
      ...initialAlertState,
      bannerStatus: 'error',
      bannerMessage: 'message:alert-noBucsListInfo'
    })
  })

  it('BUC_GET_COUNTRY_LIST_FAILURE', () => {
    expect(
      alertReducer(initialAlertState, {
        type: types.BUC_GET_COUNTRY_LIST_FAILURE
      })
    ).toEqual({
      ...initialAlertState,
      bannerStatus: 'error',
      bannerMessage: 'message:alert-noCountryList'
    })
  })

  it('BUC_GET_INSTITUTION_LIST_FAILURE', () => {
    expect(
      alertReducer(initialAlertState, {
        type: types.BUC_GET_INSTITUTION_LIST_FAILURE
      })
    ).toEqual({
      ...initialAlertState,
      bannerStatus: 'error',
      bannerMessage: 'message:alert-noInstitutionList'
    })
  })

  it('BUC_GET_SED_LIST_FAILURE', () => {
    expect(
      alertReducer(initialAlertState, {
        type: types.BUC_GET_SED_LIST_FAILURE
      })
    ).toEqual({
      ...initialAlertState,
      bannerStatus: 'error',
      bannerMessage: 'message:alert-noSedList'
    })
  })

  it('BUC_GET_TAG_LIST_FAILURE', () => {
    expect(
      alertReducer(initialAlertState, {
        type: types.BUC_GET_TAG_LIST_FAILURE
      })
    ).toEqual({
      ...initialAlertState,
      bannerStatus: 'error',
      bannerMessage: 'message:alert-noTagList'
    })
  })

  it('BUC_SAVE_BUCSINFO_FAILURE', () => {
    expect(
      alertReducer(initialAlertState, {
        type: types.BUC_SAVE_BUCSINFO_FAILURE
      })
    ).toEqual({
      ...initialAlertState,
      bannerStatus: 'error',
      bannerMessage: 'message:alert-saveBucsInfoFailure'
    })
  })

  it('BUC_SEND_ATTACHMENT_FAILURE', () => {
    expect(
      alertReducer(initialAlertState, {
        type: types.BUC_SEND_ATTACHMENT_FAILURE
      })
    ).toEqual({
      ...initialAlertState,
      bannerStatus: 'error',
      bannerMessage: 'message:alert-createAttachmentFailure'
    })
  })

  it('JOARK_LIST_FAILURE', () => {
    expect(
      alertReducer(initialAlertState, {
        type: types.JOARK_LIST_FAILURE
      })
    ).toEqual({
      ...initialAlertState,
      bannerStatus: 'error',
      bannerMessage: 'message:alert-joarkListFailure'
    })
  })

  it('JOARK_PREVIEW_FAILURE', () => {
    expect(
      alertReducer(initialAlertState, {
        type: types.JOARK_PREVIEW_FAILURE
      })
    ).toEqual({
      ...initialAlertState,
      bannerStatus: 'error',
      bannerMessage: 'message:alert-joarkPreviewFailure'
    })
  })

  it('SOMETHING/FAILURE', () => {
    expect(
      alertReducer(initialAlertState, {
        type: 'SOMETHING/FAILURE'
      })
    ).toEqual({
      ...initialAlertState,
      bannerStatus: 'error',
      bannerMessage: 'ui:error'
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
      bannerStatus: 'OK',
/*      clientErrorParam: {
        type: 'mockType'
      },*/
      bannerMessage: 'message:alert-createdBuc'
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
      bannerStatus: 'OK',
/*      clientErrorParam: {
        message: '',
        sed: 'mockType'
      },*/
      bannerMessage: 'message:alert-createdSed'
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
      /*     clientErrorStatus: 'OK',
           clientErrorParam: {
             message: '',
             sed: 'mockType'
           },*/
      bannerMessage: 'message:alert-createdSed'
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
