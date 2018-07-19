import * as types from '../constants/actionTypes';
import * as urls  from '../constants/urls';
import * as api   from './api';

export function getCaseFromCaseNumber (obj) {

    return api.call({
        url: urls.GET_CASE_NUMBER_URL + '/' + obj.caseId + '/' + obj.actorId,
        type: {
            request : types.USERCASE_GET_CASE_NUMBER_REQUEST,
            success : types.USERCASE_GET_CASE_NUMBER_SUCCESS,
            failure : types.USERCASE_GET_CASE_NUMBER_FAILURE
        }
    });
}

export function getSubjectAreaList () {

    return api.call({
        url: urls.GET_SUBJECT_AREA_LIST_URL,
        type: {
            request : types.USERCASE_GET_SUBJECT_AREA_LIST_REQUEST,
            success : types.USERCASE_GET_SUBJECT_AREA_LIST_SUCCESS,
            failure : types.USERCASE_GET_SUBJECT_AREA_LIST_FAILURE
        }
    });
}

export function getCountryList () {

    return api.call({
        url: urls.GET_COUNTRY_LIST_URL,
        type: {
            request : types.USERCASE_GET_COUNTRY_LIST_REQUEST,
            success : types.USERCASE_GET_COUNTRY_LIST_SUCCESS,
            failure : types.USERCASE_GET_COUNTRY_LIST_FAILURE
        }
    });
}

export function getInstitutionList () {

    return api.call({
        url: urls.GET_INSTITUTION_LIST_URL,
        type: {
            request : types.USERCASE_GET_INSTITUTION_LIST_REQUEST,
            success : types.USERCASE_GET_INSTITUTION_LIST_SUCCESS,
            failure : types.USERCASE_GET_INSTITUTION_LIST_FAILURE
        }
    });
}


export function getInstitutionListForCountry (country) {

    return api.call({
        url: urls.GET_INSTITUTION_LIST_URL + '/' + country,
        type: {
            request : types.USERCASE_GET_INSTITUTION_LIST_REQUEST,
            success : types.USERCASE_GET_INSTITUTION_LIST_SUCCESS,
            failure : types.USERCASE_GET_INSTITUTION_LIST_FAILURE
        }
    });
}

export function getBucList () {

    return api.call({
        url: urls.GET_BUC_LIST_URL,
        type: {
            request : types.USERCASE_GET_BUC_LIST_REQUEST,
            success : types.USERCASE_GET_BUC_LIST_SUCCESS,
            failure : types.USERCASE_GET_BUC_LIST_FAILURE
        }
    });
}

export function getSedList (buc) {

    return api.call({
        url: urls.GET_SED_LIST_URL + '/' + buc,
        type: {
            request : types.USERCASE_GET_SED_LIST_REQUEST,
            success : types.USERCASE_GET_SED_LIST_SUCCESS,
            failure : types.USERCASE_GET_SED_LIST_FAILURE
        }
    });
}

export function dataToConfirm (params) {

    return {
        type    : types.USERCASE_CONFIRM_DATA_SUCCESS,
        payload : params
    };
}

export function clearCurrentCase() {

    return {
        type : types.USERCASE_CLEAR_CURRENT_CASE
    };
}

export function clearData() {

    return {
        type : types.USERCASE_CLEAR_DATA
    };
}

export function generateData (params) {

    return api.call({
        url: urls.GENERATE_DATA_URL,
        method: 'POST',
        payload: params,
        type: {
            request : types.USERCASE_GENERATE_DATA_REQUEST,
            success : types.USERCASE_GENERATE_DATA_SUCCESS,
            failure : types.USERCASE_GENERATE_DATA_FAILURE
        }
    });
}

export function submitData (params) {
    return api.call({
        url: urls.SEND_DATA_URL,
        method: 'POST',
        payload: params,
        type: {
            request : types.USERCASE_SEND_DATA_REQUEST,
            success : types.USERCASE_SEND_DATA_SUCCESS,
            failure : types.USERCASE_SEND_DATA_FAILURE
        }
    });
}

export function getRinaUrl () {
    return api.call({
        url: urls.RINA_URL,
        type: {
            request : types.RINA_GET_URL_REQUEST,
            success : types.RINA_GET_URL_SUCCESS,
            failure : types.RINA_GET_URL_FAILURE
        }
    });
}
