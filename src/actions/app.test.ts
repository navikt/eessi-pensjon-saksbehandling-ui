import * as appActions from 'src/actions/app'
import * as types from 'src/constants/actionTypes'
import * as urls from 'src/constants/urls'
import { ParamPayload } from 'src/declarations/app'
import { ActionWithPayload, call as originalCall } from '@navikt/fetch'
import { Action } from 'redux'

jest.mock('@navikt/fetch', () => ({
  call: jest.fn()
}))
const call: jest.Mock = originalCall as jest.Mock<typeof originalCall>

describe('actions/app', () => {
  afterEach(() => {
    call.mockReset()
  })

  afterAll(() => {
    call.mockRestore()
  })

  it('clearData()', () => {
    const generatedResult: Action = appActions.clearData()
    expect(generatedResult).toMatchObject({
      type: types.APP_DATA_CLEAR
    })
  })

  it('getUserInfo()', () => {
    appActions.getUserInfo()
    expect(call).toHaveBeenCalledWith(expect.objectContaining({
      type: {
        request: types.APP_USERINFO_REQUEST,
        success: types.APP_USERINFO_SUCCESS,
        failure: types.APP_USERINFO_FAILURE,
        forbidden: types.APP_USERINFO_FORBIDDEN
      },
      cascadeFailureError: true,
      url: urls.API_USERINFO_URL
    }))
  })

  it('setStatusParam()', () => {
    const mockKey: string = 'mockKey'
    const mockValue: string = 'mockValue'
    const generatedResult: ActionWithPayload<ParamPayload> = appActions.setStatusParam(mockKey, mockValue)
    expect(generatedResult).toMatchObject({
      type: types.APP_PARAM_SET,
      payload: {
        key: mockKey,
        value: mockValue
      }
    })
  })

  it('unsetStatusParam()', () => {
    const mockKey: string = 'mockKey'
    const generatedResult: ActionWithPayload<ParamPayload> = appActions.unsetStatusParam(mockKey)
    expect(generatedResult).toMatchObject({
      type: types.APP_PARAM_UNSET,
      payload: {
        key: mockKey
      }
    })
  })
})
