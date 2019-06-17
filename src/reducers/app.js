import * as types from '../constants/actionTypes'

export const initialAppState = {
  loggedIn: undefined,
  loggedTime: undefined,
  allowed: false,
  username: undefined,
  userRole: [],
  userStatus: undefined,
  firstName: undefined,
  middleName: undefined,
  lastname: undefined,
  person: undefined,
  params: {}
}

const appReducer = (state = initialAppState, action = {}) => {
  switch (action.type) {
    case types.APP_PARAM_SET:

      return {
        ...state,
        params: {
          ...state.params,
          [action.payload.key]: action.payload.value
        }
      }

    case types.APP_PARAM_UNSET:

      return {
        ...state,
        params: {
          ...state.params,
          [action.payload.key]: undefined
        }
      }

    case types.APP_USERINFO_SUCCESS:

      const now = new Date()
      const expirationTime = action.payload.expirationTime
        ? new Date(action.payload.expirationTime)
        : new Date(new Date().setMinutes(now.getMinutes() + 60))
      const remainingTime = Math.abs(expirationTime - now)
      return Object.assign({}, state, {
        username: action.payload.subject,
        userRole: action.payload.subject === '12345678910' ? 'SAKSBEHANDLER' : action.payload.role,
        allowed: action.payload.subject === '12345678910' ? true : action.payload.allowed,
        loggedIn: true,
        userStatus: 'OK',
        loggedTime: now,
        expirationTime: expirationTime,
        remainingTime: remainingTime
      })

    case types.APP_USERINFO_FAILURE:

      return Object.assign({}, initialAppState, {
        loggedIn: false,
        userStatus: 'ERROR'
      })

    case types.APP_PERSONINFO_SUCCESS:

      return {
        ...state,
        person: action.payload.person
      }

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
      return initialAppState
    }

    default:
      return state
  }
}

export default appReducer
