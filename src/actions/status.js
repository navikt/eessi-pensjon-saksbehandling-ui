import * as types from '../constants/actionTypes'
import * as urls from '../constants/urls'
import * as api from './api'
var sprintf = require('sprintf-js').sprintf

export function setStatusParam (key, value) {
  return {
    type: types.STATUS_PARAM_SET,
    payload: {
      key: key,
      value: value
    }
  }
}

export function unsetStatusParam (key) {
  return {
    type: types.STATUS_PARAM_UNSET,
    payload: {
      key: key
    }
  }
}

export function getStatus (rinaId) {
  return api.call({
    url: sprintf(urls.STATUS_GET_URL, { rinaId: rinaId || '' }),
    type: {
      request: types.STATUS_GET_REQUEST,
      success: types.STATUS_GET_SUCCESS,
      failure: types.STATUS_GET_FAILURE
    },
    context: {functionName: 'getStatus', args: {rinaId}}
  })
}

export function getCase (rinaId) {
  return api.call({
    url: sprintf(urls.STATUS_RINA_CASE_URL, { rinaId: rinaId || '' }),
    type: {
      request: types.STATUS_RINA_CASE_REQUEST,
      success: types.STATUS_RINA_CASE_SUCCESS,
      failure: types.STATUS_RINA_CASE_FAILURE
    },
    context: {functionName: 'getCase', args: {rinaId}}
  })
}

export function deleteSed (rinaId, dokumentId) {
  return api.call({
    url: sprintf(urls.CASE_SED_URL, { rinaId: rinaId, dokumentId: dokumentId }),
    method: 'DELETE',
    type: {
      request: types.STATUS_SED_DELETE_REQUEST,
      success: types.STATUS_SED_DELETE_SUCCESS,
      failure: types.STATUS_SED_DELETE_FAILURE
    },
    context: {functionName: 'deleteSed', args: {rinaId, dokumentId}}
  })
}
