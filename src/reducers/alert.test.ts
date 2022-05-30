import alertReducer, { initialAlertState } from './alert'
import * as types from 'constants/actionTypes'

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
      serverErrorMessage: 'ui:serverInternalError',
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
      serverErrorMessage: 'ui:serverAuthenticationError',
      error: 'mockPayload'
    })
  })

  it('SOMETHING_ERROR', () => {
    expect(
      alertReducer(initialAlertState, {
        type: 'SOMETHING/ERROR',
        payload: {
          error: 'mockPayload'
        }
      })
    ).toEqual({
      ...initialAlertState,
      serverErrorMessage: 'ui:serverInternalError',
      error: 'mockPayload'
    })
  })

  it('BUC_CREATE_BUC_FAILURE', () => {
    expect(
      alertReducer(initialAlertState, {
        type: types.BUC_CREATE_BUC_FAILURE
      })
    ).toEqual({
      ...initialAlertState,
      clientErrorStatus: 'error',
      clientErrorMessage: 'message:alert-createBucFailure'
    })
  })

  it('BUC_CREATE_SED_FAILURE', () => {
    expect(
      alertReducer(initialAlertState, {
        type: types.BUC_CREATE_SED_FAILURE
      })
    ).toEqual({
      ...initialAlertState,
      clientErrorStatus: 'error',
      clientErrorMessage: 'message:alert-createSedFailure'
    })
  })

  it('BUC_GET_BUC_OPTIONS_FAILURE', () => {
    expect(
      alertReducer(initialAlertState, {
        type: types.BUC_GET_BUC_OPTIONS_FAILURE
      })
    ).toEqual({
      ...initialAlertState,
      clientErrorStatus: 'error',
      clientErrorMessage: 'message:alert-noBucOptions'
    })
  })

  it('BUC_GET_BUCSLIST_FAILURE', () => {
    expect(
      alertReducer(initialAlertState, {
        type: types.BUC_GET_BUCSLIST_FAILURE
      })
    ).toEqual({
      ...initialAlertState,
      clientErrorStatus: 'error',
      clientErrorMessage: 'message:alert-noBucs'
    })
  })

  it('BUC_GET_BUCSINFO_FAILURE', () => {
    expect(
      alertReducer(initialAlertState, {
        type: types.BUC_GET_BUCSINFO_FAILURE
      })
    ).toEqual({
      ...initialAlertState,
      clientErrorStatus: 'error',
      clientErrorMessage: 'message:alert-noBucsInfo'
    })
  })

  it('BUC_GET_BUCSINFO_LIST_FAILURE', () => {
    expect(
      alertReducer(initialAlertState, {
        type: types.BUC_GET_BUCSINFO_LIST_FAILURE
      })
    ).toEqual({
      ...initialAlertState,
      clientErrorStatus: 'error',
      clientErrorMessage: 'message:alert-noBucsListInfo'
    })
  })

  it('BUC_GET_COUNTRY_LIST_FAILURE', () => {
    expect(
      alertReducer(initialAlertState, {
        type: types.BUC_GET_COUNTRY_LIST_FAILURE
      })
    ).toEqual({
      ...initialAlertState,
      clientErrorStatus: 'error',
      clientErrorMessage: 'message:alert-noCountryList'
    })
  })

  it('BUC_GET_INSTITUTION_LIST_FAILURE', () => {
    expect(
      alertReducer(initialAlertState, {
        type: types.BUC_GET_INSTITUTION_LIST_FAILURE
      })
    ).toEqual({
      ...initialAlertState,
      clientErrorStatus: 'error',
      clientErrorMessage: 'message:alert-noInstitutionList'
    })
  })

  it('BUC_GET_SED_LIST_FAILURE', () => {
    expect(
      alertReducer(initialAlertState, {
        type: types.BUC_GET_SED_LIST_FAILURE
      })
    ).toEqual({
      ...initialAlertState,
      clientErrorStatus: 'error',
      clientErrorMessage: 'message:alert-noSedList'
    })
  })

  it('BUC_GET_TAG_LIST_FAILURE', () => {
    expect(
      alertReducer(initialAlertState, {
        type: types.BUC_GET_TAG_LIST_FAILURE
      })
    ).toEqual({
      ...initialAlertState,
      clientErrorStatus: 'error',
      clientErrorMessage: 'message:alert-noTagList'
    })
  })

  it('BUC_SAVE_BUCSINFO_FAILURE', () => {
    expect(
      alertReducer(initialAlertState, {
        type: types.BUC_SAVE_BUCSINFO_FAILURE
      })
    ).toEqual({
      ...initialAlertState,
      clientErrorStatus: 'error',
      clientErrorMessage: 'message:alert-saveBucsInfoFailure'
    })
  })

  it('BUC_SEND_ATTACHMENT_FAILURE', () => {
    expect(
      alertReducer(initialAlertState, {
        type: types.BUC_SEND_ATTACHMENT_FAILURE
      })
    ).toEqual({
      ...initialAlertState,
      clientErrorStatus: 'error',
      clientErrorMessage: 'message:alert-createAttachmentFailure'
    })
  })

  it('JOARK_LIST_FAILURE', () => {
    expect(
      alertReducer(initialAlertState, {
        type: types.JOARK_LIST_FAILURE
      })
    ).toEqual({
      ...initialAlertState,
      clientErrorStatus: 'error',
      clientErrorMessage: 'message:alert-joarkListFailure'
    })
  })

  it('JOARK_PREVIEW_FAILURE', () => {
    expect(
      alertReducer(initialAlertState, {
        type: types.JOARK_PREVIEW_FAILURE
      })
    ).toEqual({
      ...initialAlertState,
      clientErrorStatus: 'error',
      clientErrorMessage: 'message:alert-joarkPreviewFailure'
    })
  })

  it('SOMETHING/FAILURE', () => {
    expect(
      alertReducer(initialAlertState, {
        type: 'SOMETHING/FAILURE'
      })
    ).toEqual({
      ...initialAlertState,
      clientErrorStatus: 'error',
      clientErrorMessage: 'ui:error'
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
      clientErrorStatus: 'OK',
      clientErrorParam: {
        type: 'mockType'
      },
      clientErrorMessage: 'message:alert-createdBuc'
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
      clientErrorStatus: 'OK',
      clientErrorParam: {
        message: '',
        sed: 'mockType'
      },
      clientErrorMessage: 'message:alert-createdSed'
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
      clientErrorStatus: 'OK',
      clientErrorParam: {
        message: '',
        sed: 'mockType'
      },
      clientErrorMessage: 'message:alert-createdSed'
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
