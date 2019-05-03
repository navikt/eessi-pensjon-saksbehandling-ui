import * as types from '../constants/actionTypes'

export const initialBucState = {
  mode: 'list'
}

const reducer = (state, action) => {
  switch (action.type) {
    case types.BUC_MODE_SET:

      return {
        ...state,
        mode: action.payload
      }

    case types.BUC_LIST_SET:

      return {
        ...state,
        list: action.payload
      }

    default:

      return state
  }
}

export default reducer
