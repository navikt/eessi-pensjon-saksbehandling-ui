import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import * as api from 'eessi-pensjon-ui/dist/api'
const sprintf = require('sprintf-js').sprintf

export const sendInvite = (params) => {
  return api.call({
    url: sprintf(urls.API_VARSEL_URL, params),
    method: 'POST',
    payload: {},
    expectedPayload: { success: true },
    type: {
      request: types.PINFO_INVITE_REQUEST,
      success: types.PINFO_INVITE_SUCCESS,
      failure: types.PINFO_INVITE_FAILURE
    }
  })
}
