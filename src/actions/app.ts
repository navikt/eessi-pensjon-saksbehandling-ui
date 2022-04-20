import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import { ParamPayload } from 'declarations/app.d'
import { ActionWithPayload, call } from '@navikt/fetch'
import mockUser from 'mocks/app/user'
import { Action, ActionCreator } from 'redux'

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

export const login = (): Action => {
  const redirect = window.location.origin // http://hostname
  const context = encodeURIComponent(window.location.pathname + window.location.search)
  window.location.href = urls.LOGIN_URL + '?redirect=' + redirect + '&context=' + context
  return {
    type: types.APP_LOGIN_REQUEST
  } as Action
}

export const logout: ActionCreator<Action> = (): Action => {
  window.location.href = urls.LOGOUT_URL
  return {
    type: types.APP_LOGOUT_REQUEST
  } as Action
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
