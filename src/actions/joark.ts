import _ from 'lodash'
import * as api from 'eessi-pensjon-ui/dist/api'
import * as types from 'constants/actionTypes'
import { IS_TEST } from 'constants/environment'
import * as urls from 'constants/urls'
import sampleJoark from 'resources/tests/sampleJoarkRaw'
import { ActionWithPayload } from 'types'
import { JoarkFile } from 'applications/BUC/declarations/joark'
const sprintf = require('sprintf-js').sprintf

export const listJoarkFiles = (userId: string): Function => {
  return api.call({
    url: sprintf(urls.API_JOARK_LIST_URL, { userId: userId }),
    expectedPayload: sampleJoark.mockdata,
    type: {
      request: types.JOARK_LIST_REQUEST,
      success: types.JOARK_LIST_SUCCESS,
      failure: types.JOARK_LIST_FAILURE
    }
  })
}

export const getPreviewJoarkFile = (item: JoarkFile): Function => {
  return api.call({
    url: sprintf(urls.API_JOARK_GET_URL, {
      dokumentInfoId: item.dokumentInfoId,
      journalpostId: item.journalpostId,
      variantformat: item.variant.variantformat
    }),
    expectedPayload: getMockedPayload(item.journalpostId),
    context: item,
    type: {
      request: types.JOARK_PREVIEW_REQUEST,
      success: types.JOARK_PREVIEW_SUCCESS,
      failure: types.JOARK_PREVIEW_FAILURE
    }
  })
}

export const setPreviewJoarkFile = (item: JoarkFile): ActionWithPayload<JoarkFile> => {
  return {
    type: types.JOARK_PREVIEW_SET,
    payload: item
  }
}

export const getJoarkFile = (item: JoarkFile): Function => {
  return api.call({
    url: sprintf(urls.API_JOARK_GET_URL, {
      dokumentInfoId: item.dokumentInfoId,
      journalpostId: item.journalpostId,
      variantformat: item.variant.variantformat
    }),
    expectedPayload: getMockedPayload(item.journalpostId),
    context: item,
    type: {
      request: types.JOARK_GET_REQUEST,
      success: types.JOARK_GET_SUCCESS,
      failure: types.JOARK_GET_FAILURE
    }
  })
}

interface JoarkPayload {
  fileName: string | undefined;
  contentType: string;
  filInnhold: string;
}

export const getMockedPayload = (journalpostId: string): JoarkPayload | undefined => {
  if (urls.HOST === 'localhost' && !IS_TEST) {
    const item = _.find(sampleJoark.mockdata.data.dokumentoversiktBruker.journalposter, { journalpostId: journalpostId })
    const tittel: string = item ? item.tittel : 'red.pdf'
    return {
      fileName: tittel,
      contentType: 'application/pdf',
      filInnhold: (sampleJoark.files as any)[tittel]
    }
  }
  return undefined
}
