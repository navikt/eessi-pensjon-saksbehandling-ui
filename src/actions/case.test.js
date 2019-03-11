import * as caseActions from './case'
import * as api from './api'
import * as types from '../constants/actionTypes'
var sprintf = require('sprintf-js').sprintf

import * as urls  from '../constants/urls'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

const mockStore = configureMockStore([thunk])

describe('case actions', () => {
  let store

  beforeAll(() => {
    store = mockStore({})
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
    const mockParams = {foo: 'bar'}
    const generatedResult = caseActions.getCaseFromCaseNumber(mockParams)
    expect(api.call).toBeCalledWith({
      type: {
        request: types.CASE_GET_CASE_NUMBER_REQUEST,
        success: types.CASE_GET_CASE_NUMBER_SUCCESS,
        failure: types.CASE_GET_CASE_NUMBER_FAILURE
      },
      url: sprintf(urls.API_CASE_WITHOUT_RINAID_URL, mockParams)
    })
  })

  it('getCaseFromCaseNumber with RinaId()', () => {
    const mockParams = {foo: 'bar', rinaId: '123'}
    const generatedResult = caseActions.getCaseFromCaseNumber(mockParams)
    expect(api.call).toBeCalledWith({
      type: {
        request: types.CASE_GET_CASE_NUMBER_REQUEST,
        success: types.CASE_GET_CASE_NUMBER_SUCCESS,
        failure: types.CASE_GET_CASE_NUMBER_FAILURE
      },
      url: sprintf(urls.API_CASE_WITH_RINAID_URL, mockParams)
    })
  })

  it('call getSubjectAreaList()', () => {
    const generatedResult = caseActions.getSubjectAreaList()
    expect(api.call).toBeCalledWith({
      type: {
        request: types.CASE_GET_SUBJECT_AREA_LIST_REQUEST,
        success: types.CASE_GET_SUBJECT_AREA_LIST_SUCCESS,
        failure: types.CASE_GET_SUBJECT_AREA_LIST_FAILURE
      },
      url: urls.API_SUBJECT_AREA_URL
    })
  })

  it('call getCountryList()', () => {
    const generatedResult = caseActions.getCountryList()
    expect(generatedResult).toEqual({
      type: types.CASE_GET_COUNTRY_LIST_SUCCESS,
      payload: ['NO']
    })
  })

  it('call getInstitutionList()', () => {
    const generatedResult = caseActions.getInstitutionList()
    expect(generatedResult).toEqual({
      type: types.CASE_GET_INSTITUTION_LIST_SUCCESS,
      payload: ['NAVT003']
    })
  })

  it('call getInstitutionListForCountry()', () => {
    const generatedResult = caseActions.getInstitutionListForCountry('NO')
    expect(generatedResult).toEqual({
      type: types.CASE_GET_INSTITUTION_LIST_SUCCESS,
      payload: ['NAVT003']
    })
  })

  it('call getBucList() with no rinaId', () => {
    const generatedResult = caseActions.getBucList()
    expect(api.call).toBeCalledWith({
      type: {
        request: types.CASE_GET_BUC_LIST_REQUEST,
        success: types.CASE_GET_BUC_LIST_SUCCESS,
        failure: types.CASE_GET_BUC_LIST_FAILURE
      },
      url: urls.API_BUCS_URL
    })
  })

  it('call getBucList() with rinaId', () => {
    const mockRinaId = 123
    const generatedResult = caseActions.getBucList(mockRinaId)
    expect(api.call).toBeCalledWith({
      type: {
        request: types.CASE_GET_BUC_LIST_REQUEST,
        success: types.CASE_GET_BUC_LIST_SUCCESS,
        failure: types.CASE_GET_BUC_LIST_FAILURE
      },
      url: sprintf(urls.API_BUC_FROM_RINA_URL, {rinaId: mockRinaId})
    })
  })

  it('call getSedList() with no rinaId', () => {
    const mockBuc = 'mockBuc'
    const generatedResult = caseActions.getSedList(mockBuc)
    expect(api.call).toBeCalledWith({
      type: {
        request: types.CASE_GET_SED_LIST_REQUEST,
        success: types.CASE_GET_SED_LIST_SUCCESS,
        failure: types.CASE_GET_SED_LIST_FAILURE
      },
      url: sprintf(urls.API_SED_FOR_BUCS_URL, { buc: mockBuc })
    })
  })

  it('call getSedList() with rinaId', () => {
    const mockBuc = 'mockBuc'
    const mockRinaId = 123
    const generatedResult = caseActions.getSedList(mockBuc, mockRinaId)
    expect(api.call).toBeCalledWith({
      type: {
        request: types.CASE_GET_SED_LIST_REQUEST,
        success: types.CASE_GET_SED_LIST_SUCCESS,
        failure: types.CASE_GET_SED_LIST_FAILURE
      },
      url: sprintf(urls.API_SED_FROM_RINA_URL, {rinaId: mockRinaId})
    })
  })

  it('call dataPreview()', () => {
    const mockParams = {foo : 'bar'}
    const generatedResult = caseActions.dataPreview(mockParams)
    expect(generatedResult).toEqual({
      type: types.CASE_DATA_PREVIEW_SUCCESS,
      payload: mockParams
    })
  })

  it('call cleanCaseNumber()', () => {
    const generatedResult = caseActions.cleanCaseNumber()
    expect(generatedResult).toEqual({
      type: types.CASE_GET_CASE_NUMBER_CLEAN,
    })
  })

  it('call getMorePreviewData()', () => {
    const mockParams = {foo: 'bar'}
    const generatedResult = caseActions.getMorePreviewData(mockParams)
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
    const mockParams = {foo: 'bar'}
    const generatedResult = caseActions.createSed(mockParams)
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
    const mockParams = {foo: 'bar'}
    const generatedResult = caseActions.addToSed(mockParams)
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
    const mockParams = {foo: 'bar'}
    const generatedResult = caseActions.sendSed(mockParams)
    expect(api.call).toBeCalledWith({
      type: {
        request: types.CASE_SEND_SED_REQUEST,
        success: types.CASE_SEND_SED_SUCCESS,
        failure: types.CASE_SEND_SED_FAILURE
      },
      method: 'POST',
      payload: mockParams,
      url: urls.SED_SEND_URL
    })
  })

  it('call getRinaUrl()', () => {
    const generatedResult = caseActions.getRinaUrl()
    expect(api.call).toBeCalledWith({
      type: {
        request: types.RINA_GET_URL_REQUEST,
        success: types.RINA_GET_URL_SUCCESS,
        failure: types.RINA_GET_URL_FAILURE
      },
      url: urls.API_RINA_URL
    })
  })
})
