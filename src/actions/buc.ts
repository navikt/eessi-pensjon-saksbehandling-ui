import { SEDAttachmentPayloadWithFile } from 'applications/BUC/components/SEDAttachmentSender/SEDAttachmentSender'
import * as types from 'constants/actionTypes'
import * as storage from 'constants/storage'
import tagsList from 'constants/tagsList'
import * as urls from 'constants/urls'
import { BucsInfo, NewSedPayload, Sed } from 'declarations/buc'
import { JoarkFile } from 'declarations/joark'
import { P4000Info } from 'declarations/period'
import { Features } from 'declarations/types'
import Ui from 'eessi-pensjon-ui'
import * as api from 'eessi-pensjon-ui/dist/api'
import { ActionWithPayload, ThunkResult } from 'eessi-pensjon-ui/dist/declarations/types'
import _ from 'lodash'
import { mockBuc, mockParticipants } from 'mocks/buc/buc'
import mockBucList from 'mocks/buc/bucList'
import mockBucs from 'mocks/buc/bucs'
import mockBucsInfo from 'mocks/buc/bucsInfo'
import mockBucsInfoList from 'mocks/buc/bucsInfoList'
import mockCreateBuc from 'mocks/buc/createBuc'
import mockInstitutions from 'mocks/buc/institutions'
import mockP4000info from 'mocks/P4000/P4000info'
import mockP4000list from 'mocks/P4000/P4000list'
import mockRinaUrl from 'mocks/buc/rinaUrl'
import mockSed from 'mocks/buc/sed'
import mockSedList from 'mocks/buc/sedList'
import mockSubjectAreaList from 'mocks/buc/subjectAreaList'
import { Action, ActionCreator } from 'redux'

const sprintf = require('sprintf-js').sprintf

export const setMode: ActionCreator<ActionWithPayload> = (mode: string): ActionWithPayload<string> => ({
  type: types.BUC_MODE_SET,
  payload: mode
})

export const setCurrentBuc: ActionCreator<ActionWithPayload> = (bucCaseId: string | undefined): ActionWithPayload<string | undefined> => ({
  type: types.BUC_CURRENTBUC_SET,
  payload: bucCaseId
})

export const setCurrentSed: ActionCreator<ActionWithPayload> = (sedDocumentId: string | undefined) : ActionWithPayload<string | undefined> => ({
  type: types.BUC_CURRENTSED_SET,
  payload: sedDocumentId
})

export const setSedList: ActionCreator<ActionWithPayload> = (sedList: Array<string>): ActionWithPayload<Array<string>> => ({
  type: types.BUC_SEDLIST_SET,
  payload: sedList
})

export const resetBuc: ActionCreator<Action> = (): Action => ({
  type: types.BUC_BUC_RESET
})

export const resetSed: ActionCreator<Action> = (): Action => ({
  type: types.BUC_SED_RESET
})

export const resetSedAttachments: ActionCreator<Action> = (): Action => ({
  type: types.BUC_SED_ATTACHMENTS_RESET
})

export const setP4000Info: ActionCreator<ActionWithPayload> = (p4000: P4000Info): ActionWithPayload<P4000Info> => ({
  type: types.BUC_P4000_INFO_SET,
  payload: p4000
})

export const fetchSingleBuc: ActionCreator<ThunkResult<ActionWithPayload>> = (rinaCaseId: string): ThunkResult<ActionWithPayload> => {
  return api.call({
    url: sprintf(urls.BUC_GET_SINGLE_BUC_URL, { rinaCaseId: rinaCaseId }),
    expectedPayload: mockBuc(rinaCaseId),
    type: {
      request: types.BUC_GET_SINGLE_BUC_REQUEST,
      success: types.BUC_GET_SINGLE_BUC_SUCCESS,
      failure: types.BUC_GET_SINGLE_BUC_FAILURE
    }
  })
}

