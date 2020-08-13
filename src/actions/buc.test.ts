import * as bucActions from 'actions/buc'
import * as types from 'constants/actionTypes'
import * as storage from 'constants/storage'
import tagsList from 'constants/tagsList'
import * as urls from 'constants/urls'
import { Sed } from 'declarations/buc'
import { call as originalCall } from 'js-fetch-api'

jest.mock('js-fetch-api', () => ({
  call: jest.fn()
}))
const call = originalCall as jest.Mock<typeof originalCall>
const sprintf = require('sprintf-js').sprintf

describe('actions/buc', () => {
  afterEach(() => {
    call.mockReset()
  })

  afterAll(() => {
    call.mockRestore()
  })

  it('setMode()', () => {
    const mockedMode = 'mode'
    const generatedResult = bucActions.setMode(mockedMode)
    expect(generatedResult).toMatchObject({
      type: types.BUC_MODE_SET,
      payload: mockedMode
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

  it('setCurrentSed()', () => {
    const mockedSed = 'sed'
    const generatedResult = bucActions.setCurrentSed(mockedSed)
    expect(generatedResult).toMatchObject({
      type: types.BUC_CURRENTSED_SET,
      payload: mockedSed
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

  it('resetBuc()', () => {
    const generatedResult = bucActions.resetBuc()
    expect(generatedResult).toMatchObject({
      type: types.BUC_BUC_RESET
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

  it('fetchSingleBuc()', () => {
    const mockRinaCaseId = '123'
    bucActions.fetchSingleBuc(mockRinaCaseId)
    expect(call).toBeCalledWith(expect.objectContaining({
      type: {
        request: types.BUC_GET_SINGLE_BUC_REQUEST,
        success: types.BUC_GET_SINGLE_BUC_SUCCESS,
        failure: types.BUC_GET_SINGLE_BUC_FAILURE
      },
      url: sprintf(urls.BUC_GET_SINGLE_BUC_URL, { rinaCaseId: mockRinaCaseId })
    }))
  })

  it('fetchBucParticipants()', () => {
    const mockRinaCaseId = '123'
    bucActions.fetchBucParticipants(mockRinaCaseId)
    expect(call).toBeCalledWith(expect.objectContaining({
      type: {
        request: types.BUC_GET_PARTICIPANTS_REQUEST,
        success: types.BUC_GET_PARTICIPANTS_SUCCESS,
        failure: types.BUC_GET_PARTICIPANTS_FAILURE
      },
      url: sprintf(urls.BUC_GET_PARTICIPANTS_URL, { rinaCaseId: mockRinaCaseId })
    }))
  })

  it('fetchBucs()', () => {
    const mockAktoerId = '123'
    bucActions.fetchBucs(mockAktoerId)
    expect(call).toBeCalledWith(expect.objectContaining({
      type: {
        request: types.BUC_GET_BUCS_REQUEST,
        success: types.BUC_GET_BUCS_SUCCESS,
        failure: types.BUC_GET_BUCS_FAILURE
      },
      cascadeFailureError: true,
      url: sprintf(urls.BUC_GET_BUCS_URL, { aktoerId: mockAktoerId })
    }))
  })

  it('fetchBucsWithVedtakId()', () => {
    const mockAktoerId = '123'
    const mockVedtakId = '456'
    bucActions.fetchBucsWithVedtakId(mockAktoerId, mockVedtakId)
    expect(call).toBeCalledWith(expect.objectContaining({
      type: {
        request: types.BUC_GET_BUCS_REQUEST,
        success: types.BUC_GET_BUCS_SUCCESS,
        failure: types.BUC_GET_BUCS_FAILURE
      },
      cascadeFailureError: true,
      url: sprintf(urls.BUC_GET_BUCS_WITH_VEDTAKID_URL, { aktoerId: mockAktoerId, vedtakId: mockVedtakId })
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

  it('getSubjectAreaList()', () => {
    bucActions.getSubjectAreaList()
    expect(call).toBeCalledWith(expect.objectContaining({
      type: {
        request: types.BUC_GET_SUBJECT_AREA_LIST_REQUEST,
        success: types.BUC_GET_SUBJECT_AREA_LIST_SUCCESS,
        failure: types.BUC_GET_SUBJECT_AREA_LIST_FAILURE
      },
      url: urls.EUX_SUBJECT_AREA_URL
    }))
  })

  it('getBucList()', () => {
    const sakId = '123'
    const featureToggles = {}
    bucActions.getBucList(sakId, featureToggles)
    expect(call).toBeCalledWith(expect.objectContaining({
      type: {
        request: types.BUC_GET_BUC_LIST_REQUEST,
        success: types.BUC_GET_BUC_LIST_SUCCESS,
        failure: types.BUC_GET_BUC_LIST_FAILURE
      },
      url: sprintf(urls.BUC_GET_BUC_LIST_URL, { sakId: sakId })
    }))
  })

  it('getTagList()', () => {
    const expectedResults = bucActions.getTagList()
    expect(expectedResults).toMatchObject({
      type: types.BUC_GET_TAG_LIST_SUCCESS,
      payload: tagsList
    })
  })

  it('createBuc()', () => {
    const mockBuc = 'P_BUC_01'
    bucActions.createBuc(mockBuc)
    expect(call).toBeCalledWith(expect.objectContaining({
      type: {
        request: types.BUC_CREATE_BUC_REQUEST,
        success: types.BUC_CREATE_BUC_SUCCESS,
        failure: types.BUC_CREATE_BUC_FAILURE
      },
      method: 'POST',
      url: sprintf(urls.BUC_CREATE_BUC_URL, { buc: mockBuc })
    }))
  })

  it('saveBucsInfo() with empty params', () => {
    const mockParams = {
      bucsInfo: { bucs: {} },
      aktoerId: '123',
      buc: {
        caseId: '456'
      }
    }
    const expectedPayload = {
      bucs: {
        456: {}
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
      comment: [{ value: 'comment 1' }, { value: 'comment 2' }],
      buc: {
        caseId: '456'
      }
    }
    const expectedPayload = {
      bucs: {
        456: {
          tags: ['tag'],
          comment: [{ value: 'comment 1' }, { value: 'comment 2' }]
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

  it('createSed()', () => {
    const mockedPayload = {
      sakId: '123',
      buc: 'P_BUC_01',
      sed: 'P2000',
      institutions: [],
      aktoerId: '123',
      euxCaseId: '456'
    }
    bucActions.createSed(mockedPayload)
    expect(call).toBeCalledWith(expect.objectContaining({
      type: {
        request: types.BUC_CREATE_SED_REQUEST,
        success: types.BUC_CREATE_SED_SUCCESS,
        failure: types.BUC_CREATE_SED_FAILURE
      },
      method: 'POST',
      payload: mockedPayload,
      url: urls.BUC_CREATE_SED_URL
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
    }
    const mockParentId = '123'
    bucActions.createReplySed(mockedPayload, mockParentId)
    expect(call).toBeCalledWith(expect.objectContaining({
      type: {
        request: types.BUC_CREATE_REPLY_SED_REQUEST,
        success: types.BUC_CREATE_REPLY_SED_SUCCESS,
        failure: types.BUC_CREATE_REPLY_SED_FAILURE
      },
      method: 'POST',
      payload: mockedPayload,
      url: sprintf(urls.BUC_CREATE_REPLY_SED_URL, { parentId: mockParentId })
    }))
  })

  it('sendAttachmentToSed()', () => {
    const mockParams = {
      aktoerId: '123',
      rinaId: '456',
      rinaDokumentId: '789',
      journalpostId: '123456',
      dokumentInfoId: '12346789',
      variantformat: 'DUMMY'
    }
    const mockContext = {
      journalpostId: '123456',
      tittel: 'tittel',
      tema: 'tema',
      datoOpprettet: new Date(2020, 1, 1),
      dokumentInfoId: '12346789',
      variant: { variantformat: 'DUMMY', filnavn: 'filnavn' }
    }
    bucActions.sendAttachmentToSed(mockParams, mockContext)
    expect(call).toBeCalledWith(expect.objectContaining({
      type: {
        request: types.BUC_SEND_ATTACHMENT_REQUEST,
        success: types.BUC_SEND_ATTACHMENT_SUCCESS,
        failure: types.BUC_SEND_ATTACHMENT_FAILURE
      },
      context: mockContext,
      method: 'PUT',
      url: sprintf(urls.API_JOARK_ATTACHMENT_URL, mockParams)
    }))
  })

  it('getSed()', () => {
    const mockCaseId = '123'
    const mockSed = {
      id: '456'
    } as Sed
    bucActions.getSed(mockCaseId, mockSed)
    expect(call).toBeCalledWith(expect.objectContaining({
      type: {
        request: types.BUC_GET_SED_REQUEST,
        success: types.BUC_GET_SED_SUCCESS,
        failure: types.BUC_GET_SED_FAILURE
      },
      url: sprintf(urls.BUC_GET_SED_URL, { caseId: mockCaseId, documentId: mockSed.id })
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
})
