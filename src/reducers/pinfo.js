import * as types from '../constants/actionTypes'

let initialState = {
  isLoaded: false,
  step: 0,
  validationError: undefined,
  contact: {},
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

    case types.PINFO_EVENT_SET_CONTACT:
        return {
          ...state,
          contact: {
            ...state.contact,
            ...action.payload
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
