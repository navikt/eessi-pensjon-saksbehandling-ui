import * as constants from './constants'

export const initialState = {
  mode: 'list'
}

export const reducer = (state, action) => {

  switch(action.type) {

    case constants.BUC_MODE_SET:

      return Object.assign({}, state, {
        mode: action.payload
      })

    case constants.BUC_LIST_SET:

      return Object.assign({}, state, {
        list: action.payload
      })

    default:

    return state

  }
}
