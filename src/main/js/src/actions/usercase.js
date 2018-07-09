import * as types from '../constants/actionTypes';
import * as urls  from '../constants/urls';
import * as api   from './api';

export function getCaseFromCaseNumber (obj) {

    return api.call({
        url: urls.CASE_URL + '/' + obj.caseId,
        type: {
            request : types.USERCASE_GET_CASE_REQUEST,
            success : types.USERCASE_GET_CASE_SUCCESS,
            failure : types.USERCASE_GET_CASE_FAILURE
        }
    });
}

export function getSubjectAreaList () {
    return api.call({
        url: urls.SUBJECT_AREA_LIST_URL,
        type: {
            request : types.USERCASE_GET_SUBJECT_AREA_LIST_REQUEST,
            success : types.USERCASE_GET_SUBJECT_AREA_LIST_SUCCESS,
            failure : types.USERCASE_GET_SUBJECT_AREA_LIST_FAILURE
        }
    });
}

export function getCountryList () {
    return api.call({
        url: urls.COUNTRY_LIST_URL,
        type: {
            request : types.USERCASE_GET_COUNTRY_LIST_REQUEST,
            success : types.USERCASE_GET_COUNTRY_LIST_SUCCESS,
            failure : types.USERCASE_GET_COUNTRY_LIST_FAILURE
        }
    });
}

export function getInstitutionList () {
    return api.call({
        url: urls.INSTITUTION_LIST_URL,
        type: {
            request : types.USERCASE_GET_INSTITUTION_LIST_REQUEST,
            success : types.USERCASE_GET_INSTITUTION_LIST_SUCCESS,
            failure : types.USERCASE_GET_INSTITUTION_LIST_FAILURE
        }
    });
}


export function getInstitutionListForCountry (country) {
    return api.call({
        url: urls.INSTITUTION_LIST_URL + '/' + country,
        type: {
            request : types.USERCASE_GET_INSTITUTION_LIST_REQUEST,
            success : types.USERCASE_GET_INSTITUTION_LIST_SUCCESS,
            failure : types.USERCASE_GET_INSTITUTION_LIST_FAILURE
        }
    });
}

export function getBucList () {
    return api.call({
        url: urls.BUC_LIST_URL,
        type: {
            request : types.USERCASE_GET_BUC_LIST_REQUEST,
            success : types.USERCASE_GET_BUC_LIST_SUCCESS,
            failure : types.USERCASE_GET_BUC_LIST_FAILURE
        }
    });
}

export function getSedList (buc) {
    return api.call({
        url: urls.SED_LIST_URL + '/' + buc,
        type: {
            request : types.USERCASE_GET_SED_LIST_REQUEST,
            success : types.USERCASE_GET_SED_LIST_SUCCESS,
            failure : types.USERCASE_GET_SED_LIST_FAILURE
        }
    });
}

export function dataToConfirm (params) {
    return (dispatch) => {
        dispatch({
            type    : types.USERCASE_DATA_TO_CONFIRM_SUCCESS,
            payload : params
        })
    };
}

export function generateData (params) {

    return api.call({
        url: urls.GENERATE_URL,
        method: 'POST',
        payload: params,
        type: {
            request : types.USERCASE_DATA_TO_GENERATE_REQUEST,
            success : types.USERCASE_DATA_TO_GENERATE_SUCCESS,
            failure : types.USERCASE_DATA_TO_GENERATE_FAILURE
        }
    });
}

export function submitData (params) {
    return api.call({
        url: urls.FAG_CREATE_URL,
        method: 'POST',
        payload: params,
        type: {
            request : types.USERCASE_POST_REQUEST,
            success : types.USERCASE_POST_SUCCESS,
            failure : types.USERCASE_POST_FAILURE
        }
    });
}

export function getRinaUrl () {
    return api.call({
        url: urls.RINA_URL,
        method: 'GET',
        type: {
            request : types.GET_RINA_URL_REQUEST,
            success : types.GET_RINA_URL_SUCCESS,
            failure : types.GET_RINA_URL_FAILURE
        }
    });
}
