import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import { ParamPayload } from 'declarations/app.d'
import { ActionWithPayload, call } from '@navikt/fetch'
import mockUser from 'mocks/app/user'
import { Action } from 'redux'
import mockAktoerId from "../mocks/app/aktoerId";
const sprintf = require('sprintf-js').sprintf

export const clearData = (): Action => ({
  type: types.APP_DATA_CLEAR
})

export const getUserInfo = (): Action => {
  return call({
    url: urls.API_USERINFO_URL,
    cascadeFailureError: true,
    expectedPayload: mockUser,
    type: {
      request: types.APP_USERINFO_REQUEST,
      success: types.APP_USERINFO_SUCCESS,
      failure: types.APP_USERINFO_FAILURE,
      forbidden: types.APP_USERINFO_FORBIDDEN
    }
  })
}

export const getAktoerId = (fnr:string, context: string): ActionWithPayload<string> => {
  return call({
    url: sprintf(urls.PERSON_PDL_GET_AKTOERID_URL, { fnr }),
    expectedPayload: mockAktoerId,
    context: context,
    type: {
      request: types.PERSON_AKTOERID_REQUEST,
      success: types.PERSON_AKTOERID_SUCCESS,
      failure: types.PERSON_AKTOERID_FAILURE
    }
  })
}

export const setStatusParam = (
  key: string,
  value: any
): ActionWithPayload<ParamPayload> => ({
  type: types.APP_PARAM_SET,
  payload: {
    key,
    value
  } as ParamPayload
})

export const unsetStatusParam = (
  key: string
): ActionWithPayload<ParamPayload> => ({
  type: types.APP_PARAM_UNSET,
  payload: {
    key
  } as ParamPayload
})

export const copyToClipboard = (text: string) => ({
  type: types.APP_CLIPBOARD_COPY,
  payload: text
})

