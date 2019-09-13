import * as pinfoActions from 'actions/pinfo'
import * as api from 'actions/api'
import * as types from 'constants/actionTypes'

describe('actions/pinfo', () => {
  beforeAll(() => {
    api.funcCall = jest.fn()
  })

  afterAll(() => {
    api.funcCall.mockRestore()
  })

  it('sendInvite()', () => {
    pinfoActions.sendInvite({
      sakId: '123',
      aktoerId: '456'
    })
    expect(api.funcCall).toBeCalledWith({
      method: 'POST',
      payload: {},
      expectedPayload: { success: true },
      type: {
        request: types.PINFO_INVITE_REQUEST,
        success: types.PINFO_INVITE_SUCCESS,
        failure: types.PINFO_INVITE_FAILURE
      },
      url: 'http://localhost/frontend/api/varsel?saksId=123&aktoerId=456'
    })
  })
})
