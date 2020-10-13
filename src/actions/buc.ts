import { BUCMode } from 'applications/BUC'
import * as types from 'constants/actionTypes'
import * as storage from 'constants/storage'
import tagsList from 'constants/tagsList'
import * as urls from 'constants/urls'
import {
  Buc,
  BUCRawList,
  Bucs,
  BucsInfo,
  BucsInfoRawList,
  CountryRawList,
  NewSedPayload,
  Participants,
  RawInstitutions,
  RinaUrlPayload,
  SaveBucsInfoProps,
  Sed,
  SEDAttachmentPayloadWithFile,
  SEDRawList,
  SEDP5000Payload,
  SubjectAreaRawList,
  TagRawList,
  ValidBuc
} from 'declarations/buc'
import { JoarkBrowserItem, JoarkBrowserItems } from 'declarations/joark'
import { PesysContext } from 'declarations/app.d'
import { Person, PersonAvdod } from 'declarations/person.d'
import { ActionWithPayload, call, ThunkResult } from 'js-fetch-api'
import { CountryFilter } from 'land-verktoy'
import _ from 'lodash'
import { mockBuc, mockParticipants } from 'mocks/buc/buc'
import mockBucList from 'mocks/buc/bucList'
import mockBucs from 'mocks/buc/bucs'
import mockBucsInfo from 'mocks/buc/bucsInfo'
import mockBucsInfoList from 'mocks/buc/bucsInfoList'
import mockCreateBuc from 'mocks/buc/createBuc'
import mockCreateSed from 'mocks/buc/createSed'
import mockInstitutions from 'mocks/buc/institutions'
import mockRinaUrl from 'mocks/buc/rinaUrl'
import mockSed from 'mocks/buc/sed'
import mockSedList from 'mocks/buc/sedList'
import mockSubjectAreaList from 'mocks/buc/subjectAreaList'
import { Action, ActionCreator } from 'redux'

const sprintf = require('sprintf-js').sprintf

export const cleanNewlyCreatedBuc: ActionCreator<Action> = (): Action => ({
  type: types.BUC_NEWLYCREATEDBUC_RESET
})

export const createBuc: ActionCreator<ThunkResult<ActionWithPayload<ValidBuc>>> =
  (buc: string, person: Person, avdod: PersonAvdod
  ): ThunkResult<ActionWithPayload<ValidBuc>> => {
    return call({
      url: sprintf(urls.BUC_CREATE_BUC_URL, { buc: buc }),
      method: 'POST',
      context: {
        avdod: avdod,
        person: person
      },
      cascadeFailureError: true,
      expectedPayload: mockCreateBuc(buc),
      type: {
        request: types.BUC_CREATE_BUC_REQUEST,
        success: types.BUC_CREATE_BUC_SUCCESS,
        failure: types.BUC_CREATE_BUC_FAILURE
      }
    })
  }

export const createReplySed: ActionCreator<ThunkResult<ActionWithPayload<Sed>>> = (
  buc: Buc, payload: NewSedPayload, parentId: string
): ThunkResult<ActionWithPayload<Sed>> => {
  return call({
    url: sprintf(urls.BUC_CREATE_REPLY_SED_URL, { parentId: parentId }),
    payload: payload,
    context: {
      buc: buc,
      sed: payload
    },
    expectedPayload: mockCreateSed(payload),
    cascadeFailureError: true,
    method: 'POST',
    type: {
      request: types.BUC_CREATE_REPLY_SED_REQUEST,
      success: types.BUC_CREATE_REPLY_SED_SUCCESS,
      failure: types.BUC_CREATE_REPLY_SED_FAILURE
    }
  })
}

export const createSed: ActionCreator<ThunkResult<ActionWithPayload<Sed>>> = (
  buc: Buc, payload: NewSedPayload
): ThunkResult<ActionWithPayload<Sed>> => {
  return call({
    url: urls.BUC_CREATE_SED_URL,
    payload: payload,
    context: {
      buc: buc,
      sed: payload
    },
    expectedPayload: mockCreateSed(payload),
    cascadeFailureError: true,
    method: 'POST',
    type: {
      request: types.BUC_CREATE_SED_REQUEST,
      success: types.BUC_CREATE_SED_SUCCESS,
      failure: types.BUC_CREATE_SED_FAILURE
    }
  })
}

export const createSavingAttachmentJob: ActionCreator<ActionWithPayload<JoarkBrowserItems>> = (
  joarkBrowserItems: JoarkBrowserItems
): ActionWithPayload<JoarkBrowserItems> => ({
  type: types.BUC_SAVINGATTACHMENTJOB_SET,
  payload: joarkBrowserItems
})

