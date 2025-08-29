import * as types from 'src/constants/actionTypes'
import {CountryCodeLists, CountryCodes, Feature, FeatureToggles, Params, PesysContext} from 'src/declarations/app.d'
import { SakTypeKey, SakTypeMap } from 'src/declarations/buc.d'
import _ from 'lodash'
import { AnyAction } from 'redux'
import {BRUKERKONTEKST, GJENNY, KRAVKONTEKST, VEDTAKSKONTEKST} from "src/constants/constants";
import {ActionWithPayload} from "@navikt/fetch";

export interface AppState {
  featureToggles: FeatureToggles
  loggedIn: boolean | undefined
  params: Params
  pesysContext: PesysContext | undefined
  username: string | undefined
  userRole: string | undefined
  countryCodes: CountryCodes | undefined
  countryCodeMap: {string: string} | undefined
  editingItems: any
}

const initialFeatureToggles: FeatureToggles = {
  P5000_UPDATES_VISIBLE: true,
  SED_PREFILL_INSTITUTIONS: false,
  NR_AVDOD: 0,
  ADMIN_USER: false,
  TEST_USER: false
}

export const initialAppState: AppState = {
  featureToggles: initialFeatureToggles,
  loggedIn: undefined,
  params: {},
  pesysContext: undefined,
  username: undefined,
  userRole: undefined,
  countryCodes: undefined,
  countryCodeMap: undefined,
  editingItems: {}
}

const appReducer = (state: AppState = initialAppState, action: AnyAction) => {
  let newParams: Params, newFeatureToggles: FeatureToggles, newContext: PesysContext
  switch (action.type) {
    case types.APP_LOGOUT_SUCCESS: {
      return initialAppState
    }

    case types.APP_CONTEXT_SET:
      return {
        ...state,
        pesysContext: action.payload.context
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

      newContext = BRUKERKONTEKST
      if (newParams.kravId) {
        newContext = KRAVKONTEKST
      }
      if (newParams.vedtakId) {
        newContext = VEDTAKSKONTEKST
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

      newContext = BRUKERKONTEKST
      if (newParams.kravId) {
        newContext = KRAVKONTEKST
      }
      if (newParams.vedtakId) {
        newContext = VEDTAKSKONTEKST
      }
      if (newParams.avdodFnr){
        newContext = GJENNY
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

      return {
        ...state,
        featureToggles: newFeatureToggles,
        username: action.payload.subject,
        userRole: action.payload.subject === '12345678910' ? 'SAKSBEHANDLER' : action.payload.role,
        loggedIn: true
      }
    }

    case types.GET_COUNTRYCODES_SUCCESS: {
      let countryCodeMap: {[key: string]: string} = {}
      const countryCodes: CountryCodes = action.payload.result
      Object.keys(countryCodes).forEach(versionKey => {
        Object.keys(countryCodes[versionKey as keyof CountryCodes]).forEach(landKey => {
          countryCodes[versionKey as keyof CountryCodes][landKey as keyof CountryCodeLists].forEach(land => {
            // @ts-ignore
            countryCodeMap[land.landkode] = land.landnavn;
          });
        });
      });

      return {
        ...state,
        countryCodes,
        countryCodeMap
      }
    }

    case types.APP_CLIPBOARD_COPY:
      navigator.clipboard.writeText(action.payload)
      return state

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

    case types.PERSON_AKTOERID_REQUEST:
      newParams = _.cloneDeep(state.params)
      delete newParams[action.context]

      return {
        ...state,
        params: newParams
      }

    case types.PERSON_AKTOERID_SUCCESS:
      newParams = _.cloneDeep(state.params)
      newParams[action.context] = action.payload.result

      return {
        ...state,
        params: newParams
      }

    case types.APP_EDITING_ITEMS_ADD: {
      let newEditingItem = _.cloneDeep(state.editingItems)
      newEditingItem[action.payload] = true
      return {
        ...state,
        editingItems:  newEditingItem
      }
    }

    case types.APP_EDITING_ITEMS_DELETE: {
      let newEditingItem = _.cloneDeep(state.editingItems)
      _.unset(newEditingItem,
        (action as ActionWithPayload).payload
      )

      return {
        ...state,
        editingItems:  newEditingItem
      }
    }

    case types.APP_EDITING_ITEMS_RESET: {
      return {
        ...state,
        editingItems: {}
      }
    }

    default:
      return state
  }
}

export default appReducer
