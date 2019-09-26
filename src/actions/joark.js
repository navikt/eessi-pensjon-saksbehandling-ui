import _ from 'lodash'
import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import { IS_TEST } from 'constants/environment'
import * as api from 'actions/api'
import sampleJoark from 'resources/tests/sampleJoark'
var sprintf = require('sprintf-js').sprintf

export const listJoarkFiles = (userId) => {
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

export const previewJoarkFile = (item, variant) => {
  const expectedPayload = urls.HOST === 'localhost' && !IS_TEST ? getMockedPayload(item.journalpostId) : undefined
  return api.call({
    url: sprintf(urls.API_JOARK_GET_URL, {
      dokumentInfoId: item.dokumentInfoId,
      journalpostId: item.journalpostId,
      variantFormat: variant.variantformat
    }),
    expectedPayload: expectedPayload,
    context: {
      ...item,
      variant: variant
    },
    type: {
      request: types.JOARK_PREVIEW_REQUEST,
      success: types.JOARK_PREVIEW_SUCCESS,
      failure: types.JOARK_PREVIEW_FAILURE
    }
  })
}

export const getJoarkFile = (item, variant) => {
  const expectedPayload = urls.HOST === 'localhost' && !IS_TEST ? getMockedPayload(item.journalpostId) : undefined
  return api.call({
    url: sprintf(urls.API_JOARK_GET_URL, {
      dokumentInfoId: item.dokumentInfoId,
      journalpostId: item.journalpostId,
      variantFormat: variant.variantformat
    }),
    expectedPayload: expectedPayload,
    context: {
      ...item,
      variant: variant
    },
    type: {
      request: types.JOARK_GET_REQUEST,
      success: types.JOARK_GET_SUCCESS,
      failure: types.JOARK_GET_FAILURE
    }
  })
}

export const getMockedPayload = (journalpostId) => {
  const item = _.find(sampleJoark.mockdata.data.dokumentoversiktBruker.journalposter, { journalpostId: journalpostId })
  return {
    fileName: item.tittel,
    contentType: 'application/pdf',
    filInnhold: sampleJoark.files[item.tittel]
  }
}
