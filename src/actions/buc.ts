import { ActionWithPayload, call } from '@navikt/fetch'
import { CountryFilter } from '@navikt/land-verktoy'
import * as types from 'src/constants/actionTypes'
import * as storage from 'src/constants/storage'
import tagsList from 'src/constants/tagsList'
import * as urls from 'src/constants/urls'
import { BUCMode, FeatureToggles, PesysContext } from 'src/declarations/app.d'
import {
  Buc,
  BUCOptions,
  Bucs,
  BucsInfoRawList,
  CountryRawList,
  Institutions,
  NewBucPayload,
  NewSedPayload,
  RinaUrlPayload,
  SakTypeValue,
  SaveBucsInfoProps,
  Sed,
  SEDAttachmentPayloadWithFile,
  SEDRawList,
  TagRawList,
  ValidBuc
} from 'src/declarations/buc'
import { JoarkBrowserItem, JoarkBrowserItems } from 'src/declarations/joark'
import _ from 'lodash'
import { mockBuc } from 'src/mocks/buc/buc'
import mockBucOptions from 'src/mocks/buc/bucOptions'
import mockBucsInfo from 'src/mocks/buc/bucsInfo'
import mockBucsInfoList from 'src/mocks/buc/bucsInfoList'
import mockBucs from 'src/mocks/buc/bucsList'
import mockBucsWithVedtak from 'src/mocks/buc/bucsListWithVedtak'
import mockCreateBuc from 'src/mocks/buc/createBuc'
import mockCreateSed from 'src/mocks/buc/createSed'
import mockInstitutions from 'src/mocks/buc/institutions'
import mockKravDato from 'src/mocks/buc/kravDato'
import mockP2000 from 'src/mocks/buc/sed_P2000'
import mockP8000 from 'src/mocks/buc/sed_P8000'
import mockP6000 from 'src/mocks/buc/p6000'
import mockP4000 from 'src/mocks/buc/p4000'
import mockPreviewPdf from 'src/mocks/buc/previewpdf'
//import mockSed from  'src/mocks/buc/sed'
import mockRinaUrl from 'src/mocks/buc/rinaUrl'
import mockSakType from 'src/mocks/buc/sakType'
import mockSedList from 'src/mocks/buc/sedList'
import { Action, ActionCreator } from 'redux'
import {UpdateSedPayload} from "../declarations/types";
import {PSED} from "src/declarations/app.d";
// @ts-ignore
import { sprintf } from 'sprintf-js';

export const cleanNewlyCreatedBuc: ActionCreator<Action> = (): Action => ({
  type: types.BUC_NEWLYCREATEDBUC_RESET
})

export const resetATP: ActionCreator<Action> = (): Action => ({
  type: types.BUC_ATP_RESET
})

export const createBuc = (
  params: NewBucPayload
): Action => {
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

export const createATPBuc = (
  params: NewBucPayload
): Action => {
  return call({
    url: sprintf(urls.BUC_CREATE_BUC_URL, { buc: params.buc }),
    method: 'POST',
    cascadeFailureError: true,
    expectedPayload: mockCreateBuc(params.buc),
    type: {
      request: types.BUC_CREATE_ATP_BUC_REQUEST,
      success: types.BUC_CREATE_ATP_BUC_SUCCESS,
      failure: types.BUC_CREATE_ATP_BUC_FAILURE
    }
  })
}

export const createReplySed = (
  buc: Buc, payload: NewSedPayload, parentId: string
): ActionWithPayload<Sed> => {
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

export const createSed = (
  buc: Buc, payload: NewSedPayload
): ActionWithPayload<Sed> => {
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

export const createATPSed = (
  buc: Buc, payload: NewSedPayload
): ActionWithPayload<Sed> => {
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
      request: types.BUC_CREATE_ATP_SED_REQUEST,
      success: types.BUC_CREATE_ATP_SED_SUCCESS,
      failure: types.BUC_CREATE_ATP_SED_FAILURE
    }
  })
}

export const createSavingAttachmentJob: ActionCreator<ActionWithPayload<JoarkBrowserItems>> = (
  joarkBrowserItems: JoarkBrowserItems
): ActionWithPayload<JoarkBrowserItems> => ({
  type: types.BUC_SAVINGATTACHMENTJOB_SET,
  payload: joarkBrowserItems
})

export const startBucsFetch = () => ({
  type: types.BUC_GET_BUCS_START
})

export const endBucsFetch = () => ({
  type: types.BUC_GET_BUCS_END
})

export const fetchBucsList = (
  aktoerId: string, sakId: string, howManyBucLists: number
): ActionWithPayload<Bucs> => {
  return call({
    url: sprintf(urls.BUC_GET_BUCSLIST_URL, { aktoerId, sakId }),
    cascadeFailureError: true,
    expectedPayload: mockBucs(aktoerId, sakId),
    context: {
      howManyBucLists
    },
    type: {
      request: types.BUC_GET_BUCSLIST_REQUEST,
      success: types.BUC_GET_BUCSLIST_SUCCESS,
      failure: types.BUC_GET_BUCSLIST_FAILURE
    }
  })
}

