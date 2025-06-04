import * as types from 'src/constants/actionTypes'
import adminReducer, {initialAdminState} from "src/reducers/admin";

describe('reducers/admin', () => {
  it('ADMIN_RESET_SUCCESS_MSG', () => {
    expect(
      adminReducer(initialAdminState, {
        type: types.ADMIN_RESET_SUCCESS_MSG
      })
    ).toEqual({
      ...initialAdminState,
      resendingDocumentSuccess: false,
      resendingDocumentListSuccess: false
    })
  })

  it('ADMIN_RESEND_DOCUMENT_REQUEST', () => {
    expect(
      adminReducer(initialAdminState, {
        type: types.ADMIN_RESEND_DOCUMENT_REQUEST
      })
    ).toEqual({
      ...initialAdminState,
      resendingDocument: true,
      resendingDocumentSuccess: false,
    })
  })

  it('ADMIN_RESEND_DOCUMENT_SUCCESS', () => {
    expect(
      adminReducer(initialAdminState, {
        type: types.ADMIN_RESEND_DOCUMENT_SUCCESS
      })
    ).toEqual({
      ...initialAdminState,
      resendingDocument: false,
      resendingDocumentSuccess: true
    })
  })

  it('ADMIN_RESEND_DOCUMENT_FAILURE', () => {
    expect(
      adminReducer(initialAdminState, {
        type: types.ADMIN_RESEND_DOCUMENT_FAILURE
      })
    ).toEqual({
      ...initialAdminState,
      resendingDocument: false,
      resendingDocumentSuccess: false
    })
  })

  it('ADMIN_RESEND_DOCUMENT_LIST_REQUEST', () => {
    expect(
      adminReducer(initialAdminState, {
        type: types.ADMIN_RESEND_DOCUMENT_LIST_REQUEST
      })
    ).toEqual({
      ...initialAdminState,
      resendingDocumentList: true,
      resendingDocumentListSuccess: false,
    })
  })

  it('ADMIN_RESEND_DOCUMENT_LIST_SUCCESS', () => {
    expect(
      adminReducer(initialAdminState, {
        type: types.ADMIN_RESEND_DOCUMENT_LIST_SUCCESS
      })
    ).toEqual({
      ...initialAdminState,
      resendingDocumentList: false,
      resendingDocumentListSuccess: true
    })
  })

  it('ADMIN_RESEND_DOCUMENT_LIST_FAILURE', () => {
    expect(
      adminReducer(initialAdminState, {
        type: types.ADMIN_RESEND_DOCUMENT_LIST_FAILURE
      })
    ).toEqual({
      ...initialAdminState,
      resendingDocumentList: false,
      resendingDocumentListSuccess: false
    })
  })
})
