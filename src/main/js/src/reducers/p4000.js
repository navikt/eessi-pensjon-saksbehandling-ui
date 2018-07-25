import * as types from '../constants/actionTypes';

let initialState =  {
    events: []
};

export default function (state = initialState, action = {}) {

    let newEvents;

    switch (action.type) {

    case types.P4000_EVENT_ADD:

        newEvents = state.events.slice();
        newEvents[newEvents.length] = action.payload.event

        return Object.assign({}, state, {
            events : newEvents
        });

    case types.P4000_EVENT_REPLACE:

        newEvents = state.events.slice();
        newEvents[action.payload.eventIndex] = action.payload.event;

        return Object.assign({}, state, {
            events : newEvents,
            event : undefined,
            eventIndex: undefined,
            editMode: false
        });

    case types.P4000_EVENT_DELETE:

        newEvents = state.events.slice();
        newEvents.splice(action.payload.eventIndex, 1);

        return Object.assign({}, state, {
            events : newEvents,
            event : undefined,
            eventIndex: undefined,
            editMode: false
        });

   case types.P4000_EVENT_CANCEL_EDIT:

        return Object.assign({}, state, {
            event : undefined,
            eventIndex: undefined,
            editMode: false
        });

   case types.P4000_EVENT_EDIT_MODE:

        return Object.assign({}, state, {
            event : state.events[action.payload.eventIndex],
            eventIndex: action.payload.eventIndex,
            editMode: true
        });

    default:
        return state;

    }
}
