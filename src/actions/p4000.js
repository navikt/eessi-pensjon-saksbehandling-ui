import * as types from '../constants/actionTypes'
import * as urls from '../constants/urls'
import * as api from './api'

export function setPage (newPage) {
  return {
    type: types.P4000_PAGE_SET,
    payload: {
      page: newPage
    }
  }
}

export function newP4000 () {
  return {
    type: types.P4000_NEW
  }
}

export function openP4000Success (p4000) {
  return {
    type: types.P4000_OPEN_SUCCESS,
    payload: {
      events: p4000.events,
      comment : p4000.comment
    }
  }
}

export function openP4000Failure (events) {
  return {
    type: types.P4000_OPEN_FAILURE,
    payload: {
      error: events
    }
  }
}

export function pushEventToP4000Form (event) {
  return {
    type: types.P4000_EVENT_ADD,
    payload: {
      event: event,
      page: 'new'
    }
  }
}

export function replaceEventOnP4000Form (event, eventIndex) {
  return {
    type: types.P4000_EVENT_REPLACE,
    payload: {
      event: event,
      eventIndex: eventIndex
    }
  }
}

export function deleteEventToP4000Form (eventIndex) {
  return {
    type: types.P4000_EVENT_DELETE,
    payload: {
      eventIndex: eventIndex,
      page: 'new'
    }
  }
}

export function cancelEditEvent (eventIndex) {
  return {
    type: types.P4000_EVENT_CANCEL_EDIT,
    payload: {
      eventIndex: eventIndex,
      page: 'new'
    }
  }
}

export function editEvent (eventIndex) {
  return {
    type: types.P4000_EVENT_EDIT_MODE,
    payload: {
      eventIndex: eventIndex
    }
  }
}

export function setEventProperty (key, value) {
  return {
    type: types.P4000_EVENT_SET_PROPERTY,
    payload: {
      key: key,
      value: value
    }
  }
}

export function setComment (comment) {
  return {
    type: types.P4000_COMMENT_SET,
    payload: {
      comment : comment
    }
  }
}


export function submitP4000 (payload) {
  return api.call({
    url: urls.CASE_ADD_TO_SED_URL,
    method: 'POST',
    payload: payload,
    type: {
      request: types.P4000_SUBMIT_REQUEST,
      success: types.P4000_SUBMIT_SUCCESS,
      failure: types.P4000_SUBMIT_FAILURE
    }
  })
}
