import * as types from '../constants/actionTypes'

let initialState = {
  data: {}
}

export default function (state = initialState, action = {}) {
  switch (action.type) {
    case types.P6000_EVENT_SET_PROPERTY:

      return { ...state, data: { ...state.data, ...action.payload } }

    case types.APP_CLEAR_DATA:

      return initialState

    default:

      return state
  }
}
