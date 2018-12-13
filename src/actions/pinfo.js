import * as types from '../constants/actionTypes'
import * as urls from '../constants/urls'
import * as api from './api'
var sprintf = require('sprintf-js').sprintf

export function setStep (step) {
  return {
    type: types.PINFO_STEP_SET,
    payload: step
  }
}

export function setPerson (payload) {
  return {
    type: types.PINFO_PERSON_SET,
    payload: payload
  }
}

export function setStayAbroad (payload) {
  return {
    type: types.PINFO_STAY_ABROAD_SET,
    payload: payload
  }
}

export function setWork (payload) {
  return {
    type: types.PINFO_WORK_SET,
    payload: payload
  }
}

export function setBank (payload) {
  return {
    type: types.PINFO_BANK_SET,
    payload: payload
  }
}

export function sendPInfo (payload) {
  return api.call({
    url: urls.PINFO_SEND_URL,
    method: 'POST',
    payload: payload,
    type: {
      request: types.PINFO_SEND_REQUEST,
      success: types.PINFO_SEND_SUCCESS,
      failure: types.PINFO_SEND_FAILURE
    }
  })
}

export function sendInvite (params) {
  return api.call({
    url: sprintf(urls.PINFO_INVITE_URL, { saksId: params.saksId, aktoerId: params.aktoerId }),
    method: 'POST',
    payload: {},
    type: {
      request: types.PINFO_INVITE_REQUEST,
      success: types.PINFO_INVITE_SUCCESS,
      failure: types.PINFO_INVITE_FAILURE
    }
  })
}
