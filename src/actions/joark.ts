import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import { JoarkFile } from 'declarations/joark'
import { call, ActionWithPayload } from 'js-fetch-api'
import mockJoarkRaw from 'mocks/joark/joarkRaw'
import mockJoarkPreviewFile from 'mocks/joark/previewFile'

const sprintf = require('sprintf-js').sprintf

export const listJoarkFiles = (userId: string): Function => {
  return call({
    url: sprintf(urls.API_JOARK_LIST_URL, { userId: userId }),
    expectedPayload: mockJoarkRaw,
    type: {
      request: types.JOARK_LIST_REQUEST,
      success: types.JOARK_LIST_SUCCESS,
      failure: types.JOARK_LIST_FAILURE
    }
  })
}

export const getPreviewJoarkFile = (item: JoarkFile): Function => {
  return call({
    url: sprintf(urls.API_JOARK_GET_URL, {
      dokumentInfoId: item.dokumentInfoId,
      journalpostId: item.journalpostId,
      variantformat: item.variant?.variantformat
    }),
    expectedPayload: mockJoarkPreviewFile(),
    context: item,
    type: {
      request: types.JOARK_PREVIEW_REQUEST,
      success: types.JOARK_PREVIEW_SUCCESS,
      failure: types.JOARK_PREVIEW_FAILURE
    }
  })
}

export const setPreviewJoarkFile = (item: JoarkFile | undefined): ActionWithPayload<JoarkFile | undefined> => ({
  type: types.JOARK_PREVIEW_SET,
  payload: item
})
