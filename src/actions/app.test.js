import * as appActions from 'actions/app'
import * as api from 'actions/api'
import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import samplePerson from 'resources/tests/samplePerson'
var sprintf = require('sprintf-js').sprintf

describe('app actions', () => {
  beforeAll(() => {
    api.funcCall = jest.fn()
    api.call = jest.fn()
  })

  afterEach(() => {
    api.funcCall.mockRestore()
    api.call.mockRestore()
  })

  it('call setStatusParam()', () => {
    const mockKey = 'mockKey'
    const mockValue = 'mockValue'
    const generatedResult = appActions.setStatusParam(mockKey, mockValue)
    expect(generatedResult).toMatchObject({
      type: types.APP_PARAM_SET,
      payload: {
        key: mockKey,
        value: mockValue
      }
    })
  })

  it('call unsetStatusParam()', () => {
    const mockKey = 'mockKey'
    const generatedResult = appActions.unsetStatusParam(mockKey)
    expect(generatedResult).toMatchObject({
      type: types.APP_PARAM_UNSET,
      payload: {
        key: mockKey
      }
    })
  })

  it('call login()', () => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        origin: 'http://fake-url.nav.no/',
        pathname: '/path',
        search: '?var=param',
        href: 'http://fake-url.nav.no/path?var=param'
      }
    })
    const generatedResult = appActions.login()
    expect(window.location.href).toEqual('http://localhost/frontend/login?redirect=http://fake-url.nav.no/&context=%2Fpath%3Fvar%3Dparam')
    expect(generatedResult).toMatchObject({
      type: types.APP_LOGIN_REQUEST
    })
  })

  it('call logout()', () => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: {}
    })
    const generatedResult = appActions.logout()
    expect(window.location.href).toEqual(urls.LOGOUT_URL)
    expect(generatedResult).toMatchObject({
      type: types.APP_LOGOUT_REQUEST
    })
  })

  it('call getUserInfo()', () => {
    appActions.getUserInfo()
    expect(api.call).toBeCalledWith({
      type: {
        request: types.APP_USERINFO_REQUEST,
        success: types.APP_USERINFO_SUCCESS,
        failure: types.APP_USERINFO_FAILURE
      },
      failWith401: true,
      url: urls.API_USERINFO_URL
    })
  })

  it('getPersonInfo()', () => {
    const mockAktoerId = '123'
    appActions.getPersonInfo(mockAktoerId)
    expect(api.funcCall).toBeCalledWith({
      type: {
        request: types.APP_PERSONINFO_REQUEST,
        success: types.APP_PERSONINFO_SUCCESS,
        failure: types.APP_PERSONINFO_FAILURE
      },
      expectedPayload: samplePerson,
      url: sprintf(urls.PERSON_URL, { aktoerId: mockAktoerId })
    })
  })

  it('getSakType()', () => {
    const mockSakId = '123'
    const mockAktoerId = '456'
    appActions.getSakType(mockSakId, mockAktoerId)
    expect(api.funcCall).toBeCalledWith({
      type: {
        request: types.APP_SAKTYPE_REQUEST,
        success: types.APP_SAKTYPE_SUCCESS,
        failure: types.APP_SAKTYPE_FAILURE
      },
      expectedPayload: { sakId: mockSakId, sakType: 'GJENLEV' },
      url: sprintf(urls.PENSJON_GET_SAKTYPE_URL, { sakId: mockSakId, aktoerId: mockAktoerId })
    })
  })

  it('clearData()', () => {
    const generatedResult = appActions.clearData()
    expect(generatedResult).toMatchObject({
      type: types.APP_CLEAR_DATA
    })
  })
})
