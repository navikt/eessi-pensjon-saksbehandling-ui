import * as bucActions from 'actions/buc'
import * as api from 'actions/api'
import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import sampleBucs from 'resources/tests/sampleBucs'
import sampleBucsInfo from 'resources/tests/sampleBucsInfo'
var sprintf = require('sprintf-js').sprintf

urls.HOST = 'notlocalhost'

describe('buc actions', () => {
  beforeAll(() => {
    api.call = jest.fn()
  })

  afterEach(() => {
    api.call.mockRestore()
  })

  it('setMode()', () => {
    const mockedMode = 'mode'
    const generatedResult = bucActions.setMode(mockedMode)
    expect(generatedResult).toMatchObject({
      type: types.BUC_MODE_SET,
      payload: mockedMode
    })
  })

  it('setBuc()', () => {
    const mockedBuc = 'buc'
    const generatedResult = bucActions.setBuc(mockedBuc)
    expect(generatedResult).toMatchObject({
      type: types.BUC_BUC_SET,
      payload: mockedBuc
    })
  })

  it('setSeds()', () => {
    const mockedSeds = 'seds'
    const generatedResult = bucActions.setSeds(mockedSeds)
    expect(generatedResult).toMatchObject({
      type: types.BUC_SEDS_SET,
      payload: mockedSeds
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

  it('fetchBucs()', () => {
    const mockAktoerId = 123
    bucActions.fetchBucs(mockAktoerId)
    expect(api.call).toBeCalledWith({
      type: {
        request: types.BUC_GET_BUCS_REQUEST,
        success: types.BUC_GET_BUCS_SUCCESS,
        failure: types.BUC_GET_BUCS_FAILURE
      },
      expectedPayload: sampleBucs,
      url: sprintf(urls.BUC_AKTOERID_DETALJER_URL, { aktoerId: mockAktoerId })
    })
  })

  it('fetchBucsInfoList()', () => {
    const mockUserId = 123
    bucActions.fetchBucsInfoList(mockUserId)
    expect(api.call).toBeCalledWith({
      type: {
        request: types.BUC_GET_BUCSINFO_LIST_REQUEST,
        success: types.BUC_GET_BUCSINFO_LIST_SUCCESS,
        failure: types.BUC_GET_BUCSINFO_LIST_FAILURE
      },
      url: sprintf(urls.API_STORAGE_LIST_URL, { userId: mockUserId, namespace: 'BUC' })
    })
  })

  it('fetchBucsInfo()', () => {
    const mockFilename = 'mockFilename'
    bucActions.fetchBucsInfo(mockFilename)
    expect(api.call).toBeCalledWith({
      type: {
        request: types.BUC_GET_BUCSINFO_REQUEST,
        success: types.BUC_GET_BUCSINFO_SUCCESS,
        failure: types.BUC_GET_BUCSINFO_FAILURE
      },
      expectedPayload: sampleBucsInfo,
      url: sprintf(urls.API_STORAGE_GETFILE_URL, { file: mockFilename })
    })
  })

  it('verifyCaseNumber()', () => {
    const mockParams = { sakId: 123, aktoerId: 456 }
    bucActions.verifyCaseNumber(mockParams)
    expect(api.call).toBeCalledWith({
      type: {
        request: types.BUC_VERIFY_CASE_NUMBER_REQUEST,
        success: types.BUC_VERIFY_CASE_NUMBER_SUCCESS,
        failure: types.BUC_VERIFY_CASE_NUMBER_FAILURE
      },
      url: sprintf(urls.EUX_CASE_URL, mockParams)
    })
  })

  it('getSubjectAreaList()', () => {
    bucActions.getSubjectAreaList()
    expect(api.call).toBeCalledWith({
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
    expect(api.call).toBeCalledWith({
      type: {
        request: types.BUC_GET_BUC_LIST_REQUEST,
        success: types.BUC_GET_BUC_LIST_SUCCESS,
        failure: types.BUC_GET_BUC_LIST_FAILURE
      },
      url: urls.EUX_BUCS_URL
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
    let mockBuc = 'mockBuc'
    bucActions.createBuc(mockBuc)
    expect(api.call).toBeCalledWith({
      type: {
        request: types.BUC_CREATE_BUC_REQUEST,
        success: types.BUC_CREATE_BUC_SUCCESS,
        failure: types.BUC_CREATE_BUC_FAILURE
      },
      expectedPayload: {
        caseId: '123',
        type: mockBuc
      },
      method: 'POST',
      url: sprintf(urls.BUC_CREATE_BUC_URL, { buc: mockBuc })
    })
  })

  it('saveBucsInfo() with empty params', () => {
    let mockParams = {
      buc: {
        type: 'mockBuc',
        caseId: '456'
      },
      comment: 'dummy comment',
      tags: [{value: 'DUMMY'}],
      aktoerId: 123
    }
    bucActions.saveBucsInfo(mockParams)
    expect(api.call).toBeCalledWith({
      type: {
        request: types.BUC_SAVE_BUCSINFO_REQUEST,
        success: types.BUC_SAVE_BUCSINFO_SUCCESS,
        failure: types.BUC_SAVE_BUCSINFO_FAILURE
      },
      method: 'POST',
      payload: {
        bucs: {
          'mockBuc-456': {
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
    expect(api.call).toBeCalledWith({
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
    expect(api.call).toBeCalledWith({
      type: {
        request: types.BUC_GET_SED_LIST_REQUEST,
        success: types.BUC_GET_SED_LIST_SUCCESS,
        failure: types.BUC_GET_SED_LIST_FAILURE
      },
      expectedPayload: ['P2000', 'P4000'],
      url: sprintf(urls.EUX_SED_FOR_BUCS_URL, { buc: mockBuc.type, rinaId: mockBuc.caseId })
    })
  })

  it('getInstitutionsListForBucAndCountry()', () => {
    let mockBuc = 'P_BUC_01'
    let mockCountry = 'NO'
    bucActions.getInstitutionsListForBucAndCountry(mockBuc, mockCountry)
    expect(api.call).toBeCalledWith({
      type: {
        request: types.BUC_GET_INSTITUTION_LIST_REQUEST,
        success: types.BUC_GET_INSTITUTION_LIST_SUCCESS,
        failure: types.BUC_GET_INSTITUTION_LIST_FAILURE
      },
       context: {
         buc: mockBuc,
         country: mockCountry
       },
       expectedPayload: [{
         'akronym': '001',
         'id': 'XX:001',
         'landkode': 'XX',
         'navn': 'Demo institution 001',
       }, {
         'akronym': '002',
         'id': 'XX:002',
         'landkode': 'XX',
         'navn': 'Demo institution 002',
       }],
      url: sprintf(urls.EUX_INSTITUTIONS_FOR_BUC_AND_COUNTRY_URL, { buc: mockBuc, country: mockCountry })
    })
  })

  it('createSed()', () => {
    const mockedPayload = {}
    bucActions.createSed(mockedPayload)
    expect(api.call).toBeCalledWith({
      type: {
        request: types.BUC_CREATE_SED_REQUEST,
        success: types.BUC_CREATE_SED_SUCCESS,
        failure: types.BUC_CREATE_SED_FAILURE
      },
      method: 'POST',
      expectedPayload: { id: "123456789" },
      payload: mockedPayload,
      url: urls.BUC_CREATE_SED_URL
    })
  })

  it('sendAttachmentToSed()', () => {
    const mockParams = {
      aktoerId: '123',
      rinaId : '456',
      rinaDokumentId: '789',
      joarkJournalpostId: '123456',
      joarkDokumentInfoId: '12346789',
      variantFormat: 'DUMMY'
    }
    bucActions.sendAttachmentToSed(mockParams)
    expect(api.call).toBeCalledWith({
      type: {
        request: types.BUC_SED_ATTACHMENT_REQUEST,
        success: types.BUC_SED_ATTACHMENT_SUCCESS,
        failure: types.BUC_SED_ATTACHMENT_FAILURE
      },
      method: 'PUT',
      expectedPayload: { success: true },
      url: sprintf(urls.BUC_SED_ATTACHMENT_URL, mockParams)
    })
  })

  it('call getRinaUrl()', () => {
    bucActions.getRinaUrl()
    expect(api.call).toBeCalledWith({
      type: {
        request: types.BUC_RINA_GET_URL_REQUEST,
        success: types.BUC_RINA_GET_URL_SUCCESS,
        failure: types.BUC_RINA_GET_URL_FAILURE
      },
      url: urls.EUX_RINA_URL
    })
  })
})
