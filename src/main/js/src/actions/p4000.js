import * as types from '../constants/actionTypes';

export function setPage(newPage) {

    return {
        type : types.P4000_PAGE_SET,
        payload: {
            page : newPage
        }
    };
}

export function newP4000() {

    return {
        type : types.P4000_NEW
    };
}

export function openP4000(p4000) {

    return {
        type : types.P4000_OPEN,
        payload : {
            events: p4000
        }
    }
}

export function pushEventToP4000Form(event) {

    return {
        type : types.P4000_EVENT_ADD,
        payload: {
            event : event
        }
    };
}

export function pushEventToP4000FormAndToBackToForm(event) {

    return {
        type : types.P4000_EVENT_ADD,
        payload: {
            event : event,
            page  : 'file'
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

export function setEventProperty(key, value) {

    return {
        type: types.P4000_EVENT_SET_PROPERTY,
        payload: {
            key: key,
            value: value
        }
    }
}

export function clearStatus() {

    return {
        type: types.P4000_CLEAR_STATUS
    }
}
