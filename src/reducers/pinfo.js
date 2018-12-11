import * as types from '../constants/actionTypes'

let initialState = {
  isLoaded: false,
  step: 0,
  person: {},
  bank: {},
  stayAbroad: [],
  work: {},
  receipt: undefined
}

export default function (state = initialState, action = {}) {
  switch (action.type) {
    case types.PINFO_STEP_SET:

      return Object.assign({}, state, {
          step: action.payload
      })

    case types.STORAGE_GET_SUCCESS:
      return action.fileName === 'PINFO'
        ? JSON.parse(action.payload)
        : state

    case types.PINFO_PERSON_SET:
      return {
        ...state,
        person: {
          ...state.person,
          ...action.payload
        } }

    case types.PINFO_WORK_SET:
      return {
        ...state,
        work: {
          ...state.work,
          ...action.payload
        } }

    case types.PINFO_BANK_SET:
      return {
        ...state,
        bank: {
          ...state.bank,
          ...action.payload
        } }

    case types.PINFO_STAY_ABROAD_SET:

      let sortedStayAbroad = action.payload.slice()
      sortedStayAbroad.sort((a, b) => { return a.startDate - b.startDate })

      return {
        ...state,
        stayAbroad: sortedStayAbroad
      }

    case types.PINFO_SEND_SUCCESS:

     return Object.assign({}, state, {
        receipt: action.payload
     })

    case types.PINFO_SEND_FAILURE:

     return Object.assign({}, state, {
        receipt: undefined
     })

    case types.APP_CLEAR_DATA:

      return initialState

    default:

      return state
  }
}
