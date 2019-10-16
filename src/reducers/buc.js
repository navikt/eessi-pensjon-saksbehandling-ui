import * as types from 'constants/actionTypes'
import _ from 'lodash'

export const initialBucState = {
  attachments: [],
  avdodBucs: undefined,
  bucs: undefined,
  bucsInfoList: undefined,
  bucsInfo: undefined,
  bucList: undefined,
  countryList: undefined,
  currentBuc: undefined,
  currentSed: undefined,
  sed: undefined,
  sedList: undefined,
  subjectAreaList: undefined,
  p4000info: undefined,
  p4000list: undefined,
  institutionList: undefined,
  institutionNames: {},
  mode: 'buclist',
  rinaId: undefined,
  tagList: undefined,
  update: undefined
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

    case types.BUC_CURRENTBUC_SET:

      return {
        ...state,
        currentBuc: action.payload
      }

    case types.BUC_CURRENTSED_SET:

      return {
        ...state,
        currentSed: action.payload
      }

    case types.BUC_SEDLIST_SET:

      return {
        ...state,
        sedList: action.payload
      }

    case types.BUC_SED_RESET:
      return {
        ...state,
        sed: undefined
      }

    case types.BUC_BUC_RESET:
      return {
        ...state,
        currentBuc: undefined,
        sed: undefined,
        attachments: []
      }

    case types.BUC_GET_SINGLE_BUC_SUCCESS: {
      if (!action.payload.caseId || !action.payload.type) { return state }
      const key = action.payload.type === 'P_BUC_02' ? 'avdodBucs' : 'bucs'

      return !action.payload.caseId || !action.payload.type
        ? state
        : {
          ...state,
          [key]: {
            ...state[key],
            [action.payload.caseId]: action.payload
          }
        }
    }

    case types.BUC_GET_BUCS_SUCCESS: {
      const bucReducer = (currentBucs, newBuc) => {
        currentBucs[newBuc.caseId] = newBuc
        return currentBucs
      }

      if (!_.isArray(action.payload)) {
        return state
      }

      return {
        ...state,
        bucs: action.payload.reduce(bucReducer, state.bucs || {})
      }
    }

    case types.BUC_GET_BUCS_FAILURE:
      return {
        ...state,
        bucs: null
      }

    case types.BUC_GET_AVDOD_BUCS_SUCCESS: {
      const bucReducer = (currentBucs, newBuc) => {
        currentBucs[newBuc.caseId] = newBuc
        return currentBucs
      }

      if (!_.isArray(action.payload)) {
        return state
      }

      return {
        ...state,
        avdodBucs: action.payload.reduce(bucReducer, state.avdodBucs || {})
      }
    }

    case types.BUC_GET_AVDOD_BUCS_FAILURE:
      return {
        ...state,
        avdodBucs: null
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
        bucList: action.payload // _.difference(action.payload, ['P_BUC_02', 'P_BUC_03', 'P_BUC_05', 'P_BUC_10'])
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

    case types.BUC_CREATE_BUC_SUCCESS: {
      const key = action.payload.type === 'P_BUC_02' ? 'avdodBucs' : 'bucs'

      return {
        ...state,
        currentBuc: action.payload.caseId,
        [key]: {
          ...state[key],
          [action.payload.caseId]: action.payload
        },
        mode: 'bucedit',
        sed: undefined,
        attachments: []
      }
    }

    case types.BUC_SAVE_BUCSINFO_SUCCESS:
      return {
        ...state,
        bucsInfo: action.context
      }

    case types.BUC_SAVE_BUCSINFO_REQUEST:
    case types.BUC_SAVE_BUCSINFO_FAILURE:

      return {
        ...state,
        bucsInfo: action.context
      }

    case types.BUC_GET_COUNTRY_LIST_SUCCESS:

      return {
        ...state,
        countryList: action.payload
      }

    case types.BUC_GET_COUNTRY_LIST_REQUEST:
    case types.BUC_GET_COUNTRY_LIST_FAILURE:

      return {
        ...state,
        countryList: undefined
      }

    case types.BUC_GET_SED_LIST_SUCCESS: {
      // the higher the indexOf, the higher it goes in the sorted list
      const sedTypes = ['X', 'H', 'P']
      return {
        ...state,
        sedList: action.payload.sort((a, b) => {
          const mainCompare = a.localeCompare(b)
          const sedTypeA = a.charAt(0)
          const sedTypeB = b.charAt(0)
          if (sedTypes.indexOf(sedTypeB) - sedTypes.indexOf(sedTypeA) > 0) return 1
          if (sedTypes.indexOf(sedTypeB) - sedTypes.indexOf(sedTypeA) < 0) return -1
          return mainCompare
        })
      }
    }

    case types.BUC_GET_SED_LIST_REQUEST:
    case types.BUC_GET_SED_LIST_FAILURE:

      return {
        ...state,
        sedList: undefined
      }

    case types.BUC_GET_INSTITUTION_LIST_SUCCESS: {
      const institutionList = state.institutionList ? _.cloneDeep(state.institutionList) : {}
      const institutionNames = _.clone(state.institutionNames)
      action.payload.forEach(institution => {
        const existingInstitutions = institutionList[institution.landkode] || []
        if (!_.find(existingInstitutions, { id: institution.id })) {
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
    }

    case types.BUC_RINA_GET_URL_SUCCESS:

      return {
        ...state,
        rinaUrl: action.payload.rinaUrl
      }

    case types.BUC_CREATE_SED_SUCCESS:
    case types.BUC_CREATE_REPLY_SED_SUCCESS:

      return {
        ...state,
        sed: action.payload
      }

    case types.BUC_SEND_ATTACHMENT_SUCCESS: {
      const existingAttachments = _.cloneDeep(state.attachments)
      const newAttachment = action.context
      const found = _.find(existingAttachments, {
        dokumentInfoId: newAttachment.dokumentInfoId,
        journalpostId: newAttachment.journalpostId,
        variant: newAttachment.variant
      })
      if (!found) {
        existingAttachments.push(newAttachment)
      }
      return {
        ...state,
        attachments: existingAttachments
      }
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
