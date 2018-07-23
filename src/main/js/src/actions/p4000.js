import * as types from '../constants/actionTypes';

export function pushEventToP4000Form(payload) {

    return {
        type : types.P4000_PUSH_EVENT_TO_FORM,
        payload: payload
    };
}

export function editP4000FormEvent(payload) {

    return {
        type : types.P4000_EDIT_FORM_EVENT,
        payload: payload
    };
}

export function selectedP4000Step() {
    return {
        type : types.P4000_SELECTED_STEP
    }
};
