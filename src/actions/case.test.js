import * as caseActions from './case'
import * as api from './api'
import * as types from '../constants/actionTypes'
import * as urls from '../constants/urls'
var sprintf = require('sprintf-js').sprintf

describe('case actions', () => {
  beforeAll(() => {
    api.call = jest.fn()
  })

  afterEach(() => {
    api.call.mockRestore()
  })

  it('stepSet()', () => {
    const mockStep = 999
    const generatedResult = caseActions.setStep(mockStep)
    expect(generatedResult).toEqual({
      type: types.CASE_STEP_SET,
      payload: mockStep
    })
  })

  it('getCaseFromCaseNumber without RinaId()', () => {
    const mockParams = { foo: 'bar' }
    caseActions.getCaseFromCaseNumber(mockParams)
    expect(api.call).toBeCalledWith({
      type: {
        request: types.CASE_GET_CASE_NUMBER_REQUEST,
        success: types.CASE_GET_CASE_NUMBER_SUCCESS,
        failure: types.CASE_GET_CASE_NUMBER_FAILURE
      },
      url: sprintf(urls.EUX_CASE_WITHOUT_RINAID_URL, mockParams)
    })
  })

  it('getCaseFromCaseNumber with RinaId()', () => {
    const mockParams = { foo: 'bar', rinaId: '123' }
    caseActions.getCaseFromCaseNumber(mockParams)
    expect(api.call).toBeCalledWith({
      type: {
        request: types.CASE_GET_CASE_NUMBER_REQUEST,
        success: types.CASE_GET_CASE_NUMBER_SUCCESS,
        failure: types.CASE_GET_CASE_NUMBER_FAILURE
      },
      url: sprintf(urls.EUX_CASE_WITH_RINAID_URL, mockParams)
    })
  })

  it('call getSubjectAreaList()', () => {
    caseActions.getSubjectAreaList()
    expect(api.call).toBeCalledWith({
      type: {
        request: types.CASE_GET_SUBJECT_AREA_LIST_REQUEST,
        success: types.CASE_GET_SUBJECT_AREA_LIST_SUCCESS,
        failure: types.CASE_GET_SUBJECT_AREA_LIST_FAILURE
      },
      url: urls.EUX_SUBJECT_AREA_URL
    })
  })

  it('call getCountryList()', () => {
    caseActions.getCountryList()
    expect(api.call).toBeCalledWith({
      type: {
        request: types.CASE_GET_COUNTRY_LIST_REQUEST,
        success: types.CASE_GET_COUNTRY_LIST_SUCCESS,
        failure: types.CASE_GET_COUNTRY_LIST_FAILURE
      },
      url: urls.EUX_COUNTRY_URL
    })
  })

  it('call getInstitutionListForBucAndCountry()', () => {
    let mockBuc = 'P_BUC_01'
    let mockCountry = 'NO'
    caseActions.getInstitutionListForBucAndCountry(mockBuc, mockCountry)
    expect(api.call).toBeCalledWith({
      type: {
        request: types.CASE_GET_INSTITUTION_LIST_REQUEST,
        success: types.CASE_GET_INSTITUTION_LIST_SUCCESS,
        failure: types.CASE_GET_INSTITUTION_LIST_FAILURE
      },
      url: sprintf(urls.EUX_INSTITUTIONS_FOR_BUC_AND_COUNTRY_URL, { buc: mockBuc, country: mockCountry })
    })
  })

  it('call getInstitutionListForCountry()', () => {
    let mockCountry = 'NO'
    caseActions.getInstitutionListForCountry(mockCountry)
    expect(api.call).toBeCalledWith({
      type: {
        request: types.CASE_GET_INSTITUTION_LIST_REQUEST,
        success: types.CASE_GET_INSTITUTION_LIST_SUCCESS,
        failure: types.CASE_GET_INSTITUTION_LIST_FAILURE
      },
      url: sprintf(urls.EUX_INSTITUTIONS_FOR_COUNTRY_URL, { country: mockCountry })
    })
  })

  it('call getBucList() with no rinaId', () => {
    caseActions.getBucList()
    expect(api.call).toBeCalledWith({
      type: {
        request: types.CASE_GET_BUC_LIST_REQUEST,
        success: types.CASE_GET_BUC_LIST_SUCCESS,
        failure: types.CASE_GET_BUC_LIST_FAILURE
      },
      url: urls.EUX_BUCS_URL
    })
  })

  it('call getBucList() with rinaId', () => {
    const mockRinaId = 123
    caseActions.getBucList(mockRinaId)
    expect(api.call).toBeCalledWith({
      type: {
        request: types.CASE_GET_BUC_LIST_REQUEST,
        success: types.CASE_GET_BUC_LIST_SUCCESS,
        failure: types.CASE_GET_BUC_LIST_FAILURE
      },
      url: sprintf(urls.BUC_WITH_RINAID_NAME_URL, { rinaId: mockRinaId })
    })
  })

  it('call getSedList() with no rinaId', () => {
    const mockBuc = 'mockBuc'
    caseActions.getSedList(mockBuc)
    expect(api.call).toBeCalledWith({
      type: {
        request: types.CASE_GET_SED_LIST_REQUEST,
        success: types.CASE_GET_SED_LIST_SUCCESS,
        failure: types.CASE_GET_SED_LIST_FAILURE
      },
      url: sprintf(urls.EUX_SED_FOR_BUCS_URL, { buc: mockBuc })
    })
  })

  it('call getSedList() with rinaId', () => {
    const mockBuc = 'mockBuc'
    const mockRinaId = 123
    caseActions.getSedList(mockBuc, mockRinaId)
    expect(api.call).toBeCalledWith({
      type: {
        request: types.CASE_GET_SED_LIST_REQUEST,
        success: types.CASE_GET_SED_LIST_SUCCESS,
        failure: types.CASE_GET_SED_LIST_FAILURE
      },
      url: sprintf(urls.EUX_SED_FROM_RINA_URL, { rinaId: mockRinaId })
    })
  })

  it('call dataPreview()', () => {
    const mockParams = { foo: 'bar' }
    let generatedResult = caseActions.dataPreview(mockParams)
    expect(generatedResult).toEqual({
      type: types.CASE_DATA_PREVIEW_SUCCESS,
      payload: mockParams
    })
  })

  it('call cleanCaseNumber()', () => {
    let generatedResult = caseActions.cleanCaseNumber()
    expect(generatedResult).toEqual({
      type: types.CASE_GET_CASE_NUMBER_CLEAN
    })
  })

  it('call getMorePreviewData()', () => {
    const mockParams = { foo: 'bar' }
    caseActions.getMorePreviewData(mockParams)
    expect(api.call).toBeCalledWith({
      type: {
        request: types.CASE_GET_MORE_PREVIEW_DATA_REQUEST,
        success: types.CASE_GET_MORE_PREVIEW_DATA_SUCCESS,
        failure: types.CASE_GET_MORE_PREVIEW_DATA_FAILURE
      },
      method: 'POST',
      payload: mockParams,
      url: urls.SED_PREVIEW_URL
    })
  })

  it('call createSed() ', () => {
    const mockParams = { foo: 'bar' }
    caseActions.createSed(mockParams)
    expect(api.call).toBeCalledWith({
      type: {
        request: types.CASE_CREATE_SED_REQUEST,
        success: types.CASE_CREATE_SED_SUCCESS,
        failure: types.CASE_CREATE_SED_FAILURE
      },
      method: 'POST',
      payload: mockParams,
      url: urls.SED_BUC_CREATE_URL
    })
  })

  it('call addToSed()', () => {
    const mockParams = { foo: 'bar' }
    caseActions.addToSed(mockParams)
    expect(api.call).toBeCalledWith({
      type: {
        request: types.CASE_ADD_TO_SED_REQUEST,
        success: types.CASE_ADD_TO_SED_SUCCESS,
        failure: types.CASE_ADD_TO_SED_FAILURE
      },
      method: 'POST',
      payload: mockParams,
      url: urls.SED_ADD_URL
    })
  })

  it('call sendSed()', () => {
    const caseId = '123'
    const documentId = '456'
    const mockParams = { caseId: caseId, documentId: documentId }
    caseActions.sendSed(mockParams)
    expect(api.call).toBeCalledWith({
      type: {
        request: types.CASE_SEND_SED_REQUEST,
        success: types.CASE_SEND_SED_SUCCESS,
        failure: types.CASE_SEND_SED_FAILURE
      },
      url: sprintf(urls.SED_SEND_URL, { caseId: caseId, documentId: documentId })
    })
  })

  it('call getRinaUrl()', () => {
    caseActions.getRinaUrl()
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
