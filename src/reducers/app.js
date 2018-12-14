import * as types from '../constants/actionTypes'

let initialState = {
  loggedIn: false,
  allowed: false,
  username: undefined,
  userRole: undefined
}

export default function (state = initialState, action = {}) {
  switch (action.type) {
    case types.APP_REFERRER_SET:

      return Object.assign({}, state, {
        referrer: action.payload.referrer
      })

    case types.APP_USERINFO_SUCCESS:

      return Object.assign({}, state, {
        username: action.payload.subject,
        userRole: 'BRUKER',//action.payload.role,
        allowed: action.payload.allowed === 'true',
        loggedIn: true
      })

    case types.APP_USERINFO_FAILURE:
      return initialState

    case types.APP_DROPPABLE_REGISTER : {
      let droppables = state.droppables || {}
      droppables[action.payload.id] = action.payload.ref

      return Object.assign({}, state, {
        droppables: droppables
      })
    }

    case types.APP_DROPPABLE_UNREGISTER : {
      let droppables = state.droppables || {}
      delete droppables[action.payload.id]

      return Object.assign({}, state, {
        droppables: droppables
      })
    }

    case types.APP_LOGOUT_SUCCESS: {
      return initialState
    }

    default:
      return state
  }
}
