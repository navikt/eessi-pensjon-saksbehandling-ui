import { JoarkBrowserItem, JoarkBrowserItemWithContent, JoarkList, JoarkPreview } from 'declarations/joark.d'
import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import { call, ActionWithPayload, ThunkResult } from '@navikt/fetch'
import mockJoark from 'mocks/joark/joark'
import mockPreview from 'mocks/joark/preview'
import { ActionCreator } from 'redux'

const sprintf = require('sprintf-js').sprintf

export const listJoarkItems: ActionCreator<ThunkResult<ActionWithPayload<JoarkList>>> = (
  userId: string
): ThunkResult<ActionWithPayload<JoarkList>> => {
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

export const getJoarkItemPreview: ActionCreator<ThunkResult<ActionWithPayload<JoarkPreview>>> = (
  item: JoarkBrowserItem
): ThunkResult<ActionWithPayload<JoarkPreview>> => {
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
