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

    case types.USERCASE_DATA_TO_CONFIRM_SUCCESS:

        return Object.assign({}, state, {
            dataToConfirm  : action.payload
        });

    case types.USERCASE_DATA_TO_GENERATE_SUCCESS:

        return Object.assign({}, state, {
            dataToGenerate : action.payload
        });

    case types.USERCASE_POST_SUCCESS:

        return Object.assign({}, state, {
            dataSubmitted : action.payload
        });

    case types.USERCASE_GET_CASE_SUCCESS:

        return Object.assign({}, state, {
            currentCase : action.payload
        });

    case types.USERCASE_GET_CASE_REQUEST:

        return Object.assign({}, state, {
            currentCase  : undefined
        });

    case types.GET_RINA_URL_SUCCESS:

        return Object.assign({}, state, {
            rinaurl : action.payload
        });

    default:
        return state;

    }
}
