import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import * as api from './api'
import _ from 'lodash'
import sampleBucs from 'resources/tests/sampleBucs'

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

export const fetchBucs = (aktoerId) => {
  let funcCall = urls.HOST === 'localhost' ? api.fakecall : api.call
  return funcCall({
    url: sprintf(urls.BUC_AKTOERID_DETALJER_URL, { aktoerId: aktoerId }),
    expectedPayload: sampleBucs,
    type: {
      request: types.BUC_GET_BUCS_REQUEST,
      success: types.BUC_GET_BUCS_SUCCESS,
      failure: types.BUC_GET_BUCS_FAILURE
    }
  })
}

export const fetchBucsInfoList = (aktoerId) => {
  return api.call({
    url: sprintf(urls.API_STORAGE_LIST_URL, { userId: aktoerId, namespace: 'BUC' }),
    type: {
      request: types.BUC_GET_BUCSINFO_LIST_REQUEST,
      success: types.BUC_GET_BUCSINFO_LIST_SUCCESS,
      failure: types.BUC_GET_BUCSINFO_LIST_FAILURE
    }
  })
}

export const fetchBucsInfo = (aktoerId) => {
  return api.call({
    url: sprintf(urls.API_STORAGE_GET_URL, { userId: aktoerId, namespace: 'BUC', file: 'INFO' }),
    type: {
      request: types.BUC_GET_BUCSINFO_REQUEST,
      success: types.BUC_GET_BUCSINFO_SUCCESS,
      failure: types.BUC_GET_BUCSINFO_FAILURE
    }
  })
}

export const verifyCaseNumber = (params) => {
  let url = sprintf(urls.EUX_CASE_URL, params)
  return api.call({
    url: url,
    type: {
      request: types.BUC_VERIFY_CASE_NUMBER_REQUEST,
      success: types.BUC_VERIFY_CASE_NUMBER_SUCCESS,
      failure: types.BUC_VERIFY_CASE_NUMBER_FAILURE
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

export const getTagList = (aktoerId) => {
  return {
    type: types.BUC_GET_TAG_LIST_SUCCESS,
    payload: ['urgent', 'vip', 'sensitive', 'secret']
  }
}

export const createBuc = (buc) => {
  let funcCall = urls.HOST === 'localhost' ? api.fakecall : api.call
  return funcCall({
    url: sprintf(urls.BUC_CREATE_BUC_URL, { buc: buc }),
    method: 'POST',
     expectedPayload: {
       'type': buc,
       'caseId': '123'
     },
    type: {
      request: types.BUC_CREATE_BUC_REQUEST,
      success: types.BUC_CREATE_BUC_SUCCESS,
      failure: types.BUC_CREATE_BUC_FAILURE
    }
  })
}

export const saveBucsInfo = (params) => {
  let newBucsInfo = params.bucsInfo ? _.cloneDeep(params.bucsInfo) : {}
  let newTags = params.tags ? params.tags.map(tag => {
    return tag.value
  }) : []

  if (!newBucsInfo.hasOwnProperty('bucs')) {
    newBucsInfo['bucs'] = {}
  }

  if (!newBucsInfo.bucs.hasOwnProperty(params.buc)) {
    newBucsInfo.bucs[params.buc] = {}
  }
  newBucsInfo.bucs[params.buc]['tags'] = newTags

  return api.call({
    url: sprintf(urls.API_STORAGE_POST_URL, { userId: params.aktoerId, namespace: 'BUC', file: 'INFO' }),
    method: 'POST',
    payload: newBucsInfo,
    type: {
      request: types.BUC_SAVE_BUCSINFO_REQUEST,
      success: types.BUC_SAVE_BUCSINFO_SUCCESS,
      failure: types.BUC_SAVE_BUCSINFO_FAILURE
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

export const getSedList = (buc) => {
  let url = sprintf(urls.EUX_SED_FOR_BUCS_URL, { buc: buc.type })
  return api.call({
    url: url,
    type: {
      request: types.BUC_GET_SED_LIST_REQUEST,
      success: types.BUC_GET_SED_LIST_SUCCESS,
      failure: types.BUC_GET_SED_LIST_FAILURE
    }
  })
}

export const getInstitutionsListForBucAndCountry = (buc, country) => {
  return api.call({
    url: sprintf(urls.EUX_INSTITUTIONS_FOR_BUC_AND_COUNTRY_URL, { buc: buc, country: country }),
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

export const createSed = (payload) => {
  return api.call({
    url: urls.BUC_CREATE_SED_URL,
    payload: payload,
    method: 'POST',
    type: {
      request: types.BUC_CREATE_SED_REQUEST,
      success: types.BUC_CREATE_SED_SUCCESS,
      failure: types.BUC_CREATE_SED_FAILURE
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
