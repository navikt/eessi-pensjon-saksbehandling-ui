import * as types from '../constants/actionTypes';

let initialState =  {
    events: [],
    event: {},
    editMode: false
};

export default function (state = initialState, action = {}) {

    let newEvents;

    switch (action.type) {

    case types.P4000_EVENT_ADD:

        newEvents = state.events.slice();
        newEvents[newEvents.length] = action.payload.event

        return Object.assign({}, state, {
            events     : newEvents,
            event      : {},
            eventIndex : undefined,
            editMode   : false
        });

    case types.P4000_EVENT_REPLACE:

        newEvents = state.events.slice();
        newEvents[action.payload.eventIndex] = action.payload.event;

        return Object.assign({}, state, {
            events     : newEvents,
            event      : {},
            eventIndex : undefined,
            editMode   : false
        });

    case types.P4000_EVENT_DELETE:

        newEvents = state.events.slice();
        newEvents.splice(action.payload.eventIndex, 1);

        return Object.assign({}, state, {
            events     : newEvents,
            event      : {},
            eventIndex : undefined,
            editMode   : false
        });

    case types.P4000_EVENT_CANCEL_EDIT:

        return Object.assign({}, state, {
            event      : {},
            eventIndex : undefined,
            editMode   : false
        });

    case types.P4000_EVENT_EDIT_MODE:

        return Object.assign({}, state, {
            event      : state.events[action.payload.eventIndex],
            eventIndex : action.payload.eventIndex,
            editMode   : true
        });

    case types.P4000_EVENT_SET_PROPERTY: {

        let newEvent = Object.assign({}, state.event);
        if (!newEvent.type && action.payload.type) {
            newEvent.type = action.payload.type;
        }
        newEvent[action.payload.key] = action.payload.value;

        return Object.assign({}, state, {
            event : newEvent
        });
    }

    default:

        return state;

    }
}
