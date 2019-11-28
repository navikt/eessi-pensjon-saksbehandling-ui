import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import * as storage from 'constants/storage'
import tagsList from 'constants/tagsList'
import * as api from 'eessi-pensjon-ui/dist/api'
import _ from 'lodash'
import sampleBucs from 'resources/tests/sampleBucs'
import sampleBucsInfo from 'resources/tests/sampleBucsInfo'
import sampleP4000info from 'resources/tests/sampleP4000info'
import sampleInstitutions from 'resources/tests/sampleInstitutions'
import { CountryFilter } from 'eessi-pensjon-ui'
import moment from 'moment'
import { Action } from './actions' // eslint-disable-line
import {Buc, BucsInfo, NewSedPayload, Sed, P4000Info, ErrorBuc} from 'constants/types' // eslint-disable-line
const sprintf = require('sprintf-js').sprintf

export const setMode = (mode: string): Action<string> => {
  return {
    type: types.BUC_MODE_SET,
    payload: mode
  }
}

export const setCurrentBuc = (bucCaseId: string): Action<string> => {
  return {
    type: types.BUC_CURRENTBUC_SET,
    payload: bucCaseId
  }
}

export const setCurrentSed = (sedDocumentId: string) : Action<string> => {
  return {
    type: types.BUC_CURRENTSED_SET,
    payload: sedDocumentId
  }
}

export const setSedList = (sedList: Array<string>): Action<Array<string>> => {
  return {
    type: types.BUC_SEDLIST_SET,
    payload: sedList
  }
}

export const resetBuc = (): Action<string> => {
  return {
    type: types.BUC_BUC_RESET
  }
}

export const resetSed = (): Action<string> => {
  return {
    type: types.BUC_SED_RESET
  }
}
export const resetSedAttachments = (): Action<string> => {
  return {
    type: types.BUC_SED_ATTACHMENTS_RESET
  }
}

export const setP4000Info = (p4000: P4000Info): Action<P4000Info> => {
  return {
    type: types.BUC_P4000_INFO_SET,
    payload: p4000
  }
}

export const fetchSingleBuc = (rinaCaseId: string): Function => {
  return api.call({
    url: sprintf(urls.BUC_GET_SINGLE_BUC, { rinaCaseId: rinaCaseId }),
    expectedPayload: sampleBucs[0],
    type: {
      request: types.BUC_GET_SINGLE_BUC_REQUEST,
      success: types.BUC_GET_SINGLE_BUC_SUCCESS,
      failure: types.BUC_GET_SINGLE_BUC_FAILURE
    }
  })
}

export const fetchBucs = (aktoerId: string): Function => {
  return api.call({
    url: sprintf(urls.BUC_GET_BUCS_URL, { aktoerId: aktoerId }),
    cascadeFailureError: true,
    expectedPayload: sampleBucs,
    type: {
      request: types.BUC_GET_BUCS_REQUEST,
      success: types.BUC_GET_BUCS_SUCCESS,
      failure: types.BUC_GET_BUCS_FAILURE
    }
  })
}

export const fetchAvdodBucs = (aktoerId: string): Function => {
  return api.call({
    url: sprintf(urls.BUC_GET_BUCS_URL, { aktoerId: aktoerId }),
    cascadeFailureError: true,
    expectedPayload: sampleBucs,
    type: {
      request: types.BUC_GET_AVDOD_BUCS_REQUEST,
      success: types.BUC_GET_AVDOD_BUCS_SUCCESS,
      failure: types.BUC_GET_AVDOD_BUCS_FAILURE
    }
  })
}

export const fetchBucsInfoList = (aktoerId: string): Function => {
  return api.call({
    url: sprintf(urls.API_STORAGE_LIST_URL, { userId: aktoerId, namespace: storage.NAMESPACE_BUC }),
    expectedPayload: [aktoerId + '___' + storage.NAMESPACE_BUC + '___' + storage.FILE_BUCINFO],
    type: {
      request: types.BUC_GET_BUCSINFO_LIST_REQUEST,
      success: types.BUC_GET_BUCSINFO_LIST_SUCCESS,
      failure: types.BUC_GET_BUCSINFO_LIST_FAILURE
    }
  })
}

export const fetchBucsInfo = (userId: string, namespace: string, file: string): Function => {
  return api.call({
    url: sprintf(urls.API_STORAGE_GET_URL, { userId: userId, namespace: namespace, file: file }),
    expectedPayload: sampleBucsInfo,
    type: {
      request: types.BUC_GET_BUCSINFO_REQUEST,
      success: types.BUC_GET_BUCSINFO_SUCCESS,
      failure: types.BUC_GET_BUCSINFO_FAILURE
    }
  })
}

