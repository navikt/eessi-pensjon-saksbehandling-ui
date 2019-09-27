import * as pinfoActions from 'actions/pinfo'
import * as api from 'actions/api'
import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
const sprintf = require('sprintf-js').sprintf

describe('actions/pinfo', () => {
  const call = jest.spyOn(api, 'call').mockImplementation(jest.fn())

  afterEach(() => {
    call.mockReset()
  })

  afterAll(() => {
    call.mockRestore()
  })

  it('sendInvite()', () => {
    const mockParams = {
      sakId: '123',
      aktoerId: '456'
    }
    pinfoActions.sendInvite(mockParams)
    expect(call).toBeCalledWith({
      method: 'POST',
      payload: {},
      expectedPayload: { success: true },
      type: {
        request: types.PINFO_INVITE_REQUEST,
        success: types.PINFO_INVITE_SUCCESS,
        failure: types.PINFO_INVITE_FAILURE
      },
      url: sprintf(urls.API_VARSEL_URL, mockParams)
    })
  })
})
