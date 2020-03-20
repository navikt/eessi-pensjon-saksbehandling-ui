import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import * as api from 'eessi-pensjon-ui/dist/api'
import { ActionWithPayload, ThunkResult } from 'eessi-pensjon-ui/dist/declarations/types'
import { Action, ActionCreator } from 'redux'
import samplePerson from 'resources/tests/samplePerson'

const sprintf = require('sprintf-js').sprintf

export interface ParamPayload {
  key: string,
  value?: any
}

export const setStatusParam: ActionCreator<ActionWithPayload> = (key: string, value: any): ActionWithPayload<ParamPayload> => ({
  type: types.APP_PARAM_SET,
  payload: {
    key: key,
    value: value
  }
})

export const unsetStatusParam: ActionCreator<ActionWithPayload> = (key: string): ActionWithPayload<ParamPayload> => ({
  type: types.APP_PARAM_UNSET,
  payload: {
    key: key
  }
})

export const login = (): Action => {
  const redirect = window.location.origin // http://hostname
  const context = encodeURIComponent(window.location.pathname + window.location.search)
  window.location.href = urls.LOGIN_URL + '?redirect=' + redirect + '&context=' + context
  return {
    type: types.APP_LOGIN_REQUEST
  }
}

export const logout = (): Action => {
  window.location.href = urls.LOGOUT_URL
  return {
    type: types.APP_LOGOUT_REQUEST
  }
}

export const getUserInfo: ActionCreator<ThunkResult<ActionWithPayload>> = (): ThunkResult<ActionWithPayload> => {
  return api.call({
    url: urls.API_USERINFO_URL,
    cascadeFailureError: true,
    expectedPayload: {
      subject: 'demoSaksbehandlerUser',
      role: 'SAKSBEHANDLER',
      allowed: true,
      features: {
        P5000_VISIBLE: true
      }
    },
    type: {
      request: types.APP_USERINFO_REQUEST,
      success: types.APP_USERINFO_SUCCESS,
      failure: types.APP_USERINFO_FAILURE,
      forbidden: types.APP_USERINFO_FORBIDDEN
    }
  })
}

export const getPersonInfo: ActionCreator<ThunkResult<ActionWithPayload>> = (aktoerId: string): ThunkResult<ActionWithPayload> => {
  return api.call({
    url: sprintf(urls.PERSON_URL, { aktoerId: aktoerId }),
    expectedPayload: samplePerson,
    type: {
      request: types.APP_PERSONINFO_REQUEST,
      success: types.APP_PERSONINFO_SUCCESS,
      failure: types.APP_PERSONINFO_FAILURE
    }
  })
}

export const clearData = (): Action => ({
  type: types.APP_CLEAR_DATA
})
