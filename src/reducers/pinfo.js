import * as types from 'constants/actionTypes'

export const initialPinfoState = {
  invite: undefined
}

const pinfoReducer = (state = initialPinfoState, action = {}) => {
  switch (action.type) {
    case types.PINFO_INVITE_REQUEST:

      return {
        ...state,
        invite: undefined
      }

    case types.PINFO_INVITE_FAILURE:

      return {
        ...state,
        invite: {
          message: 'pinfo:alert-inviteFailure',
          status: 'ERROR'
        }
      }

    case types.PINFO_INVITE_SUCCESS:

      return {
        ...state,
        invite: {
          message: 'pinfo:alert-inviteSuccess',
          status: 'OK'
        }
      }

    default:
      return state
  }
}

export default pinfoReducer
