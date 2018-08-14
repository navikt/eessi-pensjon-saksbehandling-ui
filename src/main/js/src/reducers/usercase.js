import * as types from '../constants/actionTypes';

export default function (state = {}, action = {}) {

    switch (action.type) {

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

    case types.USERCASE_CONFIRM_DATA_SUCCESS:

        return Object.assign({}, state, {
            dataToConfirm  : action.payload
        });

    case types.USERCASE_GENERATE_DATA_SUCCESS:

        return Object.assign({}, state, {
            dataToGenerate : action.payload
        });

    case types.USERCASE_CREATE_SED_SUCCESS:
    case types.USERCASE_ADD_TO_SED_SUCCESS:

        return Object.assign({}, state, {
            dataSubmitted : action.payload
        });

    case types.USERCASE_GET_CASE_NUMBER_SUCCESS:

        return Object.assign({}, state, {
            currentCase : action.payload
        });

    case types.USERCASE_GET_CASE_NUMBER_REQUEST:

        return Object.assign({}, state, {
            currentCase : undefined
        });

    case types.RINA_GET_URL_SUCCESS:

        return Object.assign({}, state, {
            rinaUrl : action.payload
        });

    case types.USERCASE_CLEAR_DATA:

        return Object.assign({}, state, {
            currentCase    : undefined,
            dataToGenerate : undefined,
            dataToConfirm  : undefined,
            dataSubmitted  : undefined
        });

    case types.USERCASE_CLEAR_CURRENT_CASE: {
        return  Object.assign({}, state, {
            currentCase : undefined
        });
    }

    default:
        return state;

    }
}
