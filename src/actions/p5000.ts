import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import { Sed } from 'declarations/buc'
import { P5000SED } from 'declarations/p5000'
import { ActionWithPayload, call, ThunkResult } from 'js-fetch-api'
import mockSed from 'mocks/buc/sed'
import { Action, ActionCreator } from 'redux'
import mockUFT from 'mocks/buc/uft'

const sprintf = require('sprintf-js').sprintf

export const getUFT = (vedtakId: string) => {
  return call({
    url: sprintf(urls.PERSON_GET_UFT_URL, { vedtakId }),
    cascadeFailureError: true,
    expectedPayload: mockUFT,
    type: {
      request: types.PERSON_GET_UFT_REQUEST,
      success: types.PERSON_GET_UFT_SUCCESS,
      failure: types.PERSON_GET_UFT_FAILURE
    }
  })
}

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
