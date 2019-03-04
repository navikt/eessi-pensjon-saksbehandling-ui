import * as appActions from './app'
import * as api from './api'
import * as types from '../constants/actionTypes'
import { APP_LOGOUT_URL, APP_GET_USERINFO_URL } from '../constants/urls'

describe('api actions', () => {

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
    expect(window.location.href).toEqual("http://localhost/login?redirect=http://fake-url.nav.no/&context=%2Fpath%3Fvar%3Dparam")
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
    expect(window.location.href).toEqual(APP_LOGOUT_URL)
    expect(generatedResult).toMatchObject({
      type: types.APP_LOGOUT_REQUEST
    })
  })

  it('call getUserInfo()', () => {
    api.call = jest.fn()
    appActions.getUserInfo()
    expect(api.call).toBeCalledWith({
      type: {
        request: types.APP_USERINFO_REQUEST,
        success: types.APP_USERINFO_SUCCESS,
        failure: types.APP_USERINFO_FAILURE
      },
      url: APP_GET_USERINFO_URL
    })
    api.call.mockRestore()
  })

  it('call clearData()', () => {
    const generatedResult = appActions.clearData()
    expect(generatedResult).toMatchObject({
      type: types.APP_CLEAR_DATA
    })
  })

  it('call setReferrer()', () => {
    const referrer = 'referrer'
    const generatedResult = appActions.setReferrer(referrer)
    expect(generatedResult).toMatchObject({
      type: types.APP_REFERRER_SET,
      payload: {
        referrer: referrer
      }
    })
  })

  it('call registerDroppable()', () => {
    const ref = 'ref'
    const id = 'id'
    const generatedResult = appActions.registerDroppable(id, ref)
    expect(generatedResult).toMatchObject({
      type: types.APP_DROPPABLE_REGISTER,
      payload: {
        id: id,
        ref: ref
      }
    })
  })

  it('call unregisterDroppable()', () => {
    const id = 'id'
    const generatedResult = appActions.unregisterDroppable(id)
    expect(generatedResult).toMatchObject({
      type: types.APP_DROPPABLE_UNREGISTER,
      payload: {
        id: id
      }
    })
  })
})
