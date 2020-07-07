import * as types from 'constants/actionTypes'
import { Feature, FeatureToggles, Params, PesysContext, Person } from 'declarations/types'
import { ActionWithPayload } from 'js-fetch-api'
import _ from 'lodash'

export interface AppState {
  loggedIn: boolean | undefined
  loggedTime: Date | undefined
  allowed: boolean
  pesysContext: PesysContext
  expirationTime: Date | undefined
  username: string | undefined
  userRole: string | undefined
  person: Person | undefined
  params: Params
  featureToggles: FeatureToggles
}

const initialFeatureToggles: FeatureToggles = {
  P5000_VISIBLE: true,
  P_BUC_02_VISIBLE: true,
  SED_PREFILL_INSTITUTIONS: false,
  v2_ENABLED: false
}

export const initialAppState: AppState = {
  loggedIn: undefined,
  loggedTime: undefined,
  expirationTime: undefined,
  allowed: false,
  username: undefined,
  userRole: undefined,
  person: undefined,
  pesysContext: undefined,
  params: {},
  featureToggles: initialFeatureToggles
}

const appReducer = (state: AppState = initialAppState, action: ActionWithPayload) => {
  let newParams, newFeatureToggles
  switch (action.type) {
    case types.APP_PARAM_SET:
      newParams = _.cloneDeep(state.params)
      newFeatureToggles = _.cloneDeep(state.featureToggles)
      if (action.payload.key.startsWith('ft.')) {
        newFeatureToggles[action.payload.key.replace('ft.', '') as Feature] = (action.payload.value === 'true')
      } else {
        newParams[action.payload.key] = action.payload.value
      }

      let newContext = 'brukeroversikt'
      if (newParams.kravId) {
        newContext = 'kravkontekst'
      }
      if (newParams.vedtakId) {
        newContext = 'vedtakskontekst'
      }

      return {
        ...state,
        params: newParams,
        featureToggles: newFeatureToggles,
        pesysContext: newContext
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
        featureToggles: {
          ...state.featureToggles,
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

    case types.APP_USERINFO_FORBIDDEN:

      return {
        ...initialAppState,
        loggedIn: true,
        userRole: 'FORBIDDEN'
      }

    case types.APP_PERSONINFO_SUCCESS:

      return {
        ...state,
        person: action.payload.person
      }

    case types.APP_LOGOUT_SUCCESS: {
      return initialAppState
    }

    default:
      return state
  }
}

export default appReducer
