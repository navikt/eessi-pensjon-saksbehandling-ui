import * as types from '../constants/actionTypes'

let initialState = {
  documents: []
}

export default function (state = initialState, action = {}) {
  switch (action.type) {
    case types.STATUS_PARAM_SET:

      return Object.assign({}, state, {
        [action.payload.key]: action.payload.value
      })

    case types.STATUS_GET_SUCCESS:

      return Object.assign({}, state, {
        documents: action.payload
      })

    case types.STATUS_RINA_CASE_SUCCESS:

      return Object.assign({}, state, {
        rinaCase: action.payload
      })

    case types.STATUS_SED_GET_SUCCESS:

      return Object.assign({}, state, {
        sed: action.payload
      })

    default:

      return state
  }
}
