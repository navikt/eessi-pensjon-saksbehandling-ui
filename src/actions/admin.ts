import {Action} from "redux";
import {call} from "@navikt/fetch";
import * as urls from "src/constants/urls";
import * as types from "src/constants/actionTypes";
// @ts-ignore
import { sprintf } from 'sprintf-js';

export const resendDocument = (
  rinaCaseId: string, documentId: string
): Action => {
  return call({
    url: sprintf(urls.ADMIN_RESEND_DOCUMENT_URL, { rinaCaseId, documentId }),
    cascadeFailureError: true,
    expectedPayload: { success: true },
    method: 'POST',
    type: {
      request: types.ADMIN_RESEND_DOCUMENT_REQUEST,
      success: types.ADMIN_RESEND_DOCUMENT_SUCCESS,
      failure: types.ADMIN_RESEND_DOCUMENT_FAILURE
    }
  })
}

export const resendDocumentList = (
  documentList: string
): Action => {
  return call({
    url: sprintf(urls.ADMIN_RESEND_DOCUMENT_LISTE_URL),
    cascadeFailureError: true,
    expectedPayload: { success: true },
    method: 'POST',
    body: documentList,
    type: {
      request: types.ADMIN_RESEND_DOCUMENT_LIST_REQUEST,
      success: types.ADMIN_RESEND_DOCUMENT_LIST_SUCCESS,
      failure: types.ADMIN_RESEND_DOCUMENT_LIST_FAILURE
    }
  })
}

