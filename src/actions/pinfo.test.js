import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import * as pinfoActions from 'actions/pinfo'
import * as api from 'actions/api'
import * as types from 'constants/actionTypes'

describe('pinfo actions', () => {
  beforeAll(() => {
    api.call = jest.fn()
  })

  afterAll(() => {
    api.call.mockRestore()
  })

  it('sendInvite()', () => {
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
      url: 'http://localhost/frontend/api/varsel?saksId=123&aktoerId=456'
    })
  })
})
