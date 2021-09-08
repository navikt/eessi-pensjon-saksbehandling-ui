import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import { Sed } from 'declarations/buc'
import { P5000SED } from 'declarations/p5000'
import { ActionWithPayload, call, ThunkResult } from 'js-fetch-api'
import mockSed from 'mocks/buc/sed'
import { Action, ActionCreator } from 'redux'

const sprintf = require('sprintf-js').sprintf

export const getSed: ActionCreator<ThunkResult<ActionWithPayload<P5000SED>>> = (
  caseId: string, sed: Sed
): ThunkResult<ActionWithPayload<P5000SED>> => {
  return call({
    url: sprintf(urls.P5000_GET_URL, { caseId: caseId, sedId: sed.id }),
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

export const unsyncFromP5000Storage : ActionCreator<ActionWithPayload<any>> = (
  caseId: string, sedId: string
): ActionWithPayload<any> => ({
  type: types.P5000_STORAGE_REMOVE,
  payload: {
    caseId: caseId,
    sedId: sedId
  }
})

export const syncToP5000Storage: ActionCreator<ActionWithPayload<any>> = (
  newSed: P5000SED, caseId: string, sedId: string
): ActionWithPayload<any> => ({
  type: types.P5000_STORAGE_SAVE,
  payload: {
    newSed: newSed,
    caseId: caseId,
    sedId: sedId
  }
})

export const initP5000Storage : ActionCreator<ActionWithPayload<string>> = (key: string): ActionWithPayload<string> => ({
  type: types.P5000_STORAGE_INIT,
  payload: key
})

export const resetSentP5000info : ActionCreator<Action> = (): Action => ({
  type: types.P5000_SEND_RESET
})

export const sendP5000toRina: ActionCreator<ThunkResult<Action>> = (
  caseId: string, sedId: string, payload: P5000SED
): ThunkResult<Action> => {
  return call({
    url: sprintf(urls.P5000_PUT_URL, { caseId: caseId, sedId: sedId }),
    method: 'PUT',
    body: payload,
    cascadeFailureError: true,
    expectedPayload: { success: true },
    context: {
      caseId: caseId,
      sedId: sedId,
      payload: payload
    },
    type: {
      request: types.P5000_SEND_REQUEST,
      success: types.P5000_SEND_SUCCESS,
      failure: types.P5000_SEND_FAILURE
    }
  })
}
