import { JoarkBrowserItem, JoarkBrowserItemWithContent, JoarkList, JoarkPreview } from 'src/declarations/joark.d'
import * as types from 'src/constants/actionTypes'
import * as urls from 'src/constants/urls'
import { call, ActionWithPayload } from '@navikt/fetch'
import mockJoark from 'src/mocks/joark/joark'
import mockPreview from 'src/mocks/joark/preview'
import { ActionCreator } from 'redux'

//const sprintf = require('sprintf-js').sprintf
// @ts-ignore
import { sprintf } from 'sprintf-js';

export const listJoarkItems = (
  userId: string
): ActionWithPayload<JoarkList> => {
  return call({
    url: sprintf(urls.API_JOARK_LIST_URL, { userId }),
    expectedPayload: mockJoark,
    type: {
      request: types.JOARK_LIST_REQUEST,
      success: types.JOARK_LIST_SUCCESS,
      failure: types.JOARK_LIST_FAILURE
    }
  })
}

export const getJoarkItemPreview = (
  item: JoarkBrowserItem
): ActionWithPayload<JoarkPreview> => {
  return call({
    url: sprintf(urls.API_JOARK_GET_URL, {
      dokumentInfoId: item.dokumentInfoId,
      journalpostId: item.journalpostId,
      variantformat: item.variant?.variantformat
    }),
    expectedPayload: mockPreview(),
    context: item,
    type: {
      request: types.JOARK_PREVIEW_REQUEST,
      success: types.JOARK_PREVIEW_SUCCESS,
      failure: types.JOARK_PREVIEW_FAILURE
    }
  })
}

export const setJoarkItemPreview: ActionCreator<ActionWithPayload<JoarkBrowserItemWithContent | undefined>> = (
  item: JoarkBrowserItemWithContent | undefined
): ActionWithPayload<JoarkBrowserItemWithContent | undefined> => ({
  type: types.JOARK_PREVIEW_SET,
  payload: item
})
