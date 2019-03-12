import * as api from './api'
import * as types from '../constants/actionTypes'
import * as urls from '../constants/urls'
import * as statusActions from './status'
var sprintf = require('sprintf-js').sprintf

describe('status actions', () => {
  beforeAll(() => {
    api.call = jest.fn()
  })

  it('call setStatusParam()', () => {
    const mockKey = 'mockKey'
    const mockValue = 'mockValue'
    const generatedResult = statusActions.setStatusParam(mockKey, mockValue)
    expect(generatedResult).toMatchObject({
      type: types.STATUS_PARAM_SET,
      payload: {
        key: mockKey,
        value: mockValue
      }
    })
  })

  it('call unsetStatusParam()', () => {
    const mockKey = 'mockKey'
    const generatedResult = statusActions.unsetStatusParam(mockKey)
    expect(generatedResult).toMatchObject({
      type: types.STATUS_PARAM_UNSET,
      payload: {
        key: mockKey
      }
    })
  })

  it('call getPossibleActions()', () => {
    const rinaId = '123456'
    const generatedResult = statusActions.getPossibleActions(rinaId)
    expect(api.call).toBeCalledWith({
      type: {
        request: types.STATUS_GET_REQUEST,
        success: types.STATUS_GET_SUCCESS,
        failure: types.STATUS_GET_FAILURE
      },
      url: sprintf(urls.API_ACTIONS_FOR_RINAID_URL, { rinaId: rinaId}),
    })
  })

  it('call getCase()', () => {
    const rinaId = '123456'
    const generatedResult = statusActions.getCase(rinaId)
    expect(api.call).toBeCalledWith({
      type: {
        request: types.STATUS_RINA_CASE_REQUEST,
        success: types.STATUS_RINA_CASE_SUCCESS,
        failure: types.STATUS_RINA_CASE_FAILURE
      },
      url: sprintf(urls.API_CASE_FOR_RINAID_URL, { rinaId: rinaId})
    })
  })

  it('call deleteSed()', () => {
    const rinaId = '123456'
    const dokumentId = '602854986582356'
    const generatedResult = statusActions.deleteSed(rinaId, dokumentId)
    expect(api.call).toBeCalledWith({
      type: {
        request: types.STATUS_SED_DELETE_REQUEST,
        success: types.STATUS_SED_DELETE_SUCCESS,
        failure: types.STATUS_SED_DELETE_FAILURE
      },
      method: 'DELETE',
      url: sprintf(urls.SED_WITH_RINAID_AND_DOCUMENTID_URL, { rinaId: rinaId, dokumentId: dokumentId })
    })
  })
})
