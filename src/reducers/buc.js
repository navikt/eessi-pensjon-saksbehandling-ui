import * as types from '../constants/actionTypes'
import _ from 'lodash'

export const initialBucState = {
  mode: 'list',
  step: 0
}

const bucReducer = (state = initialBucState, action) => {
  switch (action.type) {
    case types.BUC_MODE_SET:

      return {
        ...state,
        mode: action.payload
      }

    case types.BUC_BUC_SET:

      return {
        ...state,
        buc: action.payload
      }

    case types.BUC_SEDS_SET:

      return {
        ...state,
        seds: action.payload
      }

    case types.BUC_LIST_SET:

      return {
        ...state,
        list: action.payload
      }

    case types.BUC_GET_SUBJECT_AREA_LIST_SUCCESS:

      return Object.assign({}, state, {
        subjectAreaList: action.payload
      })

    case types.BUC_GET_INSTITUTION_LIST_SUCCESS:

      let institutionList = state.institutionList ? _.cloneDeep(state.institutionList) : {}
      action.payload.forEach(institution => {
        let existingInstitutions = institutionList[institution.landkode] || []
        if (!_.find(existingInstitutions, { 'id': institution.id })) {
          existingInstitutions.push({
            id: institution.id,
            navn: institution.navn,
            akronym: institution.akronym,
            landkode: institution.landkode
          })
        }
        institutionList[institution.landkode] = existingInstitutions
      })

      return Object.assign({}, state, {
        institutionList: institutionList
      })

    case types.BUC_REMOVE_INSTITUTION_LIST_FOR_COUNTRY:
      let institutions = state.institutionList ? _.cloneDeep(state.institutionList) : {}
      const landkode = action.payload
      delete institutions[landkode]
      return Object.assign({}, state, {
        institutionList: institutions
      })

    case types.BUC_GET_SED_LIST_SUCCESS:

      return Object.assign({}, state, {
        sedList: action.payload
      })

    case types.BUC_GET_BUC_LIST_REQUEST:

      return Object.assign({}, state, {
        bucList: []
      })

    case types.BUC_GET_BUC_LIST_SUCCESS:

      return Object.assign({}, state, {
        bucList: action.payload
      })

    case types.BUC_GET_BUC_LIST_FAILURE:

      return Object.assign({}, state, {
        bucList: []
      })

    case types.BUC_GET_COUNTRY_LIST_SUCCESS:

      return Object.assign({}, state, {
        countryList: action.payload
      })

    case types.BUC_CREATE_SED_REQUEST:
    case types.BUC_ADD_TO_SED_REQUEST:

      return Object.assign({}, state, {
        savedData: undefined
      })

    case types.BUC_CREATE_SED_SUCCESS:
    case types.BUC_ADD_TO_SED_SUCCESS:

      return Object.assign({}, state, {
        savedData: action.payload
      })

    case types.BUC_GET_CASE_NUMBER_REQUEST:

      return Object.assign({}, state, {
        currentBUC: undefined
      })

    case types.BUC_GET_CASE_NUMBER_SUCCESS:

      return Object.assign({}, state, {
        currentBUC: action.payload
      })

    case types.BUC_GET_CASE_NUMBER_CLEAN:

      return Object.assign({}, state, {
        currentBUC: undefined
      })

    case types.RINA_GET_URL_SUCCESS:

      return Object.assign({}, state, {
        rinaUrl: action.payload.rinaUrl
      })

    case types.APP_CLEAR_DATA:

      return Object.assign({}, state, {
        currentBUC: undefined,
        savedData: undefined
      })

    default:
      return state
  }
}

export default bucReducer
