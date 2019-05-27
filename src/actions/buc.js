import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import * as api from './api'
var sprintf = require('sprintf-js').sprintf

export const setMode = (mode) => {
  return {
    type: types.BUC_MODE_SET,
    payload: mode
  }
}

export const setBuc = (buc) => {
  return {
    type: types.BUC_BUC_SET,
    payload: buc
  }
}

export const setSeds = (seds) => {
  return {
    type: types.BUC_SEDS_SET,
    payload: seds
  }
}

export const getCaseFromCaseNumber = (params) => {
  let url = params.rinaId ? sprintf(urls.EUX_CASE_WITH_RINAID_URL, params) : sprintf(urls.EUX_CASE_WITHOUT_RINAID_URL, params)
  return api.call({
    url: url,
    type: {
      request: types.BUC_GET_CASE_NUMBER_REQUEST,
      success: types.BUC_GET_CASE_NUMBER_SUCCESS,
      failure: types.BUC_GET_CASE_NUMBER_FAILURE
    }
  })
}

export const getSubjectAreaList = () => {
  return api.call({
    url: urls.EUX_SUBJECT_AREA_URL,
    type: {
      request: types.BUC_GET_SUBJECT_AREA_LIST_REQUEST,
      success: types.BUC_GET_SUBJECT_AREA_LIST_SUCCESS,
      failure: types.BUC_GET_SUBJECT_AREA_LIST_FAILURE
    }
  })
}

export const getCountryList = () => {
  return api.call({
    url: urls.EUX_COUNTRY_URL,
    type: {
      request: types.BUC_GET_COUNTRY_LIST_REQUEST,
      success: types.BUC_GET_COUNTRY_LIST_SUCCESS,
      failure: types.BUC_GET_COUNTRY_LIST_FAILURE
    }
  })
}

export const getInstitutionListForBucAndCountry = (buc, country) => {
  return api.call({
    url: sprintf(urls.EUX_INSTITUTIONS_FOR_BUC_AND_COUNTRY_URL, { buc: buc, country: country }),
    type: {
      request: types.BUC_GET_INSTITUTION_LIST_REQUEST,
      success: types.BUC_GET_INSTITUTION_LIST_SUCCESS,
      failure: types.BUC_GET_INSTITUTION_LIST_FAILURE
    }
  })
}

export const getInstitutionListForCountry = (country) => {
  return api.call({
    url: sprintf(urls.EUX_INSTITUTIONS_FOR_COUNTRY_URL, { country: country }),
    type: {
      request: types.BUC_GET_INSTITUTION_LIST_REQUEST,
      success: types.BUC_GET_INSTITUTION_LIST_SUCCESS,
      failure: types.BUC_GET_INSTITUTION_LIST_FAILURE
    }
  })
}

export const removeInstitutionForCountry = (country) => {
  return {
    type: types.BUC_REMOVE_INSTITUTION_LIST_FOR_COUNTRY,
    payload: country
  }
}

export const fetchBucs = (aktoerId) => {

  let url = sprintf(urls.SED_AKTOERID_DETALJER_URL, { aktoerId: aktoerId })
  return api.call({
    url: url,
    type: {
      request: types.BUC_GET_BUCS_REQUEST,
      success: types.BUC_GET_BUCS_SUCCESS,
      failure: types.BUC_GET_BUCS_FAILURE
    }
  })
}

export const getBucList = (aktoerId) => {

  return api.call({
    url: urls.EUX_BUCS_URL,
    type: {
      request: types.BUC_GET_BUC_LIST_REQUEST,
      success: types.BUC_GET_BUC_LIST_SUCCESS,
      failure: types.BUC_GET_BUC_LIST_FAILURE
    }
  })
}

export const getSedList = (buc, rinaId) => {
  let url = rinaId ? sprintf(urls.EUX_SED_FROM_RINA_URL, { rinaId: rinaId })
    : sprintf(urls.EUX_SED_FOR_BUCS_URL, { buc: buc })

  return api.call({
    url: url,
    type: {
      request: types.BUC_GET_SED_LIST_REQUEST,
      success: types.BUC_GET_SED_LIST_SUCCESS,
      failure: types.BUC_GET_SED_LIST_FAILURE
    }
  })
}

export const cleanCaseNumber = () => {
  return {
    type: types.BUC_GET_CASE_NUMBER_CLEAN
  }
}

export const createSed = (payload) => {
  return api.call({
    url: urls.SED_BUC_CREATE_URL,
    method: 'POST',
    payload: payload,
    type: {
      request: types.BUC_CREATE_SED_REQUEST,
      success: types.BUC_CREATE_SED_SUCCESS,
      failure: types.BUC_CREATE_SED_FAILURE
    }
  })
}

export const addToSed = (payload) => {
  return api.call({
    url: urls.SED_ADD_URL,
    method: 'POST',
    payload: payload,
    type: {
      request: types.BUC_ADD_TO_SED_REQUEST,
      success: types.BUC_ADD_TO_SED_SUCCESS,
      failure: types.BUC_ADD_TO_SED_FAILURE
    }
  })
}

export const sendSed = (params) => {
  return api.call({
    url: sprintf(urls.SED_SEND_URL, { caseId: params.caseId, documentId: params.documentId }),
    type: {
      request: types.BUC_SEND_SED_REQUEST,
      success: types.BUC_SEND_SED_SUCCESS,
      failure: types.BUC_SEND_SED_FAILURE
    }
  })
}

export const getRinaUrl = () => {
  return api.call({
    url: urls.EUX_RINA_URL,
    type: {
      request: types.RINA_GET_URL_REQUEST,
      success: types.RINA_GET_URL_SUCCESS,
      failure: types.RINA_GET_URL_FAILURE
    }
  })
}
