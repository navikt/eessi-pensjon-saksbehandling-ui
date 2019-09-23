import * as bucActions from 'actions/buc'
import * as api from 'actions/api'
import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import sampleBucs from 'resources/tests/sampleBucs'
import sampleBucsInfo from 'resources/tests/sampleBucsInfo'
import sampleP4000info from 'resources/tests/sampleP4000info'
import sampleInstitutions from 'resources/tests/sampleInstitutions'
var sprintf = require('sprintf-js').sprintf

describe('actions/buc', () => {
  const funcCall = jest.spyOn(api, 'funcCall').mockImplementation(jest.fn())

  afterEach(() => {
    funcCall.mockReset()
  })

  afterAll(() => {
    funcCall.mockRestore()
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

  it('resetSed()', () => {
    const generatedResult = bucActions.resetSed()
    expect(generatedResult).toMatchObject({
      type: types.BUC_SED_RESET
    })
  })

  it('resetBuc()', () => {
    const generatedResult = bucActions.resetBuc()
    expect(generatedResult).toMatchObject({
      type: types.BUC_BUC_RESET
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
    expect(funcCall).toBeCalledWith({
      type: {
        request: types.BUC_GET_SINGLE_BUC_REQUEST,
        success: types.BUC_GET_SINGLE_BUC_SUCCESS,
        failure: types.BUC_GET_SINGLE_BUC_FAILURE
      },
      expectedPayload: sampleBucs[0],
      url: sprintf(urls.BUC_GET_SINGLE_BUC, { rinaCaseId: mockRinaCaseId })
    })
  })

  it('fetchBucs()', () => {
    const mockAktoerId = 123
    bucActions.fetchBucs(mockAktoerId)
    expect(funcCall).toBeCalledWith({
      type: {
        request: types.BUC_GET_BUCS_REQUEST,
        success: types.BUC_GET_BUCS_SUCCESS,
        failure: types.BUC_GET_BUCS_FAILURE
      },
      expectedPayload: sampleBucs,
      failWith500: true,
      url: sprintf(urls.BUC_AKTOERID_DETALJER_URL, { aktoerId: mockAktoerId })
    })
  })

  it('fetchAvdodBucs()', () => {
    const mockAktoerId = 123
    bucActions.fetchAvdodBucs(mockAktoerId)
    expect(funcCall).toBeCalledWith({
      type: {
        request: types.BUC_GET_AVDOD_BUCS_REQUEST,
        success: types.BUC_GET_AVDOD_BUCS_SUCCESS,
        failure: types.BUC_GET_AVDOD_BUCS_FAILURE
      },
      expectedPayload: sampleBucs,
      url: sprintf(urls.BUC_AKTOERID_DETALJER_URL, { aktoerId: mockAktoerId })
    })
  })

  it('fetchBucsInfoList()', () => {
    const mockUserId = 123
    bucActions.fetchBucsInfoList(mockUserId)
    expect(funcCall).toBeCalledWith({
      type: {
        request: types.BUC_GET_BUCSINFO_LIST_REQUEST,
        success: types.BUC_GET_BUCSINFO_LIST_SUCCESS,
        failure: types.BUC_GET_BUCSINFO_LIST_FAILURE
      },
      expectedPayload: [mockUserId + '__BUC__INFO'],
      url: sprintf(urls.API_STORAGE_LIST_URL, { userId: mockUserId, namespace: 'BUC' })
    })
  })

  it('fetchBucsInfo()', () => {
    const mockUserId = 'mockUserId'
    const mockNamespace = 'mockNamespace'
    const mockFilename = 'mockFilename'
    bucActions.fetchBucsInfo(mockUserId, mockNamespace, mockFilename)
    expect(funcCall).toBeCalledWith({
      type: {
        request: types.BUC_GET_BUCSINFO_REQUEST,
        success: types.BUC_GET_BUCSINFO_SUCCESS,
        failure: types.BUC_GET_BUCSINFO_FAILURE
      },
      expectedPayload: sampleBucsInfo,
      url: sprintf(urls.API_STORAGE_GET_URL, { userId: mockUserId, namespace: mockNamespace, file: mockFilename })
    })
  })

  it('getSubjectAreaList()', () => {
    bucActions.getSubjectAreaList()
    expect(funcCall).toBeCalledWith({
      type: {
        request: types.BUC_GET_SUBJECT_AREA_LIST_REQUEST,
        success: types.BUC_GET_SUBJECT_AREA_LIST_SUCCESS,
        failure: types.BUC_GET_SUBJECT_AREA_LIST_FAILURE
      },
      url: urls.EUX_SUBJECT_AREA_URL
    })
  })

  it('getBucList()', () => {
    bucActions.getBucList()
    expect(funcCall).toBeCalledWith({
      type: {
        request: types.BUC_GET_BUC_LIST_REQUEST,
        success: types.BUC_GET_BUC_LIST_SUCCESS,
        failure: types.BUC_GET_BUC_LIST_FAILURE
      },
      expectedPayload: ['DEMO_BUC_01'],
      url: urls.BUC_BUCS_URL
    })
  })

  it('getTagList()', () => {
    const expectedResults = bucActions.getTagList()
    expect(expectedResults).toMatchObject({
      type: types.BUC_GET_TAG_LIST_SUCCESS,
      payload: ['urgent', 'vip', 'sensitive', 'secret']
    })
  })

  it('createBuc()', () => {
    const mockBuc = 'mockBuc'
    bucActions.createBuc(mockBuc)
    expect(funcCall).toBeCalledWith({
      type: {
        request: types.BUC_CREATE_BUC_REQUEST,
        success: types.BUC_CREATE_BUC_SUCCESS,
        failure: types.BUC_CREATE_BUC_FAILURE
      },
      expectedPayload: {
        caseId: '123',
        creator: {
          institution: 'NO:NAV07',
          country: 'NO'
        },
        type: mockBuc
      },
      method: 'POST',
      url: sprintf(urls.BUC_CREATE_BUC_URL, { buc: mockBuc })
    })
  })

  it('saveBucsInfo() with empty params', () => {
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
    expect(funcCall).toBeCalledWith({
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
      url: sprintf(urls.API_STORAGE_POST_URL, { userId: mockParams.aktoerId, namespace: 'BUC', file: 'INFO' })
    })
  })

  it('getCountryList()', () => {
    bucActions.getCountryList()
    expect(funcCall).toBeCalledWith({
      type: {
        request: types.BUC_GET_COUNTRY_LIST_REQUEST,
        success: types.BUC_GET_COUNTRY_LIST_SUCCESS,
        failure: types.BUC_GET_COUNTRY_LIST_FAILURE
      },
      expectedPayload: ['XX'],
      url: urls.EUX_COUNTRY_URL
    })
  })

  it('getSedList()', () => {
    const mockBuc = { type: 'mockBucType', caseId: 456 }
    const mockRinaId = '123'
    bucActions.getSedList(mockBuc, mockRinaId)
    expect(funcCall).toBeCalledWith({
      type: {
        request: types.BUC_GET_SED_LIST_REQUEST,
        success: types.BUC_GET_SED_LIST_SUCCESS,
        failure: types.BUC_GET_SED_LIST_FAILURE
      },
      expectedPayload: ['P2000', 'P4000', 'P5000'],
      url: sprintf(urls.SED_GET_OPTIONS_URL, { buc: mockBuc.type, rinaId: mockBuc.caseId })
    })
  })

  it('getInstitutionsListForBucAndCountry()', () => {
    const mockBuc = 'P_BUC_01'
    const mockCountry = 'NO'
    bucActions.getInstitutionsListForBucAndCountry(mockBuc, mockCountry)
    expect(funcCall).toBeCalledWith({
      type: {
        request: types.BUC_GET_INSTITUTION_LIST_REQUEST,
        success: types.BUC_GET_INSTITUTION_LIST_SUCCESS,
        failure: types.BUC_GET_INSTITUTION_LIST_FAILURE
      },
      context: {
        buc: mockBuc,
        country: mockCountry
      },
      expectedPayload: sampleInstitutions,
      url: sprintf(urls.EUX_INSTITUTIONS_FOR_BUC_AND_COUNTRY_URL, { buc: mockBuc, country: mockCountry })
    })
  })

  it('createSed()', () => {
    const mockedPayload = {}
    bucActions.createSed(mockedPayload)
    expect(funcCall).toBeCalledWith({
      type: {
        request: types.BUC_CREATE_SED_REQUEST,
        success: types.BUC_CREATE_SED_SUCCESS,
        failure: types.BUC_CREATE_SED_FAILURE
      },
      method: 'POST',
      expectedPayload: { id: '123456789' },
      payload: mockedPayload,
      url: urls.BUC_CREATE_SED_URL
    })
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
    expect(funcCall).toBeCalledWith({
      type: {
        request: types.BUC_SEND_ATTACHMENT_REQUEST,
        success: types.BUC_SEND_ATTACHMENT_SUCCESS,
        failure: types.BUC_SEND_ATTACHMENT_FAILURE
      },
      context: mockContext,
      method: 'PUT',
      expectedPayload: { success: true },
      url: sprintf(urls.BUC_SEND_ATTACHMENT_URL, mockParams)
    })
  })

  it('getRinaUrl()', () => {
    bucActions.getRinaUrl()
    expect(funcCall).toBeCalledWith({
      expectedPayload: {
        rinaUrl: 'http://mockurl.com/rinaUrl'
      },
      type: {
        request: types.BUC_RINA_GET_URL_REQUEST,
        success: types.BUC_RINA_GET_URL_SUCCESS,
        failure: types.BUC_RINA_GET_URL_FAILURE
      },
      url: urls.EUX_RINA_URL
    })
  })

  it('listP4000()', () => {
    const mockAktoerId = '123'
    bucActions.listP4000(mockAktoerId)
    expect(funcCall).toBeCalledWith({
      type: {
        request: types.BUC_GET_P4000_LIST_REQUEST,
        success: types.BUC_GET_P4000_LIST_SUCCESS,
        failure: types.BUC_GET_P4000_LIST_FAILURE
      },
      expectedPayload: [
        mockAktoerId + '___PINFO___PINFO.json'
      ],
      url: sprintf(urls.API_STORAGE_LIST_URL, { userId: mockAktoerId, namespace: 'PINFO' })
    })
  })

  it('getP4000()', () => {
    const mockFile = 'file.json'
    bucActions.getP4000(mockFile)
    expect(funcCall).toBeCalledWith({
      type: {
        request: types.BUC_GET_P4000_INFO_REQUEST,
        success: types.BUC_GET_P4000_INFO_SUCCESS,
        failure: types.BUC_GET_P4000_INFO_FAILURE
      },
      expectedPayload: sampleP4000info,
      url: sprintf(urls.API_STORAGE_GET_URL, { file: mockFile })
    })
  })

  it('saveP4000asSaksbehandler()', () => {
    const mockAktoer = '1234567890'
    bucActions.saveP4000asSaksbehandler(mockAktoer, sampleP4000info)
    expect(funcCall).toBeCalledWith({
      url: sprintf(urls.API_STORAGE_POST_URL, { userId: mockAktoer, namespace: 'PINFO', file: 'PINFOSB.json' }),
      payload: sampleP4000info,
      expectedPayload: sampleP4000info,
      context: { notification: false },
      type: {
        request: types.BUC_SAVE_PINFOSB_REQUEST,
        success: types.BUC_SAVE_PINFOSB_SUCCESS,
        failure: types.BUC_SAVE_PINFOSB_FAILURE
      }
    })
  })
})
