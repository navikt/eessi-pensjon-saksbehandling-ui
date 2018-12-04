import * as types from '../constants/actionTypes'

export function setEventProperty (payload) {
  return {
    type: types.PINFO_EVENT_SET_PROPERTY,
    payload: payload
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
