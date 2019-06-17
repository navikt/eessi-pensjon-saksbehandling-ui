import * as pinfoActions from './pinfo.js'
import * as types from '../constants/actionTypes'

import * as api from './api'

import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

describe('pinfo actions', () => {
  beforeAll(() => {
    api.call = jest.fn()
  })

  afterAll(() => {
    api.call.mockRestore()
  })

  it('call sendInvite()', () => {
    pinfoActions.sendInvite({
      sakId: '123',
      aktoerId: '456'
    })
    expect(api.call).toBeCalledWith({
      method: 'POST',
      payload: {},
      type: {
        request: types.PINFO_INVITE_REQUEST,
        success: types.PINFO_INVITE_SUCCESS,
        failure: types.PINFO_INVITE_FAILURE
      },
      url: 'http://localhost/api/varsel?saksId=123&aktoerId=456'
    })
  })
})
