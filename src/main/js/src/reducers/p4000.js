import * as types from '../constants/actionTypes';


export default function (state = { events: []}, action = {}) {

    let newEvents;

    switch (action.type) {

    case types.P4000_PUSH_EVENT_TO_FORM:

        newEvents = state.events.slice();
        newEvents[newEvents.length] = action.payload.event

        return Object.assign({}, state, {
            events : newEvents
        });


    case types.P4000_EDIT_EVENT:

        newEvents = state.events.slice();
        newEvents[action.payload.eventIndex] = action.payload.event;

        return Object.assign({}, state, {
            events : newEvents
        });

    case types.P4000_DELETE_EVENT:

        newEvents = state.events.slice();
        newEvents.splice(action.payload.eventIndex, 1);

        return Object.assign({}, state, {
            events : newEvents
        });

    default:
        return state;

    }
}
