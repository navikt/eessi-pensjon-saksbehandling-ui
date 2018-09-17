import * as types from '../constants/actionTypes';

export default function (state = {}, action = {}) {

    switch (action.type) {

    case types.USERCASE_GET_CASE_NUMBER_REQUEST:

        return Object.assign({}, state, {
            gettingCase : true
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

    case types.RINA_GET_URL_REQUEST:

        return Object.assign({}, state, {
            rinaUrl : true
        });

    case types.USERCASE_CREATE_SED_REQUEST:
    case types.USERCASE_ADD_TO_SED_REQUEST:

        return Object.assign({}, state, {
            savingCase : true
        });

    case types.USERCASE_SEND_SED_REQUEST:

        return Object.assign({}, state, {
            sendingCase : true
        });

    case types.USERCASE_GENERATE_DATA_REQUEST:

        return Object.assign({}, state, {
            generatingCase : true
        });

    case types.USER_INFO_REQUEST:

        return Object.assign({}, state, {
            gettingUserInfo : true
        });

    case types.STATUS_GET_REQUEST:
    case types.STATUS_RINA_CASE_REQUEST:

        return Object.assign({}, state, {
            gettingStatus : true
        });

    case types.USERCASE_GET_CASE_NUMBER_SUCCESS:
    case types.USERCASE_GET_CASE_NUMBER_FAILURE:

        return Object.assign({}, state, {
            gettingCase : false
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

    case types.USERCASE_CREATE_SED_SUCCESS:
    case types.USERCASE_CREATE_SED_FAILURE:
    case types.USERCASE_ADD_TO_SED_SUCCESS:
    case types.USERCASE_ADD_TO_SED_FAILURE:

        return Object.assign({}, state, {
            savingCase : false
        });

    case types.USERCASE_SEND_SED_SUCCESS:
    case types.USERCASE_SEND_SED_FAILURE:

        return Object.assign({}, state, {
            sendingCase : false
        });

    case types.USERCASE_GENERATE_DATA_SUCCESS:
    case types.USERCASE_GENERATE_DATA_FAILURE:

        return Object.assign({}, state, {
            generatingCase : false
        });

    case types.RINA_GET_URL_SUCCESS:
    case types.RINA_GET_URL_FAILURE:

        return Object.assign({}, state, {
            rinaUrl : false
        });

    case types.USER_INFO_SUCCESS:
    case types.USER_INFO_FAILURE:

        return Object.assign({}, state, {
            gettingUserInfo : false
        });

    case types.STATUS_GET_SUCCESS:
    case types.STATUS_GET_FAILURE:
    case types.STATUS_RINA_CASE_SUCCESS:
    case types.STATUS_RINA_CASE_FAILURE:

        return Object.assign({}, state, {
            gettingStatus : false
        });

    case types.PDF_GENERATE_REQUEST:

        return Object.assign({}, state, {
            generatingPDF : true
        });

    case types.PDF_GENERATE_SUCCESS:
    case types.PDF_GENERATE_FAILURE:

        return Object.assign({}, state, {
            generatingPDF : false
        });

    case types.PDF_LOADING_FILES_STARTED:

        return Object.assign({}, state, {
            loadingPDF : true
        });

    case types.PDF_LOADING_FILES_FINISHED:

        return Object.assign({}, state, {
            loadingPDF : false
        });

    default:

        return state;
    }
}