export const fetchBucParticipants: ActionCreator<ThunkResult<ActionWithPayload>> = (rinaCaseId: string): ThunkResult<ActionWithPayload> => {
  return api.call({
    url: sprintf(urls.BUC_GET_PARTICIPANTS_URL, { rinaCaseId: rinaCaseId }),
    expectedPayload: /* istanbul ignore next */ mockParticipants(rinaCaseId),
    context: {
      rinaCaseId: rinaCaseId
    },
    type: {
      request: types.BUC_GET_PARTICIPANTS_REQUEST,
      success: types.BUC_GET_PARTICIPANTS_SUCCESS,
      failure: types.BUC_GET_PARTICIPANTS_FAILURE
    }
  })
}

export const fetchBucs: ActionCreator<ThunkResult<ActionWithPayload>> = (aktoerId: string): ThunkResult<ActionWithPayload> => {
  return api.call({
    url: sprintf(urls.BUC_GET_BUCS_URL, { aktoerId: aktoerId }),
    cascadeFailureError: true,
    expectedPayload: mockBucs,
    type: {
      request: types.BUC_GET_BUCS_REQUEST,
      success: types.BUC_GET_BUCS_SUCCESS,
      failure: types.BUC_GET_BUCS_FAILURE
    }
  })
}

export const fetchAvdodBucs: ActionCreator<ThunkResult<ActionWithPayload>> = (aktoerId: string): ThunkResult<ActionWithPayload> => {
  return api.call({
    url: sprintf(urls.BUC_GET_BUCS_URL, { aktoerId: aktoerId }),
    cascadeFailureError: true,
    expectedPayload: mockBucs,
    type: {
      request: types.BUC_GET_AVDOD_BUCS_REQUEST,
      success: types.BUC_GET_AVDOD_BUCS_SUCCESS,
      failure: types.BUC_GET_AVDOD_BUCS_FAILURE
    }
  })
}

export const fetchBucsInfoList: ActionCreator<ThunkResult<ActionWithPayload>> = (aktoerId: string): ThunkResult<ActionWithPayload> => {
  return api.call({
    url: sprintf(urls.API_STORAGE_LIST_URL, { userId: aktoerId, namespace: storage.NAMESPACE_BUC }),
    expectedPayload: mockBucsInfoList(aktoerId),
    type: {
      request: types.BUC_GET_BUCSINFO_LIST_REQUEST,
      success: types.BUC_GET_BUCSINFO_LIST_SUCCESS,
      failure: types.BUC_GET_BUCSINFO_LIST_FAILURE
    }
  })
}

export const fetchBucsInfo: ActionCreator<ThunkResult<ActionWithPayload>> = (userId: string, namespace: string, file: string): ThunkResult<ActionWithPayload> => {
  return api.call({
    url: sprintf(urls.API_STORAGE_GET_URL, { userId: userId, namespace: namespace, file: file }),
    expectedPayload: mockBucsInfo,
    type: {
      request: types.BUC_GET_BUCSINFO_REQUEST,
      success: types.BUC_GET_BUCSINFO_SUCCESS,
      failure: types.BUC_GET_BUCSINFO_FAILURE
    }
  })
}

export const getSubjectAreaList: ActionCreator<ThunkResult<ActionWithPayload>> = (): ThunkResult<ActionWithPayload> => {
  return api.call({
    url: urls.EUX_SUBJECT_AREA_URL,
    expectedPayload: mockSubjectAreaList,
    type: {
      request: types.BUC_GET_SUBJECT_AREA_LIST_REQUEST,
      success: types.BUC_GET_SUBJECT_AREA_LIST_SUCCESS,
      failure: types.BUC_GET_SUBJECT_AREA_LIST_FAILURE
    }
  })
}

export const getBucList: ActionCreator<ThunkResult<ActionWithPayload>> = (sakId: string, features: Features): ThunkResult<ActionWithPayload> => {
  return api.call({
    url: sprintf(urls.BUC_GET_BUC_LIST_URL, { sakId: sakId }),
    expectedPayload: mockBucList,
    context: {
      features: features
    },
    type: {
      request: types.BUC_GET_BUC_LIST_REQUEST,
      success: types.BUC_GET_BUC_LIST_SUCCESS,
      failure: types.BUC_GET_BUC_LIST_FAILURE
    }
  })
}

export const getTagList: ActionCreator<ActionWithPayload> = (): ActionWithPayload<Array<string>> => ({
  type: types.BUC_GET_TAG_LIST_SUCCESS,
  payload: tagsList
})

