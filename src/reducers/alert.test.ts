import alertReducer, { initialAlertState } from './alert'
import * as types from 'constants/actionTypes'

describe('reducers/alert', () => {
  it('ALERT_CLIENT_CLEAR', () => {
    expect(
      alertReducer(initialAlertState, {
        type: types.ALERT_CLIENT_CLEAR,
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

  it('BUC_GET_BUCS_FAILURE', () => {
    expect(
      alertReducer(initialAlertState, {
        type: types.BUC_GET_BUCS_FAILURE
      })
    ).toEqual({
      ...initialAlertState,
      clientErrorStatus: 'ERROR',
      clientErrorMessage: 'buc:alert-noBucs'
    })
  })

  it('BUC_GET_BUCSINFO_LIST_FAILURE', () => {
    expect(
      alertReducer(initialAlertState, {
        type: types.BUC_GET_BUCSINFO_LIST_FAILURE
      })
    ).toEqual({
      ...initialAlertState,
      clientErrorStatus: 'ERROR',
      clientErrorMessage: 'buc:alert-noBucsListInfo'
    })
  })

  it('BUC_GET_BUCSINFO_FAILURE', () => {
    expect(
      alertReducer(initialAlertState, {
        type: types.BUC_GET_BUCSINFO_FAILURE
      })
    ).toEqual({
      ...initialAlertState,
      clientErrorStatus: 'ERROR',
      clientErrorMessage: 'buc:alert-noBucsInfo'
    })
  })

  it('BUC_GET_SUBJECT_AREA_LIST_FAILURE', () => {
    expect(
      alertReducer(initialAlertState, {
        type: types.BUC_GET_SUBJECT_AREA_LIST_FAILURE
      })
    ).toEqual({
      ...initialAlertState,
      clientErrorStatus: 'ERROR',
      clientErrorMessage: 'buc:alert-noSubjectAreaList'
    })
  })

  it('BUC_GET_BUC_LIST_FAILURE', () => {
    expect(
      alertReducer(initialAlertState, {
        type: types.BUC_GET_BUC_LIST_FAILURE
      })
    ).toEqual({
      ...initialAlertState,
      clientErrorStatus: 'ERROR',
      clientErrorMessage: 'buc:alert-noBucList'
    })
  })

  it('BUC_GET_TAG_LIST_FAILURE', () => {
    expect(
      alertReducer(initialAlertState, {
        type: types.BUC_GET_TAG_LIST_FAILURE
      })
    ).toEqual({
      ...initialAlertState,
      clientErrorStatus: 'ERROR',
      clientErrorMessage: 'buc:alert-noTagList'
    })
  })

  it('BUC_GET_INSTITUTION_LIST_FAILURE', () => {
    expect(
      alertReducer(initialAlertState, {
        type: types.BUC_GET_INSTITUTION_LIST_FAILURE
      })
    ).toEqual({
      ...initialAlertState,
      clientErrorStatus: 'ERROR',
      clientErrorMessage: 'buc:alert-noInstitutionList'
    })
  })

  it('BUC_GET_SED_LIST_FAILURE', () => {
    expect(
      alertReducer(initialAlertState, {
        type: types.BUC_GET_SED_LIST_FAILURE
      })
    ).toEqual({
      ...initialAlertState,
      clientErrorStatus: 'ERROR',
      clientErrorMessage: 'buc:alert-noSedList'
    })
  })

  it('BUC_GET_COUNTRY_LIST_FAILURE', () => {
    expect(
      alertReducer(initialAlertState, {
        type: types.BUC_GET_COUNTRY_LIST_FAILURE
      })
    ).toEqual({
      ...initialAlertState,
      clientErrorStatus: 'ERROR',
      clientErrorMessage: 'buc:alert-noCountryList'
    })
  })

  it('BUC_CREATE_BUC_FAILURE', () => {
    expect(
      alertReducer(initialAlertState, {
        type: types.BUC_CREATE_BUC_FAILURE
      })
    ).toEqual({
      ...initialAlertState,
      clientErrorStatus: 'ERROR',
      clientErrorMessage: 'buc:alert-createBucFailure'
    })
  })

  it('BUC_CREATE_SED_FAILURE', () => {
    expect(
      alertReducer(initialAlertState, {
        type: types.BUC_CREATE_SED_FAILURE
      })
    ).toEqual({
      ...initialAlertState,
      clientErrorStatus: 'ERROR',
      clientErrorMessage: 'buc:alert-createSedFailure'
    })
  })

  it('BUC_SEND_ATTACHMENT_FAILURE', () => {
    expect(
      alertReducer(initialAlertState, {
        type: types.BUC_SEND_ATTACHMENT_FAILURE
      })
    ).toEqual({
      ...initialAlertState,
      clientErrorStatus: 'ERROR',
      clientErrorMessage: 'buc:alert-createAttachmentFailure'
    })
  })

  it('BUC_SAVE_BUCSINFO_FAILURE', () => {
    expect(
      alertReducer(initialAlertState, {
        type: types.BUC_SAVE_BUCSINFO_FAILURE
      })
    ).toEqual({
      ...initialAlertState,
      clientErrorStatus: 'ERROR',
      clientErrorMessage: 'buc:alert-saveBucsInfoFailure'
    })
  })

  it('JOARK_LIST_FAILURE', () => {
    expect(
      alertReducer(initialAlertState, {
        type: types.JOARK_LIST_FAILURE
      })
    ).toEqual({
      ...initialAlertState,
      clientErrorStatus: 'ERROR',
      clientErrorMessage: 'buc:alert-joarkListFailure'
    })
  })

  it('JOARK_PREVIEW_FAILURE', () => {
    expect(
      alertReducer(initialAlertState, {
        type: types.JOARK_PREVIEW_FAILURE
      })
    ).toEqual({
      ...initialAlertState,
      clientErrorStatus: 'ERROR',
      clientErrorMessage: 'buc:alert-joarkPreviewFailure'
    })
  })

  it('STORAGE_LIST_FAILURE', () => {
    expect(
      alertReducer(initialAlertState, {
        type: types.STORAGE_LIST_FAILURE
      })
    ).toEqual({
      ...initialAlertState,
      clientErrorStatus: 'ERROR',
      clientErrorMessage: 'ui:listFailure'
    })
  })

  it('STORAGE_GET_FAILURE', () => {
    expect(
      alertReducer(initialAlertState, {
        type: types.STORAGE_GET_FAILURE
      })
    ).toEqual({
      ...initialAlertState,
      clientErrorStatus: 'ERROR',
      clientErrorMessage: 'ui:loadFailure'
    })
  })

  it('PINFO_SEND_FAILURE', () => {
    expect(
      alertReducer(initialAlertState, {
        type: types.PINFO_SEND_FAILURE
      })
    ).toEqual({
      ...initialAlertState,
      clientErrorStatus: 'ERROR',
      clientErrorMessage: 'pinfo:alert-sendFailure'
    })
  })

  it('SOMETHING/FAILURE', () => {
    expect(
      alertReducer(initialAlertState, {
        type: 'SOMETHING/FAILURE'
      })
    ).toEqual({
      ...initialAlertState,
      clientErrorStatus: 'ERROR',
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
      clientErrorMessage: 'buc:alert-createdBuc|mockType'
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
      clientErrorMessage: 'buc:alert-createdSed|mockType'
    })
  })

  it('STORAGE_GET_SUCCESS', () => {
    expect(
      alertReducer(initialAlertState, {
        type: types.STORAGE_GET_SUCCESS,
        context: { notification: true }
      })
    ).toEqual({
      ...initialAlertState,
      clientErrorStatus: 'OK',
      clientErrorMessage: 'ui:loadSuccess'
    })
  })

  it('STORAGE_POST_SUCCESS', () => {
    expect(
      alertReducer(initialAlertState, {
        type: types.STORAGE_POST_SUCCESS,
        context: { notification: true }
      })
    ).toEqual({
      ...initialAlertState,
      clientErrorStatus: 'OK',
      clientErrorMessage: 'ui:saveSuccess'
    })
  })

  it('PINFO_SEND_SUCCESS', () => {
    expect(
      alertReducer(initialAlertState, {
        type: types.PINFO_SEND_SUCCESS
      })
    ).toEqual({
      ...initialAlertState,
      clientErrorStatus: 'OK',
      clientErrorMessage: 'pinfo:alert-sendSuccess'
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
