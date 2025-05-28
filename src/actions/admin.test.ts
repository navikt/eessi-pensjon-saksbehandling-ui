import * as types from "src/constants/actionTypes";
import * as urls from "src/constants/urls";
import {resendDocument, resendDocumentList} from "src/actions/admin";
import {call as originalCall} from "@navikt/fetch";

jest.mock('@navikt/fetch', () => ({
  call: jest.fn()
}))
const call = originalCall as jest.Mock<typeof originalCall>
const sprintf = require('sprintf-js').sprintf

describe('actions/admin', () => {

  const mockSakId = "1234567"
  const mockDokumentId  = "1234567890123456789012345678901"

  const mockDocumentList = "1234567_1234567890123456789012345678901_1"

  it('resendDocument()', () => {
    resendDocument(mockSakId, mockDokumentId)
    expect(call).toBeCalledWith(expect.objectContaining({
      type: {
        request: types.ADMIN_RESEND_DOCUMENT_REQUEST,
        success: types.ADMIN_RESEND_DOCUMENT_SUCCESS,
        failure: types.ADMIN_RESEND_DOCUMENT_FAILURE
      },
      expectedPayload: { success: true },
      cascadeFailureError: true,
      method: 'POST',
      url: sprintf(urls.ADMIN_RESEND_DOCUMENT_URL, { sakId: mockSakId, dokumentId: mockDokumentId })
    }))
  })

  it('resendDocumentList()', () => {
    resendDocumentList(mockDocumentList)
    expect(call).toBeCalledWith(expect.objectContaining({
      type: {
        request: types.ADMIN_RESEND_DOCUMENT_LIST_REQUEST,
        success: types.ADMIN_RESEND_DOCUMENT_LIST_SUCCESS,
        failure: types.ADMIN_RESEND_DOCUMENT_LIST_FAILURE
      },
      expectedPayload: { success: true },
      cascadeFailureError: true,
      method: 'POST',
      url: sprintf(urls.ADMIN_RESEND_DOCUMENT_LISTE_URL)
    }))
  })
})
