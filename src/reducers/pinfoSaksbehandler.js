import * as types from '../constants/actionTypes'

export const initialPinfoSaksbehandlerState = {
  invite: undefined,
  sakType: undefined
}

const pinfoSaksbehandlerReducer = (state = initialPinfoSaksbehandlerState, action = {}) => {
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

    case types.PINFO_SAKTYPE_SUCCESS:

      return Object.assign({}, state, {
        sakType: action.payload
      })

    default:
      return state
  }
}

export default pinfoSaksbehandlerReducer
