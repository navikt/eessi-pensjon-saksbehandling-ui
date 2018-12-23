import * as types from '../constants/actionTypes'
import * as urls from '../constants/urls'
import * as api from './api'

export function login () {
  let redirectUrl = urls.APP_LOGIN_URL
  window.location.href = redirectUrl + '?context=' +
    encodeURIComponent(window.location.pathname.replace('/_/','')) +
      (window.location.search
        ? (window.location.search.startsWith('?')
          ? encodeURIComponent('&' + window.location.search.substring(1))
          : encodeURIComponent(window.location.search)
        )
        : '')
  return {
    type: types.APP_LOGIN_REQUEST
  }
}

export function logout () {
  let redirectUrl = urls.APP_LOGOUT_URL
  window.location.href = redirectUrl
  return {
    type: types.APP_LOGOUT_REQUEST
  }
}

export function getUserInfo () {
  return api.call({
    url: urls.APP_GET_USERINFO_URL,
    type: {
      request: types.APP_USERINFO_REQUEST,
      success: types.APP_USERINFO_SUCCESS,
      failure: types.APP_USERINFO_FAILURE
    }
  })
}

export function clearData () {
  return {
    type: types.APP_CLEAR_DATA
  }
}

export function setReferrer (referrer) {
  return {
    type: types.APP_REFERRER_SET,
    payload: {
      referrer: referrer
    }
  }
}

export function registerDroppable (id, ref) {
  return {
    type: types.APP_DROPPABLE_REGISTER,
    payload: {
      id: id,
      ref: ref
    }
  }
}

export function unregisterDroppable (id) {
  return {
    type: types.APP_DROPPABLE_UNREGISTER,
    payload: {
      id: id
    }
  }
}
