import * as constants from 'constants/constants'
import * as types from 'constants/actionTypes'
import { Feature, FeatureToggles, Params, PesysContext } from 'declarations/app.d'
import { SakTypeKey, SakTypeMap } from 'declarations/buc.d'
import _ from 'lodash'
import { AnyAction } from 'redux'

export interface AppState {
  featureToggles: FeatureToggles
  loggedIn: boolean | undefined
  params: Params
  pesysContext: PesysContext | undefined
  username: string | undefined
  userRole: string | undefined
}

const initialFeatureToggles: FeatureToggles = {
  P4000_VISIBLE: false,
  P5000_SUMMER_VISIBLE: true,
  P5000_UPDATES_VISIBLE: true,
  SED_PREFILL_INSTITUTIONS: false,
  NR_AVDOD: 0,
  X010_X009_VISIBLE: true,
  ADMIN_NOTIFICATION_MESSAGE: false
}

export const initialAppState: AppState = {
  featureToggles: initialFeatureToggles,
  loggedIn: undefined,
  params: {},
  pesysContext: undefined,
  username: undefined,
  userRole: undefined
}

const appReducer = (state: AppState = initialAppState, action: AnyAction) => {
  let newParams: Params, newFeatureToggles: FeatureToggles, newContext: PesysContext
  switch (action.type) {
    case types.APP_LOGOUT_SUCCESS: {
      return initialAppState
    }

    case types.APP_PARAM_SET:
      newParams = _.cloneDeep(state.params)
      newFeatureToggles = _.cloneDeep(state.featureToggles)
      if (action.payload.key.startsWith('ft.')) {
        newFeatureToggles[action.payload.key.replace('ft.', '') as Feature] =
          (action.payload.value.match(/^\d+$/) ? parseInt(action.payload.value) : action.payload.value === 'true')
      } else {
        newParams[action.payload.key] = action.payload.value
      }

      newContext = constants.BRUKERKONTEKST
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

      newContext = constants.BRUKERKONTEKST
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

    case types.APP_USERINFO_SUCCESS: {
      const newFeatureToggles = _.cloneDeep(state.featureToggles)
      if (!_.isEmpty(action.payload?.features)) {
        Object.keys(action.payload?.features).forEach((k: string) => {
          newFeatureToggles[k as Feature] = state.params[k] ? state.params[k] === "true" : action.payload?.features[k]
        })
      }
      console.log('feature toggles', newFeatureToggles)
      return {
        ...state,
        featureToggles: newFeatureToggles,
        username: action.payload.subject,
        userRole: action.payload.subject === '12345678910' ? 'SAKSBEHANDLER' : action.payload.role,
        loggedIn: true
      }
    }

    case types.BUC_GET_SAKTYPE_REQUEST:

      newParams = _.cloneDeep(state.params)
      delete newParams.sakType

      return {
        ...state,
        params: newParams
      }

    case types.BUC_GET_SAKTYPE_SUCCESS:

      newParams = _.cloneDeep(state.params)
      if (!_.isNil(action.payload.sakType)) {
        if (action.payload.sakType.length === 0) {
          newParams.sakType = SakTypeMap.UKJENT
        } else {
          newParams.sakType = SakTypeMap[action.payload.sakType as SakTypeKey]
        }
      }

      return {
        ...state,
        params: newParams
      }

    case types.BUC_GET_SAKTYPE_FAILURE:

      return {
        ...state,
        params: {
          ...state.params,
          sakType: null
        }
      }

    default:
      return state
  }
}

export default appReducer
