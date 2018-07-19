import * as types from '../constants/actionTypes';

export function setPdfSize (payload) {

    return {
        type: types.SETTINGS_SET_PDF_SIZE,
        payload: payload
    };
}
