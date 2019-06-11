import * as types from '../constants/actionTypes'
import * as urls from '../constants/urls'
import * as api from './api'
var sprintf = require('sprintf-js').sprintf

export function listJoarkFiles (userId) {
  return api.call({
    url: sprintf(urls.API_JOARK_LIST_URL, { userId: userId }),
    type: {
      request: types.JOARK_LIST_REQUEST,
      success: types.JOARK_LIST_SUCCESS,
      failure: types.JOARK_LIST_FAILURE
    }
  })
}

export function getJoarkFiles (userId) {
  return api.call({
    url: sprintf(urls.API_JOARK_GET_URL, { userId: userId }),
    type: {
      request: types.JOARK_GET_REQUEST,
      success: types.JOARK_GET_SUCCESS,
      failure: types.JOARK_GET_FAILURE
    }
  })
}
