import appReducer, { initialAppState } from './app.js'
import * as types from 'constants/actionTypes'

describe('reducers/app', () => {
  it('APP_PARAM_SET', () => {
    expect(
      appReducer(initialAppState, {
        type: types.APP_PARAM_SET,
        payload: {
          key: 'mockKey',
          value: 'mockValue'
        }
      })
    ).toEqual({
      ...initialAppState,
      params: {
        mockKey: 'mockValue'
      }
    })
  })

  it('APP_PARAM_UNSET', () => {
    expect(
      appReducer({
        ...initialAppState,
        params: {
          mockKey: 'mockValue',
          foo: 'bar'
        }
      }, {
        type: types.APP_PARAM_UNSET,
        payload: {
          key: 'mockKey'
        }
      })
    ).toEqual({
      ...initialAppState,
      params: {
        foo: 'bar'
      }
    })
  })

  it('APP_USERINFO_SUCCESS', () => {
    const mockNowDate = '2020-12-17T03:24:00'
    const mockExpirationDate = '2020-12-31T09:00:00'
    expect(
      appReducer(initialAppState, {
        type: types.APP_USERINFO_SUCCESS,
        payload: {
          now: mockNowDate,
          expirationTime: mockExpirationDate,
          subject: 'mockSubject',
          role: 'mockRole',
          allowed: 'mockAllowed'
        }
      })
    ).toEqual({
      ...initialAppState,
      username: 'mockSubject',
      userRole: 'mockRole',
      allowed: 'mockAllowed',
      loggedIn: true,
      userStatus: 'OK',
      loggedTime: new Date(mockNowDate),
      expirationTime: new Date(mockExpirationDate)
    })
  })

  it('APP_USERINFO_FAILURE', () => {
    expect(
      appReducer(initialAppState, {
        type: types.APP_USERINFO_FAILURE
      })
    ).toEqual({
      ...initialAppState,
      loggedIn: false,
      userStatus: 'ERROR'
    })
  })

  it('APP_PERSONINFO_SUCCESS', () => {
    expect(
      appReducer(initialAppState, {
        type: types.APP_PERSONINFO_SUCCESS,
        payload: {
          person: 'mockPayload'
        }
      })
    ).toEqual({
      ...initialAppState,
      person: 'mockPayload'
    })
  })

  it('APP_LOGOUT_SUCCESS', () => {
    expect(
      appReducer(initialAppState, {
        type: types.APP_LOGOUT_SUCCESS
      })
    ).toEqual(initialAppState)
  })
})
