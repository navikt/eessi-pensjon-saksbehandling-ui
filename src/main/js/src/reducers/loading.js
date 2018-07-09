import * as types from '../constants/actionTypes';

export default function (state = {}, action = {}) {

    switch (action.type) {

    case types.USERCASE_GET_CASE_REQUEST:

        return Object.assign({}, state, {
            getcase : true
        });

    case types.USERCASE_GET_SUBJECT_AREA_LIST_REQUEST:

        return Object.assign({}, state, {
            subjectAreaList : true
        });

    case types.USERCASE_GET_INSTITUTION_LIST_REQUEST:

        return Object.assign({}, state, {
            institutionList : true
        });

    case types.USERCASE_GET_SED_LIST_REQUEST:

        return Object.assign({}, state, {
            sedList : true
        });

    case types.USERCASE_GET_BUC_LIST_REQUEST:

        return Object.assign({}, state, {
            bucList : true
        });

    case types.USERCASE_GET_COUNTRY_LIST_REQUEST:

        return Object.assign({}, state, {
            countryList : true
        });

    case types.GET_RINA_URL_REQUEST:

        return Object.assign({}, state, {
            rinaurl : true
        });

    case types.USERCASE_POST_REQUEST:

        return Object.assign({}, state, {
            postcase : true
        });

    case types.USERCASE_DATA_TO_GENERATE_REQUEST:

        return Object.assign({}, state, {
            generatecase : true
        });

    case types.USERCASE_GET_CASE_SUCCESS:
    case types.USERCASE_GET_CASE_FAILURE:

        return Object.assign({}, state, {
            getcase : false
        });

    case types.USERCASE_GET_SUBJECT_AREA_LIST_SUCCESS:
    case types.USERCASE_GET_SUBJECT_AREA_LIST_FAILURE:

        return Object.assign({}, state, {
            subjectAreaList : false
        });

    case types.USERCASE_GET_INSTITUTION_LIST_SUCCESS:
    case types.USERCASE_GET_INSTITUTION_LIST_FAILURE:

        return Object.assign({}, state, {
            institutionList : false
        });

    case types.USERCASE_GET_SED_LIST_SUCCESS:
    case types.USERCASE_GET_SED_LIST_FAILURE:

        return Object.assign({}, state, {
            sedList : false
        });

    case types.USERCASE_GET_BUC_LIST_SUCCESS:
    case types.USERCASE_GET_BUC_LIST_FAILURE:

        return Object.assign({}, state, {
            bucList : false
        });

    case types.USERCASE_GET_COUNTRY_LIST_SUCCESS:
    case types.USERCASE_GET_COUNTRY_LIST_FAILURE:

        return Object.assign({}, state, {
            countryList : false
        });

    case types.USERCASE_POST_SUCCESS:
    case types.USERCASE_POST_FAILURE:

        return Object.assign({}, state, {
            postcase : false
        });

    case types.USERCASE_DATA_TO_GENERATE_SUCCESS:
    case types.USERCASE_DATA_TO_GENERATE_FAILURE:

        return Object.assign({}, state, {
            generatecase : false
        });

    case types.GET_RINA_URL_SUCCESS:
    case types.GET_RINA_URL_FAILURE:

        return Object.assign({}, state, {
            rinaurl : false
        });

    default:

        return state;
    }
}
