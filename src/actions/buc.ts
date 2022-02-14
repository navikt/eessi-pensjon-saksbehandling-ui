import * as types from 'constants/actionTypes'
import * as storage from 'constants/storage'
import tagsList from 'constants/tagsList'
import * as urls from 'constants/urls'
import { BUCMode, FeatureToggles, PesysContext } from 'declarations/app.d'
import {
  Buc,
  BUCOptions,
  Bucs,
  BucsInfoRawList,
  CountryRawList,
  Institutions,
  NewBucPayload,
  NewSedPayload,
  Participants,
  RinaUrlPayload,
  SakTypeValue,
  SaveBucsInfoProps,
  Sed,
  SEDAttachmentPayloadWithFile,
  SEDRawList,
  SubjectAreaRawList,
  TagRawList,
  ValidBuc
} from 'declarations/buc'
import { JoarkBrowserItem, JoarkBrowserItems } from 'declarations/joark'
import { ActionWithPayload, call, ThunkResult } from '@navikt/fetch'
import { CountryFilter } from '@navikt/land-verktoy'
import _ from 'lodash'
import { mockBuc, mockParticipants } from 'mocks/buc/buc'
import mockBucOptions from 'mocks/buc/bucOptions'
import mockBucs from 'mocks/buc/bucsList'
import mockBucsInfo from 'mocks/buc/bucsInfo'
import mockBucsInfoList from 'mocks/buc/bucsInfoList'
import mockCreateBuc from 'mocks/buc/createBuc'
import mockCreateSed from 'mocks/buc/createSed'
import mockInstitutions from 'mocks/buc/institutions'
import mockKravDato from 'mocks/buc/kravDato'
import mockRinaUrl from 'mocks/buc/rinaUrl'
import mockSakType from 'mocks/buc/sakType'
import mockSedList from 'mocks/buc/sedList'
import mockSubjectAreaList from 'mocks/buc/subjectAreaList'
import mockP6000 from 'mocks/buc/p6000'
import mockP6000pdf from 'mocks/buc/p6000pdf'
import { Action, ActionCreator } from 'redux'

const sprintf = require('sprintf-js').sprintf

export const cleanNewlyCreatedBuc: ActionCreator<Action> = (): Action => ({
  type: types.BUC_NEWLYCREATEDBUC_RESET
})

