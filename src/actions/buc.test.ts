import * as bucActions from 'src/actions/buc'
import { BUCMode, FeatureToggles } from 'src/declarations/app.d'
import * as types from 'src/constants/actionTypes'
import { VEDTAKSKONTEKST } from 'src/constants/constants'
import * as storage from 'src/constants/storage'
import tagsList from 'src/constants/tagsList'
import * as urls from 'src/constants/urls'
import { Buc, NewBucPayload, NewSedPayload, SakTypeValue, Sed, SEDAttachmentPayloadWithFile } from 'src/declarations/buc.d'
import { JoarkBrowserItem } from 'src/declarations/joark'
import { call as originalCall } from '@navikt/fetch'
import _ from 'lodash'
import mockItems from 'src/mocks/joark/items'

jest.mock('@navikt/fetch', () => ({
  call: jest.fn()
}))
const call = originalCall as jest.Mock<typeof originalCall>
const sprintf = require('sprintf-js').sprintf

describe('src/actions/buc', () => {
  afterEach(() => {
    call.mockReset()
  })

  afterAll(() => {
    call.mockRestore()
  })

  it('cleanNewlyCreatedBuc()', () => {
    const expectedResults = bucActions.cleanNewlyCreatedBuc()
    expect(expectedResults).toMatchObject({
      type: types.BUC_NEWLYCREATEDBUC_RESET
    })
  })

  it('createBuc()', () => {
    const mockBuc = {
      buc: 'P_BUC_01',
      avdod: {
        aktoerId: '123',
        etternavn: 'Nordmann',
        fnr: '12345687901',
        fornavn: 'Olav',
        fulltNavn: 'Olav Nordmann',
        mellomnavn: null,
        relasjon: ''
      },
      avdodfnr: '456',
      person: 'abc',
      kravDato: '1970-01-01'
    } as NewBucPayload
    bucActions.createBuc(mockBuc)
    expect(call).toBeCalledWith(expect.objectContaining({
      type: {
        request: types.BUC_CREATE_BUC_REQUEST,
        success: types.BUC_CREATE_BUC_SUCCESS,
        failure: types.BUC_CREATE_BUC_FAILURE
      },
      method: 'POST',
      context: _.omit(mockBuc, 'buc'),
      url: sprintf(urls.BUC_CREATE_BUC_URL, { buc: mockBuc.buc })
    }))
  })

  it('createReplySed()', () => {
    const mockedPayload = {
      sakId: '123',
      buc: 'P_BUC_01',
      sed: 'P2000',
      institutions: [],
      aktoerId: '123',
      euxCaseId: '456'
    } as NewSedPayload
    const mockBuc = { type: 'mockBucType', caseId: '456' } as Buc
    const mockParentId = '123'
    bucActions.createReplySed(mockBuc, mockedPayload, mockParentId)
    expect(call).toBeCalledWith(expect.objectContaining({
      type: {
        request: types.BUC_CREATE_REPLY_SED_REQUEST,
        success: types.BUC_CREATE_REPLY_SED_SUCCESS,
        failure: types.BUC_CREATE_REPLY_SED_FAILURE
      },
      method: 'POST',
      payload: mockedPayload,
      context: {
        buc: mockBuc,
        sed: mockedPayload
      },
      url: sprintf(urls.BUC_CREATE_REPLY_SED_URL, { parentId: mockParentId })
    }))
  })

  it('createSed()', () => {
    const mockBuc = { type: 'mockBucType', caseId: '456' } as Buc
    const mockedPayload = {
      sakId: '123',
      buc: 'P_BUC_01',
      sed: 'P2000',
      institutions: [],
      aktoerId: '123',
      euxCaseId: '456'
    } as NewSedPayload
    bucActions.createSed(mockBuc, mockedPayload)
    expect(call).toBeCalledWith(expect.objectContaining({
      type: {
        request: types.BUC_CREATE_SED_REQUEST,
        success: types.BUC_CREATE_SED_SUCCESS,
        failure: types.BUC_CREATE_SED_FAILURE
      },
      method: 'POST',
      payload: mockedPayload,
      context: {
        buc: mockBuc,
        sed: mockedPayload
      },
      url: urls.BUC_CREATE_SED_URL
    }))
  })

  it('createSavingAttachmentJob()', () => {
    const generatedResult = bucActions.createSavingAttachmentJob(mockItems)
    expect(generatedResult).toMatchObject({
      type: types.BUC_SAVINGATTACHMENTJOB_SET,
      payload: mockItems
    })
  })

  it('fetchBucsList()', () => {
    const mockAktoerId = '123'
    const mockSakId = '456'
    const howManyBucLists = 1
    bucActions.fetchBucsList(mockAktoerId, mockSakId, howManyBucLists)
    expect(call).toBeCalledWith(expect.objectContaining({
      type: {
        request: types.BUC_GET_BUCSLIST_REQUEST,
        success: types.BUC_GET_BUCSLIST_SUCCESS,
        failure: types.BUC_GET_BUCSLIST_FAILURE
      },
      context: {
        howManyBucLists
      },
      cascadeFailureError: true,
      url: sprintf(urls.BUC_GET_BUCSLIST_URL, { aktoerId: mockAktoerId, sakId: mockSakId })
    }))
  })

  it('fetchBucsInfo()', () => {
    const mockUserId = 'mockUserId'
    const mockNamespace = 'mockNamespace'
    const mockFilename = 'mockFilename'
    bucActions.fetchBucsInfo(mockUserId, mockNamespace, mockFilename)
    expect(call).toBeCalledWith(expect.objectContaining({
      type: {
        request: types.BUC_GET_BUCSINFO_REQUEST,
        success: types.BUC_GET_BUCSINFO_SUCCESS,
        failure: types.BUC_GET_BUCSINFO_FAILURE
      },
      url: sprintf(urls.API_STORAGE_GET_URL, { userId: mockUserId, namespace: mockNamespace, file: mockFilename })
    }))
  })

  it('fetchBucsInfoList()', () => {
    const mockUserId = '123'
    bucActions.fetchBucsInfoList(mockUserId)
    expect(call).toBeCalledWith(expect.objectContaining({
      type: {
        request: types.BUC_GET_BUCSINFO_LIST_REQUEST,
        success: types.BUC_GET_BUCSINFO_LIST_SUCCESS,
        failure: types.BUC_GET_BUCSINFO_LIST_FAILURE
      },
      url: sprintf(urls.API_STORAGE_LIST_URL, { userId: mockUserId, namespace: storage.NAMESPACE_BUC })
    }))
  })

  it('fetchBucsListWithAvdodFnr()', () => {
    const mockAktoerId = '123'
    const mockSakId = '456'
    const mockAvdodFnr = '789'
    bucActions.fetchBucsListWithAvdodFnr(mockAktoerId, mockSakId, mockAvdodFnr)
    expect(call).toBeCalledWith(expect.objectContaining({
      type: {
        request: types.BUC_GET_BUCSLIST_REQUEST,
        success: types.BUC_GET_BUCSLIST_SUCCESS,
        failure: types.BUC_GET_BUCSLIST_FAILURE
      },
      cascadeFailureError: true,
      url: sprintf(urls.BUC_GET_BUCSLIST_WITH_AVDODFNR_URL, { aktoerId: mockAktoerId, sakId: mockSakId, avdodFnr: mockAvdodFnr })
    }))
  })

  it('fetchBucsListWithVedtakId()', () => {
    const mockAktoerId = '123'
    const mockSakId = '456'
    const mockVedtakId = '789'
    bucActions.fetchBucsListWithVedtakId(mockAktoerId, mockSakId, mockVedtakId)
    expect(call).toBeCalledWith(expect.objectContaining({
      type: {
        request: types.BUC_GET_BUCSLIST_VEDTAK_REQUEST,
        success: types.BUC_GET_BUCSLIST_VEDTAK_SUCCESS,
        failure: types.BUC_GET_BUCSLIST_VEDTAK_FAILURE
      },
      cascadeFailureError: true,
      url: sprintf(urls.BUC_GET_BUCSLIST_WITH_VEDTAKID_URL, { aktoerId: mockAktoerId, sakId: mockSakId, vedtakId: mockVedtakId })
    }))
  })

  it('fetchKravDato()', () => {
    const mockSakId = '123'
    const mockAktoerId = '456'
    const mockKravId = '789'
    bucActions.fetchKravDato({ sakId: mockSakId, aktoerId: mockAktoerId, kravId: mockKravId })
    expect(call).toBeCalledWith(expect.objectContaining({
      type: {
        request: types.BUC_GET_KRAVDATO_REQUEST,
        success: types.BUC_GET_KRAVDATO_SUCCESS,
        failure: types.BUC_GET_KRAVDATO_FAILURE
      },
      url: sprintf(urls.BUC_GET_KRAVDATO_URL, { sakId: mockSakId, aktoerId: mockAktoerId, kravId: mockKravId })
    }))
  })

  it('fetchBuc()', () => {
    const rinaCaseId = '123'
    const aktoerId = '456'
    const sakId = '780'
    const kilde = 'pdl'
    bucActions.fetchBuc(rinaCaseId, aktoerId, sakId, undefined, kilde)
    expect(call).toBeCalledWith(expect.objectContaining({
      type: {
        request: types.BUC_GET_BUC_REQUEST,
        success: types.BUC_GET_BUC_SUCCESS,
        failure: types.BUC_GET_BUC_FAILURE
      },
      url: sprintf(urls.BUC_GET_BUC_URL, { rinaCaseId, aktoerId, sakId })
    }))
  })

  it('fetchBuc() avdod', () => {
    const rinaCaseId = '123'
    const aktoerId = '456'
    const sakId = '780'
    const avdodFnr = '12345678901'
    const kilde = 'pdl'
    bucActions.fetchBuc(rinaCaseId, aktoerId, sakId, avdodFnr, kilde)
    expect(call).toBeCalledWith(expect.objectContaining({
      type: {
        request: types.BUC_GET_BUC_REQUEST,
        success: types.BUC_GET_BUC_SUCCESS,
        failure: types.BUC_GET_BUC_FAILURE
      },
      url: sprintf(urls.BUC_GET_BUC_WITH_AVDOD_URL, { rinaCaseId, aktoerId, sakId, avdodFnr, kilde })
    }))
  })

  it('getBucOptions()', () => {
    const pesysContext = VEDTAKSKONTEKST
    const sakType = 'AFP' as SakTypeValue
    bucActions.getBucOptions({} as FeatureToggles, pesysContext, sakType)
    expect(call).toBeCalledWith(expect.objectContaining({
      type: {
        request: types.BUC_GET_BUC_OPTIONS_REQUEST,
        success: types.BUC_GET_BUC_OPTIONS_SUCCESS,
        failure: types.BUC_GET_BUC_OPTIONS_FAILURE
      },
      url: sprintf(urls.BUC_GET_BUC_OPTIONS_URL)
    }))
  })

  it('getCountryList()', () => {
    const mockBucType = 'P_BUC_01'
    bucActions.getCountryList(mockBucType)
    expect(call).toBeCalledWith(expect.objectContaining({
      type: {
        request: types.BUC_GET_COUNTRY_LIST_REQUEST,
        success: types.BUC_GET_COUNTRY_LIST_SUCCESS,
        failure: types.BUC_GET_COUNTRY_LIST_FAILURE
      },
      url: sprintf(urls.EUX_COUNTRIES_FOR_BUC_URL, { bucType: mockBucType })
    }))
  })

  it('getInstitutionsListForBucAndCountry() - GB translated to UK', () => {
    const mockBucType = 'P_BUC_01'
    const mockCountry = 'GB'
    bucActions.getInstitutionsListForBucAndCountry(mockBucType, mockCountry)
    expect(call).toBeCalledWith(expect.objectContaining({
      type: {
        request: types.BUC_GET_INSTITUTION_LIST_REQUEST,
        success: types.BUC_GET_INSTITUTION_LIST_SUCCESS,
        failure: types.BUC_GET_INSTITUTION_LIST_FAILURE
      },
      context: {
        buc: mockBucType,
        country: mockCountry
      },
      url: sprintf(urls.EUX_INSTITUTIONS_FOR_BUC_AND_COUNTRY_URL, { buc: mockBucType, country: 'UK' })
    }))
  })

  it('getSedP6000()', () => {
    const mockRinaCaseId = '123'
    bucActions.getSedP6000(mockRinaCaseId)
    expect(call).toBeCalledWith(expect.objectContaining({
      type: {
        request: types.BUC_GET_P6000_REQUEST,
        success: types.BUC_GET_P6000_SUCCESS,
        failure: types.BUC_GET_P6000_FAILURE
      },
      url: sprintf(urls.BUC_GET_P6000_URL, { rinaCaseId: mockRinaCaseId })
    }))
  })

  it('getSedP6000()', () => {
    const mockRinaCaseId = '123'
    const mockDocumentId = '456'
    bucActions.getSedP6000PDF(mockRinaCaseId, mockDocumentId)
    expect(call).toBeCalledWith(expect.objectContaining({
      type: {
        request: types.BUC_GET_P6000PDF_REQUEST,
        success: types.BUC_GET_P6000PDF_SUCCESS,
        failure: types.BUC_GET_P6000PDF_FAILURE
      },
      url: sprintf(urls.BUC_GET_PDF_URL, { rinaCaseId: mockRinaCaseId, documentId: mockDocumentId })
    }))
  })

  it('getRinaUrl()', () => {
    bucActions.getRinaUrl()
    expect(call).toBeCalledWith(expect.objectContaining({
      type: {
        request: types.BUC_RINA_GET_URL_REQUEST,
        success: types.BUC_RINA_GET_URL_SUCCESS,
        failure: types.BUC_RINA_GET_URL_FAILURE
      },
      url: urls.EUX_RINA_URL
    }))
  })

  it('getSakType()', () => {
    const mockSakId = '123'
    const mockAktoerId = '456'

    bucActions.getSakType(mockSakId, mockAktoerId)
    expect(call).toBeCalledWith(expect.objectContaining({
      type: {
        request: types.BUC_GET_SAKTYPE_REQUEST,
        success: types.BUC_GET_SAKTYPE_SUCCESS,
        failure: types.BUC_GET_SAKTYPE_FAILURE
      },
      url: sprintf(urls.BUC_GET_SAKTYPE_URL, { sakId: mockSakId, aktoerId: mockAktoerId })
    }))
  })

  it('getSedList()', () => {
    const mockBuc = { type: 'mockBucType', caseId: '456' }
    bucActions.getSedList(mockBuc)
    expect(call).toBeCalledWith(expect.objectContaining({
      type: {
        request: types.BUC_GET_SED_LIST_REQUEST,
        success: types.BUC_GET_SED_LIST_SUCCESS,
        failure: types.BUC_GET_SED_LIST_FAILURE
      },
      url: sprintf(urls.BUC_GET_SED_LIST_URL, { buc: mockBuc.type, rinaId: mockBuc.caseId })
    }))
  })

  it('getTagList()', () => {
    const expectedResults = bucActions.getTagList()
    expect(expectedResults).toMatchObject({
      type: types.BUC_GET_TAG_LIST_SUCCESS,
      payload: tagsList
    })
  })

  it('resetBuc()', () => {
    const generatedResult = bucActions.resetBuc()
    expect(generatedResult).toMatchObject({
      type: types.BUC_BUC_RESET
    })
  })

  it('resetNewSed()', () => {
    const generatedResult = bucActions.resetNewSed()
    expect(generatedResult).toMatchObject({
      type: types.BUC_NEWSED_RESET
    })
  })

  it('resetSavingAttachmentJob()', () => {
    const generatedResult = bucActions.resetSavingAttachmentJob(mockItems)
    expect(generatedResult).toMatchObject({
      type: types.BUC_SAVINGATTACHMENTJOB_RESET
    })
  })

  it('resetSed()', () => {
    const generatedResult = bucActions.resetSed()
    expect(generatedResult).toMatchObject({
      type: types.BUC_SED_RESET
    })
  })

  it('resetSedAttachments()', () => {
    const generatedResult = bucActions.resetSedAttachments()
    expect(generatedResult).toMatchObject({
      type: types.BUC_SED_ATTACHMENTS_RESET
    })
  })

  it('saveBucsInfo() with empty params', () => {
    const mockParams = {
      bucsInfo: { bucs: {} },
      aktoerId: '123',
      buc: {
        caseId: '456'
      },
      avdod: '789'
    }
    const expectedPayload = {
      bucs: {
        456: {
          avdod: '789'
        }
      }
    }

    bucActions.saveBucsInfo(mockParams)
    expect(call).toBeCalledWith({
      type: {
        request: types.BUC_SAVE_BUCSINFO_REQUEST,
        success: types.BUC_SAVE_BUCSINFO_SUCCESS,
        failure: types.BUC_SAVE_BUCSINFO_FAILURE
      },
      method: 'POST',
      context: expectedPayload,
      payload: expectedPayload,
      url: sprintf(urls.API_STORAGE_POST_URL, { userId: mockParams.aktoerId, namespace: storage.NAMESPACE_BUC, file: storage.FILE_BUCINFO })
    })
  })

  it('saveBucsInfo() with non-empty params', () => {
    const mockParams = {
      bucsInfo: { bucs: {} },
      aktoerId: '123',
      tags: ['tag'],
      buc: {
        caseId: '456'
      }
    }
    const expectedPayload = {
      bucs: {
        456: {
          tags: ['tag'],
        }
      }
    }
    bucActions.saveBucsInfo(mockParams)
    expect(call).toBeCalledWith({
      type: {
        request: types.BUC_SAVE_BUCSINFO_REQUEST,
        success: types.BUC_SAVE_BUCSINFO_SUCCESS,
        failure: types.BUC_SAVE_BUCSINFO_FAILURE
      },
      method: 'POST',
      payload: expectedPayload,
      context: expectedPayload,
      url: sprintf(urls.API_STORAGE_POST_URL, { userId: mockParams.aktoerId, namespace: storage.NAMESPACE_BUC, file: storage.FILE_BUCINFO })
    })
  })

  it('setCurrentBuc()', () => {
    const mockedBuc = 'buc'
    const generatedResult = bucActions.setCurrentBuc(mockedBuc)
    expect(generatedResult).toMatchObject({
      type: types.BUC_CURRENTBUC_SET,
      payload: mockedBuc
    })
  })

  it('setFollowUpSeds()', () => {
    const mockedSed = {
      id: 'sed'
    } as Sed
    const mockedFollowUpSeds = [{
      id: 'followUpSed1'
    }, {
      id: 'followUpSed2'
    }] as Array<Sed>
    const generatedResult = bucActions.setFollowUpSeds(mockedSed, mockedFollowUpSeds)
    expect(generatedResult).toMatchObject({
      type: types.BUC_FOLLOWUPSEDS_SET,
      payload: {
        sed: mockedSed,
        followUpSeds: mockedFollowUpSeds
      }
    })
  })

  it('sendAttachmentToSed()', () => {
    const mockParams = {
      aktoerId: '123',
      rinaId: '456',
      rinaDokumentId: '789',
      journalpostId: '123456',
      dokumentInfoId: '12346789',
      variantformat: 'DUMMY'
    } as SEDAttachmentPayloadWithFile
    const mockJoarkBrowserItem = {
      hasSubrows: false,
      key: '123456',
      type: 'joark',
      journalpostId: '123456',
      title: 'title',
      tema: 'tema',
      date: new Date(2020, 1, 1),
      dokumentInfoId: '12346789',
      variant: { variantformat: 'DUMMY', filnavn: 'filnavn' }
    } as JoarkBrowserItem
    bucActions.sendAttachmentToSed(mockParams, mockJoarkBrowserItem)
    expect(call).toBeCalledWith(expect.objectContaining({
      type: {
        request: types.BUC_SEND_ATTACHMENT_REQUEST,
        success: types.BUC_SEND_ATTACHMENT_SUCCESS,
        failure: types.BUC_SEND_ATTACHMENT_FAILURE
      },
      context: {
        params: mockParams,
        joarkBrowserItem: mockJoarkBrowserItem
      },
      method: 'PUT',
      url: sprintf(urls.API_JOARK_ATTACHMENT_URL, mockParams)
    }))
  })

  it('setMode()', () => {
    const mockedMode = 'mode' as BUCMode
    const generatedResult = bucActions.setMode(mockedMode)
    expect(generatedResult).toMatchObject({
      type: types.BUC_MODE_SET,
      payload: mockedMode
    })
  })

  it('setSedList()', () => {
    const mockedSedList = ['P2000', 'P4000', 'P6000']
    const generatedResult = bucActions.setSedList(mockedSedList)
    expect(generatedResult).toMatchObject({
      type: types.BUC_SEDLIST_SET,
      payload: mockedSedList
    })
  })
})
