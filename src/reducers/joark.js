import * as types from '../constants/actionTypes'
import _ from 'lodash'

export const initialJoarkState = {
  list: undefined
}

const joarkReducer = (state = initialJoarkState, action = {}) => {
  switch (action.type) {

  case types.JOARK_LIST_SUCCESS:
    return {
      ...state,
      list: action.payload
    }

  case types.JOARK_GET_SUCCESS:
    return {
      ...state,
      file: action.payload
    }

  default:
    return state
  }
}

export default joarkReducer
