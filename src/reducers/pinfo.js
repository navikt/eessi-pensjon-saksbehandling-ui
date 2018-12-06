import * as types from '../constants/actionTypes'

let initialState = {
  isLoaded: false,
  step: 0,
  validationError: undefined,
  person: {
    lastNameAfterBirth: undefined,
    names: [],
    phones: [],
    emails: []
  },
  bank: {},
  stayAbroad: [],
  work: {}
}

export default function (state = initialState, action = {}) {
  switch (action.type) {
    case types.PINFO_EVENT_SET_PROPERTY:

      return { ...state, ...action.payload }

    case types.STORAGE_GET_SUCCESS:
      return action.fileName === 'PINFO'
        ? JSON.parse(action.payload)
        : state

    case types.PINFO_EVENT_SET_LASTNAME:

      return {
        ...state,
        person: {
          ...state.person,
          lastNameAfterBirth: action.payload
        } }

    case types.PINFO_EVENT_SET_PHONES:

      return {
        ...state,
        person: {
          ...state.person,
          phones: action.payload
        } }

    case types.PINFO_EVENT_SET_NAMES:

      return {
        ...state,
        person: {
          ...state.person,
          names: action.payload
        } }

    case types.PINFO_EVENT_SET_EMAILS:
      return {
        ...state,
        person: {
          ...state.person,
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

    case types.PINFO_EVENT_SET_STAY_ABROAD:
      return {
        ...state,
        stayAbroad: action.payload
      }

    case types.PINFO_NEW:

      break

    case types.APP_CLEAR_DATA:

      return initialState

    default:

      return state
  }
}
