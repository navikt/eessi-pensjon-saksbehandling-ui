import * as types from '../constants/actionTypes';

export function pushEventToP4000Form(event) {

    return {
        type : types.P4000_PUSH_EVENT_TO_FORM,
        payload: {
            event : event
        }
    };
}

export function editEventToP4000Form(event, eventIndex) {

    return {
        type : types.P4000_EDIT_EVENT,
        payload: {
            event      : event,
            eventIndex : eventIndex
        }
    };
}

export function deleteEventToP4000Form(eventIndex) {

    return {
        type : types.P4000_DELETE_EVENT,
        payload: {
            eventIndex : eventIndex
        }
    };
}
