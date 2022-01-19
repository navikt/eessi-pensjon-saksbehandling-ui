import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import { ParamPayload, UserInfoPayload } from 'declarations/app.d'
import { PersonPDL, PersonAvdods } from 'declarations/person.d'
import { ActionWithPayload, call, ThunkResult } from 'js-fetch-api'
import mockPerson from 'mocks/app/person'
import mockPersonAvdod from 'mocks/app/personAvdod'
import mockUser from 'mocks/app/user'
import { Action, ActionCreator } from 'redux'

const sprintf = require('sprintf-js').sprintf

export const clearData: ActionCreator<Action> = (): Action => ({
  type: types.APP_CLEAR_DATA
})

export const getPersonAvdodInfo: ActionCreator<ThunkResult<ActionWithPayload<PersonAvdods>>> = (
  aktoerId: string,
  vedtakId: string,
  nrAvdod: number | undefined
): ThunkResult<ActionWithPayload<PersonAvdods>> => {
  return call({
    url: sprintf(urls.PERSON_PDL_AVDOD_URL, { aktoerId, vedtakId }),
    expectedPayload: /* istanbul ignore next */ mockPersonAvdod(nrAvdod),
    type: {
      request: types.APP_PERSONINFO_AVDOD_REQUEST,
      success: types.APP_PERSONINFO_AVDOD_SUCCESS,
      failure: types.APP_PERSONINFO_AVDOD_FAILURE
    }
  })
}

export const getPersonInfo: ActionCreator<ThunkResult<ActionWithPayload<PersonPDL>>> = (
  aktoerId: string
): ThunkResult<ActionWithPayload<PersonPDL>> => {
  return call({
    url: sprintf(urls.PERSON_PDL_URL, { aktoerId }),
    expectedPayload: mockPerson,
    type: {
      request: types.APP_PERSONINFO_REQUEST,
      success: types.APP_PERSONINFO_SUCCESS,
      failure: types.APP_PERSONINFO_FAILURE
    }
  })
}

export const getUserInfo: ActionCreator<ThunkResult<ActionWithPayload<UserInfoPayload>>> = (
): ThunkResult<ActionWithPayload<UserInfoPayload>> => {
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

export const login: ActionCreator<Action> = (): Action => {
  const redirect = window.location.origin // http://hostname
  const context = encodeURIComponent(window.location.pathname + window.location.search)
  window.location.href = urls.LOGIN_URL + '?redirect=' + redirect + '&context=' + context
  return {
    type: types.APP_LOGIN_REQUEST
  }
}

export const logout: ActionCreator<Action> = (): Action => {
  window.location.href = urls.LOGOUT_URL
  return {
    type: types.APP_LOGOUT_REQUEST
  }
}

export const setStatusParam: ActionCreator<ActionWithPayload<ParamPayload>> = (
  key: string,
  value: any
): ActionWithPayload<ParamPayload> => ({
  type: types.APP_PARAM_SET,
  payload: {
    key,
    value
  } as ParamPayload
})

export const unsetStatusParam: ActionCreator<ActionWithPayload<ParamPayload>> = (
  key: string
): ActionWithPayload<ParamPayload> => ({
  type: types.APP_PARAM_UNSET,
  payload: {
    key
  } as ParamPayload
})
