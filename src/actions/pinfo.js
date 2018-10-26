import * as types from '../constants/actionTypes'

export function setEventProperty (payload) {
  return {
    type: types.PINFO_EVENT_SET_PROPERTY,
    payload: payload
  }
}
