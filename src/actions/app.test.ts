import * as appActions from 'actions/app'
import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import { ParamPayload } from 'declarations/app'
import { ActionWithPayload, call as originalCall } from 'js-fetch-api'
import { Action } from 'redux'

jest.mock('js-fetch-api', () => ({
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
      type: types.APP_CLEAR_DATA
    })
  })

  it('getUserInfo()', () => {
    appActions.getUserInfo()
    expect(call).toBeCalledWith(expect.objectContaining({
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

  it('login()', () => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        origin: 'http://fake-url.nav.no/',
        pathname: '/path',
        search: '?var=param',
        href: 'http://fake-url.nav.no/path?var=param'
      }
    })
    const generatedResult: Action = appActions.login()
    expect(window.location.href).toEqual(
      'http://localhost/frontend/login?' +
      'redirect=http://fake-url.nav.no/&' +
      'context=%2Fpath%3Fvar%3Dparam'
    )
    expect(generatedResult).toMatchObject({
      type: types.APP_LOGIN_REQUEST
    })
  })

  it('logout()', () => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: {}
    })
    const generatedResult: Action = appActions.logout()
    expect(window.location.href).toEqual(urls.LOGOUT_URL)
    expect(generatedResult).toMatchObject({
      type: types.APP_LOGOUT_REQUEST
    })
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