export const getSubjectAreaList = (): Function => {
  return api.call({
    url: urls.EUX_SUBJECT_AREA_URL,
    expectedPayload: ['Pensjon'],
    type: {
      request: types.BUC_GET_SUBJECT_AREA_LIST_REQUEST,
      success: types.BUC_GET_SUBJECT_AREA_LIST_SUCCESS,
      failure: types.BUC_GET_SUBJECT_AREA_LIST_FAILURE
    }
  })
}

export const getBucList = (): Function => {
  return api.call({
    url: urls.BUC_GET_BUC_LIST_URL,
    expectedPayload: ['DEMO_BUC_01'],
    type: {
      request: types.BUC_GET_BUC_LIST_REQUEST,
      success: types.BUC_GET_BUC_LIST_SUCCESS,
      failure: types.BUC_GET_BUC_LIST_FAILURE
    }
  })
}

export const getTagList = (): Action<Array<string>> => {
  return {
    type: types.BUC_GET_TAG_LIST_SUCCESS,
    payload: tagsList
  }
}

export const createBuc = (buc: Buc | ErrorBuc): Function => {
  return api.call({
    url: sprintf(urls.BUC_CREATE_BUC_URL, { buc: buc }),
    method: 'POST',
    expectedPayload: {
      type: buc,
      caseId: '123',
      creator: {
        institution: 'NO:NAV07',
        country: 'NO'
      }
    },
    type: {
      request: types.BUC_CREATE_BUC_REQUEST,
      success: types.BUC_CREATE_BUC_SUCCESS,
      failure: types.BUC_CREATE_BUC_FAILURE
    }
  })
}

interface BucsInfoProps {
  aktoerId: string;
  buc: {
    caseId: string;
  };
  bucsInfo: BucsInfo;
  comment?: string;
  tags?: Array<{value: string}>;
}

export const saveBucsInfo = ({ aktoerId, buc, bucsInfo = { bucs: {} }, comment, tags }: BucsInfoProps): Function => {
  const newBucsInfo = _.cloneDeep(bucsInfo)
  const newTags = tags ? tags.map(tag => tag.value) : []
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

export const getCountryList = (): Action<Array<string>> => {
  return {
    type: types.BUC_GET_COUNTRY_LIST_SUCCESS,
    payload: moment(new Date()).isAfter(new Date(2019, 11, 2)) ? CountryFilter.EESSI_READY_2 :  CountryFilter.EESSI_READY
}
}

export const getSedList = (buc: {type: string, caseId: string}): Function => {
  const url = sprintf(urls.BUC_GET_SED_LIST_URL, { buc: buc.type, rinaId: buc.caseId })
  return api.call({
    url: url,
    expectedPayload: ['P2000', 'P4000', 'P5000', 'P6000'],
    type: {
      request: types.BUC_GET_SED_LIST_REQUEST,
      success: types.BUC_GET_SED_LIST_SUCCESS,
      failure: types.BUC_GET_SED_LIST_FAILURE
    }
  })
}

export const getInstitutionsListForBucAndCountry = (bucType: string, country: string): Function => {
  // RINA uses UK, not GB
  let _country = country
  if (_country.toUpperCase() === 'GB') {
    _country = 'UK'
  }
  return api.call({
    url: sprintf(urls.EUX_INSTITUTIONS_FOR_BUC_AND_COUNTRY_URL, { buc: bucType, country: _country }),
    context: {
      buc: bucType,
      country: country
    },
    expectedPayload: sampleInstitutions,
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

export const sendAttachmentToSed = (params: any, context: any): Function => {
  return api.call({
    url: sprintf(urls.BUC_SEND_ATTACHMENT_URL, params),
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

export const getRinaUrl = (): Function => {
  return api.call({
    url: urls.EUX_RINA_URL,
    expectedPayload: {
      rinaUrl: 'http://mockurl.com/rinaUrl'
    },
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
    expectedPayload: [
      aktoerId + '___' + storage.NAMESPACE_PINFO + '___' + storage.FILE_PINFO
    ],
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
    expectedPayload: sampleP4000info,
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
    expectedPayload: sampleP4000info,
    context: { notification: false },
    type: {
      request: types.BUC_SAVE_PINFOSB_REQUEST,
      success: types.BUC_SAVE_PINFOSB_SUCCESS,
      failure: types.BUC_SAVE_PINFOSB_FAILURE
    }
  })
}
