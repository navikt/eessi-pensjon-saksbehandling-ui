import { P5000ForS3 } from 'applications/P5000/utils/pesysUtils'
import * as types from 'constants/actionTypes'
import * as storage from 'constants/storage'
import * as urls from 'constants/urls'
import { Sed } from 'declarations/buc'
import { P5000SED } from 'declarations/p5000'
import { ActionWithPayload, call } from '@navikt/fetch'
import mockSed from 'mocks/buc/sed'
import mockP5000FromS3 from 'mocks/p5000/fromS3'
import { Action, ActionCreator } from 'redux'

const sprintf = require('sprintf-js').sprintf

export const setGjpBpWarning = (payload: any) => ({
  type: types.P5000_GJPBPWARNING_SET,
  payload
})

export const getSed = (
  caseId: string, sed: Sed
): ActionWithPayload<P5000SED> => {
  return call({
    url: sprintf(urls.P5000_GET_URL, { caseId, sedId: sed.id }),
    cascadeFailureError: true,
    context: sed,
    expectedPayload: mockSed(sed, 'small'),
    type: {
      request: types.P5000_GET_REQUEST,
      success: types.P5000_GET_SUCCESS,
      failure: types.P5000_GET_FAILURE
    }
  })
}

export const resetSentP5000info : ActionCreator<Action> = (): Action => ({
  type: types.P5000_SEND_RESET
})

export const sendP5000toRina = (
  caseId: string, sedId: string, payload: P5000SED
): Action => {
  return call({
    url: sprintf(urls.P5000_PUT_URL, { caseId, sedId }),
    method: 'PUT',
    body: payload,
    cascadeFailureError: true,
    expectedErrorRate: { 200: 1 },
    expectedPayload: { success: true },
    context: {
      caseId,
      sedId,
      payload
    },
    type: {
      request: types.P5000_SEND_REQUEST,
      success: types.P5000_SEND_SUCCESS,
      failure: types.P5000_SEND_FAILURE
    }
  })
}

export const getP5000FromS3 = (
  aktoerId: string,
  caseId: string
): Action => {
  return call({
    url: sprintf(urls.API_STORAGE_GET_URL, { userId: aktoerId, namespace: storage.NAMESPACE_PESYS, file: caseId }),
    method: 'GET',
    cascadeFailureError: true,
    expectedErrorRate: { 200: 1 },
    expectedPayload: mockP5000FromS3,
    type: {
      request: types.P5000_PESYS_GET_REQUEST,
      success: types.P5000_PESYS_GET_SUCCESS,
      failure: types.P5000_PESYS_GET_FAILURE
    }
  })
}

export const sendP5000ToS3 = (
  aktoerId: string,
  caseId: string,
  items: Array<P5000ForS3>
): Action => {
  return call({
    url: sprintf(urls.API_STORAGE_POST_URL, { userId: aktoerId, namespace: storage.NAMESPACE_PESYS, file: caseId }),
    method: 'POST',
    body: items,
    cascadeFailureError: true,
    expectedErrorRate: { 200: 1 },
    expectedPayload: items,
    context: {
      caseId
    },
    type: {
      request: types.P5000_PESYS_SEND_REQUEST,
      success: types.P5000_PESYS_SEND_SUCCESS,
      failure: types.P5000_PESYS_SEND_FAILURE
    }
  })
}
