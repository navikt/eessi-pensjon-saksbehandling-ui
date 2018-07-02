import * as types from '../constants/actionTypes';

export default function (state = {}, action = {}) {

  switch (action.type) {

  case types.USERCASE_GET_CASE_REQUEST:

    return Object.assign({}, state, {
      'getcase' : true,
    });

  case types.USERCASE_GET_INSTITUTION_OPTIONS_REQUEST:

    return Object.assign({}, state, {
      'institution' : true,
    });

  case types.USERCASE_GET_SED_OPTIONS_REQUEST:

    return Object.assign({}, state, {
      'sed' : true,
    });

  case types.USERCASE_GET_BUC_OPTIONS_REQUEST:

    return Object.assign({}, state, {
      'buc' : true,
    });

  case types.USERCASE_POST_REQUEST:

    return Object.assign({}, state, {
      'postcase' : true,
    });

  case types.USERCASE_GET_CASE_SUCCESS:
  case types.USERCASE_GET_CASE_FAILURE:

    return Object.assign({}, state, {
      'getcase' : false,
    });

  case types.USERCASE_GET_INSTITUTION_OPTIONS_SUCCESS:
  case types.USERCASE_GET_INSTITUTION_OPTIONS_FAILURE:

    return Object.assign({}, state, {
      'institution' : false,
    });

  case types.USERCASE_GET_SED_OPTIONS_SUCCESS:
  case types.USERCASE_GET_SED_OPTIONS_FAILURE:

    return Object.assign({}, state, {
      'sed' : false,
    });

  case types.USERCASE_GET_BUC_OPTIONS_SUCCESS:
  case types.USERCASE_GET_BUC_OPTIONS_FAILURE:

    return Object.assign({}, state, {
      'buc' : false,
    });

  case types.USERCASE_POST_SUCCESS:
  case types.USERCASE_POST_FAILURE:

    return Object.assign({}, state, {
      'postcase' : false
    });

  default:

    return state;
  }
}
