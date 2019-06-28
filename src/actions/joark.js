import * as types from '../constants/actionTypes'
import * as urls from '../constants/urls'
import * as api from './api'
import _ from 'lodash'
import sampleJoark from 'resources/tests/sampleJoark'
var sprintf = require('sprintf-js').sprintf

export function listJoarkFiles (userId) {
  let funcCall = urls.HOST === 'localhost' ? api.fakecall : api.call
  return funcCall({
    url: sprintf(urls.API_JOARK_LIST_URL, { userId: userId }),
    expectedPayload: sampleJoark.mockdata,
    type: {
      request: types.JOARK_LIST_REQUEST,
      success: types.JOARK_LIST_SUCCESS,
      failure: types.JOARK_LIST_FAILURE
    }
  })
}

export function previewJoarkFile (item) {
  let funcCall = urls.HOST === 'localhost' ? api.fakecall : api.call
  let expectedPayload = urls.HOST === 'localhost' ? getMockedPayload(item.journalpostId) : undefined
  return funcCall({
    url: sprintf(urls.API_JOARK_GET_URL, { dokumentInfoId: item.dokumentInfoId, journalpostId: item.journalpostId }),
    expectedPayload: expectedPayload,
    context: item,
    type: {
      request: types.JOARK_PREVIEW_REQUEST,
      success: types.JOARK_PREVIEW_SUCCESS,
      failure: types.JOARK_PREVIEW_FAILURE
    }
  })
}

export function getJoarkFile (item, variant) {
  let funcCall = urls.HOST === 'localhost' ? api.fakecall : api.call
  let expectedPayload = urls.HOST === 'localhost' ? getMockedPayload(item.journalpostId) : undefined
  return funcCall({
    url: sprintf(urls.API_JOARK_GET_URL, {
      dokumentInfoId: item.dokumentInfoId,
      journalpostId: item.journalpostId,
      variant: variant
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

const getMockedPayload = (journalpostId) => {
  let item = _.find(sampleJoark.mockdata.data.dokumentoversiktBruker.journalposter, { journalpostId: journalpostId })
  return {
    fileName: item.tittel,
    contentType: 'application/pdf',
    base64: sampleJoark.files[item.tittel]
  }
}
