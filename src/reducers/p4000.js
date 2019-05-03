import * as types from '../constants/actionTypes'

export const initialP4000State = {
  events: [],
  event: undefined,
  comment: undefined,
  submitted: undefined,
  pdf: undefined
}

const p4000Reducer = (state = initialP4000State, action = {}) => {
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
        comment: action.payload.comment,
        submitted: undefined
      })

    case types.P4000_EVENT_ADD:

      newEvents = state.events.slice()
      newEvents[newEvents.length] = action.payload.event
      newEvents.sort((a, b) => { return a.startDate - b.startDate })

      return Object.assign({}, state, {
        events: newEvents,
        event: {},
        eventIndex: undefined
      })

    case types.P4000_EVENT_REPLACE:

      newEvents = state.events.slice()
      newEvents[action.payload.eventIndex] = action.payload.event
      newEvents.sort((a, b) => { return a.startDate - b.startDate })

      return Object.assign({}, state, {
        events: newEvents,
        event: {},
        eventIndex: undefined
      })

    case types.P4000_EVENT_DELETE:

      newEvents = state.events.slice()
      newEvents.splice(action.payload.eventIndex, 1)

      return Object.assign({}, state, {
        events: newEvents,
        event: {},
        eventIndex: undefined
      })

    case types.P4000_EVENT_CANCEL_EDIT:

      return Object.assign({}, state, {
        event: {},
        eventIndex: undefined
      })

    case types.P4000_EVENT_EDIT:

      return Object.assign({}, state, {
        event: state.events[action.payload.eventIndex],
        eventIndex: action.payload.eventIndex
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

    case types.P4000_PDF_SET:

      return Object.assign({}, state, {
        pdf: action.payload.pdf
      })

    case types.APP_CLEAR_DATA:

      return initialP4000State

    default:

      return state
  }
}

export default p4000Reducer
