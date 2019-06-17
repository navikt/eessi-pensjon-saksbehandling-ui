import * as types from '../constants/actionTypes'

export const initialPinfoState = {
  invite: undefined
}

const pinfoReducer = (state = initialPinfoState, action = {}) => {
  switch (action.type) {
    case types.PINFO_INVITE_REQUEST:

      return Object.assign({}, state, {
        invite: undefined
      })

    case types.PINFO_INVITE_FAILURE:

      return Object.assign({}, state, {
        invite: {
          message: 'pinfo:alert-inviteFailure',
          status: 'ERROR'
        }
      })

    case types.PINFO_INVITE_SUCCESS:

      return Object.assign({}, state, {
        invite: {
          message: 'pinfo:alert-inviteSuccess',
          status: 'OK'
        }
      })

    default:
      return state
  }
}

export default pinfoReducer
