import alertReducer, { initialAlertState } from './alert.js'
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
        payload: 'mockPayload'
      })
    ).toEqual({
      serverErrorMessage: 'ui:serverInternalError',
      error: 'mockPayload'
    })
  })

  it('SERVER_UNAUTHORIZED_ERROR', () => {
    expect(
      alertReducer(initialAlertState, {
        type: types.SERVER_UNAUTHORIZED_ERROR,
        payload: 'mockPayload'
      })
    ).toEqual({
      serverErrorMessage: 'ui:serverAuthenticationError',
      error: 'mockPayload'
    })
  })

  it('SOMETHING_ERROR', () => {
    expect(
      alertReducer(initialAlertState, {
        type: 'SOMETHING/ERROR',
        payload: 'mockPayload'
      })
    ).toEqual({
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
      clientErrorStatus: 'ERROR',
      clientErrorMessage: 'buc:alert-createSedFailure'
    })
  })

  it('BUC_SED_ATTACHMENT_FAILURE', () => {
    expect(
      alertReducer(initialAlertState, {
        type: types.BUC_SED_ATTACHMENT_FAILURE
      })
    ).toEqual({
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
      clientErrorStatus: 'ERROR',
      clientErrorMessage: 'buc:alert-saveBucsInfoFailure'
    })
  })

  it('BUC_GET_P4000_LIST_FAILURE', () => {
    expect(
      alertReducer(initialAlertState, {
        type: types.BUC_GET_P4000_LIST_FAILURE
      })
    ).toEqual({
      clientErrorStatus: 'ERROR',
      clientErrorMessage: 'buc:alert-getP4000ListFailure'
    })
  })

  it('BUC_GET_P4000_INFO_FAILURE', () => {
    expect(
      alertReducer(initialAlertState, {
        type: types.BUC_GET_P4000_INFO_FAILURE
      })
    ).toEqual({
      clientErrorStatus: 'ERROR',
      clientErrorMessage: 'buc:alert-getP4000InfoFailure'
    })
  })

  it('JOARK_LIST_FAILURE', () => {
    expect(
      alertReducer(initialAlertState, {
        type: types.JOARK_LIST_FAILURE
      })
    ).toEqual({
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
      clientErrorStatus: 'ERROR',
      clientErrorMessage: 'buc:alert-joarkPreviewFailure'
    })
  })

  it('JOARK_GET_FAILURE', () => {
    expect(
      alertReducer(initialAlertState, {
        type: types.JOARK_GET_FAILURE
      })
    ).toEqual({
      clientErrorStatus: 'ERROR',
      clientErrorMessage: 'buc:alert-joarkGetFailure'
    })
  })

  it('PDF_GENERATE_FAILURE', () => {
    expect(
      alertReducer(initialAlertState, {
        type: types.PDF_GENERATE_FAILURE
      })
    ).toEqual({
      clientErrorStatus: 'ERROR',
      clientErrorMessage: 'pdf:alert-PDFGenerationFail'
    })
  })

  it('STORAGE_LIST_FAILURE', () => {
    expect(
      alertReducer(initialAlertState, {
        type: types.STORAGE_LIST_FAILURE
      })
    ).toEqual({
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
      clientErrorStatus: 'OK',
      clientErrorMessage: 'buc:alert-createdSed|mockType'
    })
  })

  it('PDF_GENERATE_SUCCESS', () => {
    expect(
      alertReducer(initialAlertState, {
        type: types.PDF_GENERATE_SUCCESS
      })
    ).toEqual({
      clientErrorStatus: 'OK',
      clientErrorMessage: 'pdf:alert-PDFGenerationSuccess'
    })
  })

  it('STORAGE_GET_SUCCESS', () => {
    expect(
      alertReducer(initialAlertState, {
        type: types.STORAGE_GET_SUCCESS
      })
    ).toEqual({
      clientErrorStatus: 'OK',
      clientErrorMessage: 'ui:loadSuccess'
    })
  })

  it('STORAGE_POST_SUCCESS', () => {
    expect(
      alertReducer(initialAlertState, {
        type: types.STORAGE_POST_SUCCESS
      })
    ).toEqual({
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
      clientErrorStatus: 'OK',
      clientErrorMessage: 'pinfo:alert-sendSuccess'
    })
  })
})