export const createBuc: ActionCreator<ThunkResult<ActionWithPayload<ValidBuc>>> = (
  params: NewBucPayload
): ThunkResult<ActionWithPayload<ValidBuc>> => {
  return call({
    url: sprintf(urls.BUC_CREATE_BUC_URL, { buc: params.buc }),
    method: 'POST',

    //  these are params collected on create BUC and have to be passed later so that
    // create SED either just displays them, or decides if should ask for them again
    context: {
      avdod: params.avdod,
      avdodfnr: params.avdodfnr,
      person: params.person,
      kravDato: params.kravDato
    },
    cascadeFailureError: true,
    expectedPayload: mockCreateBuc(params.buc),
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
    url: sprintf(urls.BUC_CREATE_REPLY_SED_URL, { parentId }),
    payload,
    context: {
      buc,
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
    payload,
    context: {
      buc,
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
    url: sprintf(urls.BUC_GET_PARTICIPANTS_URL, { rinaCaseId }),
    expectedPayload: /* istanbul ignore next */ mockParticipants(rinaCaseId),
    context: {
      rinaCaseId
    },
    type: {
      request: types.BUC_GET_PARTICIPANTS_REQUEST,
      success: types.BUC_GET_PARTICIPANTS_SUCCESS,
      failure: types.BUC_GET_PARTICIPANTS_FAILURE
    }
  })
}

export const startBucsFetch = () => ({
  type: types.BUC_GET_BUCS_START
})

export const endBucsFetch = () => ({
  type: types.BUC_GET_BUCS_END
})

export const fetchBucsList: ActionCreator<ThunkResult<ActionWithPayload<Bucs>>> = (
  aktoerId: string, sakId: string
): ThunkResult<ActionWithPayload<Bucs>> => {
  return call({
    url: sprintf(urls.BUC_GET_BUCSLIST_URL, { aktoerId, sakId }),
    cascadeFailureError: true,
    expectedPayload: mockBucs(aktoerId, sakId),
    type: {
      request: types.BUC_GET_BUCSLIST_REQUEST,
      success: types.BUC_GET_BUCSLIST_SUCCESS,
      failure: types.BUC_GET_BUCSLIST_FAILURE
    }
  })
}

export const fetchBucsInfo: ActionCreator<ThunkResult<ActionWithPayload<BucsInfoRawList>>> = (
  userId: string, namespace: string, file: string
): ThunkResult<ActionWithPayload<BucsInfoRawList>> => {
  return call({
    url: sprintf(urls.API_STORAGE_GET_URL, { userId, namespace, file }),
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

export const fetchBucsListWithAvdodFnr: ActionCreator<ThunkResult<ActionWithPayload<Bucs>>> = (
  aktoerId: string, sakId: string, avdodFnr: string
): ThunkResult<ActionWithPayload<Bucs>> => {
  return call({
    url: sprintf(urls.BUC_GET_BUCSLIST_WITH_AVDODFNR_URL, { aktoerId, sakId, avdodFnr }),
    cascadeFailureError: true,
    expectedPayload: mockBucs(aktoerId, sakId),
    type: {
      request: types.BUC_GET_BUCSLIST_REQUEST,
      success: types.BUC_GET_BUCSLIST_SUCCESS,
      failure: types.BUC_GET_BUCSLIST_FAILURE
    }
  })
}

export const fetchBucsListWithVedtakId: ActionCreator<ThunkResult<ActionWithPayload<Bucs>>> = (
  aktoerId: string, sakId: string, vedtakId: string
): ThunkResult<ActionWithPayload<Bucs>> => {
  return call({
    url: sprintf(urls.BUC_GET_BUCSLIST_WITH_VEDTAKID_URL, { aktoerId, sakId, vedtakId }),
    cascadeFailureError: true,
    expectedPayload: mockBucs(aktoerId, sakId),
    type: {
      request: types.BUC_GET_BUCSLIST_REQUEST,
      success: types.BUC_GET_BUCSLIST_SUCCESS,
      failure: types.BUC_GET_BUCSLIST_FAILURE
    }
  })
}

export const fetchKravDato: ActionCreator<ThunkResult<ActionWithPayload<any>>> = ({
  sakId,
  aktoerId,
  kravId
}): ThunkResult<ActionWithPayload<any>> => {
  return call({
    url: sprintf(urls.BUC_GET_KRAVDATO_URL, { sakId, kravId, aktoerId }),
    expectedPayload: mockKravDato,
    type: {
      request: types.BUC_GET_KRAVDATO_REQUEST,
      success: types.BUC_GET_KRAVDATO_SUCCESS,
      failure: types.BUC_GET_KRAVDATO_FAILURE
    }
  })
}

export const fetchBuc: ActionCreator<ThunkResult<ActionWithPayload<ValidBuc>>> = (
  rinaCaseId: string, aktoerId: string, sakId: string, avdodFnr: string | undefined, kilde: string
): ThunkResult<ActionWithPayload<ValidBuc>> => {
  const url = !_.isEmpty(avdodFnr)
    ? sprintf(urls.BUC_GET_BUC_WITH_AVDOD_URL, { rinaCaseId, aktoerId, sakId, avdodFnr, kilde })
    : sprintf(urls.BUC_GET_BUC_URL, { rinaCaseId, aktoerId, sakId, kilde })

  return call({
    url,
    expectedPayload: mockBuc(rinaCaseId),
    context: {
      rinaCaseId,
      aktoerId,
      sakId,
      avdodFnr
    },
    type: {
      request: types.BUC_GET_BUC_REQUEST,
      success: types.BUC_GET_BUC_SUCCESS,
      failure: types.BUC_GET_BUC_FAILURE
    }
  })
}

export const getBucOptions: ActionCreator<ThunkResult<ActionWithPayload<BUCOptions>>> = (
  sakId: string, featureToggles: FeatureToggles, pesysContext: PesysContext, sakType: SakTypeValue
): ThunkResult<ActionWithPayload<BUCOptions>> => {
  return call({
    url: sprintf(urls.BUC_GET_BUC_OPTIONS_URL, { sakId }),
    expectedPayload: mockBucOptions,
    context: {
      featureToggles,
      pesysContext,
      sakType
    },
    type: {
      request: types.BUC_GET_BUC_OPTIONS_REQUEST,
      success: types.BUC_GET_BUC_OPTIONS_SUCCESS,
      failure: types.BUC_GET_BUC_OPTIONS_FAILURE
    }
  })
}

export const getCountryList: ActionCreator<ThunkResult<ActionWithPayload<CountryRawList>>> = (
  bucType: string
): ThunkResult<ActionWithPayload<CountryRawList>> => {
  return call({
    url: sprintf(urls.EUX_COUNTRIES_FOR_BUC_URL, { bucType }),
    context: {
      buc: bucType
    },
    expectedPayload: CountryFilter.EESSI_READY({}),
    type: {
      request: types.BUC_GET_COUNTRY_LIST_REQUEST,
      success: types.BUC_GET_COUNTRY_LIST_SUCCESS,
      failure: types.BUC_GET_COUNTRY_LIST_FAILURE
    }
  })
}

export const getInstitutionsListForBucAndCountry: ActionCreator<ThunkResult<ActionWithPayload<Institutions>>> = (
  bucType: string, country: string
): ThunkResult<ActionWithPayload<Institutions>> => {
  // RINA uses UK, not GB
  let _country: string = country
  if (_country.toUpperCase() === 'GB') {
    _country = 'UK'
  }
  return call({
    url: sprintf(urls.EUX_INSTITUTIONS_FOR_BUC_AND_COUNTRY_URL, { buc: bucType, country: _country }),
    context: {
      buc: bucType,
      country
    },
    expectedPayload: mockInstitutions,
    type: {
      request: types.BUC_GET_INSTITUTION_LIST_REQUEST,
      success: types.BUC_GET_INSTITUTION_LIST_SUCCESS,
      failure: types.BUC_GET_INSTITUTION_LIST_FAILURE
    }
  })
}

export const getSedP6000: ActionCreator<ThunkResult<Action>> = (
  rinaCaseId: string
): ThunkResult<Action> => {
  return call({
    url: sprintf(urls.BUC_GET_P6000_URL, { rinaCaseId }),
    cascadeFailureError: true,
    expectedPayload: mockP6000,
    type: {
      request: types.BUC_GET_P6000_REQUEST,
      success: types.BUC_GET_P6000_SUCCESS,
      failure: types.BUC_GET_P6000_FAILURE
    }
  })
}

export const getSedP6000PDF: ActionCreator<ThunkResult<Action>> = (
  rinaCaseId: string, documentId: string
): ThunkResult<Action> => {
  return call({
    url: sprintf(urls.BUC_GET_P6000PDF_URL, { rinaCaseId, documentId }),
    cascadeFailureError: true,
    expectedPayload: mockP6000pdf,
    type: {
      request: types.BUC_GET_P6000PDF_REQUEST,
      success: types.BUC_GET_P6000PDF_SUCCESS,
      failure: types.BUC_GET_P6000PDF_FAILURE
    }
  })
}

export const resetSedP6000PDF: ActionCreator<Action> = (): Action => ({
  type: types.BUC_P6000PDF_RESET
})

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

export const getSakType: ActionCreator<ThunkResult<ActionWithPayload>> = (
  sakId: string, aktoerId: string
): ThunkResult<ActionWithPayload> => {
  return call({
    url: sprintf(urls.BUC_GET_SAKTYPE_URL, { sakId, aktoerId }),
    expectedPayload: mockSakType,
    cascadeFailureError: true,
    type: {
      request: types.BUC_GET_SAKTYPE_REQUEST,
      success: types.BUC_GET_SAKTYPE_SUCCESS,
      failure: types.BUC_GET_SAKTYPE_FAILURE
    }
  })
}

export const getSedList: ActionCreator<ThunkResult<ActionWithPayload<SEDRawList>>> = (
  buc: {type: string, caseId: string}
): ThunkResult<ActionWithPayload<SEDRawList>> => {
  const url: string = sprintf(urls.BUC_GET_SED_LIST_URL, { buc: buc.type, rinaId: buc.caseId })
  return call({
    url,
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

export const setFollowUpSeds: ActionCreator<ActionWithPayload<{[k in string] : Sed | Array<Sed> | undefined}>> = (
  sed: Sed | undefined, followUpSeds: Array<Sed> | undefined
) : ActionWithPayload<{[k in string] : Sed | Array<Sed> | undefined}> => ({
  type: types.BUC_FOLLOWUPSEDS_SET,
  payload: {
    sed,
    followUpSeds
  }
})

export const sendAttachmentToSed: ActionCreator<ThunkResult<Action>> = (
  params: SEDAttachmentPayloadWithFile, joarkBrowserItem: JoarkBrowserItem
): ThunkResult<Action> => {
  return call({
    url: sprintf(urls.API_JOARK_ATTACHMENT_URL, params),
    method: 'PUT',
    cascadeFailureError: true,
    expectedPayload: joarkBrowserItem,
    context: {
      params,
      joarkBrowserItem
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
