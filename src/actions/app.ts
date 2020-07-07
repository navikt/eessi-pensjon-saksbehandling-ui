import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import { call, ActionWithPayload, ThunkResult } from 'js-fetch-api'
import { Action, ActionCreator } from 'redux'
import mockPerson from 'mocks/app/person'
import mockPersonAvdod from 'mocks/app/personAvdod'
import mockUser from 'mocks/app/user'

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

export const getPersonInfo: ActionCreator<ThunkResult<ActionWithPayload>> = (aktoerId: string): ThunkResult<ActionWithPayload> => {
  return call({
    url: sprintf(urls.PERSON_URL, { aktoerId: aktoerId }),
    expectedPayload: mockPerson,
    type: {
      request: types.APP_PERSONINFO_REQUEST,
      success: types.APP_PERSONINFO_SUCCESS,
      failure: types.APP_PERSONINFO_FAILURE
    }
  })
}

export const getPersonAvdodInfo: ActionCreator<ThunkResult<ActionWithPayload>> = (aktoerId: string, vedtakId: string): ThunkResult<ActionWithPayload> => {
  return call({
    url: sprintf(urls.PERSON_AVDOD_URL, { aktoerId: aktoerId, vedtakId: vedtakId }),
    expectedPayload: mockPersonAvdod,
    type: {
      request: types.APP_PERSONINFO_AVDOD_REQUEST,
      success: types.APP_PERSONINFO_AVDOD_SUCCESS,
      failure: types.APP_PERSONINFO_AVDOD_FAILURE
    }
  })
}

export const clearData = (): Action => ({
  type: types.APP_CLEAR_DATA
})
