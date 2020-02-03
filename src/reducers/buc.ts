import { BUCMode } from 'applications/BUC'
import * as types from 'constants/actionTypes'
import {
  AttachedFiles,
  Buc,
  Bucs,
  BucsInfo,
  InstitutionListMap,
  InstitutionNames,
  RawInstitution,
  Sed
} from 'declarations/buc'
import { JoarkFile } from 'declarations/joark'
import { P4000Info } from 'declarations/period'
import { RinaUrl } from 'declarations/types'
import { ActionWithPayload } from 'eessi-pensjon-ui/dist/declarations/types'
import _ from 'lodash'
import { Action } from 'redux'

export interface BucState {
  attachments: AttachedFiles;
  attachmentsError: boolean;
  avdodBucs: Bucs | undefined,
  bucs: Bucs | undefined,
  bucsInfoList: Array<string> | undefined;
  bucsInfo: BucsInfo | undefined,
  bucList: Array<string> | undefined;
  countryList: Array<string> | undefined;
  currentBuc: string | undefined;
  currentSed: string | undefined,
  sed: Sed | undefined,
  sedList: Array<string> | undefined,
  subjectAreaList: Array<string> | undefined,
  p4000info: P4000Info | undefined,
  p4000list: Array<string> | undefined,
  institutionList: InstitutionListMap<RawInstitution> | undefined,
  institutionNames: InstitutionNames;
  mode: BUCMode;
  rinaId: string | undefined;
  rinaUrl: RinaUrl | undefined;
  tagList: Array<string> | undefined;
}

export const initialBucState: BucState = {
  attachments: {},
  attachmentsError: false,
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
  rinaUrl: undefined,
  tagList: undefined
}

