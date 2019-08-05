import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import * as api from 'actions/api'
import samplePerson from 'resources/tests/samplePerson'
var sprintf = require('sprintf-js').sprintf

export const setStatusParam = (key, value) => {
  return {
    type: types.APP_PARAM_SET,
    payload: {
      key: key,
      value: value
    }
  }
}

export const unsetStatusParam = (key) => {
  return {
    type: types.APP_PARAM_UNSET,
    payload: {
      key: key
    }
  }
}

export const login = () => {
  const currentHost = window.location.origin // http://hostname
  const redirect = currentHost
  const context = encodeURIComponent(window.location.pathname + window.location.search)
  const newUrl = urls.LOGIN_URL + '?redirect=' + redirect + '&context=' + context
  window.location.href = newUrl
  return {
    type: types.APP_LOGIN_REQUEST
  }
}

export const logout = () => {
  const redirectUrl = urls.LOGOUT_URL
  window.location.href = redirectUrl
  return {
    type: types.APP_LOGOUT_REQUEST
  }
}

export const getUserInfo = () => {
  return api.call({
    url: urls.API_USERINFO_URL,
    failWith401: true,
    type: {
      request: types.APP_USERINFO_REQUEST,
      success: types.APP_USERINFO_SUCCESS,
      failure: types.APP_USERINFO_FAILURE
    }
  })
}

export const getPersonInfo = (aktoerId) => {
  return api.funcCall({
    url: sprintf(urls.PERSON_URL, { aktoerId: aktoerId }),
    expectedPayload: samplePerson,
    type: {
      request: types.APP_PERSONINFO_REQUEST,
      success: types.APP_PERSONINFO_SUCCESS,
      failure: types.APP_PERSONINFO_FAILURE
    }
  })
}

export const clearData = () => {
  return {
    type: types.APP_CLEAR_DATA
  }
}
