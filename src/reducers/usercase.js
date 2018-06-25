import * as types from '../constants/actionTypes';

export default function (state = {}, action = {}) {

  switch (action.type) {

  case types.USERCASE_GET_CASE_SUCCESS:

    return Object.assign({}, state, {
      isProcessing : false,
      usercase     : action.payload,
    });

  case types.USERCASE_GET_MOTTAGER_OPTIONS_SUCCESS:

    return Object.assign({}, state, {
      isProcessing : false,
      mottager     : action.payload
    });

  case types.USERCASE_GET_SED_OPTIONS_SUCCESS:

    return Object.assign({}, state, {
      isProcessing : false,
      sed          : action.payload
    });

  case types.USERCASE_GET_BUC_OPTIONS_SUCCESS:

    return Object.assign({}, state, {
      isProcessing : false,
      buc          : action.payload
    });

  case types.USERCASE_POST_SUCCESS:

    return Object.assign({}, state, {
      isProcessing : false,
      submitted    : action.payload
    });

  case types.USERCASE_GET_CASE_REQUEST:
  case types.USERCASE_GET_MOTTAGER_OPTIONS_REQUEST:
  case types.USERCASE_GET_SED_OPTIONS_REQUEST:
  case types.USERCASE_GET_BUC_OPTIONS_REQUEST:
  case types.USERCASE_POST_REQUEST:

    return Object.assign({}, state, {
      isProcessing : true,
      error        : undefined
    });

  case types.USERCASE_GET_CASE_FAILURE:
  case types.USERCASE_GET_MOTTAGER_OPTIONS_FAILURE:
  case types.USERCASE_GET_SED_OPTIONS_FAILURE:
  case types.USERCASE_GET_BUC_OPTIONS_FAILURE:
  case types.USERCASE_POST_FAILURE:

    return Object.assign({}, state, {
      isProcessing : false,
      error        : action.payload.serverMessage
    });

  default:
    return state;

  }
}
