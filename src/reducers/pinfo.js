import * as types from '../constants/actionTypes'

let initialState = {
  isLoaded: false,
  step: 0,
  maxstep: 6,
  validationError: undefined,
  contact: {
    phones: [],
    emails: []
  },
  attachments: {},
  bank: {},
  work: {},
  pension: []
}

export default function (state = initialState, action = {}) {
  switch (action.type) {
    case types.PINFO_EVENT_SET_PROPERTY:

      return { ...state, ...action.payload }

    case types.STORAGE_GET_SUCCESS:
      return action.fileName === 'PINFO'
        ? JSON.parse(action.payload)
        : state

    case types.PINFO_EVENT_SET_PHONES:

      return {
        ...state,
        contact: {
          ...state.contact,
          phones: action.payload
        } }

    case types.PINFO_EVENT_SET_EMAILS:
      return {
        ...state,
        contact: {
          ...state.contact,
          emails: action.payload
        } }

    case types.PINFO_EVENT_SET_WORK:
      return {
        ...state,
        work: {
          ...state.work,
          ...action.payload
        } }

    case types.PINFO_EVENT_SET_BANK:
      return {
        ...state,
        bank: {
          ...state.bank,
          ...action.payload
        } }

    case types.PINFO_EVENT_SET_P4000:
      return {
        ...state,
        p4000: {
          ...state.p4000,
          ...action.payload
        } }

    case types.PINFO_NEW:

      break

    case types.APP_CLEAR_DATA:

      return initialState

    default:

      return state
  }
}
