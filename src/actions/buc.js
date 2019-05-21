import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import * as api from './api'
var sprintf = require('sprintf-js').sprintf

const BUCLIST = [
  {
    type: 'P_BUC_01',
    name: 'AldersPensjon',
    dateCreated: 'dd.mm.åå',
    countries: ['ZW', 'KR', 'SE', 'DK', 'CZ']
  },
  {
    type: 'P_BUC_02',
    name: 'UførePensjon',
    dateCreated: 'dd.mm.åå',
    countries: ['SE', 'DK', 'CZ'],
    merknader: ['foo', 'bar', 'baz']
  },
  {
    type: 'P_BUC_01',
    name: 'AldersPensjon',
    dateCreated: 'dd.mm.åå',
    countries: ['ZW', 'KR', 'SE', 'DK', 'CZ'],
    comments: ['foo', 'bar', 'baz']
  },
  {
    type: 'P_BUC_01',
    name: 'AldersPensjon',
    dateCreated: 'dd.mm.åå',
    countries: ['ZW', 'KR', 'SE', 'DK', 'CZ'],
    merknader: ['foo', 'bar', 'baz'],
    comments: ['foo', 'bar', 'baz']
  }
]


const SEDS = [
  {
    name: 'P2000',
    status: 'sent',
    date: 'dd.mm.åå',
    institutions: [{
       country: 'Sverige',
       institution: 'Försäkringskassan'
    }]
  },
  {
    name: 'P3000SE',
    status: 'draft',
    date: 'dd.mm.åå',
    institutions: [{
       country: 'Sverige',
       institution: 'Försäkringskassan'
    }, {
       country: 'Danmark',
       institution: 'Udbetaling Danmark'
    }, {
       country: 'Norge',
       institution: 'NAV'
    }]
  },
  {
    name: 'P4000',
    status: 'received',
    date: 'dd.mm.åå',
    institutions: [{
       country: 'Danmark',
       institution: 'Udbetaling Danmark'
    }]
  },
  {
    name: 'P5000',
    status: 'foo',
    date: 'dd.mm.åå',
    institutions: [{
       country: 'Sverige',
       institution: 'Försäkringskassan'
    }]
  }
]

export const fetchBucList = () => {
  return {
    type: types.BUC_LIST_SET,
    payload: BUCLIST
  }
}

export const setMode = (mode) => {
  return {
    type: types.BUC_MODE_SET,
    payload: mode
  }
}

export const fetchSedListForBuc = async (buc) => {
  return SEDS
}

export const setStep = (step) => {
  return {
    type: types.CASE_STEP_SET,
    payload: step
  }
}

export const getCaseFromCaseNumber = (params) => {
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

export const getSubjectAreaList = () => {
  return api.call({
    url: urls.EUX_SUBJECT_AREA_URL,
    type: {
      request: types.CASE_GET_SUBJECT_AREA_LIST_REQUEST,
      success: types.CASE_GET_SUBJECT_AREA_LIST_SUCCESS,
      failure: types.CASE_GET_SUBJECT_AREA_LIST_FAILURE
    }
  })
}

export const getCountryList = () => {
  return api.call({
    url: urls.EUX_COUNTRY_URL,
    type: {
      request: types.CASE_GET_COUNTRY_LIST_REQUEST,
      success: types.CASE_GET_COUNTRY_LIST_SUCCESS,
      failure: types.CASE_GET_COUNTRY_LIST_FAILURE
    }
  })
}

export const getInstitutionListForBucAndCountry = (buc, country) => {
  return api.call({
    url: sprintf(urls.EUX_INSTITUTIONS_FOR_BUC_AND_COUNTRY_URL, { buc: buc, country: country }),
    type: {
      request: types.CASE_GET_INSTITUTION_LIST_REQUEST,
      success: types.CASE_GET_INSTITUTION_LIST_SUCCESS,
      failure: types.CASE_GET_INSTITUTION_LIST_FAILURE
    }
  })
}

export const getInstitutionListForCountry = (country) => {
  return api.call({
    url: sprintf(urls.EUX_INSTITUTIONS_FOR_COUNTRY_URL, { country: country }),
    type: {
      request: types.CASE_GET_INSTITUTION_LIST_REQUEST,
      success: types.CASE_GET_INSTITUTION_LIST_SUCCESS,
      failure: types.CASE_GET_INSTITUTION_LIST_FAILURE
    }
  })
}

export const removeInstitutionForCountry = (country) => {
  return {
    type: types.CASE_REMOVE_INSTITUTION_LIST_FOR_COUNTRY,
    payload: country
  }
}

export const getBucList = (rinaId) => {
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

export const getSedList = (buc, rinaId) => {
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

export const dataPreview = (params) => {
  return {
    type: types.CASE_DATA_PREVIEW_SUCCESS,
    payload: params
  }
}

export const cleanCaseNumber = () => {
  return {
    type: types.CASE_GET_CASE_NUMBER_CLEAN
  }
}

export const createSed = (payload) => {
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

export const addToSed = (payload) => {
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

export const sendSed = (params) => {
  return api.call({
    url: sprintf(urls.SED_SEND_URL, { caseId: params.caseId, documentId: params.documentId }),
    type: {
      request: types.CASE_SEND_SED_REQUEST,
      success: types.CASE_SEND_SED_SUCCESS,
      failure: types.CASE_SEND_SED_FAILURE
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
