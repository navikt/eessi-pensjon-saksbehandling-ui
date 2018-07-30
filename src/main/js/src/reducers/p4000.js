import * as types from '../constants/actionTypes';

let initialState =  {
    events: [],
    event: {},
    editMode: false,
    page: 'file',        // for current menu page
    status: undefined    // For saving message flashes
};

export default function (state = initialState, action = {}) {

    let newEvents;

    switch (action.type) {

    case types.P4000_CLEAR_STATUS:

        return Object.assign({}, state, {
             status: undefined
        });

    case types.P4000_NEW:

        return Object.assign({}, state, {
            page  : 'work',
            event : {},
            events: [],
            status: 'p4000:newP4000Form'
        });

    case types.P4000_OPEN:

        return Object.assign({}, state, {
            page   : 'work',
            event  : {},
            events : action.payload.events,
            status: 'p4000:openP4000Form'
        });

    case types.P4000_PAGE_SET:

        return Object.assign({}, state, {
            page : action.payload.page
        });

    case types.P4000_EVENT_ADD:

        newEvents = state.events.slice();
        newEvents[newEvents.length] = action.payload.event
        newEvents.sort((a, b) => { return a.startDate - b.startDate })

        return Object.assign({}, state, {
            events     : newEvents,
            event      : {},
            eventIndex : undefined,
            editMode   : false,
            status     : 'p4000:addedP4000Event'
        });

    case types.P4000_EVENT_REPLACE:

        newEvents = state.events.slice();
        newEvents[action.payload.eventIndex] = action.payload.event;
        newEvents.sort((a, b) => { return a.startDate - b.startDate })

        return Object.assign({}, state, {
            events     : newEvents,
            event      : {},
            eventIndex : undefined,
            editMode   : false,
            status     : 'p4000:replacedP4000Event'
        });

    case types.P4000_EVENT_DELETE:

        newEvents = state.events.slice();
        newEvents.splice(action.payload.eventIndex, 1);

        return Object.assign({}, state, {
            events     : newEvents,
            event      : {},
            eventIndex : undefined,
            editMode   : false,
            status     : 'p4000:deletedP4000Event'
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
        newEvent[action.payload.key] = action.payload.value;

        return Object.assign({}, state, {
            event : newEvent
        });
    }

    default:

        return state;

    }
}
