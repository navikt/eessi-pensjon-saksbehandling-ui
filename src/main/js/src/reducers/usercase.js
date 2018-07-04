import * as types from '../constants/actionTypes';

export default function (state = {}, action = {}) {

    switch (action.type) {

    case types.USERCASE_GET_CASE_SUCCESS:

        return Object.assign({}, state, {
            currentCase : action.payload
        });

    case types.USERCASE_GET_INSTITUTION_OPTIONS_SUCCESS:

        return Object.assign({}, state, {
            institution : action.payload
        });

    case types.USERCASE_GET_SED_OPTIONS_SUCCESS:

        return Object.assign({}, state, {
            sed : action.payload
        });

    case types.USERCASE_GET_BUC_OPTIONS_SUCCESS:

        return Object.assign({}, state, {
            buc : action.payload
        });

    case types.USERCASE_POST_SUCCESS:

        return Object.assign({}, state, {
            submitted : action.payload,
            toConfirm : undefined
        });

    case types.USERCASE_GET_CASE_REQUEST:

        return Object.assign({}, state, {
            errorMessage : undefined,
            currentCase  : undefined
        });

    case types.USERCASE_GET_INSTITUTION_OPTIONS_REQUEST:
    case types.USERCASE_GET_SED_OPTIONS_REQUEST:
    case types.USERCASE_GET_BUC_OPTIONS_REQUEST:
    case types.USERCASE_POST_REQUEST:

        return Object.assign({}, state, {
            errorMessage : undefined
        });

    case types.USERCASE_GET_CASE_FAILURE:
    case types.USERCASE_GET_INSTITUTION_OPTIONS_FAILURE:
    case types.USERCASE_GET_SED_OPTIONS_FAILURE:
    case types.USERCASE_GET_BUC_OPTIONS_FAILURE:
    case types.USERCASE_POST_FAILURE:

        return Object.assign({}, state, {
            errorMessage : action.payload.serverMessage
        });

    case types.USERCASE_TO_CONFIRM_OPTIONS:

        return Object.assign({}, state, {
            toConfirm : action.payload
        });

    case types.USERCASE_TO_CONFIRM_CANCEL:

        return Object.assign({}, state, {
            toConfirm : undefined
        });

    default:
        return state;

    }
}