const bucReducer = (state: BucState = initialBucState, action: Action | ActionWithPayload) => {
  switch (action.type) {
    case types.APP_CLEAR_DATA: {
      return initialBucState
    }

    case types.BUC_MODE_SET:

      return {
        ...state,
        mode: (action as ActionWithPayload).payload
      }

    case types.BUC_CURRENTBUC_SET:
      return {
        ...state,
        currentBuc: (action as ActionWithPayload).payload
      }

    case types.BUC_CURRENTSED_SET:

      return {
        ...state,
        currentSed: (action as ActionWithPayload).payload
      }

    case types.BUC_SEDLIST_SET:

      return {
        ...state,
        sedList: (action as ActionWithPayload).payload
      }

    case types.BUC_SED_RESET:
      return {
        ...state,
        sed: undefined,
        countryList: undefined,
        institutionList: undefined
      }

    case types.BUC_SED_ATTACHMENTS_RESET: {
      return {
        ...state,
        attachments: {}
      }
    }

    case types.BUC_BUC_RESET:
      return {
        ...state,
        currentBuc: undefined,
        sed: undefined,
        attachments: {}
      }

    case types.BUC_GET_SINGLE_BUC_SUCCESS: {
      if (!(action as ActionWithPayload).payload.caseId || !(action as ActionWithPayload).payload.type) { return state }
      const key = (action as ActionWithPayload).payload.type === 'P_BUC_02' ? 'avdodBucs' : 'bucs'

      return !(action as ActionWithPayload).payload.caseId || !(action as ActionWithPayload).payload.type
        ? state
        : {
          ...state,
          [key]: {
            ...state[key],
            [(action as ActionWithPayload).payload.caseId]: (action as ActionWithPayload).payload
          }
        }
    }

    case types.BUC_GET_BUCS_SUCCESS: {
      const bucReducer = (currentBucs: Bucs, newBuc: Buc) => {
        currentBucs[newBuc.caseId as string] = newBuc
        return currentBucs
      }

      if (!_.isArray((action as ActionWithPayload).payload)) {
        return state
      }

      return {
        ...state,
        bucs: (action as ActionWithPayload).payload.reduce(bucReducer, state.bucs || {})
      }
    }

    case types.BUC_GET_BUCS_FAILURE:
      return {
        ...state,
        bucs: null
      }

    case types.BUC_GET_AVDOD_BUCS_SUCCESS: {
      const bucReducer = (currentBucs: Bucs, newBuc: Buc) => {
        currentBucs[newBuc.caseId as string] = newBuc
        return currentBucs
      }

      if (!_.isArray((action as ActionWithPayload).payload)) {
        return state
      }

      return {
        ...state,
        avdodBucs: (action as ActionWithPayload).payload.reduce(bucReducer, state.avdodBucs || {})
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
        bucsInfoList: (action as ActionWithPayload).payload
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
        bucsInfo: typeof (action as ActionWithPayload).payload === 'object' ? (action as ActionWithPayload).payload : JSON.parse((action as ActionWithPayload).payload)
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
        subjectAreaList: (action as ActionWithPayload).payload
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
        bucList: _.difference((action as ActionWithPayload).payload, ['P_BUC_02', 'P_BUC_05', 'P_BUC_10'])
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
        tagList: (action as ActionWithPayload).payload
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
      const key = (action as ActionWithPayload).payload.type === 'P_BUC_02' ? 'avdodBucs' : 'bucs'

      return {
        ...state,
        currentBuc: (action as ActionWithPayload).payload.caseId,
        [key]: {
          ...state[key],
          [(action as ActionWithPayload).payload.caseId]: (action as ActionWithPayload).payload
        },
        mode: 'bucedit',
        sed: undefined,
        attachments: {}
      }
    }

    case types.BUC_SAVE_BUCSINFO_SUCCESS:
      return {
        ...state,
        bucsInfo: (action as ActionWithPayload).context
      }

    case types.BUC_SAVE_BUCSINFO_REQUEST:
    case types.BUC_SAVE_BUCSINFO_FAILURE:

      return {
        ...state,
        bucsInfo: (action as ActionWithPayload).context
      }

    case types.BUC_GET_COUNTRY_LIST_SUCCESS:

      return {
        ...state,
        countryList: (action as ActionWithPayload).payload
      }

    case types.BUC_GET_COUNTRY_LIST_REQUEST:
    case types.BUC_GET_COUNTRY_LIST_FAILURE:

      return {
        ...state,
        countryList: undefined
      }

    case types.BUC_GET_SED_LIST_SUCCESS: {
      const sedTypes = ['X', 'H', 'P']
      return {
        ...state,
        sedList: (action as ActionWithPayload).payload.sort((a: string, b: string) => {
          const mainCompare = parseInt(a.replace(/[^\d]/g, ''), 10) - parseInt(b.replace(/[^\d]/g, ''), 10)
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
      const institutionList: InstitutionListMap<RawInstitution> = state.institutionList ? _.cloneDeep(state.institutionList!) : {}
      const institutionNames: InstitutionNames = _.clone(state.institutionNames);
      (action as ActionWithPayload).payload.forEach((institution: RawInstitution) => {
        const existingInstitutions = institutionList[institution.landkode] || []
        if (!_.find(existingInstitutions, { id: institution.id })) {
          existingInstitutions.push({
            id: institution.id,
            navn: institution.navn,
            akronym: institution.akronym,
            landkode: institution.landkode,
            buc: (action as ActionWithPayload).context.buc
          })
        }
        existingInstitutions.sort((a: RawInstitution, b: RawInstitution) => a.navn.localeCompare(b.navn))
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
        rinaUrl: (action as ActionWithPayload).payload.rinaUrl
      }

    case types.BUC_CREATE_SED_SUCCESS:
    case types.BUC_CREATE_REPLY_SED_SUCCESS:

      return {
        ...state,
        sed: (action as ActionWithPayload).payload
      }

    case types.BUC_SEND_ATTACHMENT_SUCCESS: {
      const existingAttachments: AttachedFiles = _.cloneDeep(state.attachments)
      const newAttachment: JoarkFile = (action as ActionWithPayload).context
      const found = _.find(existingAttachments.joark, {
        dokumentInfoId: newAttachment.dokumentInfoId,
        journalpostId: newAttachment.journalpostId,
        variant: newAttachment.variant
      })
      if (!found) {
        if (!existingAttachments.joark) {
          existingAttachments.joark = []
        }
        (existingAttachments.joark as Array<JoarkFile>).push(newAttachment as JoarkFile)
      }
      return {
        ...state,
        attachments: existingAttachments
      }
    }

    case types.BUC_SEND_ATTACHMENT_REQUEST:
      return {
        ...state,
        attachmentsError: false
      }

    case types.BUC_SEND_ATTACHMENT_FAILURE:
      return {
        ...state,
        attachmentsError: true
      }

    case types.BUC_GET_P4000_LIST_SUCCESS:
      return {
        ...state,
        p4000list: (action as ActionWithPayload).payload
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
        p4000info: (action as ActionWithPayload).payload
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
