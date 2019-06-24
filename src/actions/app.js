import * as types from '../constants/actionTypes'
import * as urls from '../constants/urls'
import * as api from './api'
import samplePerson from 'resources/tests/samplePerson'
var sprintf = require('sprintf-js').sprintf

export function setStatusParam (key, value) {
  return {
    type: types.APP_PARAM_SET,
    payload: {
      key: key,
      value: value
    }
  }
}

export function unsetStatusParam (key) {
  return {
    type: types.APP_PARAM_UNSET,
    payload: {
      key: key
    }
  }
}

export function login () {
  let currentHost = window.location.origin // http://hostname
  let redirect = currentHost
  let context = encodeURIComponent(window.location.pathname + window.location.search)

  let newUrl = urls.LOGIN_URL + '?redirect=' + redirect + '&context=' + context
  window.location.href = newUrl

  return {
    type: types.APP_LOGIN_REQUEST
  }
}

export function logout () {
  let redirectUrl = urls.LOGOUT_URL
  window.location.href = redirectUrl
  return {
    type: types.APP_LOGOUT_REQUEST
  }
}

export function getUserInfo () {
  return api.call({
    url: urls.API_USERINFO_URL,
    type: {
      request: types.APP_USERINFO_REQUEST,
      success: types.APP_USERINFO_SUCCESS,
      failure: types.APP_USERINFO_FAILURE
    }
  })
}

export function getPersonInfo (aktoerId) {
  let funcCall = urls.HOST === 'localhost' ? api.fakecall : api.call
  return funcCall({
    url: sprintf(urls.PERSON_URL, { aktoerId: aktoerId }),
    expectedPayload: samplePerson,
    type: {
      request: types.APP_PERSONINFO_REQUEST,
      success: types.APP_PERSONINFO_SUCCESS,
      failure: types.APP_PERSONINFO_FAILURE
    }
  })
}

export function clearData () {
  return {
    type: types.APP_CLEAR_DATA
  }
}

export function registerDroppable (id, ref) {
  return {
    type: types.APP_DROPPABLE_REGISTER,
    payload: {
      id: id,
      ref: ref
    }
  }
}

export function unregisterDroppable (id) {
  return {
    type: types.APP_DROPPABLE_UNREGISTER,
    payload: {
      id: id
    }
  }
}
