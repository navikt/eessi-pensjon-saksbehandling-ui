import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import * as api from 'eessi-pensjon-ui/dist/api'
import samplePerson from 'resources/tests/samplePerson'
const sprintf = require('sprintf-js').sprintf

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
  const redirect = window.location.origin // http://hostname
  const context = encodeURIComponent(window.location.pathname + window.location.search)
  window.location.href = urls.LOGIN_URL + '?redirect=' + redirect + '&context=' + context
  return {
    type: types.APP_LOGIN_REQUEST
  }
}

export const logout = () => {
  window.location.href = urls.LOGOUT_URL
  return {
    type: types.APP_LOGOUT_REQUEST
  }
}

export const getUserInfo = () => {
  return api.call({
    url: urls.API_USERINFO_URL,
    failWith401: true,
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

export const getPersonInfo = (aktoerId) => {
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

export const getSakType = (sakId, aktoerId) => {
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

export const clearData = () => {
  return {
    type: types.APP_CLEAR_DATA
  }
}
