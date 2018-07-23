import * as types from '../constants/actionTypes';

export function addToForm(payload) {

    return {
        type : types.P4000_ADD_TO_FORM,
        payload: payload
    };
}
