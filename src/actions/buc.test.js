import * as bucActions from './buc'
import * as api from './api'
import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
var sprintf = require('sprintf-js').sprintf

describe('case actions', () => {
  beforeAll(() => {
    api.call = jest.fn()
  })

  afterEach(() => {
    api.call.mockRestore()
  })

  it('verifyCaseNumber without RinaId()', () => {
    const mockParams = { foo: 'bar' }
    bucActions.verifyCaseNumber(mockParams)
    expect(api.call).toBeCalledWith({
      type: {
        request: types.BUC_VERIFY_CASE_NUMBER_REQUEST,
        success: types.BUC_VERIFY_CASE_NUMBER_SUCCESS,
        failure: types.BUC_VERIFY_CASE_NUMBER_FAILURE
      },
      url: sprintf(urls.EUX_CASE_WITHOUT_RINAID_URL, mockParams)
    })
  })

  it('verifyCaseNumber with RinaId()', () => {
    const mockParams = { foo: 'bar', rinaId: '123' }
    bucActions.verifyCaseNumber(mockParams)
    expect(api.call).toBeCalledWith({
      type: {
        request: types.BUC_VERIFY_CASE_NUMBER_REQUEST,
        success: types.BUC_VERIFY_CASE_NUMBER_SUCCESS,
        failure: types.BUC_VERIFY_CASE_NUMBER_FAILURE
      },
      url: sprintf(urls.EUX_CASE_WITH_RINAID_URL, mockParams)
    })
  })

  it('call getSubjectAreaList()', () => {
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

  it('call getCountryList()', () => {
    bucActions.getCountryList()
    expect(api.call).toBeCalledWith({
      type: {
        request: types.BUC_GET_COUNTRY_LIST_REQUEST,
        success: types.BUC_GET_COUNTRY_LIST_SUCCESS,
        failure: types.BUC_GET_COUNTRY_LIST_FAILURE
      },
      url: urls.EUX_COUNTRY_URL
    })
  })

  it('call getInstitutionListForBucAndCountry()', () => {
    let mockBuc = 'P_BUC_01'
    let mockCountry = 'NO'
    bucActions.getInstitutionListForBucAndCountry(mockBuc, mockCountry)
    expect(api.call).toBeCalledWith({
      type: {
        request: types.BUC_GET_INSTITUTION_LIST_REQUEST,
        success: types.BUC_GET_INSTITUTION_LIST_SUCCESS,
        failure: types.BUC_GET_INSTITUTION_LIST_FAILURE
      },
      url: sprintf(urls.EUX_INSTITUTIONS_FOR_BUC_AND_COUNTRY_URL, { buc: mockBuc, country: mockCountry })
    })
  })

  it('call getInstitutionListForCountry()', () => {
    let mockCountry = 'NO'
    bucActions.getInstitutionListForCountry(mockCountry)
    expect(api.call).toBeCalledWith({
      type: {
        request: types.BUC_GET_INSTITUTION_LIST_REQUEST,
        success: types.BUC_GET_INSTITUTION_LIST_SUCCESS,
        failure: types.BUC_GET_INSTITUTION_LIST_FAILURE
      },
      url: sprintf(urls.EUX_INSTITUTIONS_FOR_COUNTRY_URL, { country: mockCountry })
    })
  })

  it('call getBucList() with rinaId', () => {
    const mockAktoerId = 123
    bucActions.getBucList(mockRinaId)
    expect(api.call).toBeCalledWith({
      type: {
        request: types.BUC_GET_BUC_LIST_REQUEST,
        success: types.BUC_GET_BUC_LIST_SUCCESS,
        failure: types.BUC_GET_BUC_LIST_FAILURE
      },
      url: sprintf(urls.BUC_AKTOERID_DETALJER_URL, { aktoerId: mockAktoerId })
    })
  })

  it('call getSedList() with no rinaId', () => {
    const mockBuc = 'mockBuc'
    bucActions.getSedList(mockBuc)
    expect(api.call).toBeCalledWith({
      type: {
        request: types.BUC_GET_SED_LIST_REQUEST,
        success: types.BUC_GET_SED_LIST_SUCCESS,
        failure: types.BUC_GET_SED_LIST_FAILURE
      },
      url: sprintf(urls.EUX_SED_FOR_BUCS_URL, { buc: mockBuc })
    })
  })

  it('call getSedList() with rinaId', () => {
    const mockBuc = 'mockBuc'
    const mockRinaId = 123
    bucActions.getSedList(mockBuc, mockRinaId)
    expect(api.call).toBeCalledWith({
      type: {
        request: types.BUC_GET_SED_LIST_REQUEST,
        success: types.BUC_GET_SED_LIST_SUCCESS,
        failure: types.BUC_GET_SED_LIST_FAILURE
      },
      url: sprintf(urls.EUX_SED_FROM_RINA_URL, { rinaId: mockRinaId })
    })
  })


  it('call sendSed()', () => {
    const caseId = '123'
    const documentId = '456'
    const mockParams = { caseId: caseId, documentId: documentId }
    bucActions.sendSed(mockParams)
    expect(api.call).toBeCalledWith({
      type: {
        request: types.BUC_SEND_SED_REQUEST,
        success: types.BUC_SEND_SED_SUCCESS,
        failure: types.BUC_SEND_SED_FAILURE
      },
      url: sprintf(urls.SED_SEND_URL, { caseId: caseId, documentId: documentId })
    })
  })

  it('call getRinaUrl()', () => {
    bucActions.getRinaUrl()
    expect(api.call).toBeCalledWith({
      type: {
        request: types.RINA_GET_URL_REQUEST,
        success: types.RINA_GET_URL_SUCCESS,
        failure: types.RINA_GET_URL_FAILURE
      },
      url: urls.EUX_RINA_URL
    })
  })
})
