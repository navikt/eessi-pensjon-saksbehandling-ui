import * as types from '../constants/actionTypes'
import uuidv4 from 'uuid'

export function setEventProperty (payload) {
  return {
    type: types.PINFO_EVENT_SET_PROPERTY,
    payload: payload
  }
}

export function newPhone () {
  let key = uuidv4()
  return {
    type: types.PINFO_EVENT_SET_PHONE,
    key: key,
    payload: { key: key, number: null, type: null }
  }
}
export function newEmail () {
  let key = uuidv4()
  return {
    type: types.PINFO_EVENT_SET_EMAIL,
    key: key,
    payload: { key: key, address: null }
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

export function setBank (payload) {
  return {
    type: types.PINFO_EVENT_SET_BANK,
    payload: payload instanceof Object ? payload : {}
  }
}

export function setPension (payload) {
  return {
    type: types.PINFO_EVENT_SET_PENSION,
    payload: payload instanceof Object ? payload : {}
  }
}

export function setAttachments (payload) {
  return {
    type: types.PINFO_EVENT_SET_ATTACHMENTS,
    payload: Array.isArray(payload) ? payload : []
  }
}

export function setAttachmentTypes (payload) {
  return {
    type: types.PINFO_EVENT_SET_ATTACHMENT_TYPES,
    payload: payload instanceof Object ? payload : {}
  }
}
