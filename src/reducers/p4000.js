import * as types from '../constants/actionTypes'

let initialState = {
  events: [],
  event: undefined,
  editMode: false,
  page: 'new',
  comment: undefined,
  submitted: undefined
}

export default function (state = initialState, action = {}) {
  let newEvents

  switch (action.type) {
    case types.P4000_NEW:

      return Object.assign({}, state, {
        event: {},
        events: [],
        comment: undefined,
        submitted: undefined
      })

    case types.P4000_OPEN_SUCCESS:

      return Object.assign({}, state, {
        event: {},
        events: action.payload.events,
        comment : action.payload.comment,
        submitted: undefined
      })

    case types.P4000_PAGE_SET:

      return Object.assign({}, state, {
        page: action.payload.page
      })

    case types.P4000_EVENT_ADD:

      newEvents = state.events.slice()
      newEvents[newEvents.length] = action.payload.event
      newEvents.sort((a, b) => { return a.startDate - b.startDate })

      return Object.assign({}, state, {
        events: newEvents,
        event: {},
        eventIndex: undefined,
        editMode: false,
        page: action.payload.page || state.page
      })

    case types.P4000_EVENT_REPLACE:

      newEvents = state.events.slice()
      newEvents[action.payload.eventIndex] = action.payload.event
      newEvents.sort((a, b) => { return a.startDate - b.startDate })

      return Object.assign({}, state, {
        events: newEvents,
        event: {},
        eventIndex: undefined,
        editMode: false
      })

    case types.P4000_EVENT_DELETE:

      newEvents = state.events.slice()
      newEvents.splice(action.payload.eventIndex, 1)

      return Object.assign({}, state, {
        events: newEvents,
        event: {},
        eventIndex: undefined,
        editMode: false,
        page: action.payload.page
      })

    case types.P4000_EVENT_CANCEL_EDIT:

      return Object.assign({}, state, {
        event: {},
        eventIndex: undefined,
        editMode: false,
        page: action.payload.page
      })

    case types.P4000_EVENT_EDIT_MODE:

      return Object.assign({}, state, {
        event: state.events[action.payload.eventIndex],
        eventIndex: action.payload.eventIndex,
        editMode: true
      })

    case types.P4000_EVENT_SET_PROPERTY: {
      let newEvent = Object.assign({}, state.event)
      newEvent[action.payload.key] = action.payload.value

      return Object.assign({}, state, {
        event: newEvent
      })
    }

    case types.P4000_SUBMIT_SUCCESS:

      return Object.assign({}, state, {
        submitted: 'OK'
      })

    case types.P4000_SUBMIT_FAILURE:

      return Object.assign({}, state, {
        submitted: 'ERROR'
      })

    case types.P4000_COMMENT_SET:

     return Object.assign({}, state, {
        comment: action.payload.comment
     })

    case types.APP_CLEAR_DATA:

      return initialState

    default:

      return state
  }
}
