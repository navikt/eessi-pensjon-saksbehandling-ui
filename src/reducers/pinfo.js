import * as types from '../constants/actionTypes'

let initialState = {
  isReady: false,
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

    case types.PINFO_SET_READY:

      return Object.assign({}, state, {
         isReady: true
      })

    case types.PINFO_SEND_FAILURE:

      return Object.assign({}, state, {
        receipt: undefined
      })

    case types.PINFO_STATE_RESTORE: {
       return Object.assign({}, initialState, {isReady: true}, action.payload)
    }

    case types.APP_CLEAR_DATA:

      return initialState

    default:

      return state
  }
}
