import * as types from '../constants/actionTypes'

export const initialP6000State = {
  data: {}
}

const p6000Reducer = (state = initialP6000State, action = {}) => {
  switch (action.type) {
    case types.P6000_EVENT_SET_PROPERTY:

      return { ...state, data: { ...state.data, ...action.payload } }

    case types.APP_CLEAR_DATA:

      return initialP6000State

    default:

      return state
  }
}

export default p6000Reducer
