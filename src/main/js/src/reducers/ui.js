import * as types from '../constants/actionTypes';

export default function (state = {}, action = {}) {

  switch (action.type) {

  case types.USERCASE_GET_CASE_REQUEST:
  case types.USERCASE_GET_INSTITUTION_OPTIONS_REQUEST:
  case types.USERCASE_GET_SED_OPTIONS_REQUEST:
  case types.USERCASE_GET_BUC_OPTIONS_REQUEST:
  case types.USERCASE_POST_REQUEST:

    return Object.assign({}, state, {
      isProcessing : true,
      serverError  : undefined
    });

  case types.SERVER_OFFLINE:

    return Object.assign({}, state, {
      isProcessing : false,
      serverError : 'serverOffline'
    });

  case types.USERCASE_GET_CASE_SUCCESS:
  case types.USERCASE_GET_INSTITUTION_OPTIONS_SUCCESS:
  case types.USERCASE_GET_SED_OPTIONS_SUCCESS:
  case types.USERCASE_GET_BUC_OPTIONS_SUCCESS:
  case types.USERCASE_POST_SUCCESS:
  case types.USERCASE_GET_CASE_FAILURE:
  case types.USERCASE_GET_INSTITUTION_OPTIONS_FAILURE:
  case types.USERCASE_GET_SED_OPTIONS_FAILURE:
  case types.USERCASE_GET_BUC_OPTIONS_FAILURE:
  case types.USERCASE_POST_FAILURE:

    return Object.assign({}, state, {
      isProcessing : false
    });

  case types.LANGUAGE_CHANGED:

    return Object.assign({}, state, {
      language : action.payload
    });

  default:

    return state;
  }
}
