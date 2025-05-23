import {AnyAction} from "redux";
import * as types from "src/constants/actionTypes";

export interface  AdminState {
  resendingDocument: boolean
  resendingDocumentSuccess: boolean
  resendingDocumentList: boolean
  resendingDocumentListSuccess: boolean
}

export const initialAdminState : AdminState = {
  resendingDocument: false,
  resendingDocumentList: false,
  resendingDocumentSuccess: false,
  resendingDocumentListSuccess: false
}

const adminReducer = (state: AdminState = initialAdminState, action: AnyAction) => {

  switch (action.type) {
    case types.ADMIN_RESET_SUCCESS_MSG:
      return {
        resendingDocumentSuccess: false,
        resendingDocumentListSuccess: false
      }

    case types.ADMIN_RESEND_DOCUMENT_REQUEST:
      return {
        ...state,
        resendingDocument: true,
        resendingDocumentSuccess: false,
      }

    case types.ADMIN_RESEND_DOCUMENT_SUCCESS:
      return {
        ...state,
        resendingDocument: false,
        resendingDocumentSuccess: true
      }

    case types.ADMIN_RESEND_DOCUMENT_FAILURE:
      return {
        ...state,
        resendingDocument: false,
        resendingDocumentSuccess: false
      }

    case types.ADMIN_RESEND_DOCUMENT_LIST_REQUEST:
      return {
        ...state,
        resendingDocumentList: true,
        resendingDocumentListSuccess: false,
      }

    case types.ADMIN_RESEND_DOCUMENT_LIST_SUCCESS:
      return {
        ...state,
        resendingDocumentList: false,
        resendingDocumentListSuccess: true
      }
    case types.ADMIN_RESEND_DOCUMENT_LIST_FAILURE:
      return {
        ...state,
        resendingDocumentList: false,
        resendingDocumentListSuccess: false
      }

    default:
      return state
  }
}

export default adminReducer
