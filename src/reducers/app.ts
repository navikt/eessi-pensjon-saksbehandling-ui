import * as constants from 'constants/constants'
import * as types from 'constants/actionTypes'
import { Feature, FeatureToggles, Params, PesysContext } from 'declarations/app.d'
import { PersonAvdods, Person } from 'declarations/person.d'
import { ActionWithPayload } from 'js-fetch-api'
import _ from 'lodash'

export interface AppState {
  loggedIn: boolean | undefined
  loggedTime: Date | undefined
  allowed: boolean
  pesysContext: PesysContext | undefined
  expirationTime: Date | undefined
  username: string | undefined
  userRole: string | undefined
  person: Person | undefined
  personAvdods: PersonAvdods | undefined
  params: Params
  featureToggles: FeatureToggles
}

const initialFeatureToggles: FeatureToggles = {
  P5000_VISIBLE: true,
  P_BUC_02_VISIBLE: true,
  SED_PREFILL_INSTITUTIONS: false,
  NR_AVDOD: 0
}

export const initialAppState: AppState = {
  loggedIn: undefined,
  loggedTime: undefined,
  expirationTime: undefined,
  allowed: false,
  username: undefined,
  userRole: undefined,
  person: undefined,
  personAvdods: undefined,
  pesysContext: undefined,
  params: {},
  featureToggles: initialFeatureToggles
}

const appReducer = (state: AppState = initialAppState, action: ActionWithPayload) => {
  let newParams, newFeatureToggles, newContext
  switch (action.type) {
    case types.APP_PARAM_SET:
      newParams = _.cloneDeep(state.params)
      newFeatureToggles = _.cloneDeep(state.featureToggles)
      if (action.payload.key.startsWith('ft.')) {
        newFeatureToggles[action.payload.key.replace('ft.', '') as Feature] =
          (action.payload.value.match(/^\d+$/) ? parseInt(action.payload.value) : action.payload.value === 'true')
      } else {
        newParams[action.payload.key] = action.payload.value
      }

      newContext = constants.BRUKEROVERSIKT
      if (newParams.kravId) {
        newContext = constants.KRAVKONTEKST
      }
      if (newParams.vedtakId) {
        newContext = constants.VEDTAKSKONTEKST
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

      newContext = constants.BRUKEROVERSIKT
      if (newParams.kravId) {
        newContext = constants.KRAVKONTEKST
      }
      if (newParams.vedtakId) {
        newContext = constants.VEDTAKSKONTEKST
      }

      return {
        ...state,
        params: newParams,
        pesysContext: newContext
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

    case types.APP_PERSONINFO_AVDOD_SUCCESS:

      return {
        ...state,
        personAvdods: action.payload
      }

    case types.APP_LOGOUT_SUCCESS: {
      return initialAppState
    }

    default:
      return state
  }
}

export default appReducer
