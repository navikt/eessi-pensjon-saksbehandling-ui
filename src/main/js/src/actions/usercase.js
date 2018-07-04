import * as types from '../constants/actionTypes';
import * as urls from '../constants/urls';
import * as api from './api';

export function getCaseFromCaseNumber (obj) {

  return api.call({
    url: urls.CASE_URL + '/' + obj.caseId,
    type: {
      request: types.USERCASE_GET_CASE_REQUEST,
      success: types.USERCASE_GET_CASE_SUCCESS,
      failure: types.USERCASE_GET_CASE_FAILURE
    }
  });
}

export function getInstitutionOptions () {
  return api.call({
    url: urls.INSTITUTION_URL,
    type: {
      request: types.USERCASE_GET_INSTITUTION_OPTIONS_REQUEST,
      success: types.USERCASE_GET_INSTITUTION_OPTIONS_SUCCESS,
      failure: types.USERCASE_GET_INSTITUTION_OPTIONS_FAILURE
    }
  });
}

export function getBucOptions () {
  return api.call({
    url: urls.BUC_URL,
    type: {
      request: types.USERCASE_GET_BUC_OPTIONS_REQUEST,
      success: types.USERCASE_GET_BUC_OPTIONS_SUCCESS,
      failure: types.USERCASE_GET_BUC_OPTIONS_FAILURE
    }
  });
}

export function getSedOptions (buc) {
  return api.call({
    url: urls.SED_URL + '/' + buc,
    type: {
      request: types.USERCASE_GET_SED_OPTIONS_REQUEST,
      success: types.USERCASE_GET_SED_OPTIONS_SUCCESS,
      failure: types.USERCASE_GET_SED_OPTIONS_FAILURE
    }
  });
}

export function postChoices (params) {
  return api.call({
    url: urls.CASESUBMIT_URL,
    method: 'POST',
    payload: params,
    type: {
      request: types.USERCASE_POST_REQUEST,
      success: types.USERCASE_POST_SUCCESS,
      failure: types.USERCASE_POST_FAILURE
    }
  });
}
