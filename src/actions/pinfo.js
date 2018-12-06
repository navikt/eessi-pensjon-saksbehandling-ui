import * as types from '../constants/actionTypes'

export function setEventProperty (payload) {
  return {
    type: types.PINFO_EVENT_SET_PROPERTY,
    payload: payload
  }
}

export function setLastNameAfterBirth (lastNameAfterBirth) {
  return {
    type: types.PINFO_EVENT_SET_LASTNAME,
    payload: lastNameAfterBirth
  }
}

export function setNames (names) {
  return {
    type: types.PINFO_EVENT_SET_NAMES,
    payload: names
  }
}

export function setPhones (phones) {
  return {
    type: types.PINFO_EVENT_SET_PHONES,
    payload: phones
  }
}

export function setEmails (emails) {
  return {
    type: types.PINFO_EVENT_SET_EMAILS,
    payload: emails
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
