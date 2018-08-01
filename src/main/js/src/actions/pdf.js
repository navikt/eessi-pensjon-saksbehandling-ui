import * as types from '../constants/actionTypes';
import * as urls from '../constants/urls';
import * as api from './api';

export function selectPDF (pdfs) {

    return {
        type: types.PDF_SELECTED,
        payload: pdfs
    };
}

export function clearPDF () {

    return {
        type: types.PDF_CLEAR
    };
}

export function setRecipe (recipe) {

    return {
        type: types.PDF_SET_RECIPE,
        payload: recipe
    };
}

export function previewPDF(payload) {

    return {
        type: types.PDF_PREVIEW_START,
        payload: payload
    };
}

export function cancelPreviewPDF() {

    return {
        type: types.PDF_PREVIEW_END
    };
}

export function generatePDF (body) {

    for (var i in body.pdfs) {
        delete body.pdfs[i].data;
    }

    return api.call({
        url: urls.PDF_GENERATE_URL,
        method: 'POST',
        payload: body,
        type: {
            request : types.PDF_GENERATE_REQUEST,
            success : types.PDF_GENERATE_SUCCESS,
            failure : types.PDF_GENERATE_FAILURE
        }
    });
}
