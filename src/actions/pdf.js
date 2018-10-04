import * as types from '../constants/actionTypes';
import * as urls from '../constants/urls';
import * as api from './api';
import _ from 'lodash';

export function selectPDF (pdfs) {

    return {
        type    : types.PDF_SELECTED,
        payload : pdfs
    };
}

export function loadingFilesStart () {

    return {
        type : types.PDF_LOADING_FILES_STARTED
    };
}

export function loadingFilesEnd () {

    return {
        type : types.PDF_LOADING_FILES_FINISHED
    };
}

export function clearPDF () {

    return {
        type : types.PDF_CLEAR
    };
}

export function setRecipe (recipe) {

    return {
        type    : types.PDF_SET_RECIPE,
        payload : recipe
    };
}

export function setActiveDnDTarget (target) {

    return {
        type    : types.PDF_SET_DND_TARGET,
        payload : target
    };
}

export function setPdfSize (size) {

    return {
        type    : types.PDF_SET_PAGE_SIZE,
        payload : size
    };
}


export function getExternalFileList () {

    return api.call({
        url     : urls.PDF_EXTERNAL_FILE_LIST_URL,
        type    : {
            request : types.PDF_EXTERNAL_FILE_LIST_REQUEST,
            success : types.PDF_EXTERNAL_FILE_LIST_SUCCESS,
            failure : types.PDF_EXTERNAL_FILE_LIST_FAILURE
        }
    });
}

export function setExternalFileList (files) {

    return {
        type    : types.PDF_EXTERNAL_FILE_LIST_SET,
        payload : files
    };
}

export function setWatermark(payload) {
    return {
        type    : types.PDF_WATERMARK_SET,
        payload : payload
    };
}

export function generatePDF (payload) {

    let newPayload = Object.assign({}, payload);

    newPayload.pdfs.map(pdf => {
        let newPdf = _.clone(pdf);
        delete newPdf.data;
        return newPdf;
    });

    return api.call({
        url     : urls.PDF_GENERATE_URL,
        method  : 'POST',
        payload : newPayload,
        type    : {
             request : types.PDF_GENERATE_REQUEST,
             success : types.PDF_GENERATE_SUCCESS,
             failure : types.PDF_GENERATE_FAILURE
        }
    });
}
