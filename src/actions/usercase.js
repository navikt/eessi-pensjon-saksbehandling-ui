import * as types from '../constants/actionTypes';
//import * as urls from '../constants/urls';
//import * as api from './api';

export function getCaseFromCaseNumber (obj) {

  if (
    (obj.hasOwnProperty('caseId') && obj.caseId.match(/\d+/)) ||
    (obj.hasOwnProperty('caseHandler') && obj.caseHandler.match(/\d+/))
  ) {
    return (dispatch) => {
      dispatch({
        type: types.USERCASE_GET_CASE_SUCCESS,
        payload: {
          'caseId'      : obj.caseId,
          'caseHandler' : obj.caseHandler
        }
      })
    }
  } else {
    return (dispatch) => {
      dispatch({
        type: types.USERCASE_GET_CASE_FAILURE,
        payload: {
          'serverMessage': 'invalidCaseNumber'
        }
      })
    }
  }
  /*return api.call({
    method: 'GET',
    url: urls.USERCASE_URL + '/' + id,
    type: {
      request: types.CASE_REQUEST,
      failure: types.CASE_FAILURE,
      success: types.CASE_SUCCESS
    },
    payload: undefined
  })*/
}

export function getMottagerOptions () {
  return (dispatch) => {
    dispatch({
      type: types.USERCASE_GET_MOTTAGER_OPTIONS_SUCCESS,
      payload: [
        'Mottager1',
        'Mottager2',
        'Mottager3'
      ]
    })
  }
}

export function getBucOptions () {
  return (dispatch) => {
    dispatch({
      type: types.USERCASE_GET_BUC_OPTIONS_SUCCESS,
      payload: [
        'BUC1',
        'BUC2',
        'BUC3'
      ]
    })
  }
}

export function getSedOptions () {
  return (dispatch) => {
    dispatch({
      type: types.USERCASE_GET_SED_OPTIONS_SUCCESS,
      payload: [
        'SED1',
        'SED2',
        'SED3'
      ]
    })
  }
}

export function postChoices (params) {
  if (!params.mottager || !params.buc || !params.sed) {
   return (dispatch) => {
      dispatch({
        type: types.USERCASE_POST_FAILURE,
        payload:  {'serverMessage': 'insufficientParameters'}
      })
    }
  }

  return (dispatch) => {
    dispatch({
      type: types.USERCASE_POST_SUCCESS,
      payload: params
    })
  }
}