export const createBuc: ActionCreator<ThunkResult<ActionWithPayload>> = (buc: string): ThunkResult<ActionWithPayload> => {
  return api.call({
    url: sprintf(urls.BUC_CREATE_BUC_URL, { buc: buc }),
    method: 'POST',
    cascadeFailureError: true,
    expectedPayload: mockCreateBuc(buc),
    type: {
      request: types.BUC_CREATE_BUC_REQUEST,
      success: types.BUC_CREATE_BUC_SUCCESS,
      failure: types.BUC_CREATE_BUC_FAILURE
    }
  })
}

export interface SaveBucsInfoProps {
  aktoerId: string;
  buc: {
    caseId: string;
  };
  bucsInfo: BucsInfo;
  comment?: string;
  tags?: Array<string>;
}

export const saveBucsInfo: ActionCreator<ThunkResult<ActionWithPayload>> = ({
  aktoerId, buc, bucsInfo = { bucs: {} }, comment, tags
}: SaveBucsInfoProps): ThunkResult<ActionWithPayload> => {
  const newBucsInfo = _.cloneDeep(bucsInfo)
  const newTags = tags || [] // ? tags.map(tag => tag.value) : []
  const bucId = parseInt(buc.caseId, 10)
  newBucsInfo.bucs = newBucsInfo.bucs || {}
  newBucsInfo.bucs[bucId] = newBucsInfo.bucs[bucId] || {}
  if (tags) {
    newBucsInfo.bucs[bucId].tags = newTags
  }
  if (comment) {
    newBucsInfo.bucs[bucId].comment = comment
  }
  return api.call({
    url: sprintf(urls.API_STORAGE_POST_URL, { userId: aktoerId, namespace: storage.NAMESPACE_BUC, file: storage.FILE_BUCINFO }),
    method: 'POST',
    payload: newBucsInfo,
    context: newBucsInfo,
    type: {
      request: types.BUC_SAVE_BUCSINFO_REQUEST,
      success: types.BUC_SAVE_BUCSINFO_SUCCESS,
      failure: types.BUC_SAVE_BUCSINFO_FAILURE
    }
  })
}

export const getCountryList: ActionCreator<ThunkResult<ActionWithPayload>> = (bucType: string): ThunkResult<ActionWithPayload> => {
  return api.call({
    url: sprintf(urls.EUX_COUNTRIES_FOR_BUC_URL, { bucType: bucType }),
    context: {
      buc: bucType
    },
    expectedPayload: Ui.CountryFilter.EESSI_READY,
    type: {
      request: types.BUC_GET_COUNTRY_LIST_REQUEST,
      success: types.BUC_GET_COUNTRY_LIST_SUCCESS,
      failure: types.BUC_GET_COUNTRY_LIST_FAILURE
    }
  })
}

export const getSedList: ActionCreator<ThunkResult<ActionWithPayload>> = (buc: {type: string, caseId: string}): ThunkResult<ActionWithPayload> => {
  const url: string = sprintf(urls.BUC_GET_SED_LIST_URL, { buc: buc.type, rinaId: buc.caseId })
  return api.call({
    url: url,
    expectedPayload: mockSedList,
    type: {
      request: types.BUC_GET_SED_LIST_REQUEST,
      success: types.BUC_GET_SED_LIST_SUCCESS,
      failure: types.BUC_GET_SED_LIST_FAILURE
    }
  })
}

export const getInstitutionsListForBucAndCountry = (bucType: string, country: string): Function => {
  // RINA uses UK, not GB
  let _country: string = country
  if (_country.toUpperCase() === 'GB') {
    _country = 'UK'
  }
  return api.call({
    url: sprintf(urls.EUX_INSTITUTIONS_FOR_BUC_AND_COUNTRY_URL, { buc: bucType, country: _country }),
    context: {
      buc: bucType,
      country: country
    },
    expectedPayload: mockInstitutions,
    type: {
      request: types.BUC_GET_INSTITUTION_LIST_REQUEST,
      success: types.BUC_GET_INSTITUTION_LIST_SUCCESS,
      failure: types.BUC_GET_INSTITUTION_LIST_FAILURE
    }
  })
}

