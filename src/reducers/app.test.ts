import * as types from 'constants/actionTypes'
import appReducer, { initialAppState } from './app'

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
      pesysContext: 'brukeroversikt',
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

  it('APP_USERINFO_SUCCESS: with date ', () => {
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
      loggedTime: new Date(mockNowDate),
      expirationTime: new Date(mockExpirationDate)
    })
  })

  it('APP_USERINFO_SUCCESS: with no date ', () => {
    expect(
      appReducer(initialAppState, {
        type: types.APP_USERINFO_SUCCESS,
        payload: {
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
      loggedTime: expect.any(Date),
      expirationTime: expect.any(Date)
    })
  })

  it('APP_USERINFO_FAILURE', () => {
    expect(
      appReducer(initialAppState, {
        type: types.APP_USERINFO_FAILURE,
        payload: undefined
      })
    ).toEqual({
      ...initialAppState,
      loggedIn: false
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
        type: types.APP_LOGOUT_SUCCESS,
        payload: undefined
      })
    ).toEqual(initialAppState)
  })

  it('UNKNOWN_ACTION', () => {
    expect(
      appReducer(initialAppState, {
        type: 'UNKNOWN_ACTION',
        payload: undefined
      })
    ).toEqual(initialAppState)
  })
})
