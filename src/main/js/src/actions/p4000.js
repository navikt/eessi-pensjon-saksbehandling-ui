import * as types from '../constants/actionTypes';

export function pushEventToP4000Form(event) {

    return {
        type : types.P4000_EVENT_ADD,
        payload: {
            event : event
        }
    };
}

export function replaceEventOnP4000Form(event, eventIndex) {

    return {
        type : types.P4000_EVENT_REPLACE,
        payload: {
            event      : event,
            eventIndex : eventIndex
        }
    };
}

export function deleteEventToP4000Form(eventIndex) {

    return {
        type : types.P4000_EVENT_DELETE,
        payload: {
            eventIndex : eventIndex
        }
    };
}

export function cancelEditEvent(eventIndex) {

    return {
        type : types.P4000_EVENT_CANCEL_EDIT,
        payload: {
            eventIndex : eventIndex
        }
    };
}

export function editEvent(eventIndex) {

    return {
        type : types.P4000_EVENT_EDIT_MODE,
        payload: {
            eventIndex : eventIndex
        }
    };
}

export function setEventProperty(key, value, type) {

    return {
        type: types.P4000_EVENT_SET_PROPERTY,
        payload: {
            key: key,
            value: value,
            type: type
        }
    }
}
