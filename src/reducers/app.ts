import * as types from 'src/constants/actionTypes'
import {CountryCodes, CountryCodeLists, CurrencyCodes, CurrencyCodeLists, Feature, FeatureToggles, LandOgValutakoder, Params, PesysContext} from 'src/declarations/app.d'
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
  countryCodeMap: {[key: string]: string} | undefined
  currencyCodes: CurrencyCodes | undefined
  editingItems: any
}

const initialFeatureToggles: FeatureToggles = {
  P5000_TRANSFER_PESYS_BUTTON: true,
  SED_PREFILL_INSTITUTIONS: false,
  NR_AVDOD: 0,
  EESSI_ADMIN: false,
  TEST_USER: false,
  P5000_MERGE_BUTTON: false,
  RELEASE_CDM_4_4: false,
  RELEASE_CDM_4_4_BANNER: false,
  EP_WARNING_BANNER: false,
  TRACK_TO_UMAMI: false
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
  currencyCodes: undefined,
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
          newFeatureToggles[k as Feature] = action.payload?.features[k]
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

    case types.GET_COUNTRY_AND_CURRENCY_CODES_SUCCESS: {
      const landOgValutakoder: LandOgValutakoder = action.payload.result

      const countryCodes: CountryCodes = {} as CountryCodes
      const currencyCodes: CurrencyCodes = {} as CurrencyCodes

      Object.keys(landOgValutakoder).forEach(versionKey => {
        const version = landOgValutakoder[versionKey as keyof LandOgValutakoder]
        countryCodes[versionKey as keyof CountryCodes] = {
          euEftaLand: version.euEftaLand,
          verdensLand: version.verdensLand,
          verdensLandHistorisk: version.verdensLandHistorisk,
          statsborgerskap: version.statsborgerskap
        } as CountryCodeLists
        currencyCodes[versionKey as keyof CurrencyCodes] = {
          euEftaValuta: version.euEftaValuta,
          verdensValuta: version.verdensValuta
        } as CurrencyCodeLists
      })

      let countryCodeMap: {[key: string]: string} = {}
      Object.keys(countryCodes).forEach(versionKey => {
        Object.keys(countryCodes[versionKey as keyof CountryCodes]).forEach(landKey => {
          countryCodes[versionKey as keyof CountryCodes][landKey as keyof CountryCodeLists].forEach(land => {
            countryCodeMap[land.landkode] = land.landnavn
          })
        })
      })

      return {
        ...state,
        countryCodes,
        countryCodeMap,
        currencyCodes
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
      if (!_.isNil(action.payload.result) && !_.isNil(action.payload.result.sakType)) {
        if (action.payload.result.sakType.length === 0) {
          newParams.sakType = SakTypeMap.UKJENT
        } else {
          newParams.sakType = SakTypeMap[action.payload.result.sakType as SakTypeKey]
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
