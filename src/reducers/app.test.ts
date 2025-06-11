import * as constants from 'src/constants/constants'
import * as types from 'src/constants/actionTypes'
import appReducer, { initialAppState } from './app'

describe('reducers/app', () => {
  it('APP_LOGOUT_SUCCESS', () => {
    expect(
      appReducer(initialAppState, {
        type: types.APP_LOGOUT_SUCCESS,
        payload: undefined
      })
    ).toEqual(initialAppState)
  })

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
      pesysContext: constants.BRUKERKONTEKST,
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
      },
      pesysContext: 'brukerkontekst'
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

  it('APP_USERINFO_FORBIDDEN', () => {
    expect(
      appReducer(initialAppState, {
        type: types.APP_USERINFO_FORBIDDEN,
        payload: undefined
      })
    ).toEqual({
      ...initialAppState,
      loggedIn: true,
      userRole: 'FORBIDDEN'
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
          role: 'mockRole'
        }
      })
    ).toEqual({
      ...initialAppState,
      username: 'mockSubject',
      userRole: 'mockRole',
      loggedIn: true,
    })
  })

  it('APP_USERINFO_SUCCESS: with no date ', () => {
    expect(
      appReducer(initialAppState, {
        type: types.APP_USERINFO_SUCCESS,
        payload: {
          subject: 'mockSubject',
          role: 'mockRole'
        }
      })
    ).toEqual({
      ...initialAppState,
      username: 'mockSubject',
      userRole: 'mockRole',
      loggedIn: true,
    })
  })

  it('APP_USERINFO_SUCCESS: feature toggle ', () => {
    expect(
      appReducer({
        ...initialAppState,
        featureToggles: {
          ...initialAppState.featureToggles,
        }
      }, {
        type: types.APP_USERINFO_SUCCESS,
        payload: {
          subject: 'mockSubject',
          role: 'mockRole',
          features: {
            P5000_UPDATES_VISIBLE: true
          }
        }
      })
    ).toEqual({
      ...initialAppState,
      username: 'mockSubject',
      userRole: 'mockRole',
      loggedIn: true,
      featureToggles: expect.objectContaining({
        P5000_UPDATES_VISIBLE: true,
      })
    })
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
