import * as types from '../constants/actionTypes'

let initialState = {
  message: undefined,
  status: undefined
}

export default function (state = initialState, action = {}) {
  switch (action.type) {
    case types.PINFO_INVITE_REQUEST:

      return {}

    case types.PINFO_INVITE_FAILURE:

      return {
        message: 'pinfo:alert-inviteFailure',
        status: 'ERROR'
      }
    case types.PINFO_INVITE_SUCCESS:

      return {
        message: 'pinfo:alert-inviteSuccess',
        status: 'OK'
      }

    default:
      return state
  }
}
