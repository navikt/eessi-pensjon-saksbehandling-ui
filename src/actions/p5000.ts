import { P5000ForS3 } from 'src/applications/P5000/utils/pesysUtils'
import * as types from 'src/constants/actionTypes'
import * as storage from 'src/constants/storage'
import * as urls from 'src/constants/urls'
import { Sed } from 'src/declarations/buc'
import { P5000SED } from 'src/declarations/p5000'
import { ActionWithPayload, call } from '@navikt/fetch'
//import mockP5000 from 'src/mocks/buc/sedP5000'
import mockSEDP5000_small from 'src/mocks/buc/sed_P5000_small2'
import mockP5000FromS3 from 'src/mocks/p5000/fromS3'
import { Action, ActionCreator } from 'redux'

// @ts-ignore
import { sprintf } from 'sprintf-js';

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
    //expectedPayload: mockP5000(sed, 'small'),
    expectedPayload: mockSEDP5000_small,
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
  fnr: string,
  caseId: string
): Action => {
  return call({
    url: sprintf(urls.API_STORAGE_GET_URL, { userId: fnr, namespace: storage.NAMESPACE_PESYS, file: caseId }),
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
  fnr: string,
  caseId: string,
  items: Array<P5000ForS3>
): Action => {
  return call({
    url: sprintf(urls.API_STORAGE_POST_URL, { userId: fnr, namespace: storage.NAMESPACE_PESYS, file: caseId }),
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
