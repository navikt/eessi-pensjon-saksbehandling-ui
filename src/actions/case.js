import * as types from '../constants/actionTypes'
import * as urls from '../constants/urls'
import * as api from './api'
var sprintf = require('sprintf-js').sprintf

export function setStep (step) {
  return {
    type: types.CASE_STEP_SET,
    payload: step
  }
}

export function getCaseFromCaseNumber (params) {
  let url = params.rinaId ? sprintf(urls.EUX_CASE_WITH_RINAID_URL, params) : sprintf(urls.EUX_CASE_WITHOUT_RINAID_URL, params)
  return api.call({
    url: url,
    type: {
      request: types.CASE_GET_CASE_NUMBER_REQUEST,
      success: types.CASE_GET_CASE_NUMBER_SUCCESS,
      failure: types.CASE_GET_CASE_NUMBER_FAILURE
    }
  })
}

export function getSubjectAreaList () {
  return api.call({
    url: urls.EUX_SUBJECT_AREA_URL,
    type: {
      request: types.CASE_GET_SUBJECT_AREA_LIST_REQUEST,
      success: types.CASE_GET_SUBJECT_AREA_LIST_SUCCESS,
      failure: types.CASE_GET_SUBJECT_AREA_LIST_FAILURE
    }
  })
}

export function getCountryList () {
  return api.call({
    url: urls.EUX_COUNTRY_URL,
    type: {
      request: types.CASE_GET_COUNTRY_LIST_REQUEST,
      success: types.CASE_GET_COUNTRY_LIST_SUCCESS,
      failure: types.CASE_GET_COUNTRY_LIST_FAILURE
    }
  })
}

export function getInstitutionListForBucAndCountry (buc, country) {
  return api.call({
    url: sprintf(urls.EUX_INSTITUTIONS_FOR_BUC_AND_COUNTRY_URL, {buc: buc, country: country}),
    type: {
      request: types.CASE_GET_INSTITUTION_LIST_REQUEST,
      success: types.CASE_GET_INSTITUTION_LIST_SUCCESS,
      failure: types.CASE_GET_INSTITUTION_LIST_FAILURE
    }
  })
}

export function getInstitutionListForCountry (country) {
  return api.call({
    url: sprintf(urls.EUX_INSTITUTIONS_FOR_COUNTRY_URL, { country: country }),
    type: {
      request: types.CASE_GET_INSTITUTION_LIST_REQUEST,
      success: types.CASE_GET_INSTITUTION_LIST_SUCCESS,
      failure: types.CASE_GET_INSTITUTION_LIST_FAILURE
    }
  })
}

export function getBucList (rinaId) {
  let url = rinaId ? sprintf(urls.BUC_WITH_RINAID_NAME_URL, { rinaId: rinaId })
    : urls.EUX_BUCS_URL

  return api.call({
    url: url,
    type: {
      request: types.CASE_GET_BUC_LIST_REQUEST,
      success: types.CASE_GET_BUC_LIST_SUCCESS,
      failure: types.CASE_GET_BUC_LIST_FAILURE
    }
  })
}

export function getSedList (buc, rinaId) {
  let url = rinaId ? sprintf(urls.EUX_SED_FROM_RINA_URL, { rinaId: rinaId })
    : sprintf(urls.EUX_SED_FOR_BUCS_URL, { buc: buc })

  return api.call({
    url: url,
    type: {
      request: types.CASE_GET_SED_LIST_REQUEST,
      success: types.CASE_GET_SED_LIST_SUCCESS,
      failure: types.CASE_GET_SED_LIST_FAILURE
    }
  })
}

export function dataPreview (params) {
  return {
    type: types.CASE_DATA_PREVIEW_SUCCESS,
    payload: params
  }
}

export function cleanCaseNumber () {
  return {
    type: types.CASE_GET_CASE_NUMBER_CLEAN
  }
}

export function getMorePreviewData (payload) {
  return api.call({
    url: urls.SED_PREVIEW_URL,
    method: 'POST',
    payload: payload,
    type: {
      request: types.CASE_GET_MORE_PREVIEW_DATA_REQUEST,
      success: types.CASE_GET_MORE_PREVIEW_DATA_SUCCESS,
      failure: types.CASE_GET_MORE_PREVIEW_DATA_FAILURE
    }
  })
}

export function createSed (payload) {
  return api.call({
    url: urls.SED_BUC_CREATE_URL,
    method: 'POST',
    payload: payload,
    type: {
      request: types.CASE_CREATE_SED_REQUEST,
      success: types.CASE_CREATE_SED_SUCCESS,
      failure: types.CASE_CREATE_SED_FAILURE
    }
  })
}

export function addToSed (payload) {
  return api.call({
    url: urls.SED_ADD_URL,
    method: 'POST',
    payload: payload,
    type: {
      request: types.CASE_ADD_TO_SED_REQUEST,
      success: types.CASE_ADD_TO_SED_SUCCESS,
      failure: types.CASE_ADD_TO_SED_FAILURE
    }
  })
}

export function sendSed (params) {
  return api.call({
    url: sprintf(urls.SED_SEND_URL, { caseId: params.caseId, documentId: params.documentId }),
    type: {
      request: types.CASE_SEND_SED_REQUEST,
      success: types.CASE_SEND_SED_SUCCESS,
      failure: types.CASE_SEND_SED_FAILURE
    }
  })
}

export function getRinaUrl () {
  return api.call({
    url: urls.EUX_RINA_URL,
    type: {
      request: types.RINA_GET_URL_REQUEST,
      success: types.RINA_GET_URL_SUCCESS,
      failure: types.RINA_GET_URL_FAILURE
    }
  })
}