export const fetchBucsInfo = (
  userId: string, namespace: string, file: string
): ActionWithPayload<BucsInfoRawList> => {
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

export const fetchBucsInfoList = (
  aktoerId: string
): ActionWithPayload<BucsInfoRawList> => {
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

export const  fetchBucsListWithAvdodFnr = (
  aktoerId: string, sakId: string, avdodFnr: string
): ActionWithPayload<Bucs> => {
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

export const fetchBucsListWithVedtakId = (
  aktoerId: string, sakId: string, vedtakId: string
): ActionWithPayload<Bucs> => {
  return call({
    url: sprintf(urls.BUC_GET_BUCSLIST_WITH_VEDTAKID_URL, { aktoerId, sakId, vedtakId }),
    cascadeFailureError: true,
    expectedPayload: mockBucsWithVedtak(aktoerId, sakId),
    type: {
      request: types.BUC_GET_BUCSLIST_VEDTAK_REQUEST,
      success: types.BUC_GET_BUCSLIST_VEDTAK_SUCCESS,
      failure: types.BUC_GET_BUCSLIST_VEDTAK_FAILURE
    }
  })
}

export const fetchKravDato = ({
  sakId,
  aktoerId,
  kravId
}: any): ActionWithPayload<any> => {
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

export const fetchBuc = (
  rinaCaseId: string, aktoerId?: string, sakId?: string, avdodFnr?: string | null | undefined, kilde?: string
): ActionWithPayload<ValidBuc> => {
  const url = !_.isEmpty(avdodFnr)
    ? sprintf(urls.BUC_GET_BUC_WITH_AVDOD_URL, { rinaCaseId, aktoerId, sakId, avdodFnr, kilde })
    : sprintf(urls.BUC_GET_BUC_URL, { rinaCaseId })

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

export const getBucOptions = (
  featureToggles: FeatureToggles, pesysContext: PesysContext, sakType: SakTypeValue
): ActionWithPayload<BUCOptions> => {
  return call({
    url: sprintf(urls.BUC_GET_BUC_OPTIONS_URL),
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

export const getCountryList = (
  bucType: string
): ActionWithPayload<CountryRawList> => {
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

export const getInstitutionsListForBucAndCountry = (
  bucType: string, country: string
): ActionWithPayload<Institutions> => {
  // RINA uses UK, not GB
  // RINA uses EL, not GR
  let _country: string = country
  if (_country.toUpperCase() === 'GB') {
    _country = 'UK'
  }
  if (_country.toUpperCase() === 'GR') {
    _country = 'EL'
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

export const getSed = (
  caseId: string, sed: Sed
): Action => {

  return call({
    url: sprintf(urls.BUC_GET_SED_URL, { caseId, sedId: sed.id }),
    cascadeFailureError: true,
    expectedPayload: mockP2000,
    context: {
      sed: sed
    },
    type: {
      request: types.BUC_GET_SED_REQUEST,
      success: types.BUC_GET_SED_SUCCESS,
      failure: types.BUC_GET_SED_FAILURE
    }
  })
}

export const getSedP8000 = (
  caseId: string, sed: Sed
): Action => {

  return call({
    url: sprintf(urls.BUC_GET_SED_URL, { caseId, sedId: sed.id }),
    cascadeFailureError: true,
    expectedPayload: mockP8000,
    context: {
      sed: sed
    },
    type: {
      request: types.BUC_GET_P8000SED_REQUEST,
      success: types.BUC_GET_P8000SED_SUCCESS,
      failure: types.BUC_GET_P8000SED_FAILURE
    }
  })
}

export const saveSed = (
  caseId: string, sedId: string, sedType: string, payload: any
): Action => {
  const copyPSED = _.cloneDeep(payload)
  delete copyPSED.originalSed
  if(copyPSED.fritekst){
    delete copyPSED.fritekst
  }
  return call({
    url: sprintf(urls.BUC_PUT_SED_URL, { caseId, sedId }),
    method: 'PUT',
    body: copyPSED,
    cascadeFailureError: true,
    context: {
      caseId,
      sedId,
      sedType,
      payload
    },
    type: {
      request: types.BUC_PUT_SED_REQUEST,
      success: types.BUC_PUT_SED_SUCCESS,
      failure: types.BUC_PUT_SED_FAILURE
    }
  })
}

export const sendSed = (
  caseId: string, sedId: string
): Action => {
  return call({
    url: sprintf(urls.EUX_BUC_SED_SEND_URL, { caseId, sedId }),
    method: 'POST',
    cascadeFailureError: true,
    expectedPayload: {
      success: 'true'
    },
    type: {
      request: types.BUC_SEND_SED_REQUEST,
      success: types.BUC_SEND_SED_SUCCESS,
      failure: types.BUC_SEND_SED_FAILURE
    }
  })
}

export const sendSedTo = (
  caseId: string, sedId: string, mottakere: Array<string>
): Action => {
  return call({
    url: sprintf(urls.EUX_BUC_SED_SENDTO_URL, { caseId, sedId }),
    method: 'POST',
    body: mottakere,
    cascadeFailureError: true,
    expectedPayload: {
      success: 'true'
    },
    type: {
      request: types.BUC_SEND_SED_REQUEST,
      success: types.BUC_SEND_SED_SUCCESS,
      failure: types.BUC_SEND_SED_FAILURE
    }
  })
}

export const setPSED: ActionCreator<ActionWithPayload<PSED>> = (
  PSED: PSED
): ActionWithPayload<PSED> => ({
  type: types.BUC_SED_SET,
  payload: PSED
})

export const resetPSED: ActionCreator<Action> = (): Action => ({
  type: types.PSED_RESET
})

export const updatePSED: ActionCreator<ActionWithPayload<UpdateSedPayload>> = (
  needle: string, value: any
): ActionWithPayload<UpdateSedPayload> => ({
  type: types.BUC_SED_UPDATE,
  payload: { needle, value }
})

export const deletePSEDProp: ActionCreator<ActionWithPayload<UpdateSedPayload>> = (
  needle: string
): ActionWithPayload<UpdateSedPayload> => ({
  type: types.BUC_SED_DELETE_PROPERTY,
  payload: { needle }
})

export const getSedP4000 = (
  caseId: string, sed: Sed
): Action => {
  return call({
    url: sprintf(urls.BUC_GET_SED_URL, { caseId, sedId: sed.id }),
    cascadeFailureError: true,
    expectedPayload: mockP4000,
    context: {
      sedId: sed.id
    },
    type: {
      request: types.BUC_GET_P4000_REQUEST,
      success: types.BUC_GET_P4000_SUCCESS,
      failure: types.BUC_GET_P4000_FAILURE
    }
  })
}

export const getSedP6000 = (
  rinaCaseId: string
): Action => {
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

export const getSedP6000PDF = (
  rinaCaseId: string, documentId: string
): Action => {
  return call({
    url: sprintf(urls.BUC_GET_PDF_URL, { rinaCaseId, documentId }),
    cascadeFailureError: true,
    expectedPayload: mockPreviewPdf,
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

export const getPreviewFile = (PSED: PSED): ActionWithPayload => {
  return call({
    method: 'POST',
    url: sprintf(urls.BUC_PREVIEW_PDF_URL),
    expectedPayload: mockPreviewPdf,
    type: {
      request: types.BUC_GET_PREVIEWPDF_REQUEST,
      success: types.BUC_GET_PREVIEWPDF_SUCCESS,
      failure: types.BUC_GET_PREVIEWPDF_FAILURE
    },
    body: PSED
  })
}

export const getSedPreviewPDF = (
  rinaCaseId: string, documentId: string
): Action => {
  return call({
    url: sprintf(urls.BUC_GET_PDF_URL, { rinaCaseId, documentId }),
    cascadeFailureError: true,
    expectedPayload: mockPreviewPdf,
    type: {
      request: types.BUC_GET_PREVIEWPDF_REQUEST,
      success: types.BUC_GET_PREVIEWPDF_SUCCESS,
      failure: types.BUC_GET_PREVIEWPDF_FAILURE
    }
  })
}

export const resetSedPreviewPDF: ActionCreator<Action> = (): Action => ({
  type: types.BUC_PREVIEWPDF_RESET
})

export const getRinaUrl = (

): ActionWithPayload<RinaUrlPayload> => {
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

export const getSakType = (
  sakId: string, aktoerId: string
): ActionWithPayload<any> => {
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

export const getSedList = (
  buc: {type: string, caseId: string}
): ActionWithPayload<SEDRawList> => {
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

export const saveBucsInfo = ({
  aktoerId, avdod, buc, bucsInfo = { bucs: {} }, tags
}: SaveBucsInfoProps): Action => {
  const newBucsInfo = _.cloneDeep(bucsInfo)
  const newTags = tags || [] // ? tags.map(tag => tag.value) : []
  const bucId = parseInt(buc.caseId, 10)
  newBucsInfo.bucs = newBucsInfo.bucs || {}
  newBucsInfo.bucs[bucId] = newBucsInfo.bucs[bucId] || {}
  if (tags) {
    newBucsInfo.bucs[bucId].tags = newTags
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

export const sendAttachmentToSed = (
  params: SEDAttachmentPayloadWithFile, joarkBrowserItem: JoarkBrowserItem
): Action => {
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
