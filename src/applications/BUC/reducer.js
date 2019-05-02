import * as constants from './constants'

export const initialState = {
  mode: 'list'
}

export const reducer = (state, action) => {

  switch(action.type) {

    case constants.BUC_MODE:

      return Object.assign({}, state, {
        mode: action.payload
      })

    default:

    return state

  }
}