export const fetchBucParticipants: ActionCreator<ThunkResult<ActionWithPayload<Participants>>> = (
  rinaCaseId: string
): ThunkResult<ActionWithPayload<Participants>> => {
  return call({
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

export const fetchBucs: ActionCreator<ThunkResult<ActionWithPayload<Bucs>>> = (
  aktoerId: string
): ThunkResult<ActionWithPayload<Bucs>> => {
  return call({
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

export const fetchBucsInfo: ActionCreator<ThunkResult<ActionWithPayload<BucsInfo>>> = (
  userId: string, namespace: string, file: string
): ThunkResult<ActionWithPayload<BucsInfoRawList>> => {
  return call({
    url: sprintf(urls.API_STORAGE_GET_URL, { userId: userId, namespace: namespace, file: file }),
    expectedPayload: mockBucsInfo,
    type: {
      request: types.BUC_GET_BUCSINFO_REQUEST,
      success: types.BUC_GET_BUCSINFO_SUCCESS,
      failure: types.BUC_GET_BUCSINFO_FAILURE
    }
  })
}

export const fetchBucsInfoList: ActionCreator<ThunkResult<ActionWithPayload<BucsInfoRawList>>> = (
  aktoerId: string
): ThunkResult<ActionWithPayload<BucsInfoRawList>> => {
  return call({
    url: sprintf(urls.API_STORAGE_LIST_URL, { userId: aktoerId, namespace: storage.NAMESPACE_BUC }),
    expectedPayload: mockBucsInfoList(aktoerId),
    type: {
      request: types.BUC_GET_BUCSINFO_LIST_REQUEST,
      success: types.BUC_GET_BUCSINFO_LIST_SUCCESS,
      failure: types.BUC_GET_BUCSINFO_LIST_FAILURE
    }
  })
}

export const fetchBucsWithVedtakId: ActionCreator<ThunkResult<ActionWithPayload<Bucs>>> = (
  aktoerId: string, vedtakId: string
): ThunkResult<ActionWithPayload<Bucs>> => {
  return call({
    url: sprintf(urls.BUC_GET_BUCS_WITH_VEDTAKID_URL, { aktoerId: aktoerId, vedtakId: vedtakId }),
    cascadeFailureError: true,
    expectedPayload: mockBucs,
    type: {
      request: types.BUC_GET_BUCS_REQUEST,
      success: types.BUC_GET_BUCS_SUCCESS,
      failure: types.BUC_GET_BUCS_FAILURE
    }
  })
}

export const fetchSingleBuc: ActionCreator<ThunkResult<ActionWithPayload<ValidBuc>>> = (
  rinaCaseId: string
): ThunkResult<ActionWithPayload<ValidBuc>> => {
  return call({
    url: sprintf(urls.BUC_GET_SINGLE_BUC_URL, { rinaCaseId: rinaCaseId }),
    expectedPayload: mockBuc(rinaCaseId),
    type: {
      request: types.BUC_GET_SINGLE_BUC_REQUEST,
      success: types.BUC_GET_SINGLE_BUC_SUCCESS,
      failure: types.BUC_GET_SINGLE_BUC_FAILURE
    }
  })
}

export const getBucList: ActionCreator<ThunkResult<ActionWithPayload<BUCRawList>>> = (
  sakId: string, pesysContext: PesysContext
): ThunkResult<ActionWithPayload<BUCRawList>> => {
  return call({
    url: sprintf(urls.BUC_GET_BUC_LIST_URL, { sakId: sakId }),
    expectedPayload: mockBucList,
    context: {
      pesysContext: pesysContext
    },
    type: {
      request: types.BUC_GET_BUC_LIST_REQUEST,
      success: types.BUC_GET_BUC_LIST_SUCCESS,
      failure: types.BUC_GET_BUC_LIST_FAILURE
    }
  })
}

export const getCountryList: ActionCreator<ThunkResult<ActionWithPayload<CountryRawList>>> = (
  bucType: string
): ThunkResult<ActionWithPayload<CountryRawList>> => {
  return call({
    url: sprintf(urls.EUX_COUNTRIES_FOR_BUC_URL, { bucType: bucType }),
    context: {
      buc: bucType
    },
    expectedPayload: CountryFilter.EESSI_READY,
    type: {
      request: types.BUC_GET_COUNTRY_LIST_REQUEST,
      success: types.BUC_GET_COUNTRY_LIST_SUCCESS,
      failure: types.BUC_GET_COUNTRY_LIST_FAILURE
    }
  })
}

export const getInstitutionsListForBucAndCountry: ActionCreator<ThunkResult<ActionWithPayload<RawInstitutions>>> = (
  bucType: string, country: string
): ThunkResult<ActionWithPayload<RawInstitutions>> => {
  // RINA uses UK, not GB
  let _country: string = country
  if (_country.toUpperCase() === 'GB') {
    _country = 'UK'
  }
  return call({
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

export const getRinaUrl: ActionCreator<ThunkResult<ActionWithPayload<RinaUrlPayload>>> = (
): ThunkResult<ActionWithPayload<RinaUrlPayload>> => {
  return call({
    url: urls.EUX_RINA_URL,
    expectedPayload: mockRinaUrl,
    type: {
      request: types.BUC_RINA_GET_URL_REQUEST,
      success: types.BUC_RINA_GET_URL_SUCCESS,
      failure: types.BUC_RINA_GET_URL_FAILURE
    }
  })
}

export const getSed: ActionCreator<ThunkResult<ActionWithPayload<SEDP5000Payload>>> = (
  caseId: string, sed: Sed
): ThunkResult<ActionWithPayload<SEDP5000Payload>> => {
  return call({
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

export const getSedList: ActionCreator<ThunkResult<ActionWithPayload<SEDRawList>>> = (
  buc: {type: string, caseId: string}
): ThunkResult<ActionWithPayload<SEDRawList>> => {
  const url: string = sprintf(urls.BUC_GET_SED_LIST_URL, { buc: buc.type, rinaId: buc.caseId })
  return call({
    url: url,
    expectedPayload: mockSedList,
    type: {
      request: types.BUC_GET_SED_LIST_REQUEST,
      success: types.BUC_GET_SED_LIST_SUCCESS,
      failure: types.BUC_GET_SED_LIST_FAILURE
    }
  })
}

export const getSubjectAreaList: ActionCreator<ThunkResult<ActionWithPayload<SubjectAreaRawList>>> = (
): ThunkResult<ActionWithPayload<SubjectAreaRawList>> => {
  return call({
    url: urls.EUX_SUBJECT_AREA_URL,
    expectedPayload: mockSubjectAreaList,
    type: {
      request: types.BUC_GET_SUBJECT_AREA_LIST_REQUEST,
      success: types.BUC_GET_SUBJECT_AREA_LIST_SUCCESS,
      failure: types.BUC_GET_SUBJECT_AREA_LIST_FAILURE
    }
  })
}

export const getTagList: ActionCreator<ActionWithPayload<TagRawList>> = (
): ActionWithPayload<TagRawList> => ({
  type: types.BUC_GET_TAG_LIST_SUCCESS,
  payload: tagsList
})

export const resetBuc: ActionCreator<Action> = (): Action => ({
  type: types.BUC_BUC_RESET
})

export const resetNewSed: ActionCreator<Action> = (): Action => ({
  type: types.BUC_NEWSED_RESET
})

export const resetSavingAttachmentJob: ActionCreator<Action> = (): Action => ({
  type: types.BUC_SAVINGATTACHMENTJOB_RESET
})

export const resetSed: ActionCreator<Action> = (): Action => ({
  type: types.BUC_SED_RESET
})

export const resetSedAttachments: ActionCreator<Action> = (): Action => ({
  type: types.BUC_SED_ATTACHMENTS_RESET
})

export const saveBucsInfo: ActionCreator<ThunkResult<Action>> = ({
  aktoerId, avdod, buc, bucsInfo = { bucs: {} }, comment, tags
}: SaveBucsInfoProps): ThunkResult<Action> => {
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
  if (avdod) {
    newBucsInfo.bucs[bucId].avdod = avdod
  }
  return call({
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

export const setCurrentBuc: ActionCreator<ActionWithPayload<string | undefined>> = (
  bucCaseId: string | undefined
): ActionWithPayload<string | undefined> => ({
  type: types.BUC_CURRENTBUC_SET,
  payload: bucCaseId
})

export const setCurrentSed: ActionCreator<ActionWithPayload<Sed | undefined>> = (
  sed: Sed | undefined
) : ActionWithPayload<Sed | undefined> => ({
  type: types.BUC_CURRENTSED_SET,
  payload: sed
})

export const sendAttachmentToSed: ActionCreator<ThunkResult<Action>> = (
  params: SEDAttachmentPayloadWithFile, joarkBrowserItem: JoarkBrowserItem
): ActionCreator<ThunkResult<Action>> => {
  return call({
    url: sprintf(urls.API_JOARK_ATTACHMENT_URL, params),
    method: 'PUT',
    cascadeFailureError: true,
    expectedPayload: joarkBrowserItem,
    context: {
      params: params,
      joarkBrowserItem: joarkBrowserItem
    },
    type: {
      request: types.BUC_SEND_ATTACHMENT_REQUEST,
      success: types.BUC_SEND_ATTACHMENT_SUCCESS,
      failure: types.BUC_SEND_ATTACHMENT_FAILURE
    }
  })
}

export const setMode: ActionCreator<ActionWithPayload<BUCMode>> = (
  mode: BUCMode
): ActionWithPayload<BUCMode> => ({
  type: types.BUC_MODE_SET,
  payload: mode
})

export const setSedList: ActionCreator<ActionWithPayload<Array<string>>> = (
  sedList: Array<string>
): ActionWithPayload<Array<string>> => ({
  type: types.BUC_SEDLIST_SET,
  payload: sedList
})
