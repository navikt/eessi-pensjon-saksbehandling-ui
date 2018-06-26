import * as types from '../constants/actionTypes';

export default function (state = {}, action = {}) {

  switch (action.type) {

    case types.USERCASE_GET_CASE_REQUEST:
    case types.USERCASE_GET_MOTTAGER_OPTIONS_REQUEST:
    case types.USERCASE_GET_SED_OPTIONS_REQUEST:
    case types.USERCASE_GET_BUC_OPTIONS_REQUEST:
    case types.USERCASE_POST_REQUEST:

      return Object.assign({}, state, {
        error        : undefined
      });

    case types.SERVER_OFFLINE:
      return Object.assign({}, state, {
        error : 'serverOffline'
      });

    default:
      return state;
  }
}
