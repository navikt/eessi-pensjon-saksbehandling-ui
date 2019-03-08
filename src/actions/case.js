import * as types from '../constants/actionTypes'
import * as urls from '../constants/urls'
import * as api from './api'
var sprintf = require('sprintf-js').sprintf

export function getCaseFromCaseNumber (obj) {
  return {
    type: types.CASE_GET_CASE_NUMBER_SUCCESS,
    payload: {
      casenumber: obj.sakId,
      pinid: obj.aktoerId,
      rinaid: obj.rinaId
    }
  }
  /* let url = obj.rinaId ? sprintf(urls.API_CASE_WITH_RINAID_URL, obj) : sprintf(urls.API_CASE_WITHOUT_RINAID_URL, obj)
  return api.call({
    url: url,
    type: {
      request: types.CASE_GET_CASE_NUMBER_REQUEST,
      success: types.CASE_GET_CASE_NUMBER_SUCCESS,
      failure: types.CASE_GET_CASE_NUMBER_FAILURE
    }
  })
  */
}

export function getSubjectAreaList () {
  return api.call({
    url: urls.API_SUBJECT_AREA_URL,
    type: {
      request: types.CASE_GET_SUBJECT_AREA_LIST_REQUEST,
      success: types.CASE_GET_SUBJECT_AREA_LIST_SUCCESS,
      failure: types.CASE_GET_SUBJECT_AREA_LIST_FAILURE
    }
  })
}

export function getCountryList () {
  return {
    type: types.CASE_GET_COUNTRY_LIST_SUCCESS,
    payload: ['NO']
  }
  /* return api.call({
    url: urls.API_COUNTRY_URL,
    type: {
      request: types.CASE_GET_COUNTRY_LIST_REQUEST,
      success: types.CASE_GET_COUNTRY_LIST_SUCCESS,
      failure: types.CASE_GET_COUNTRY_LIST_FAILURE
    }
  }) */
}

export function getInstitutionList () {
  return {
    type: types.CASE_GET_INSTITUTION_LIST_SUCCESS,
    payload: ['NAVT003']
  }
  /* return api.call({
    url: urls.API_INSTITUTIONS_URL,
    type: {
      request: types.CASE_GET_INSTITUTION_LIST_REQUEST,
      success: types.CASE_GET_INSTITUTION_LIST_SUCCESS,
      failure: types.CASE_GET_INSTITUTION_LIST_FAILURE
    }
  }) */
}

export function getInstitutionListForCountry (country) {
  return {
    type: types.CASE_GET_INSTITUTION_LIST_SUCCESS,
    payload: ['NAVT003']
  }
  /* return api.call({
    url: sprintf(urls.API_INSTITUTIONS_FOR_COUNTRY_URL, { country: country }),
    type: {
      request: types.CASE_GET_INSTITUTION_LIST_REQUEST,
      success: types.CASE_GET_INSTITUTION_LIST_SUCCESS,
      failure: types.CASE_GET_INSTITUTION_LIST_FAILURE
    }
  }) */
}

export function getBucList (rinaId) {
  let url = rinaId ? sprintf(urls.API_BUC_FROM_RINA_URL, { rinaId: rinaId })
    : urls.API_BUCS_URL

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
  let url = rinaId ? sprintf(urls.API_SED_FROM_RINA_URL, { rinaId: rinaId })
    : sprintf(urls.API_SED_FOR_BUCS_URL, { buc: buc })

  return api.call({
    url: url,
    type: {
      request: types.CASE_GET_SED_LIST_REQUEST,
      success: types.CASE_GET_SED_LIST_SUCCESS,
      failure: types.CASE_GET_SED_LIST_FAILURE
    }
  })
}

export function dataToConfirm (params) {
  return {
    type: types.CASE_CONFIRM_DATA_SUCCESS,
    payload: params
  }
}

export function cleanCaseNumber () {
  return {
    type: types.CASE_GET_CASE_NUMBER_CLEAN
  }
}

export function cleanDataToConfirm () {
  return {
    type: types.CASE_CONFIRM_DATA_CLEAN
  }
}

export function cleanDataToGenerate () {
  return {
    type: types.CASE_GENERATE_DATA_CLEAN
  }
}

export function cleanDataSaved () {
  return {
    type: types.CASE_SAVE_DATA_CLEAN
  }
}

export function generateData (params) {
  return api.call({
    url: urls.SED_PREVIEW_URL,
    method: 'POST',
    payload: params,
    type: {
      request: types.CASE_GENERATE_DATA_REQUEST,
      success: types.CASE_GENERATE_DATA_SUCCESS,
      failure: types.CASE_GENERATE_DATA_FAILURE
    }
  })
}

export function createSed (params) {
  return api.call({
    url: urls.SED_BUC_CREATE_URL,
    method: 'POST',
    payload: params,
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

export function sendSed (payload) {
  return api.call({
    url: urls.SED_URL,
    method: 'POST',
    payload: payload,
    type: {
      request: types.CASE_SEND_SED_REQUEST,
      success: types.CASE_SEND_SED_SUCCESS,
      failure: types.CASE_SEND_SED_FAILURE
    }
  })
}

export function getRinaUrl () {
  return api.call({
    url: urls.API_RINA_URL,
    type: {
      request: types.RINA_GET_URL_REQUEST,
      success: types.RINA_GET_URL_SUCCESS,
      failure: types.RINA_GET_URL_FAILURE
    }
  })
}
