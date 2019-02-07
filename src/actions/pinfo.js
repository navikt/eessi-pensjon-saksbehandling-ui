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

export function setComment (payload) {
  return {
    type: types.PINFO_COMMENT_SET,
    payload: payload
  }
}

export function setMainButtonsVisibility (value) {
  return {
    type: types.PINFO_BUTTONS_VISIBLE,
    payload: value
  }
}

export function setPageErrors (pageErrors) {
  return {
    type: types.PINFO_PAGE_ERRORS_SET,
    payload: {
      pageErrors: pageErrors,
      errorTimestamp: new Date().getTime()
    }
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
    url: sprintf(urls.PINFO_INVITE_URL, { sakId: params.sakId, aktoerId: params.aktoerId }),
    method: 'POST',
    payload: {},
    type: {
      request: types.PINFO_INVITE_REQUEST,
      success: types.PINFO_INVITE_SUCCESS,
      failure: types.PINFO_INVITE_FAILURE
    }
  })
}

export function generateReceipt () {
  return api.call({
    url: urls.PINFO_RECEIPT_URL,
    method: 'GET',
    type: {
      request: types.PINFO_RECEIPT_REQUEST,
      success: types.PINFO_RECEIPT_SUCCESS,
      failure: types.PINFO_RECEIPT_FAILURE
    }
  })
}

export function setReady () {
  return {
    type: types.PINFO_SET_READY
  }
}

export function restoreState (content) {
  return {
    type: types.PINFO_STATE_RESTORE,
    payload: content
  }
}
