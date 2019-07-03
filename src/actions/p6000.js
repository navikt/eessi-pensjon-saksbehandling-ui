import * as types from 'constants/actionTypes'

export function p6000SetEventProperty (payload) {
  return {
    type: types.P6000_EVENT_SET_PROPERTY,
    payload: payload
  }
}
