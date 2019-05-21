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

    case types.BUC_LIST_SET:

      return {
        ...state,
        list: action.payload
      }

    case types.CASE_STEP_SET:

      return Object.assign({}, state, {
        step: action.payload
      })

    case types.CASE_GET_SUBJECT_AREA_LIST_SUCCESS:

      return Object.assign({}, state, {
        subjectAreaList: action.payload
      })

    case types.CASE_GET_INSTITUTION_LIST_SUCCESS:

      let institutionList = state.institutionList ? _.cloneDeep(state.institutionList) : {}
      action.payload.forEach(institution => {
        let existingInstitutions = institutionList[institution.landkode] || []
        if (!_.find(existingInstitutions, {'id': institution.id})) {
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

    case types.CASE_REMOVE_INSTITUTION_LIST_FOR_COUNTRY:
      let institutions = state.institutionList ? _.cloneDeep(state.institutionList) : {}
      const landkode = action.payload
      delete institutions[landkode]
      return Object.assign({}, state, {
        institutionList: institutions
      })

    case types.CASE_GET_SED_LIST_SUCCESS:

      return Object.assign({}, state, {
        sedList: action.payload
      })

    case types.CASE_GET_BUC_LIST_REQUEST:

      return Object.assign({}, state, {
        bucList: []
      })

    case types.CASE_GET_BUC_LIST_SUCCESS:

      return Object.assign({}, state, {
        bucList: action.payload
      })

    case types.CASE_GET_BUC_LIST_FAILURE:

      return Object.assign({}, state, {
        bucList: []
      })

    case types.CASE_GET_COUNTRY_LIST_SUCCESS:

      return Object.assign({}, state, {
        countryList: action.payload
      })

    case types.CASE_CREATE_SED_REQUEST:
    case types.CASE_ADD_TO_SED_REQUEST:

      return Object.assign({}, state, {
        savedData: undefined
      })

    case types.CASE_CREATE_SED_SUCCESS:
    case types.CASE_ADD_TO_SED_SUCCESS:

      return Object.assign({}, state, {
        savedData: action.payload,
        step: 2
      })

    case types.CASE_GET_CASE_NUMBER_REQUEST:

      return Object.assign({}, state, {
        currentCase: undefined
      })

    case types.CASE_GET_CASE_NUMBER_SUCCESS:

      return Object.assign({}, state, {
        currentCase: action.payload
      })

    case types.CASE_GET_CASE_NUMBER_CLEAN:

      return Object.assign({}, state, {
        currentCase: undefined
      })

    case types.RINA_GET_URL_SUCCESS:

      return Object.assign({}, state, {
        rinaUrl: action.payload.rinaUrl
      })

    case types.APP_CLEAR_DATA:

      return Object.assign({}, state, {
        currentCase: undefined,
        savedData: undefined,
        step: 0
      })

    default:
      return state
  }
}

export default bucReducer