export const createSed = (payload: NewSedPayload): Function => {
  return api.call({
    url: urls.BUC_CREATE_SED_URL,
    payload: payload,
    expectedPayload: {
      ...payload,
      id: '123456789'
    },
    cascadeFailureError: true,
    method: 'POST',
    type: {
      request: types.BUC_CREATE_SED_REQUEST,
      success: types.BUC_CREATE_SED_SUCCESS,
      failure: types.BUC_CREATE_SED_FAILURE
    }
  })
}

export const createReplySed = (payload: NewSedPayload, parentId: string): Function => {
  return api.call({
    url: sprintf(urls.BUC_CREATE_REPLY_SED_URL, { parentId: parentId }),
    payload: payload,
    expectedPayload: {
      ...payload,
      id: '123456789'
    },
    method: 'POST',
    type: {
      request: types.BUC_CREATE_REPLY_SED_REQUEST,
      success: types.BUC_CREATE_REPLY_SED_SUCCESS,
      failure: types.BUC_CREATE_REPLY_SED_FAILURE
    }
  })
}

export const sendAttachmentToSed = (params: SEDAttachmentPayloadWithFile, context: JoarkFile): Function => {
  return api.call({
    url: sprintf(urls.API_JOARK_ATTACHMENT_URL, params),
    method: 'PUT',
    cascadeFailureError: true,
    expectedPayload: context,
    context: context,
    type: {
      request: types.BUC_SEND_ATTACHMENT_REQUEST,
      success: types.BUC_SEND_ATTACHMENT_SUCCESS,
      failure: types.BUC_SEND_ATTACHMENT_FAILURE
    }
  })
}

export const getSed = (caseId: string, sed: Sed): Function => {
  return api.call({
    url: sprintf(urls.BUC_GET_SED_URL, { caseId: caseId, documentId: sed.id }),
    cascadeFailureError: true,
    context: sed,
    expectedPayload: mockSed(sed),
    type: {
      request: types.BUC_GET_SED_REQUEST,
      success: types.BUC_GET_SED_SUCCESS,
      failure: types.BUC_GET_SED_FAILURE
    }
  })
}

export const getRinaUrl = (): Function => {
  return api.call({
    url: urls.EUX_RINA_URL,
    expectedPayload: mockRinaUrl,
    type: {
      request: types.BUC_RINA_GET_URL_REQUEST,
      success: types.BUC_RINA_GET_URL_SUCCESS,
      failure: types.BUC_RINA_GET_URL_FAILURE
    }
  })
}

export const listP4000 = (aktoerId: string): Function => {
  return api.call({
    url: sprintf(urls.API_STORAGE_LIST_URL, { userId: aktoerId, namespace: storage.NAMESPACE_PINFO }),
    expectedPayload: mockP4000list(aktoerId),
    type: {
      request: types.BUC_GET_P4000_LIST_REQUEST,
      success: types.BUC_GET_P4000_LIST_SUCCESS,
      failure: types.BUC_GET_P4000_LIST_FAILURE
    }
  })
}

export const getP4000 = (file: string): Function => {
  return api.call({
    url: sprintf(urls.API_STORAGE_GET_URL, { file: file }),
    expectedPayload: mockP4000info,
    type: {
      request: types.BUC_GET_P4000_INFO_REQUEST,
      success: types.BUC_GET_P4000_INFO_SUCCESS,
      failure: types.BUC_GET_P4000_INFO_FAILURE
    }
  })
}

export const saveP4000asSaksbehandler = (aktoerId: string, file: string): Function => {
  return api.call({
    url: sprintf(urls.API_STORAGE_POST_URL, { userId: aktoerId, namespace: storage.NAMESPACE_PINFO, file: 'PINFOSB.json' }),
    payload: file,
    expectedPayload: mockP4000info,
    context: { notification: false },
    type: {
      request: types.BUC_SAVE_PINFOSB_REQUEST,
      success: types.BUC_SAVE_PINFOSB_SUCCESS,
      failure: types.BUC_SAVE_PINFOSB_FAILURE
    }
  })
}
