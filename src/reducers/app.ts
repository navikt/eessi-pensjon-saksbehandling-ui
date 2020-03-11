import * as types from 'constants/actionTypes'
import { Features, Params, Person } from 'declarations/types'
import { ActionWithPayload } from 'eessi-pensjon-ui/dist/declarations/types'
import _ from 'lodash'

export interface AppState {
  loggedIn: boolean | undefined;
  loggedTime: Date | undefined;
  allowed: boolean;
  expirationTime: Date | undefined;
  username: string | undefined
  userRole: string | undefined,
  person: Person | undefined,
  params: Params;
  features: Features;
}

const initialFeatures = {
  P5000_VISIBLE: false
}

export const initialAppState: AppState = {
  loggedIn: undefined,
  loggedTime: undefined,
  expirationTime: undefined,
  allowed: false,
  username: undefined,
  userRole: undefined,
  person: undefined,
  params: {},
  features: initialFeatures
}

const appReducer = (state: AppState = initialAppState, action: ActionWithPayload) => {
  let newParams
  switch (action.type) {
    case types.APP_PARAM_SET:

      newParams = _.cloneDeep(state.params)
      newParams[action.payload.key] = action.payload.value

      return {
        ...state,
        params: newParams
      }

    case types.APP_PARAM_UNSET:

      newParams = _.cloneDeep(state.params)
      delete newParams[action.payload.key]

      return {
        ...state,
        params: newParams
      }

    case types.APP_USERINFO_SUCCESS: {
      const now = action.payload.now ? new Date(action.payload.now) : new Date()
      const expirationTime = action.payload.expirationTime
        ? new Date(action.payload.expirationTime)
        : new Date(new Date().setMinutes(now.getMinutes() + 60))
      return {
        ...state,
        features: {
          ...state.features,
          ...(action.payload.features || {})
        },
        username: action.payload.subject,
        userRole: action.payload.subject === '12345678910' ? 'SAKSBEHANDLER' : action.payload.role,
        allowed: action.payload.subject === '12345678910' ? true : action.payload.allowed,
        loggedIn: true,
        loggedTime: now,
        expirationTime: expirationTime
      }
    }

    case types.APP_USERINFO_FAILURE:

      return {
        ...initialAppState,
        loggedIn: false
      }

    case types.APP_PERSONINFO_SUCCESS:

      return {
        ...state,
        person: action.payload.person
      }

    case types.APP_LOGOUT_SUCCESS: {
      return initialAppState
    }

    case types.APP_SAKTYPE_SUCCESS: {
      const sakType = (action.payload.sakType === 'GJENLEV') ? 'Gjenlevendeytelse' : action.payload.sakType

      return {
        ...state,
        params: { ...state.params, sakType: sakType }
      }
    }

    case types.APP_SAKTYPE_FAILURE: {
      return {
        ...state,
        params: { ...state.params, sakType: 'Unknown' }
      }
    }

    default:
      return state
  }
}

export default appReducer
