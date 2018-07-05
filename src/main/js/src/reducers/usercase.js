import * as types from '../constants/actionTypes';

export default function (state = {}, action = {}) {

    switch (action.type) {

    case types.USERCASE_GET_CASE_SUCCESS:

        return Object.assign({}, state, {
            currentCase : action.payload
        });

    case types.USERCASE_GET_SUBJECT_AREA_LIST_SUCCESS:

        return Object.assign({}, state, {
            subjectAreaList : action.payload
        });

    case types.USERCASE_GET_INSTITUTION_LIST_SUCCESS:

        return Object.assign({}, state, {
            institutionList : action.payload
        });

    case types.USERCASE_GET_SED_LIST_SUCCESS:

        return Object.assign({}, state, {
            sedList : action.payload
        });

    case types.USERCASE_GET_BUC_LIST_SUCCESS:

        return Object.assign({}, state, {
            bucList : action.payload
        });

    case types.USERCASE_GET_COUNTRY_LIST_SUCCESS:

        return Object.assign({}, state, {
            countryList : action.payload
        });

    case types.USERCASE_POST_SUCCESS:

        return Object.assign({}, state, {
            dataSubmitted : action.payload,
            dataToConfirm : undefined
        });

    case types.USERCASE_GET_CASE_REQUEST:

        return Object.assign({}, state, {
            errorMessage : undefined,
            errorStatus  : undefined,
            currentCase  : undefined
        });

    case types.USERCASE_GET_SUBJECT_AREA_LIST_REQUEST:
    case types.USERCASE_GET_INSTITUTION_LIST_REQUEST:
    case types.USERCASE_GET_SED_LIST_REQUEST:
    case types.USERCASE_GET_BUC_LIST_REQUEST:
    case types.USERCASE_GET_COUNTRY_LIST_REQUEST:
    case types.USERCASE_POST_REQUEST:

        return Object.assign({}, state, {
            errorMessage : undefined,
            errorStatus  : undefined
        });

    case types.USERCASE_GET_CASE_FAILURE:
    case types.USERCASE_GET_SUBJECT_AREA_LIST_FAILURE:
    case types.USERCASE_GET_INSTITUTION_LIST_FAILURE:
    case types.USERCASE_GET_SED_LIST_FAILURE:
    case types.USERCASE_GET_BUC_LIST_FAILURE:
    case types.USERCASE_GET_COUNTRY_LIST_FAILURE:
    case types.USERCASE_POST_FAILURE:

        return Object.assign({}, state, {
            errorStatus  : 'ERROR',
            errorMessage : action.payload.serverMessage
        });

    case types.USERCASE_DATA_TO_CONFIRM:

        return Object.assign({}, state, {
            dataToConfirm : action.payload
        });

    case types.USERCASE_DATA_TO_CONFIRM_CANCEL:

        return Object.assign({}, state, {
            dataToConfirm : undefined
        });

    default:
        return state;

    }
}
