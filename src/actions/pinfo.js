import * as types from '../constants/actionTypes'
import uuidv4 from 'uuid'

export function setEventProperty (payload) {
  return {
    type: types.PINFO_EVENT_SET_PROPERTY,
    payload: payload
  }
}

export function newPhone () {
  return {
    type: types.PINFO_EVENT_SET_PHONE,
    key: uuidv4(),
    payload: { nummer: null, type: null }
  }
}
export function newEmail () {
  return {
    type: types.PINFO_EVENT_SET_EMAIL,
    key: uuidv4(),
    payload: { adresse: null }
  }
}

export function setPhone (key, payload) {
  return {
    type: types.PINFO_EVENT_SET_PHONE,
    key: key,
    payload: payload
  }
}

export function setEmail (key, payload) {
  return {
    type: types.PINFO_EVENT_SET_EMAIL,
    key: key,
    payload: payload
  }
}

export function removePhone (key) {
  return {
    type: types.PINFO_EVENT_REMOVE_PHONE,
    key: key
  }
}

export function removeEmail (key) {
  return {
    type: types.PINFO_EVENT_REMOVE_EMAIL,
    key: key
  }
}

export function setWorkIncome (payload) {
  return {
    type: types.PINFO_EVENT_SET_WORKINCOME,
    payload: payload instanceof Object ? payload : {}
  }
}
