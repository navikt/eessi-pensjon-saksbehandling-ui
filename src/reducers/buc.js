import * as types from '../constants/actionTypes'
import _ from 'lodash'

export const initialBucState = {
  buc: undefined,
  bucs: undefined,
  bucsInfoList: undefined,
  bucsInfo: undefined,
  sed: undefined,
  seds: undefined,
  statusFilter: ['inbox'],
  p4000info: undefined,
  p4000list: undefined,
  institutionList: undefined,
  institutionNames: {},
  mode: 'buclist'
}

const bucReducer = (state = initialBucState, action) => {
  switch (action.type) {
    case types.APP_CLEAR_DATA: {
      return initialBucState
    }

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

    case types.BUC_SED_RESET:
      return {
        ...state,
        sed: undefined
      }

    case types.BUC_STATUS_FILTER_SET:
      return {
        ...state,
        statusFilter: action.payload
      }

    case types.BUC_BUC_RESET:
      return {
        ...state,
        buc: undefined,
        seds: undefined,
        sed: undefined,
        attachments: undefined
      }

    case types.BUC_GET_BUCS_SUCCESS:

      return {
        ...state,
        bucs: action.payload
      }

    case types.BUC_GET_BUCS_REQUEST:
      return {
        ...state,
        bucs: undefined
      }

    case types.BUC_GET_BUCS_FAILURE:

      return {
        ...state,
        bucs: null
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
        bucsInfo: typeof action.payload === 'object' ? action.payload : JSON.parse(action.payload)
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
        sed: undefined,
        attachments: undefined
      }

    case types.BUC_SAVE_BUCSINFO_SUCCESS:

      return {
        ...state,
        bucsInfo: typeof action.originalPayload === 'object' ? action.originalPayload : JSON.parse(action.originalPayload)
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
      let institutionNames = _.cloneDeep(state.institutionNames)
      action.payload.forEach(institution => {
        let existingInstitutions = institutionList[institution.landkode] || []
        if (!_.find(existingInstitutions, { 'id': institution.id })) {
          existingInstitutions.push({
            id: institution.id,
            navn: institution.navn,
            akronym: institution.akronym,
            landkode: institution.landkode,
            buc: action.context.buc
          })
        }
        institutionList[institution.landkode] = existingInstitutions
        institutionNames[institution.id] = institution.navn
      })

      return {
        ...state,
        institutionList: institutionList,
        institutionNames: institutionNames
      }

    case types.BUC_RINA_GET_URL_SUCCESS:

      return {
        ...state,
        rinaUrl: action.payload.rinaUrl
      }

    case types.BUC_CREATE_SED_SUCCESS:

      return {
        ...state,
        sed: action.payload
      }

    case types.BUC_SED_ATTACHMENT_SUCCESS:

      let existingAttachments = state.attachments ? _.cloneDeep(state.attachments) : []
      let newAttachment = action.payload
      let found = _.find(existingAttachments, { dokumentInfoId: newAttachment.dokumentInfoId })
      if (!found) {
        existingAttachments.push(newAttachment)
      }
      return {
        ...state,
        attachments: existingAttachments
      }

    case types.BUC_GET_P4000_LIST_SUCCESS:
      return {
        ...state,
        p4000list: action.payload
      }

    case types.BUC_GET_P4000_LIST_FAILURE:
      return {
        ...state,
        p4000list: null
      }

    case types.BUC_GET_P4000_INFO_SUCCESS:
    case types.BUC_P4000_INFO_SET:
      return {
        ...state,
        p4000info: action.payload
      }

    case types.BUC_GET_P4000_INFO_FAILURE:
      return {
        ...state,
        p4000info: null
      }

    default:
      return state
  }
}

export default bucReducer
