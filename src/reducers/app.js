import * as types from '../constants/actionTypes'

let initialState = {
  loggedIn: false,
  allowed: false,
  username: undefined,
  userRole: undefined,
  userStatus: undefined,
  dirtyForm: false
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
        userRole: action.payload.role,
        allowed: action.payload.allowed,
        loggedIn: true,
        userStatus: 'OK'
      })

    case types.APP_USERINFO_FAILURE:
      return Object.assign({}, initialState, {
        userStatus: 'ERROR'
      })

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

    case types.PINFO_PERSON_SET:
    case types.PINFO_WORK_SET:
    case types.PINFO_BANK_SET:
    case types.PINFO_STAY_ABROAD_SET:
    case types.PINFO_COMMENT_SET:
      return Object.assign({}, state, {
        dirtyForm: true
      })

    case types.STORAGE_POST_SUCCESS:
      return Object.assign({}, state, {
        dirtyForm: false
      })

    default:
      return state
  }
}