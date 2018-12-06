import * as types from '../constants/actionTypes'

export function setEventProperty (payload) {
  return {
    type: types.PINFO_EVENT_SET_PROPERTY,
    payload: payload
  }
}

export function setPerson (payload) {
  return {
    type: types.PINFO_EVENT_SET_PERSON,
    payload: payload instanceof Object ? payload : {}
  }
}

export function setStayAbroad (payload) {
  return {
    type: types.PINFO_EVENT_SET_STAY_ABROAD,
    payload: payload
  }
}

export function setWork (payload) {
  return {
    type: types.PINFO_EVENT_SET_WORK,
    payload: payload instanceof Object ? payload : {}
  }
}

export function setBank (payload) {
  return {
    type: types.PINFO_EVENT_SET_BANK,
    payload: payload instanceof Object ? payload : {}
  }
}
