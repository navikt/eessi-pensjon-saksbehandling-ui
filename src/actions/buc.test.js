import * as bucActions from 'actions/buc'
import { call } from 'eessi-pensjon-ui/dist/api'
import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import * as storage from 'constants/storage'
const sprintf = require('sprintf-js').sprintf
jest.mock('eessi-pensjon-ui/dist/api', () => ({
  call: jest.fn()
}))

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
    const mockedSedList = 'sedlist'
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

  it('setP4000Info()', () => {
    const mockedP4000 = { foo: 'bar' }
    const generatedResult = bucActions.setP4000Info(mockedP4000)
    expect(generatedResult).toMatchObject({
      type: types.BUC_P4000_INFO_SET,
      payload: mockedP4000
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
      url: sprintf(urls.BUC_GET_SINGLE_BUC, { rinaCaseId: mockRinaCaseId })
    }))
  })

  it('fetchBucs()', () => {
    const mockAktoerId = 123
    bucActions.fetchBucs(mockAktoerId)
    expect(call).toBeCalledWith(expect.objectContaining({
      type: {
        request: types.BUC_GET_BUCS_REQUEST,
        success: types.BUC_GET_BUCS_SUCCESS,
        failure: types.BUC_GET_BUCS_FAILURE
      },
      failWith500: true,
      url: sprintf(urls.BUC_GET_BUCS_URL, { aktoerId: mockAktoerId })
    }))
  })

  it('fetchAvdodBucs()', () => {
    const mockAktoerId = 123
    bucActions.fetchAvdodBucs(mockAktoerId)
    expect(call).toBeCalledWith(expect.objectContaining({
      type: {
        request: types.BUC_GET_AVDOD_BUCS_REQUEST,
        success: types.BUC_GET_AVDOD_BUCS_SUCCESS,
        failure: types.BUC_GET_AVDOD_BUCS_FAILURE
      },
      url: sprintf(urls.BUC_GET_BUCS_URL, { aktoerId: mockAktoerId })
    }))
  })

  it('fetchBucsInfoList()', () => {
    const mockUserId = 123
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
    bucActions.getBucList()
    expect(call).toBeCalledWith(expect.objectContaining({
      type: {
        request: types.BUC_GET_BUC_LIST_REQUEST,
        success: types.BUC_GET_BUC_LIST_SUCCESS,
        failure: types.BUC_GET_BUC_LIST_FAILURE
      },
      url: urls.BUC_GET_BUC_LIST_URL
    }))
  })

  it('getTagList()', () => {
    const expectedResults = bucActions.getTagList()
    expect(expectedResults).toMatchObject({
      type: types.BUC_GET_TAG_LIST_SUCCESS,
      payload: [
        'tag-refusjonskrav',
        'tag-uttakFor67ar',
        'tag-kombinasjonssaker',
        'tag-skilsmissesakerDE',
        'tag-forLavOpptjening',
        'tag-konvensjonsland',
        'tag-innvilgetYtelseIUtland',
        'tag-LengstOpptjeningstidINorge',
        'tag-kurantSak',
        'tag-InnvilgetGrunnytelse',
        'tag-12_2',
        'tag-lånekassen',
        'tag-loependeBarnetillegg',
        'tag-inntektsavkortetGrunnytelse',
        'tag-avvikendeMedlemskap'

      ]
    })
  })

  it('createBuc()', () => {
    const mockBuc = 'mockBuc'
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
      buc: {
        type: 'mockBuc',
        caseId: '456'
      },
      aktoerId: 123
    }
    bucActions.saveBucsInfo(mockParams)
    expect(call).toBeCalledWith({
      type: {
        request: types.BUC_SAVE_BUCSINFO_REQUEST,
        success: types.BUC_SAVE_BUCSINFO_SUCCESS,
        failure: types.BUC_SAVE_BUCSINFO_FAILURE
      },
      method: 'POST',
      context: {
        bucs: {
          456: {}
        }
      },
      payload: {
        bucs: {
          456: {}
        }
      },
      url: sprintf(urls.API_STORAGE_POST_URL, { userId: mockParams.aktoerId, namespace: storage.NAMESPACE_BUC, file: storage.FILE_BUCINFO })
    })
  })

  it('saveBucsInfo() with non-empty params', () => {
    const mockParams = {
      buc: {
        type: 'mockBuc',
        caseId: '456'
      },
      comment: 'dummy comment',
      tags: [{ value: 'DUMMY' }],
      aktoerId: 123
    }
    bucActions.saveBucsInfo(mockParams)
    expect(call).toBeCalledWith({
      type: {
        request: types.BUC_SAVE_BUCSINFO_REQUEST,
        success: types.BUC_SAVE_BUCSINFO_SUCCESS,
        failure: types.BUC_SAVE_BUCSINFO_FAILURE
      },
      method: 'POST',
      payload: {
        bucs: {
          456: {
            tags: ['DUMMY'],
            comment: 'dummy comment'
          }
        }
      },
      context: {
        bucs: {
          456: {
            tags: ['DUMMY'],
            comment: 'dummy comment'
          }
        }
      },
      url: sprintf(urls.API_STORAGE_POST_URL, { userId: mockParams.aktoerId, namespace: storage.NAMESPACE_BUC, file: storage.FILE_BUCINFO })
    })
  })

  it('getCountryList()', () => {
    bucActions.getCountryList()
    expect(call).toBeCalledWith(expect.objectContaining({
      type: {
        request: types.BUC_GET_COUNTRY_LIST_REQUEST,
        success: types.BUC_GET_COUNTRY_LIST_SUCCESS,
        failure: types.BUC_GET_COUNTRY_LIST_FAILURE
      },
      url: urls.EUX_COUNTRY_URL
    }))
  })

  it('getSedList()', () => {
    const mockBuc = { type: 'mockBucType', caseId: 456 }
    const mockRinaId = '123'
    bucActions.getSedList(mockBuc, mockRinaId)
    expect(call).toBeCalledWith(expect.objectContaining({
      type: {
        request: types.BUC_GET_SED_LIST_REQUEST,
        success: types.BUC_GET_SED_LIST_SUCCESS,
        failure: types.BUC_GET_SED_LIST_FAILURE
      },
      url: sprintf(urls.BUC_GET_SED_LIST_URL, { buc: mockBuc.type, rinaId: mockBuc.caseId })
    }))
  })

  it('getInstitutionsListForBucAndCountry()', () => {
    const mockBuc = 'P_BUC_01'
    const mockCountry = 'NO'
    bucActions.getInstitutionsListForBucAndCountry(mockBuc, mockCountry)
    expect(call).toBeCalledWith(expect.objectContaining({
      type: {
        request: types.BUC_GET_INSTITUTION_LIST_REQUEST,
        success: types.BUC_GET_INSTITUTION_LIST_SUCCESS,
        failure: types.BUC_GET_INSTITUTION_LIST_FAILURE
      },
      context: {
        buc: mockBuc,
        country: mockCountry
      },
      url: sprintf(urls.EUX_INSTITUTIONS_FOR_BUC_AND_COUNTRY_URL, { buc: mockBuc, country: mockCountry })
    }))
  })

  it('createSed()', () => {
    const mockedPayload = {}
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
    const mockedPayload = {}
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
      variantFormat: 'DUMMY'
    }
    const mockContext = { foo: 'bar' }
    bucActions.sendAttachmentToSed(mockParams, mockContext)
    expect(call).toBeCalledWith(expect.objectContaining({
      type: {
        request: types.BUC_SEND_ATTACHMENT_REQUEST,
        success: types.BUC_SEND_ATTACHMENT_SUCCESS,
        failure: types.BUC_SEND_ATTACHMENT_FAILURE
      },
      context: mockContext,
      method: 'PUT',
      url: sprintf(urls.BUC_SEND_ATTACHMENT_URL, mockParams)
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

  it('listP4000()', () => {
    const mockAktoerId = '123'
    bucActions.listP4000(mockAktoerId)
    expect(call).toBeCalledWith(expect.objectContaining({
      type: {
        request: types.BUC_GET_P4000_LIST_REQUEST,
        success: types.BUC_GET_P4000_LIST_SUCCESS,
        failure: types.BUC_GET_P4000_LIST_FAILURE
      },
      url: sprintf(urls.API_STORAGE_LIST_URL, { userId: mockAktoerId, namespace: storage.NAMESPACE_PINFO })
    }))
  })

  it('getP4000()', () => {
    const mockFile = 'file.json'
    bucActions.getP4000(mockFile)
    expect(call).toBeCalledWith(expect.objectContaining({
      type: {
        request: types.BUC_GET_P4000_INFO_REQUEST,
        success: types.BUC_GET_P4000_INFO_SUCCESS,
        failure: types.BUC_GET_P4000_INFO_FAILURE
      },
      url: sprintf(urls.API_STORAGE_GET_URL, { file: mockFile })
    }))
  })

  it('saveP4000asSaksbehandler()', () => {
    const mockAktoer = '1234567890'
    const mockP4000info = 'mockP4000Info'
    bucActions.saveP4000asSaksbehandler(mockAktoer, mockP4000info)
    expect(call).toBeCalledWith(expect.objectContaining({
      type: {
        request: types.BUC_SAVE_PINFOSB_REQUEST,
        success: types.BUC_SAVE_PINFOSB_SUCCESS,
        failure: types.BUC_SAVE_PINFOSB_FAILURE
      },
      url: sprintf(urls.API_STORAGE_POST_URL, { userId: mockAktoer, namespace: storage.NAMESPACE_PINFO, file: 'PINFOSB.json' }),
      payload: mockP4000info,
      context: { notification: false }
    }))
  })
})
