import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import * as storage from 'constants/storage'
import * as api from './api'
import _ from 'lodash'
import sampleBucs from 'resources/tests/sampleBucs'
import sampleBucsInfo from 'resources/tests/sampleBucsInfo'
import sampleP4000info from 'resources/tests/sampleP4000info'
import sampleInstitutions from 'resources/tests/sampleInstitutions'
const sprintf = require('sprintf-js').sprintf

export const setMode = (mode) => {
  return {
    type: types.BUC_MODE_SET,
    payload: mode
  }
}

export const setCurrentBuc = (bucCaseId) => {
  return {
    type: types.BUC_CURRENTBUC_SET,
    payload: bucCaseId
  }
}

export const setCurrentSed = (sedDocumentId) => {
  return {
    type: types.BUC_CURRENTSED_SET,
    payload: sedDocumentId
  }
}

export const setSedList = (sedList) => {
  return {
    type: types.BUC_SEDLIST_SET,
    payload: sedList
  }
}

export const resetBuc = () => {
  return {
    type: types.BUC_BUC_RESET
  }
}

export const resetSed = () => {
  return {
    type: types.BUC_SED_RESET
  }
}

export const setP4000Info = (p4000) => {
  return {
    type: types.BUC_P4000_INFO_SET,
    payload: p4000
  }
}

export const fetchSingleBuc = (rinaCaseId) => {
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

export const fetchBucs = (aktoerId) => {
  return api.call({
    url: sprintf(urls.BUC_GET_BUCS_URL, { aktoerId: aktoerId }),
    failWith500: true,
    expectedPayload: sampleBucs,
    type: {
      request: types.BUC_GET_BUCS_REQUEST,
      success: types.BUC_GET_BUCS_SUCCESS,
      failure: types.BUC_GET_BUCS_FAILURE
    }
  })
}

export const fetchAvdodBucs = (aktoerId) => {
  return api.call({
    url: sprintf(urls.BUC_GET_BUCS_URL, { aktoerId: aktoerId }),
    failWith500: true,
    expectedPayload: sampleBucs,
    type: {
      request: types.BUC_GET_AVDOD_BUCS_REQUEST,
      success: types.BUC_GET_AVDOD_BUCS_SUCCESS,
      failure: types.BUC_GET_AVDOD_BUCS_FAILURE
    }
  })
}

export const fetchBucsInfoList = (aktoerId) => {
  return api.call({
    url: sprintf(urls.API_STORAGE_LIST_URL, { userId: aktoerId, namespace: storage.NAMESPACE_BUC }),
    expectedPayload: [aktoerId + '__BUC__INFO'],
    type: {
      request: types.BUC_GET_BUCSINFO_LIST_REQUEST,
      success: types.BUC_GET_BUCSINFO_LIST_SUCCESS,
      failure: types.BUC_GET_BUCSINFO_LIST_FAILURE
    }
  })
}

export const fetchBucsInfo = (userId, namespace, file) => {
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

export const getSubjectAreaList = () => {
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

export const getBucList = () => {
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

export const getTagList = () => {
  return {
    type: types.BUC_GET_TAG_LIST_SUCCESS,
    payload: ['urgent', 'vip', 'sensitive', 'secret']
  }
}

export const createBuc = (buc) => {
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

export const saveBucsInfo = ({ aktoerId, buc, bucsInfo = {}, comment, tags }) => {
  const newBucsInfo = _.cloneDeep(bucsInfo)
  const newTags = tags ? tags.map(tag => tag.value) : []
  const bucId = buc.caseId
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
    type: {
      request: types.BUC_SAVE_BUCSINFO_REQUEST,
      success: types.BUC_SAVE_BUCSINFO_SUCCESS,
      failure: types.BUC_SAVE_BUCSINFO_FAILURE
    }
  })
}

export const getCountryList = () => {
  return api.call({
    url: urls.EUX_COUNTRY_URL,
    expectedPayload: ['XX'],
    type: {
      request: types.BUC_GET_COUNTRY_LIST_REQUEST,
      success: types.BUC_GET_COUNTRY_LIST_SUCCESS,
      failure: types.BUC_GET_COUNTRY_LIST_FAILURE
    }
  })
}

export const getSedList = (buc) => {
  const url = sprintf(urls.BUC_GET_SED_LIST_URL, { buc: buc.type, rinaId: buc.caseId })
  return api.call({
    url: url,
    expectedPayload: ['P2000', 'P4000', 'P5000'],
    type: {
      request: types.BUC_GET_SED_LIST_REQUEST,
      success: types.BUC_GET_SED_LIST_SUCCESS,
      failure: types.BUC_GET_SED_LIST_FAILURE
    }
  })
}

export const getInstitutionsListForBucAndCountry = (buc, country) => {
  return api.call({
    url: sprintf(urls.EUX_INSTITUTIONS_FOR_BUC_AND_COUNTRY_URL, { buc: buc, country: country }),
    context: {
      buc: buc,
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

export const createSed = (payload) => {
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

export const createReplySed = (payload, parentId) => {
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

export const sendAttachmentToSed = (params, context) => {
  return api.call({
    url: sprintf(urls.BUC_SEND_ATTACHMENT_URL, params),
    method: 'PUT',
    expectedPayload: {
      success: true
    },
    context: context,
    type: {
      request: types.BUC_SEND_ATTACHMENT_REQUEST,
      success: types.BUC_SEND_ATTACHMENT_SUCCESS,
      failure: types.BUC_SEND_ATTACHMENT_FAILURE
    }
  })
}

export const getRinaUrl = () => {
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

export const listP4000 = (aktoerId) => {
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

export const getP4000 = (file) => {
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

export const saveP4000asSaksbehandler = (aktoerId, file) => {
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
