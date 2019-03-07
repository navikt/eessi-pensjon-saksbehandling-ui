import * as types from '../constants/actionTypes'
import * as urls from '../constants/urls'
import * as constants from '../constants/constants'
import * as api from './api'
import * as storageActions from './storage'

var sprintf = require('sprintf-js').sprintf

export function setStep (step) {
  return {
    type: types.PINFO_STEP_SET,
    payload: step
  }
}

export function setStepError (stepError) {
  return {
    type: types.PINFO_STEP_ERROR,
    payload: stepError
  }
}

export function setPerson (payload) {
  return {
    type: types.PINFO_PERSON_SET,
    payload: payload
  }
}

export function setBank (payload) {
  return {
    type: types.PINFO_BANK_SET,
    payload: payload
  }
}

export function setStayAbroad (payload) {
  return {
    type: types.PINFO_STAY_ABROAD_SET,
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

export function getPinfoFromStorage (params) {
  return api.call({
    url: sprintf(urls.STORAGE_GET_URL, { userId: params.userId, namespace: params.namespace, file: params.file }),
    method: 'GET',
    type: {
      request: types.PINFO_GET_FROM_STORAGE_REQUEST,
      success: types.PINFO_GET_FROM_STORAGE_SUCCESS,
      failure: types.PINFO_GET_FROM_STORAGE_FAILURE
    }
  })
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

export function clearPInfoData () {
  return {
    type: types.PINFO_CLEAR_DATA
  }
}

export function saveStateAndExit (pinfo, username) {
  return (dispatch) => {
    return dispatch(
      storageActions.postStorageFileWithNoNotification(username, constants.PINFO, constants.PINFO_FILE, JSON.stringify(pinfo))
    ).then(() => {
      dispatch(clearPInfoData())
      window.location.href = urls.NAV_URL
    })
  }
}

export function deleteStateAndExit (username) {
  return (dispatch) => {
    return dispatch(
      storageActions.deleteAllStorageFilesFromUser(username, constants.PINFO)
    ).then(() => {
      dispatch(clearPInfoData())
      window.location.href = urls.NAV_URL
    })
  }
}

export function setReady () {
  return {
    type: types.PINFO_SET_READY
  }
}
