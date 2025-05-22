import {AnyAction} from "redux";
import * as types from "src/constants/actionTypes";

export interface  AdminState {
  resendingDocument: boolean
  resendingDocumentList: boolean
}

export const initialAdminState : AdminState = {
  resendingDocument: false,
  resendingDocumentList: false
}

const adminReducer = (state: AdminState = initialAdminState, action: AnyAction) => {

  switch (action.type) {
    case types.ADMIN_RESEND_DOCUMENT_REQUEST:
      return {
        ...state,
        resendingDocument: true
      }

    case types.ADMIN_RESEND_DOCUMENT_SUCCESS:
    case types.ADMIN_RESEND_DOCUMENT_FAILURE:
      return {
        ...state,
        resendingDocument: false
      }

    case types.ADMIN_RESEND_DOCUMENT_LIST_REQUEST:
      return {
        ...state,
        resendingDocumentList: true
      }

    case types.ADMIN_RESEND_DOCUMENT_LIST_SUCCESS:
    case types.ADMIN_RESEND_DOCUMENT_LIST_FAILURE:
      return {
        ...state,
        resendingDocumentList: false
      }

    default:
      return state
  }
}

export default adminReducer
