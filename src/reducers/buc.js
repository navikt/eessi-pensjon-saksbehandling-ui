import * as types from '../constants/actionTypes'
import _ from 'lodash'

export const initialBucState = {
  mode: 'list',
  bucs: undefined,
  bucsInfoList: undefined,
  bucsInfo: undefined
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

    case types.BUC_GET_BUCS_SUCCESS:

      return {
        ...state,
        bucs: action.payload
      }

    case types.BUC_GET_BUCS_REQUEST:
    case types.BUC_GET_BUCS_FAILURE:

      return {
        ...state,
        bucs: undefined
      }

    case types.BUC_GET_BUCSINFO_LIST_SUCCESS:

      return {
        ...state,
        bucsInfoList: action.payload
      }

    case types.BUC_GET_BUCSINFO_LIST_REQUEST:
    case types.BUC_GET_BUCSINFO_LIST_FAILURE:

      return {
        ...state,
        bucsInfoList: undefined
      }

    case types.BUC_GET_BUCSINFO_SUCCESS:

      return {
        ...state,
        bucsInfo: action.payload
      }

    case types.BUC_GET_BUCSINFO_REQUEST:
    case types.BUC_GET_BUCSINFO_FAILURE:

      return {
        ...state,
        bucsInfo: undefined
      }

    case types.BUC_VERIFY_CASE_NUMBER_SUCCESS:

      return {
        ...state,
        currentBUC: action.payload
      }

    case types.BUC_VERIFY_CASE_NUMBER_REQUEST:
    case types.BUC_VERIFY_CASE_NUMBER_FAILURE:

      return {
        ...state,
        currentBUC: undefined
      }

    case types.BUC_GET_SUBJECT_AREA_LIST_SUCCESS:

      return {
        ...state,
        subjectAreaList: action.payload
      }

    case types.BUC_GET_SUBJECT_AREA_LIST_REQUEST:
    case types.BUC_GET_SUBJECT_AREA_LIST_FAILURE:

      return {
        ...state,
        subjectAreaList: []
      }

    case types.BUC_GET_BUC_LIST_SUCCESS:

      return {
        ...state,
        bucList: action.payload
      }

    case types.BUC_GET_BUC_LIST_REQUEST:
    case types.BUC_GET_BUC_LIST_FAILURE:

      return {
        ...state,
        bucList: []
      }

    case types.BUC_GET_TAG_LIST_SUCCESS:

      return {
        ...state,
        tagList: action.payload
      }

    case types.BUC_GET_TAG_LIST_REQUEST:
    case types.BUC_GET_TAG_LIST_FAILURE:

      return {
        ...state,
        tagList: []
      }

    case types.BUC_CREATE_BUC_REQUEST:
    case types.BUC_CREATE_BUC_FAILURE:

      return {
        ...state,
        rinaId: undefined
      }

    case types.BUC_CREATE_BUC_SUCCESS:

      return {
        ...state,
        buc: action.payload,
        seds: [],
        sed: undefined
      }

    case types.BUC_SAVE_BUCSINFO_SUCCESS:

      return {
        ...state,
        bucsInfo: action.originalPayload
      }

    case types.BUC_SAVE_BUCSINFO_REQUEST:
    case types.BUC_SAVE_BUCSINFO_FAILURE:

      return state

    case types.BUC_GET_COUNTRY_LIST_SUCCESS:

      return {
        ...state,
        countryList: action.payload
      }

    case types.BUC_GET_COUNTRY_LIST_REQUEST:
    case types.BUC_GET_COUNTRY_LIST_FAILURE:

      return state

    case types.BUC_GET_SED_LIST_SUCCESS:

      return {
        ...state,
        sedList: action.payload
      }

    case types.BUC_GET_SED_LIST_REQUEST:
    case types.BUC_GET_SED_LIST_FAILURE:

      return state

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

      return {
        ...state,
        institutionList: institutionList
      }

    case types.BUC_REMOVE_INSTITUTION_LIST_FOR_COUNTRY:
      let institutions = state.institutionList ? _.cloneDeep(state.institutionList) : {}
      const landkode = action.payload
      delete institutions[landkode]
      return {
        ...state,
        institutionList: institutions
      }

    case types.RINA_GET_URL_SUCCESS:

      return {
        ...state,
        rinaUrl: action.payload.rinaUrl
      }

    case types.BUC_CREATE_SED_SUCCESS:

      return {
        ...state,
        sed: action.payload
      }

    case types.APP_CLEAR_DATA:

      return initialBucState

    default:
      return state
  }
}

export default bucReducer
