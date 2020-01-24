import { sendInvite, InviteParams } from 'actions/pinfo'
import { call as originalCall } from 'eessi-pensjon-ui/dist/api'
import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
const sprintf = require('sprintf-js').sprintf
jest.mock('eessi-pensjon-ui/dist/api', () => ({
  call: jest.fn()
}))
const call = originalCall as jest.Mock<typeof originalCall>

describe('actions/pinfo', () => {
  afterEach(() => {
    call.mockReset()
  })

  afterAll(() => {
    call.mockRestore()
  })

  it('sendInvite()', () => {
    const mockParams: InviteParams = {
      sakId: '123',
      aktoerId: '456'
    }
    sendInvite(mockParams)
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
