import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import * as api from 'eessi-pensjon-ui/dist/api'
import samplePerson from 'resources/tests/samplePerson'
import { Action, ActionWithPayload } from 'types'
const sprintf = require('sprintf-js').sprintf

export interface ParamPayload {
  key: string,
  value?: any
}

export const setStatusParam = (key: string, value: any): ActionWithPayload<ParamPayload> => {
  return {
    type: types.APP_PARAM_SET,
    payload: {
      key: key,
      value: value
    }
  }
}

export const unsetStatusParam = (key: string): ActionWithPayload<ParamPayload> => {
  return {
    type: types.APP_PARAM_UNSET,
    payload: {
      key: key
    }
  }
}

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

export const getUserInfo = (): Function => {
  return api.call({
    url: urls.API_USERINFO_URL,
    cascadeFailureError: true,
    expectedPayload: {
      subject: 'demoSaksbehandlerUser',
      role: 'SAKSBEHANDLER',
      allowed: true
    },
    type: {
      request: types.APP_USERINFO_REQUEST,
      success: types.APP_USERINFO_SUCCESS,
      failure: types.APP_USERINFO_FAILURE
    }
  })
}

export const getPersonInfo = (aktoerId: string): Function => {
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

export const getSakType = (sakId: string, aktoerId: string): Function => {
  return api.call({
    url: sprintf(urls.PENSJON_GET_SAKTYPE_URL, { sakId: sakId, aktoerId: aktoerId }),
    expectedPayload: {
      sakId: '123',
      sakType: 'GJENLEV'
    },
    type: {
      request: types.APP_SAKTYPE_REQUEST,
      success: types.APP_SAKTYPE_SUCCESS,
      failure: types.APP_SAKTYPE_FAILURE
    }
  })
}

export const clearData = (): Action => {
  return {
    type: types.APP_CLEAR_DATA
  }
}
