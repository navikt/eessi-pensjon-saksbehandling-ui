import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import * as api from 'actions/api'

var sprintf = require('sprintf-js').sprintf

export function sendInvite (params) {
  return api.call({
    url: sprintf(urls.API_VARSEL_URL, params),
    method: 'POST',
    payload: {},
    type: {
      request: types.PINFO_INVITE_REQUEST,
      success: types.PINFO_INVITE_SUCCESS,
      failure: types.PINFO_INVITE_FAILURE
    }
  })
}
