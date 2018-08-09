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
        type: types.PDF_LOADING_FILES_STARTED
    };
}

export function loadingFilesEnd () {

    return {
        type: types.PDF_LOADING_FILES_FINISHED
    };
}

export function clearPDF () {

    return {
        type: types.PDF_CLEAR
    };
}

export function setRecipe (recipe) {

    return {
        type    : types.PDF_SET_RECIPE,
        payload : recipe
    };
}

export function previewPDF(pdf) {

    return {
        type    : types.PDF_PREVIEW_START,
        payload : pdf
    };
}

export function cancelPreviewPDF() {

    return {
        type: types.PDF_PREVIEW_END
    };
}

export function setActiveDnDTarget(target) {

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

export function generatePDF (payload) {

    let newPayload = Object.assign({}, payload);

    newPayload.pdfs.map(pdf => {
        let newPdf = _.clone(pdf);
        delete newPdf.data;
        return newPdf;
    });

    return api.call({
        url: urls.PDF_GENERATE_URL,
        method: 'POST',
        payload: newPayload,
        type: {
            request : types.PDF_GENERATE_REQUEST,
            success : types.PDF_GENERATE_SUCCESS,
            failure : types.PDF_GENERATE_FAILURE
        }
    });
}
